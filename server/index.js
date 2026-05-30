// ===== خادم Safari Kids Adventure =====
// يقدّم الملفات الثابتة + وسيطًا آمنًا لـ OpenAI (المفتاح يبقى على الخادم فقط).
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerOpenAIRoutes } from "./openai.js";
import { SECTIONS } from "./seoContent.js";
import {
  renderSectionPage,
  renderHomePage,
  renderSitemap,
  renderRobots,
} from "./seoRender.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const app = express();
const PORT = process.env.PORT || 3000;

// نقبل JSON كبيراً نسبياً (لإرسال صوت base64 للنسخ الصوتي)
app.use(express.json({ limit: "8mb" }));

// مسارات OpenAI: ‎/api/tts , ‎/api/ask , ‎/api/stt , ‎/api/health
registerOpenAIRoutes(app);

// ===== ملفات الأرشفة (SEO) =====
app.get("/sitemap.xml", (_req, res) => {
  res.type("application/xml").send(renderSitemap());
});
app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(renderRobots());
});

// الصفحة الرئيسية الغنيّة (HTML كامل يُؤرشَف بلا JavaScript)
app.get("/", (_req, res) => {
  res.type("html").send(renderHomePage());
});

// صفحات الأقسام الغنيّة: ‎/arabic-letters , ‎/animals , ...
const SLUGS = new Set(SECTIONS.map((s) => s.slug));
app.get("/:slug", (req, res, next) => {
  if (!SLUGS.has(req.params.slug)) return next();
  res.type("html").send(renderSectionPage(req.params.slug));
});

// التطبيق التفاعلي (SPA) على /app
app.get("/app", (_req, res) => {
  res.sendFile(path.join(ROOT, "index.html"));
});

// تقديم ملفات الواجهة الثابتة (css/js/manifest/sw...)
app.use(express.static(ROOT, { extensions: ["html"] }));

// أي مسار غير معروف → التطبيق التفاعلي
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
