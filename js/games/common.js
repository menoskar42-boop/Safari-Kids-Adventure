// ===== أدوات مشتركة بين الألعاب =====
import { Store } from "../core/storage.js";
import { Sfx } from "../core/audio.js";
import { Speech } from "../core/speech.js";
import { Confetti } from "../core/confetti.js";
import {
  awardStars,
  updateStarCounter,
  grantRandomCollectible,
  showRewardPopup,
} from "../core/rewards.js";

/** عبارة المثال بلغة العنصر: "أَلِف مثل أرنب" أو "A for Apple" */
export function examplePhrase(item, lang) {
  return lang && lang.startsWith("en")
    ? `${item.name} for ${item.word}`
    : `${item.name} مثل ${item.word}`;
}

/** خلط مصفوفة (نسخة جديدة) */
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** شريط علوي موحّد للألعاب */
export function gameTopbar(title, onBack) {
  const bar = document.createElement("div");
  bar.className = "topbar";
  bar.innerHTML = `
    <button class="icon-btn" title="رجوع">⟵</button>
    <h2>${title}</h2>
    <span class="star-counter" id="starCounter">⭐ <span>${Store.stars}</span></span>
  `;
  bar.querySelector(".icon-btn").addEventListener("click", () => {
    Sfx.tap();
    onBack();
  });
  setTimeout(() => updateStarCounter(), 0);
  return bar;
}

/** نقاط التقدّم */
export function progressDots(total, activeIndex) {
  const wrap = document.createElement("div");
  wrap.className = "progress-dots";
  for (let i = 0; i < total; i++) {
    const d = document.createElement("span");
    d.className = "dot" + (i <= activeIndex ? " active" : "");
    wrap.appendChild(d);
  }
  return wrap;
}

/** لوحة تشجيع سريعة */
export function showCheer(emoji, text, onClose) {
  Sfx.win();
  const overlay = document.createElement("div");
  overlay.className = "cheer";
  overlay.innerHTML = `
    <div class="cheer-card">
      <div class="cheer-emoji">${emoji}</div>
      <div class="cheer-text">${text}</div>
    </div>`;
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.remove();
    if (onClose) onClose();
  }, 1400);
}

/** إنهاء نشاط: منح نجوم، تحديث تقدّم المنطقة، احتمال مكافأة، ثم رجوع */
export function finishActivity({ regionId, regionIndex, stars = 5, onDone }) {
  const wasCompleted = Store.regionProgress(regionId).completed;
  awardStars(stars);
  Confetti.burst();
  Store.setRegionStars(regionId, (Store.regionProgress(regionId).stars || 0) + stars);
  Store.markRegionDone(regionId);
  if (regionIndex != null) Store.unlockNext(regionIndex);

  // مكافأة جديدة بنسبة جيّدة لإبقاء الحماس
  const reward = Math.random() < 0.7 ? grantRandomCollectible() : null;

  const done = () => {
    Speech.ar("أحسنت! لقد أكملت المهمة");
    if (onDone) onDone();
  };

  // شهادة إنجاز عند إكمال المنطقة لأول مرة
  const finish = () => {
    if (!wasCompleted) showCertificate(regionId, done);
    else done();
  };

  showCheer("🏆", "أحسنت يا بطل!", () => {
    if (reward) showRewardPopup(reward, finish);
    else finish();
  });
}

/** شهادة إنجاز قابلة للحفظ عند إكمال قسم لأول مرة */
export function showCertificate(regionId, onClose) {
  const name = Store.childName || "البطل الصغير";
  const overlay = document.createElement("div");
  overlay.className = "cheer";
  overlay.innerHTML = `
    <div class="certificate">
      <div class="cert-ribbon">🏅 شهادة إنجاز</div>
      <p class="cert-line">تُمنح هذه الشهادة إلى</p>
      <p class="cert-name">${name}</p>
      <p class="cert-line">لإكماله بنجاح وتميّز 🌟</p>
      <div class="cert-seal">🦁</div>
      <p class="cert-foot">عالم الاستكشاف السحري</p>
      <button class="candy-btn" id="certOk">رائع! 🎉</button>
    </div>`;
  document.body.appendChild(overlay);
  Sfx.win();
  Confetti.stars();
  Speech.ar(`مبروك يا ${name}، حصلت على شهادة إنجاز`);
  overlay.querySelector("#certOk").addEventListener("click", () => {
    overlay.remove();
    if (onClose) onClose();
  });
}
