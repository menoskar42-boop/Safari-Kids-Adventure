// ===== ميزو: شخصية الطفل (صور ٣D ثابتة لكل حالة) =====
// لكل مزاج صورة معبّرة. نحافظ على كلاس .miz-svg ليطبَّق نفس قياس الأحجام في الموقع.
// الهوية والعبارات من المصدر المركزي js/data/mizo.js (نعيد تصديرها للتوافق).
import { MIZO } from "../data/mizo.js";
import { Store } from "../core/storage.js";
import { onSpeaking } from "../core/speech.js";
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
  calm: "mizo-calm",
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

  let stopTimer = null, moodTimer = null, talkLoop = null;
  let talkOk = false, blinkOk = false;
  // نفحص توفّر إطارات الأنيميشن (فم مفتوح / عيون مغلقة) — تُفعَّل تلقائياً عند وجودها
  if (typeof Image !== "undefined") {
    const probeTalk = new Image(); probeTalk.onload = () => { talkOk = true; }; probeTalk.src = "/assets/mizo/mizo-talk.png";
    const probeBlink = new Image(); probeBlink.onload = () => { blinkOk = true; }; probeBlink.src = "/assets/mizo/mizo-blink.png";
  }

  function show(mood) {
    const key = MOOD_IMG[mood] ? mood : "happy";
    img.src = `/assets/mizo/${MOOD_IMG[key]}.png`;
  }
  function startTalking(ms) {
    el.classList.add("talking");
    clearTimeout(stopTimer);
    // تحريك الشفاه: تبديل سريع بين مغلق/مفتوح أثناء النطق (إن توفّرت صورة الفم المفتوح)
    // يعمل في كل الحالات المزاجية — أي كلام = شفاه تتحرّك (الأولوية لمزامنة الشفاه أثناء النطق)
    if (talkOk && !talkLoop) {
      let open = false;
      // إيقاع كلام طبيعي: مدّة كل إطار تتغيّر قليلاً
      const tick = () => {
        open = !open;
        img.src = open ? "/assets/mizo/mizo-talk.png" : "/assets/mizo/mizo-wave.png";
        talkLoop = setTimeout(tick, 110 + Math.random() * 90);
      };
      tick();
    }
    if (ms) stopTimer = setTimeout(stopTalking, ms);
  }
  function stopTalking() {
    clearTimeout(stopTimer);
    el.classList.remove("talking");
    if (talkLoop) { clearTimeout(talkLoop); talkLoop = null; img.src = "/assets/mizo/mizo-wave.png"; }
  }
  // يضبط تعبير ميزو. مع ms يعود تلقائياً لـ"happy".
  function setMood(mood, ms) {
    show(mood);
    clearTimeout(moodTimer);
    if (ms) moodTimer = setTimeout(() => show("happy"), ms);
  }
  show("happy");

  // ===== حيوية أثناء الخمول: لفتات عفوية كي لا يبقى ثابتاً =====
  const IDLE_GESTURES = ["cheer", "proud", "surprised", "think", "wave", "calm"];
  const idleLoop = setInterval(() => {
    if (!el.isConnected) { clearInterval(idleLoop); return; }       // تنظيف عند إزالة العنصر
    if (document.hidden) return;
    if (el.classList.contains("talking")) return;                    // لا نقاطع الكلام
    if (!(img.getAttribute("src") || "").includes("mizo-wave")) return; // فقط في وضع الخمول
    const g = IDLE_GESTURES[(Math.random() * IDLE_GESTURES.length) | 0];
    show(g);
    el.classList.add("gesture");
    if (g === "wave") { el.classList.add("waving"); setTimeout(() => el.classList.remove("waving"), 1300); }
    clearTimeout(moodTimer);
    moodTimer = setTimeout(() => { show("happy"); el.classList.remove("gesture"); }, 1300);
  }, 7000 + Math.random() * 5000);

  // ===== رمشة العين: تُفعَّل تلقائياً عند توفّر إطار العيون المغلقة =====
  function doBlink(times) {
    if (el.classList.contains("talking")) return;
    if (!(img.getAttribute("src") || "").includes("mizo-wave")) return;
    img.src = "/assets/mizo/mizo-blink.png";
    setTimeout(() => {
      if ((img.getAttribute("src") || "").includes("mizo-blink")) img.src = "/assets/mizo/mizo-wave.png";
      if (times > 1) setTimeout(() => doBlink(times - 1), 130); // رمشة مزدوجة أحياناً
    }, 120);
  }
  const blinkLoop = setInterval(() => {
    if (!el.isConnected) { clearInterval(blinkLoop); return; }
    if (!blinkOk || document.hidden) return;
    doBlink(Math.random() < 0.3 ? 2 : 1);
  }, 4000 + Math.random() * 3000);

  // أي كلام في الموقع = ميزو يتكلّمه → شفاهه تتحرّك لحظياً مع الصوت الفعلي
  let offSpeak = null;
  offSpeak = onSpeaking((on) => {
    if (!el.isConnected) { if (offSpeak) offSpeak(); offSpeak = null; return; }
    if (on) startTalking(0); else stopTalking();
  });

  return { el, startTalking, stopTalking, setMood, name, mouth: null };
}

