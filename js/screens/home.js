// ===== الشاشة الرئيسية: الخريطة السحرية =====
import { REGIONS } from "../data/regions.js";
import { Store } from "../core/storage.js";
import { Router } from "../core/router.js";
import { Speech, whenSpeechReady } from "../core/speech.js";
import { Sfx } from "../core/audio.js";
import { bindStarCounter, bindStreak } from "../core/rewards.js";
import { avatarEmoji } from "./profile.js";
import { FEATURES } from "../core/features.js";
import { createCharacter } from "../games/character.js";

const GUIDE = "🐨"; // المرشد اللطيف
let greetedSession = false; // ميزو يرحّب صوتياً مرّة واحدة في الجلسة

export function renderHome() {
  const screen = document.createElement("div");
  screen.className = "map-screen";

  // الشريط العلوي
  const topbar = document.createElement("div");
  topbar.className = "topbar";
  topbar.innerHTML = `
    <div style="display:flex;gap:8px">
      <button class="icon-btn" id="rewardsBtn" title="كنوزي">🎁</button>
      <button class="icon-btn" id="dailyBtn" title="رحلة اليوم">🎯</button>
      <button class="icon-btn" id="songBtn" title="نشيد ميزو">🎶</button>
      <button class="icon-btn" id="colorBtn" title="تلوين">🎨</button>
      ${FEATURES.videos ? '<button class="icon-btn" id="videosBtn" title="أغاني وفيديو">🎵</button>' : ""}
      <button class="icon-btn" id="gardenBtn" title="حديقتي">🌳</button>
      <button class="icon-btn" id="arBtn" title="الواقع المعزّز">📸</button>
      <button class="icon-btn" id="parentBtn" title="ولي الأمر">⚙️</button>
    </div>
    <h2>🗺️ خريطة المغامرة</h2>
    <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end">
      <span class="star-counter" id="starCounter">⭐ <span>0</span></span>
      <span class="streak-badge" id="streakBadge">🔥 <span>0</span></span>
    </div>
  `;
  screen.appendChild(topbar);

  // لافتة المرشد (تعرض أفاتار الطفل واسمه، وتفتح الملف عند الضغط)
  const banner = document.createElement("div");
  banner.className = "guide-banner";
  const who = Store.childName ? `مرحباً يا ${Store.childName}!` : "مرحباً يا بطل!";
  // ميزو يتذكّر الطفل: ترحيب شخصي للعائد
  const f = Store.friendship;
  // نصّ العرض (مع إيموجي وتنسيق) ونصّ منطوق صريح مستقل (يضمن "أنا ميزو" دائماً)
  let bubbleMsg, spoken;
  if (f.visits > 1 && f.lastRegion) {
    bubbleMsg = `${who} أنا <b>ميزو</b> 👋 اشتقتُ إليك! آخر مرّة لعبنا في <b>${f.lastRegion}</b> ✨`;
    spoken = `${who} أنا ميزو، اشتقتُ إليك. آخر مرّة لعبنا في ${f.lastRegion}. هيا نكمل المغامرة`;
  } else {
    bubbleMsg = `${who} أنا <b>ميزو</b> 👋 اختر منطقة لنبدأ المغامرة ✨`;
    spoken = `${who} أنا ميزو، صديقك. اختر منطقة لنبدأ المغامرة`;
  }
  banner.innerHTML = `
    <button class="guide-emoji guide-miz" id="profileBtn" style="background:none;border:none;cursor:pointer" title="ملفي"></button>
    <div class="bubble">${bubbleMsg}</div>
  `;
  // ميزو المرشد بدل الإيموجي الثابت (يلوّح عند فتح الخريطة)
  const guide = createCharacter();
  banner.querySelector("#profileBtn").appendChild(guide.el);
  setTimeout(() => guide.setMood("wave", 2600), 250);
  // ترحيب صوتي مرّة واحدة في الجلسة — ننتظر جاهزية الـ AI كي يستخدم صوت ميزو
  if (!greetedSession) {
    greetedSession = true;
    whenSpeechReady().then(() => {
      guide.startTalking(spoken.length * 80 + 1200);
      Speech.ar(spoken);
    });
  }
  screen.appendChild(banner);

  // المناطق التأسيسية مفتوحة دائماً. المناطق المتقدّمة تُفتح تدريجياً:
  // كل منطقة يكملها الطفل تفتح واحدة جديدة من المتقدّمة.
  const completed = Store.completedCount();
  let lockedSeen = 0;

  // ترتيب الفئات وعناوينها
  const CATS = [
    { key: "basics", label: "🔤 الأساسيات", en: "Basics" },
    { key: "nature", label: "🦁 الحيوانات والطبيعة", en: "Animals & Nature" },
    { key: "self", label: "🧍 أنا وعائلتي", en: "Me & Family" },
    { key: "life", label: "🏙️ حياتي اليومية", en: "Daily Life" },
    { key: "think", label: "🧠 مهارات التفكير", en: "Thinking" },
    { key: "story", label: "📖 قصص وقيم", en: "Stories & Values" },
  ];

  function buildCard(region, index, unlocked) {
    const prog = Store.regionProgress(region.id);
    const card = document.createElement("button");
    card.className = `region-card ${region.bg}`;
    card.style.animationDelay = `${(index % 6) * 0.05}s`;
    if (!unlocked) card.classList.add("locked");
    if (prog.completed) card.classList.add("done");
    card.innerHTML = `
      ${prog.stars ? `<span class="region-stars">⭐ ${prog.stars}</span>` : ""}
      <span class="region-emoji">${region.emoji}</span>
      <span class="region-name">${region.name}</span>
      <span class="region-name-en">${region.nameEn}</span>
    `;
    card.addEventListener("click", () => {
      Sfx.unlock();
      if (!unlocked) {
        Sfx.wrong();
        Speech.ar("أكمل منطقة أخرى أولاً لتفتح هذه");
        card.animate(
          [{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
          { duration: 250 }
        );
        return;
      }
      Sfx.whoosh();
      Speech.ar(region.guide);
      Router.go("region", { id: region.id, index });
    });
    return card;
  }

  // نحسب حالة الفتح بترتيب REGIONS الأصلي (حفاظاً على التدرّج)
  const unlockedMap = new Map();
  REGIONS.forEach((region, index) => {
    let unlocked;
    if (FEATURES.unlockAll || region.open) unlocked = true;
    else { unlocked = lockedSeen < completed; lockedSeen++; }
    unlockedMap.set(region.id, { unlocked, index });
  });

  // نعرض كل فئة بعنوانها وشبكتها
  CATS.forEach((cat) => {
    const inCat = REGIONS.filter((r) => (r.cat || "life") === cat.key);
    if (!inCat.length) return;

    const header = document.createElement("h3");
    header.className = "cat-header";
    header.innerHTML = `${cat.label} <span class="cat-en">${cat.en}</span>`;
    screen.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "regions-grid";
    inCat.forEach((region) => {
      const { unlocked, index } = unlockedMap.get(region.id);
      grid.appendChild(buildCard(region, index, unlocked));
    });
    screen.appendChild(grid);
  });

  // ربط الأحداث بعد الإضافة
  setTimeout(() => {
    bindStarCounter(screen.querySelector("#starCounter"));
    bindStreak(screen.querySelector("#streakBadge"));
    screen.querySelector("#profileBtn").addEventListener("click", () => {
      Sfx.tap();
      Router.go("profile");
    });
    screen.querySelector("#rewardsBtn").addEventListener("click", () => {
      Sfx.tap();
      Router.go("rewards");
    });
    screen.querySelector("#colorBtn").addEventListener("click", () => {
      Sfx.tap();
      Router.go("coloring", { title: "🎨 لوّن الصور" });
    });
    screen.querySelector("#dailyBtn").addEventListener("click", () => {
      Sfx.tap();
      Router.go("dailyPlan");
    });
    screen.querySelector("#songBtn").addEventListener("click", () => {
      Sfx.tap();
      Router.go("mizoSong");
    });
    const videosBtn = screen.querySelector("#videosBtn");
    if (videosBtn) videosBtn.addEventListener("click", () => {
      Sfx.tap();
      Router.go("videos");
    });
    screen.querySelector("#gardenBtn").addEventListener("click", () => {
      Sfx.tap();
      Router.go("garden");
    });
    screen.querySelector("#arBtn").addEventListener("click", () => {
      Sfx.tap();
      Router.go("ar");
    });
    screen.querySelector("#parentBtn").addEventListener("click", () => {
      Sfx.tap();
      Router.go("parent");
    });
    Speech.ar("مرحباً يا بطل! اختر منطقة لنبدأ المغامرة");
  }, 0);

  return screen;
}
