// ===== جسر الواجهة مع خادم OpenAI الآمن =====
// يكتشف توفّر الـ AI، ويوفّر دوال: TTS (نطق)، ask (سؤال)، transcribe (نسخ صوتي).
// كل شيء يفشل بهدوء (graceful) ليرجع التطبيق إلى Web Speech عند الحاجة.

let aiAvailable = null; // null = لم يُفحص بعد
let userDisabled = false; // يضبطه ولي الأمر (تعطيل الميكروفون/الذكاء الاصطناعي)
let audioEl = null;

/** تعطيل/تفعيل ميزات الـ AI من إعداد ولي الأمر */
export function setAIEnabled(on) {
  userDisabled = !on;
}

/** يفحص الخادم مرّة واحدة: هل ميزات الـ AI متاحة؟ */
export async function checkAI() {
  if (aiAvailable !== null) return aiAvailable;
  try {
    const r = await fetch("/api/health", { cache: "no-store" });
    if (!r.ok) throw new Error("health");
    const data = await r.json();
    aiAvailable = Boolean(data.ai);
  } catch (e) {
    aiAvailable = false; // لا خادم (مثلاً GitHub Pages) → بديل Web Speech
  }
  return aiAvailable;
}

export function isAIReady() {
  return aiAvailable === true && !userDisabled;
}

/**
 * نطق نص عبر OpenAI TTS. يُرجع Promise:
 *  - resolve عند انتهاء التشغيل
 *  - reject عند الفشل (ليجرّب المنادي البديل)
 */
export function aiSpeak(text, opts = {}) {
  return new Promise(async (resolve, reject) => {
    if (!text) return resolve();
    try {
      const r = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: opts.voice,
          instructions: opts.instructions,
        }),
      });
      if (!r.ok) throw new Error("tts " + r.status);

      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      if (!audioEl) audioEl = new Audio();
      else audioEl.pause();
      audioEl.src = url;
      audioEl.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      audioEl.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("audio_play"));
      };
      await audioEl.play();
    } catch (e) {
      reject(e);
    }
  });
}

/** إيقاف نطق الـ AI الحالي */
export function aiStop() {
  if (audioEl) {
    try {
      audioEl.pause();
      audioEl.currentTime = 0;
    } catch (e) {}
  }
}

/** سؤال المساعد الصوتي → نص الإجابة */
export async function aiAsk(question, lang = "ar") {
  const r = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, lang }),
  });
  if (!r.ok) throw new Error("ask " + r.status);
  const data = await r.json();
  return data.answer || "";
}

/** نسخ صوتي: Blob صوت → نص */
export async function aiTranscribe(blob, lang = "ar") {
  const base64 = await blobToBase64(blob);
  const r = await fetch("/api/stt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioBase64: base64, mime: blob.type, lang }),
  });
  if (!r.ok) throw new Error("stt " + r.status);
  const data = await r.json();
  return data.text || "";
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result).split(",")[1] || "");
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}
