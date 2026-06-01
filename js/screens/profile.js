// ===== ملف الطفل: الاسم + اختيار الأفاتار من الكنوز المجموعة =====
import { COLLECTIBLES } from "../core/rewards.js";
import { Store } from "../core/storage.js";
import { Router } from "../core/router.js";
import { Sfx } from "../core/audio.js";
import { Speech } from "../core/speech.js";
import { createCharacter } from "../games/character.js";

const GUIDE = "🐨"; // الأفاتار الافتراضي

export function avatarEmoji() {
  const id = Store.avatarId;
  const item = COLLECTIBLES.find((c) => c.id === id);
  return item ? item.emoji : GUIDE;
}

export function renderProfile() {
  const screen = document.createElement("div");
  screen.className = "region-screen";
  screen.style.background = "linear-gradient(180deg,#d7f5ff,#a0c8ff)";

  const topbar = document.createElement("div");
  topbar.className = "topbar";
  topbar.innerHTML = `
    <button class="icon-btn" id="backBtn" title="رجوع">🏠</button>
    <h2>👤 ملفّي</h2>
    <span style="width:48px"></span>`;
  screen.appendChild(topbar);

  const wrap = document.createElement("div");
  wrap.style.cssText = "max-width:620px;margin:0 auto;padding:18px 16px 40px;text-align:center";

  // الأفاتار الحالي
  const current = document.createElement("div");
  current.style.cssText = "font-size:clamp(80px,24vw,140px);filter:drop-shadow(0 8px 8px rgba(0,0,0,.2))";
  current.textContent = avatarEmoji();
  wrap.appendChild(current);

  // الاسم
  const nameLabel = document.createElement("p");
  nameLabel.style.cssText = "font-weight:800;color:var(--c-purple);font-size:clamp(16px,4.5vw,20px);margin:6px 0";
  nameLabel.textContent = "اسمي:";
  wrap.appendChild(nameLabel);

  const nameInput = document.createElement("input");
  nameInput.value = Store.childName;
  nameInput.placeholder = "اكتب اسمك";
  nameInput.maxLength = 20;
  nameInput.style.cssText =
    "font-size:22px;font-weight:800;text-align:center;width:min(80vw,280px);padding:10px;border-radius:16px;border:3px solid var(--c-purple);font-family:inherit";
  nameInput.addEventListener("input", () => Store.setChildName(nameInput.value));
  wrap.appendChild(nameInput);

  // الفئة العمرية (تُكيّف صعوبة الألعاب)
  const ageLabel = document.createElement("p");
  ageLabel.style.cssText = "font-weight:800;color:var(--c-ink);margin:22px 0 8px;font-size:clamp(16px,4.5vw,20px)";
  ageLabel.textContent = "عمر الطفل (لضبط الصعوبة)";
  wrap.appendChild(ageLabel);

  const ageRow = document.createElement("div");
  ageRow.style.cssText = "display:flex;gap:12px;justify-content:center;flex-wrap:wrap";
  [["small", "٣ – ٤ سنوات", "🧒"], ["big", "٥ – ٦ سنوات", "👦"]].forEach(([band, txt, emo]) => {
    const b = document.createElement("button");
    b.className = "candy-btn";
    b.textContent = `${emo} ${txt}`;
    const paint = () => {
      b.style.background = Store.ageBand === band
        ? "linear-gradient(180deg,#34d399,#10b981)"
        : "linear-gradient(180deg,#9aa7ff,#6b7cff)";
    };
    paint();
    b.addEventListener("click", () => {
      Sfx.tap();
      Store.setAgeBand(Store.ageBand === band ? "" : band);
      ageRow.querySelectorAll("button").forEach((x) => x.dispatchEvent(new Event("repaint")));
    });
    b.addEventListener("repaint", paint);
    ageRow.appendChild(b);
  });
  wrap.appendChild(ageRow);

  // ===== صداقة ميزو + تخصيصه =====
  const fLevel = Store.friendLevel;
  const fTitle = document.createElement("p");
  fTitle.style.cssText = "font-weight:800;color:var(--c-ink);margin:24px 0 6px;font-size:clamp(16px,4.5vw,20px)";
  fTitle.textContent = `صداقتك مع ميزو: المستوى ${fLevel} 💛`;
  wrap.appendChild(fTitle);

  const preview = document.createElement("div");
  preview.style.cssText = "display:grid;place-items:center;margin:4px 0";
  const previewMizo = createCharacter();
  preview.appendChild(previewMizo.el);
  wrap.appendChild(preview);

  const accHint = document.createElement("p");
  accHint.style.cssText = "font-size:13px;color:#7a6ca8;text-align:center;margin:2px 0 8px";
  accHint.textContent = "زيّن ميزو! تُفتح إكسسوارات جديدة كلّما كبرت صداقتكما 🎁";
  wrap.appendChild(accHint);

  const accRow = document.createElement("div");
  accRow.style.cssText = "display:flex;gap:10px;justify-content:center;flex-wrap:wrap";
  // [إيموجي, المستوى المطلوب]
  const ACCS = [["", 1], ["🧢", 1], ["🎀", 2], ["🎩", 3], ["👑", 4], ["⭐", 5]];
  ACCS.forEach(([acc, lvl]) => {
    const b = document.createElement("button");
    b.className = "wb-tile";
    const locked = fLevel < lvl;
    b.textContent = locked ? "🔒" : (acc || "🚫");
    b.disabled = locked;
    b.style.opacity = locked ? ".5" : "1";
    if (!locked && Store.mizoAccessory === acc) b.style.outline = "4px solid var(--c-green)";
    b.addEventListener("click", () => {
      if (locked) return;
      Sfx.tap();
      Store.setMizoAccessory(acc);
      // إعادة بناء المعاينة فوراً
      const fresh = createCharacter();
      previewMizo.el.replaceWith(fresh.el);
      previewMizo.el = fresh.el;
      fresh.setMood("cheer", 1200);
      accRow.querySelectorAll("button").forEach((x) => (x.style.outline = "none"));
      if (!locked) b.style.outline = "4px solid var(--c-green)";
    });
    accRow.appendChild(b);
  });
  wrap.appendChild(accRow);

  // اختيار الأفاتار
  const h = document.createElement("p");
  h.style.cssText = "font-weight:800;color:var(--c-ink);margin:22px 0 10px;font-size:clamp(16px,4.5vw,20px)";
  h.textContent = "اختر صورتك من كنوزك 🎁";
  wrap.appendChild(h);

  const grid = document.createElement("div");
  grid.className = "regions-grid";

  // خيار المرشد الافتراضي + الكنوز المملوكة
  const owned = COLLECTIBLES.filter((c) => Store.hasCollected(c.id));
  const choices = [{ id: "", emoji: GUIDE, name: "المرشد" }, ...owned];

  choices.forEach((c) => {
    const card = document.createElement("button");
    card.className = "region-card";
    const isSel = Store.avatarId === c.id;
    card.style.cssText = `background:${isSel ? "linear-gradient(160deg,#ffd23f,#ff924c)" : "#cdbfe6"}`;
    card.innerHTML = `<span class="region-emoji">${c.emoji}</span><span class="region-name">${c.name}</span>`;
    card.addEventListener("click", () => {
      Sfx.pop();
      Store.setAvatar(c.id);
      current.textContent = c.emoji;
      grid.querySelectorAll(".region-card").forEach((x) => (x.style.background = "#cdbfe6"));
      card.style.background = "linear-gradient(160deg,#ffd23f,#ff924c)";
      Speech.ar("اخترت صورتك");
    });
    grid.appendChild(card);
  });

  if (owned.length === 0) {
    const hint = document.createElement("p");
    hint.style.cssText = "color:#7a6ca8;font-weight:700;margin-top:8px";
    hint.textContent = "تعلّم واجمع الكنوز لتفتح صوراً جديدة!";
    wrap.appendChild(grid);
    wrap.appendChild(hint);
  } else {
    wrap.appendChild(grid);
  }

  screen.appendChild(wrap);

  setTimeout(() => {
    screen.querySelector("#backBtn").addEventListener("click", () => { Sfx.tap(); Router.go("home"); });
  }, 0);

  return screen;
}
