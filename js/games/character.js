// ===== ميزو: شخصية الطفل (صور ٣D ثابتة لكل حالة) =====
// لكل مزاج صورة معبّرة. نحافظ على كلاس .miz-svg ليطبَّق نفس قياس الأحجام في الموقع.
// الهوية والعبارات من المصدر المركزي js/data/mizo.js (نعيد تصديرها للتوافق).
import { MIZO } from "../data/mizo.js";
import { Store } from "../core/storage.js";
export {
  MIZO,
  MIZO_INTRO,
  MIZO_HELLO,
  MIZO_PRAISE,
  MIZO_ENCOURAGE,
  MIZO_GOAL,
  MIZO_CATCH,
} from "../data/mizo.js";
export const CHARACTER_NAME = MIZO.name;

// خريطة المزاج → صورة الحالة
const MOOD_IMG = {
  happy: "mizo-wave",
  wave: "mizo-wave",
  cheer: "mizo-cheer",
  proud: "mizo-proud",
  think: "mizo-think",
  listening: "mizo-listen",
  sad: "mizo-sad",
  surprised: "mizo-idea",
};

export function createCharacter(name = MIZO.name) {
  const el = document.createElement("div");
  el.className = "miz miz-photo";
  el.setAttribute("aria-label", name);

  const img = document.createElement("img");
  img.className = "miz-svg miz-img";
  img.alt = name;
  img.decoding = "async";
  el.appendChild(img);

  // إكسسوار الطفل المختار (إيموجي فوق رأس ميزو)
  const acc = Store.mizoAccessory;
  if (acc) {
    const s = document.createElement("span");
    s.className = "miz-acc-emoji";
    s.textContent = acc;
    el.appendChild(s);
  }

  let stopTimer = null, moodTimer = null;
  function show(mood) {
    const key = MOOD_IMG[mood] ? mood : "happy";
    img.src = `/assets/mizo/${MOOD_IMG[key]}.png`;
  }
  function startTalking(ms) {
    el.classList.add("talking");
    clearTimeout(stopTimer);
    if (ms) stopTimer = setTimeout(stopTalking, ms);
  }
  function stopTalking() {
    clearTimeout(stopTimer);
    el.classList.remove("talking");
  }
  // يضبط تعبير ميزو. مع ms يعود تلقائياً لـ"happy".
  function setMood(mood, ms) {
    show(mood);
    clearTimeout(moodTimer);
    if (ms) moodTimer = setTimeout(() => show("happy"), ms);
  }
  show("happy");

  return { el, startTalking, stopTalking, setMood, name, mouth: null };
}

