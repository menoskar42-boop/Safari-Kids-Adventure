// ===== الشاشة الرئيسية: الخريطة السحرية =====
import { REGIONS } from "../data/regions.js";
import { Store } from "../core/storage.js";
import { Router } from "../core/router.js";
import { Speech } from "../core/speech.js";
import { Sfx } from "../core/audio.js";
import { bindStarCounter, bindStreak } from "../core/rewards.js";

const GUIDE = "🐨"; // المرشد اللطيف

export function renderHome() {
  const screen = document.createElement("div");
  screen.className = "map-screen";

  // الشريط العلوي
  const topbar = document.createElement("div");
  topbar.className = "topbar";
  topbar.innerHTML = `
    <div style="display:flex;gap:8px">
      <button class="icon-btn" id="rewardsBtn" title="كنوزي">🎁</button>
      <button class="icon-btn" id="videosBtn" title="أغاني وفيديو">🎵</button>
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

  // لافتة المرشد
  const banner = document.createElement("div");
  banner.className = "guide-banner";
  banner.innerHTML = `
    <div class="guide-emoji">${GUIDE}</div>
    <div class="bubble">مرحباً يا بطل! اختر منطقة لنبدأ المغامرة ✨</div>
  `;
  screen.appendChild(banner);

  // شبكة المناطق
  const grid = document.createElement("div");
  grid.className = "regions-grid";

  // المناطق التأسيسية مفتوحة دائماً. المناطق المتقدّمة تُفتح تدريجياً:
  // كل منطقة يكملها الطفل تفتح واحدة جديدة من المتقدّمة.
  const completed = Store.completedCount();
  let lockedSeen = 0;

  REGIONS.forEach((region, index) => {
    let unlocked;
    if (region.open) {
      unlocked = true;
    } else {
      // المنطقة المتقدّمة رقم (lockedSeen) تُفتح إذا أكمل الطفل عدداً كافياً
      unlocked = lockedSeen < completed;
      lockedSeen++;
    }
    const prog = Store.regionProgress(region.id);

    const card = document.createElement("button");
    card.className = `region-card ${region.bg}`;
    card.style.animationDelay = `${index * 0.05}s`;
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
        Speech.ar("أكمل المنطقة السابقة أولاً");
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

    grid.appendChild(card);
  });

  screen.appendChild(grid);

  // ربط الأحداث بعد الإضافة
  setTimeout(() => {
    bindStarCounter(screen.querySelector("#starCounter"));
    bindStreak(screen.querySelector("#streakBadge"));
    screen.querySelector("#rewardsBtn").addEventListener("click", () => {
      Sfx.tap();
      Router.go("rewards");
    });
    screen.querySelector("#videosBtn").addEventListener("click", () => {
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
