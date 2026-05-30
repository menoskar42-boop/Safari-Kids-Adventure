// ===== المساعد الصوتي: الطفل يسأل "ما هذا؟" بصوته =====
// التدفّق: تسجيل الميكروفون → STT → سؤال → إجابة قصيرة → نطق.
// يحتاج خادم OpenAI (isAIReady). إن لم يتوفّر، يُخفى الزر.
import { isAIReady, aiAsk, aiTranscribe } from "./ai.js";
import { Speech } from "./speech.js";
import { Sfx } from "./audio.js";

let recorder = null;
let chunks = [];
let listening = false;
let overlay = null;

/** هل المساعد متاح؟ (AI + دعم التسجيل) */
export function assistantAvailable() {
  return (
    isAIReady() &&
    typeof MediaRecorder !== "undefined" &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function"
  );
}

/** يبني الزر العائم ويضيفه للصفحة (مرّة واحدة) */
export function mountAssistantButton() {
  if (!assistantAvailable()) return;
  if (document.getElementById("assistantBtn")) return;

  const btn = document.createElement("button");
  btn.id = "assistantBtn";
  btn.className = "assistant-fab";
  btn.title = "اسألني! ما هذا؟";
  btn.innerHTML = "🎤";
  btn.addEventListener("click", toggleListen);
  document.body.appendChild(btn);
}

function setState(state, text) {
  const btn = document.getElementById("assistantBtn");
  if (btn) {
    btn.classList.toggle("listening", state === "listening");
    btn.classList.toggle("thinking", state === "thinking");
    btn.innerHTML = state === "listening" ? "⏺️" : state === "thinking" ? "💭" : "🎤";
  }
  showBubble(text);
}

function showBubble(text) {
  if (!text) {
    if (overlay) { overlay.remove(); overlay = null; }
    return;
  }
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "assistant-bubble";
    document.body.appendChild(overlay);
  }
  overlay.textContent = text;
}

async function toggleListen() {
  if (listening) {
    stopListening();
    return;
  }
  if (!assistantAvailable()) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks = [];
    const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
    recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      handleAudio();
    };
    recorder.start();
    listening = true;
    Sfx.pop();
    setState("listening", "أنا أستمع... قل: ما هذا؟ 🎤");
    // حدّ أقصى ٦ ثوانٍ ثم نتوقّف تلقائياً
    setTimeout(() => { if (listening) stopListening(); }, 6000);
  } catch (e) {
    setState("idle", "لم أستطع تشغيل الميكروفون 🙈");
    setTimeout(() => showBubble(""), 2500);
  }
}

function stopListening() {
  if (recorder && recorder.state !== "inactive") recorder.stop();
  listening = false;
}

async function handleAudio() {
  if (!chunks.length) { setState("idle", ""); return; }
  setState("thinking", "أفكّر... 💭");
  Speech.stop();
  try {
    const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
    const question = (await aiTranscribe(blob, "ar")).trim();
    if (!question) {
      setState("idle", "لم أسمعك جيداً، حاول مرّة أخرى 😊");
      Speech.ar("لم أسمعك جيداً، حاول مرّة أخرى");
      setTimeout(() => showBubble(""), 2600);
      return;
    }
    const answer = await aiAsk(question, "ar");
    setState("idle", answer || "");
    Sfx.correct();
    Speech.ar(answer, { onend: () => setTimeout(() => showBubble(""), 1500) });
  } catch (e) {
    setState("idle", "حدث خطأ بسيط، جرّب مجدداً 🙏");
    setTimeout(() => showBubble(""), 2600);
  }
}
