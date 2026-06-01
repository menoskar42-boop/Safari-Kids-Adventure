// ===== النطق الهجين: OpenAI TTS أولاً ثم Web Speech كبديل =====
import { isAIReady, aiSpeak, aiStop } from "./ai.js";
import { MIZO } from "../data/mizo.js";

let voices = [];
let enabled = "speechSynthesis" in window;
let useAI = false; // يُضبط من checkAI() عبر setAISpeech()
let speakSeq = 0; // رمز تسلسل النطق لمنع تداخل OpenAI مع Web Speech

// صوت ميزو الثابت لكل لغة (من ملف الهوية المركزي) — كي لا يتغيّر "صديق الطفل"
const AI_VOICE = MIZO.voice;

// وعد جاهزية النطق: يُحَلّ بعد أن يقرّر app.js نتيجة فحص الـ AI
let _resolveReady;
const _readyPromise = new Promise((r) => { _resolveReady = r; });

/** تفعيل/تعطيل النطق بالـ AI (يستدعيه app.js بعد فحص الخادم) */
export function setAISpeech(on) {
  useAI = Boolean(on);
  if (_resolveReady) { _resolveReady(); _resolveReady = null; }
}

/** يُرجع وعداً يُحَلّ عندما يُعرَف هل سنستخدم AI أم Web Speech (لتفادي سباق النطق) */
export function whenSpeechReady() {
  return _readyPromise;
}

function refreshVoices() {
  if (!enabled) return;
  voices = window.speechSynthesis.getVoices() || [];
}

if (enabled) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function pickVoice(lang) {
  if (!voices.length) refreshVoices();
  const prefix = lang.slice(0, 2).toLowerCase();
  // أفضلية لصوت يطابق اللغة بالكامل ثم بالبادئة
  return (
    voices.find((v) => v.lang && v.lang.toLowerCase() === lang.toLowerCase()) ||
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(prefix)) ||
    null
  );
}

export const Speech = {
  get available() {
    return enabled;
  },

  /**
   * نطق نص بلغة معيّنة.
   * @param {string} text
   * @param {object} opts  { lang:'ar-EG'|'en-US', rate, pitch, onend }
   */
  say(text, opts = {}) {
    if (!text) {
      if (opts.onend) setTimeout(opts.onend, 300);
      return;
    }
    const lang = opts.lang || "ar-EG";
    const myId = ++speakSeq; // رمز تسلسل: أيّ نطق جديد يُلغي ما قبله

    // المسار المفضّل: OpenAI TTS (صوت أوضح وأدفأ للأطفال)
    if (useAI && isAIReady()) {
      // أوقف أي Web Speech عالق كي لا يتداخل صوتان معاً
      if (enabled) { try { window.speechSynthesis.cancel(); } catch (e) {} }
      const voice = AI_VOICE[lang.slice(0, 2)] || undefined;
      aiSpeak(text, { voice, instructions: opts.instructions }).then(
        () => { if (myId === speakSeq && opts.onend) opts.onend(); },
        // بديل Web Speech فقط إن لم يُستبدَل هذا النطق بنطقٍ أحدث (يمنع تداخل AI + Web)
        () => { if (myId === speakSeq) this._webSpeak(text, opts); }
      );
      return;
    }
    this._webSpeak(text, opts);
  },

  /**
   * نطق ميزو الشخصي: لهجة مصرية حيوية وسريعة قليلاً تجذب الأطفال.
   * (نطق الحروف والقواعد يبقى عبر say/ar بالفصحى البسيطة كما هو.)
   */
  mizo(text, opts = {}) {
    this.say(text, { ...opts, lang: "ar-EG", instructions: MIZO.toneInstructions, rate: opts.rate ?? 1.05 });
  },

  // النطق عبر متصفح الجهاز (Web Speech) — البديل الدائم
  _webSpeak(text, opts = {}) {
    if (!enabled) {
      if (opts.onend) setTimeout(opts.onend, 300);
      return;
    }
    const lang = opts.lang || "ar-EG";
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = lang;
      u.rate = opts.rate ?? 0.85; // أبطأ قليلاً للأطفال
      u.pitch = opts.pitch ?? 1.15; // نبرة ودودة
      const v = pickVoice(lang);
      if (v) u.voice = v;
      if (opts.onend) u.onend = opts.onend;
      window.speechSynthesis.speak(u);
    } catch (e) {
      if (opts.onend) setTimeout(opts.onend, 300);
    }
  },

  ar(text, opts = {}) {
    this.say(text, { ...opts, lang: "ar-EG" });
  },

  en(text, opts = {}) {
    this.say(text, { ...opts, lang: "en-US" });
  },

  /** نطق متسلسل: عناصر بالشكل {text, lang} */
  sequence(items, gap = 350) {
    let i = 0;
    const next = () => {
      if (i >= items.length) return;
      const item = items[i++];
      this.say(item.text, {
        lang: item.lang || "ar-EG",
        rate: item.rate,
        pitch: item.pitch,
        onend: () => setTimeout(next, gap),
      });
    };
    next();
  },

  stop() {
    aiStop();
    if (enabled) window.speechSynthesis.cancel();
  },
};
