// ===== وسيط OpenAI الآمن =====
// كل الطلبات تمر عبر الخادم؛ المفتاح لا يصل المتصفح إطلاقاً.
// يستخدم fetch المدمج في Node 18+ (لا تبعيات إضافية).
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OPENAI_BASE = "https://api.openai.com/v1";

const TTS_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const TTS_VOICE = process.env.OPENAI_TTS_VOICE || "alloy";
const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
const STT_MODEL = process.env.OPENAI_STT_MODEL || "gpt-4o-mini-transcribe";

// ===== تخزين النطق دائماً على القرص (يُشارَكه كل الأطفال) =====
// أول مرّة يُنطق فيها نصّ: نولّده بالـ AI ونحفظه ملفاً .mp3.
// أي طلب لاحق لنفس النص (أي طفل/جهاز) يُقدَّم من الملف بلا أي استدعاء للـ AI.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TTS_CACHE_DIR =
  process.env.TTS_CACHE_DIR || path.join(__dirname, ".tts-cache");
try {
  fs.mkdirSync(TTS_CACHE_DIR, { recursive: true });
} catch (_e) {}

// طبقة ذاكرة سريعة فوق القرص (L1) — تقلّل قراءة القرص للنصوص الشائعة
const ttsMem = new Map();
const TTS_MEM_MAX = 120;

// مفتاح ثابت = بصمة (الموديل|الصوت|التوجيه|النص) → اسم ملف آمن
function ttsCacheKey(text, voice, instructions) {
  const raw = `${TTS_MODEL}|${voice || TTS_VOICE}|${instructions || ""}|${text}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}
function ttsCachePath(hash) {
  return path.join(TTS_CACHE_DIR, `${hash}.mp3`);
}
function memSet(hash, buf) {
  if (ttsMem.size >= TTS_MEM_MAX) ttsMem.delete(ttsMem.keys().next().value);
  ttsMem.set(hash, buf);
}

function key() {
  return process.env.OPENAI_API_KEY;
}

function ensureKey(res) {
  if (!key()) {
    res.status(503).json({ error: "no_api_key", fallback: true });
    return false;
  }
  return true;
}

export function registerOpenAIRoutes(app) {
  // فحص توفّر الميزات (للواجهة كي تقرّر: AI أم Web Speech)
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, ai: Boolean(key()) });
  });

  // ===== تحويل النص إلى كلام (TTS) =====
  // body: { text, voice?, lang?, instructions? }
  app.post("/api/tts", async (req, res) => {
    const { text, voice, instructions } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "missing_text" });
    }

    const hash = ttsCacheKey(text, voice, instructions);
    const filePath = ttsCachePath(hash);

    // ملاحظة: نتحقّق من الذاكرة/القرص قبل المفتاح — فالنطق المخزَّن
    // يُقدَّم بلا أي حاجة للذكاء الاصطناعي (الـ AI يُستهلك فقط مع الميكروفون).

    // 1) ذاكرة سريعة (L1)
    const mem = ttsMem.get(hash);
    if (mem) {
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("X-Cache", "MEM");
      return res.send(mem);
    }
    // 2) ملف محفوظ على القرص (دائم، مشترك بين كل الأطفال) — بلا استدعاء AI
    try {
      const buf = await fs.promises.readFile(filePath);
      memSet(hash, buf);
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("X-Cache", "DISK");
      return res.send(buf);
    } catch (_e) {
      // غير موجود → نولّده بالـ AI لأوّل (وآخر) مرّة
    }

    // التوليد يحتاج المفتاح؛ إن لم يوجد → بديل Web Speech في المتصفح
    if (!ensureKey(res)) return;

    try {
      const r = await fetch(`${OPENAI_BASE}/audio/speech`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: TTS_MODEL,
          voice: voice || TTS_VOICE,
          input: text.slice(0, 600),
          response_format: "mp3",
          // توجيه نبرة ودودة وبطيئة مناسبة للأطفال
          instructions:
            instructions ||
            "Speak slowly, warmly and clearly, like a friendly teacher for a 3-5 year old child.",
        }),
      });

      if (!r.ok) {
        const detail = await r.text();
        return res.status(502).json({ error: "openai_tts_failed", detail, fallback: true });
      }

      const buf = Buffer.from(await r.arrayBuffer());
      // حفظ دائم على القرص + الذاكرة السريعة (atomic write لتفادي ملف ناقص)
      memSet(hash, buf);
      fs.promises
        .writeFile(`${filePath}.tmp`, buf)
        .then(() => fs.promises.rename(`${filePath}.tmp`, filePath))
        .catch(() => {});

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("X-Cache", "MISS");
      res.send(buf);
    } catch (e) {
      res.status(502).json({ error: "tts_error", message: String(e), fallback: true });
    }
  });

  // ===== المساعد الصوتي: سؤال الطفل → إجابة قصيرة مناسبة =====
  // body: { question, lang? }
  app.post("/api/ask", async (req, res) => {
    if (!ensureKey(res)) return;
    const { question, lang } = req.body || {};
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "missing_question" });
    }

    const isAr = !lang || String(lang).startsWith("ar");
    const system = isAr
      ? "أنت مرشد لطيف ومرح في تطبيق تعليمي لطفل عمره ٣ إلى ٥ سنوات اسمه عالم الاستكشاف السحري. " +
        "أجب بجملة واحدة قصيرة جداً وبسيطة بالعربية الفصحى المبسّطة، بكلمات يفهمها طفل صغير. " +
        "كن إيجابياً ومشجّعاً. لا تستخدم رموزاً أو تنسيقاً، فقط نصاً منطوقاً."
      : "You are a friendly, cheerful guide in a learning app for a 3-5 year old child. " +
        "Answer with one very short, simple sentence a small child understands. " +
        "Be positive and encouraging. No symbols or formatting, just spoken text.";

    try {
      const r = await fetch(`${OPENAI_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: CHAT_MODEL,
          messages: [
            { role: "system", content: system },
            { role: "user", content: question.slice(0, 300) },
          ],
          max_tokens: 80,
          temperature: 0.6,
        }),
      });

      if (!r.ok) {
        const detail = await r.text();
        return res.status(502).json({ error: "openai_chat_failed", detail });
      }
      const data = await r.json();
      const answer = data.choices?.[0]?.message?.content?.trim() || "";
      res.json({ answer });
    } catch (e) {
      res.status(502).json({ error: "ask_error", message: String(e) });
    }
  });

  // ===== النسخ الصوتي (STT): صوت الطفل → نص =====
  // body: { audioBase64, mime?, lang? }
  app.post("/api/stt", async (req, res) => {
    if (!ensureKey(res)) return;
    const { audioBase64, mime, lang } = req.body || {};
    if (!audioBase64) return res.status(400).json({ error: "missing_audio" });

    try {
      const bytes = Buffer.from(audioBase64, "base64");
      const blob = new Blob([bytes], { type: mime || "audio/webm" });
      const form = new FormData();
      form.append("file", blob, "speech.webm");
      form.append("model", STT_MODEL);
      if (lang) form.append("language", String(lang).slice(0, 2));

      const r = await fetch(`${OPENAI_BASE}/audio/transcriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${key()}` },
        body: form,
      });
      if (!r.ok) {
        const detail = await r.text();
        return res.status(502).json({ error: "openai_stt_failed", detail });
      }
      const data = await r.json();
      res.json({ text: data.text || "" });
    } catch (e) {
      res.status(502).json({ error: "stt_error", message: String(e) });
    }
  });
}
