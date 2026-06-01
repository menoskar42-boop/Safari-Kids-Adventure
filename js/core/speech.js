// ===== النطق الهجين: OpenAI TTS أولاً ثم Web Speech كبديل =====
import { isAIReady, aiSpeak, aiStop } from "./ai.js";
import { MIZO } from "../data/mizo.js";

let voices = [];
let enabled = "speechSynthesis" in window;
let useAI = false; // يُضبط من checkAI() عبر setAISpeech()

// صوت ميزو الثابت لكل لغة (من ملف الهوية المركزي) — كي لا يتغيّر "صديق الطفل"
const AI_VOICE = MIZO.voice;

/** تفعيل/تعطيل النطق بالـ AI (يستدعيه app.js بعد فحص الخادم) */
export function setAISpeech(on) {
  useAI = Boolean(on);
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

    // المسار المفضّل: OpenAI TTS (صوت أوضح وأدفأ للأطفال)
    if (useAI && isAIReady()) {
      const voice = AI_VOICE[lang.slice(0, 2)] || undefined;
      aiSpeak(text, { voice }).then(
        () => { if (opts.onend) opts.onend(); },
        () => this._webSpeak(text, opts) // أي فشل → بديل فوري
      );
      return;
    }
    this._webSpeak(text, opts);
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
