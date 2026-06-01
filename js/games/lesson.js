// ===== المعلّم الافتراضي: درس تفاعلي لشرح الحرف/الرقم =====
// شخصية ودودة تشرح، وسبّورة بخطّ أساس يُكتب عليها الحرف بالحركة،
// مع نطق بصوتنا المخزَّن، وأزرار تشغيل/سابق/تالي + "اكتبه بنفسك".
// يحاكي فيديوهات تعليم الحروف لكن بشكل تفاعلي ومجاني وبلا فيديو.
import { getDataset } from "../data/datasets.js";
import { Router } from "../core/router.js";
import { Speech } from "../core/speech.js";
import { Sfx } from "../core/audio.js";
import { gameTopbar, finishActivity } from "./common.js";

export function renderLesson({ regionId, regionIndex, datasetKey, lang, title }) {
  const ds = getDataset(datasetKey);
  const speakLang = lang || ds.lang || "ar-EG";
  const isAr = speakLang.startsWith("ar");
  const noun = ds.glyphKind === "number" ? "رقم" : "حرف";
  const items = ds.items;
  let idx = 0;

  const glyphOf = (it) => it.char || it.arDigit || it.name;
  const labelOf = (it) => it.name || it.arName || "";

  const screen = document.createElement("div");
  screen.className = "region-screen";
  screen.style.background = "linear-gradient(180deg,#e7f0ff,#bcd2ff)";
  const back = () => Router.go("region", { id: regionId, index: regionIndex });
  screen.appendChild(gameTopbar(title || "🧑‍🏫 معلّم الحروف", back));

  const wrap = document.createElement("div");
  wrap.className = "lesson";
  wrap.innerHTML = `
    <div class="lesson-board">
      <div class="lesson-glyph"></div>
      <div class="lesson-baseline"></div>
      <span class="lesson-pen">🖊️</span>
    </div>
    <div class="lesson-teacher">
      <div class="teacher-char">🧒</div>
      <div class="teacher-bubble"></div>
    </div>
    <div class="lesson-controls">
      <button class="candy-btn" id="lsPlay">🔊 اسمع</button>
      <button class="candy-btn" id="lsWrite" style="background:linear-gradient(180deg,#34d399,#10b981)">✍️ اكتبه</button>
      <button class="candy-btn" id="lsPrev" style="background:linear-gradient(180deg,#9aa7ff,#6b7cff)">⏮️ السابق</button>
      <button class="candy-btn" id="lsNext">التالي ⏭️</button>
    </div>`;
  screen.appendChild(wrap);

  const glyphEl = wrap.querySelector(".lesson-glyph");
  const penEl = wrap.querySelector(".lesson-pen");
  const bubble = wrap.querySelector(".teacher-bubble");

  function narrate(it) {
    const label = labelOf(it);
    const parts = [{ text: `هذا ${noun} ${label}`, lang: speakLang }];
    if (it.word) {
      parts.push({ text: isAr ? `${label} مثل ${it.word}` : `${label} for ${it.word}`, lang: speakLang });
    }
    parts.push({ text: label, lang: speakLang });
    Speech.sequence(parts);
  }

  function animateWrite() {
    // إعادة تشغيل حركة "الكتابة" (كشف الحرف من أعلى لأسفل + قلم يتحرّك)
    glyphEl.classList.remove("writing");
    penEl.style.animation = "none";
    void glyphEl.offsetWidth; // إجبار إعادة التدفّق
    glyphEl.classList.add("writing");
    penEl.style.animation = "";
  }

  function render() {
    const it = items[idx];
    glyphEl.textContent = glyphOf(it);
    const label = labelOf(it);
    bubble.innerHTML = it.word
      ? `هذا ${noun} «${label}» ${it.emoji || ""}<br>${label} مثل ${it.word}`
      : `هذا ${noun} «${label}»`;
    animateWrite();
    Sfx.pop();
    narrate(it);
    wrap.querySelector("#lsPrev").disabled = idx === 0;
  }

  wrap.querySelector("#lsPlay").addEventListener("click", () => { animateWrite(); narrate(items[idx]); });
  wrap.querySelector("#lsWrite").addEventListener("click", () => {
    Sfx.tap();
    Router.go("trace", { regionId, regionIndex, datasetKey, lang });
  });
  wrap.querySelector("#lsPrev").addEventListener("click", () => {
    if (idx > 0) { idx--; render(); }
  });
  wrap.querySelector("#lsNext").addEventListener("click", () => {
    Sfx.tap();
    if (idx >= items.length - 1) finishActivity({ regionId, regionIndex, stars: 5, onDone: back });
    else { idx++; render(); }
  });

  setTimeout(render, 30);
  return screen;
}
