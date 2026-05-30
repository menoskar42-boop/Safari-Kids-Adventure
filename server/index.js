// ===== خادم Safari Kids Adventure =====
// يقدّم الملفات الثابتة + وسيطًا آمنًا لـ OpenAI (المفتاح يبقى على الخادم فقط).
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerOpenAIRoutes } from "./openai.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const app = express();
const PORT = process.env.PORT || 3000;

// نقبل JSON كبيراً نسبياً (لإرسال صوت base64 للنسخ الصوتي)
app.use(express.json({ limit: "8mb" }));

// مسارات OpenAI: ‎/api/tts , ‎/api/ask , ‎/api/stt , ‎/api/health
registerOpenAIRoutes(app);

// تقديم ملفات الواجهة الثابتة
app.use(express.static(ROOT, { extensions: ["html"] }));

// أي مسار آخر → الصفحة الرئيسية (تطبيق صفحة واحدة)
app.get("*", (_req, res) => {
  res.sendFile(path.join(ROOT, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  const hasKey = Boolean(process.env.OPENAI_API_KEY);
  console.log(`🦁 Safari Kids Adventure يعمل على المنفذ ${PORT}`);
  console.log(
    hasKey
      ? "✅ OPENAI_API_KEY موجود — ميزات الذكاء الاصطناعي مُفعّلة."
      : "⚠️  لا يوجد OPENAI_API_KEY — سيستخدم التطبيق Web Speech كبديل. أضِف المفتاح في Replit Secrets."
  );
});
