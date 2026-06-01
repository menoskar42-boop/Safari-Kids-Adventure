// ===== مولّد صفحات HTML الغنيّة للأرشفة (SSR بسيط بلا مكتبات) =====
import { SITE, SECTIONS, getSection } from "./seoContent.js";
import { GUIDES } from "./guidesContent.js";

// دليل الآباء المرتبط بقسم (إن وُجد)
function guideForSection(slug) {
  return GUIDES.find((g) => g.related === slug);
}

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ===== شبكة عناصر القسم (محتوى نصّي غنيّ يظهر بلا JavaScript) =====
function renderItems(section) {
  const cards = section.items
    .map((it) => {
      if (section.kind === "ar-letter") {
        return `<li class="seo-card"><span class="seo-emoji">${it.emoji}</span>
          <b class="seo-glyph">${esc(it.char)}</b>
          <span class="seo-name">${esc(it.name)}</span>
          <span class="seo-word">${esc(it.char)} مثل ${esc(it.word)}</span></li>`;
      }
      if (section.kind === "en-letter") {
        return `<li class="seo-card"><span class="seo-emoji">${it.emoji}</span>
          <b class="seo-glyph">${esc(it.char)}</b>
          <span class="seo-name">${esc(it.name)}</span>
          <span class="seo-word">${esc(it.char)} for ${esc(it.word)}</span></li>`;
      }
      if (section.kind === "number") {
        return `<li class="seo-card"><b class="seo-glyph">${esc(it.arDigit)}</b>
          <span class="seo-name">${esc(it.arName)}</span>
          <span class="seo-word">${esc(it.value)} — ${esc(it.enName)}</span></li>`;
      }
      if (section.kind === "creature-sound") {
        return `<li class="seo-card"><span class="seo-emoji">${it.emoji}</span>
          <span class="seo-name">${esc(it.name)}</span>
          <span class="seo-word">${esc(it.en)} — ${esc(it.sound)}</span></li>`;
      }
      // creature
      return `<li class="seo-card"><span class="seo-emoji">${it.emoji}</span>
        <span class="seo-name">${esc(it.name)}</span>
        <span class="seo-word">${esc(it.en)}</span></li>`;
    })
    .join("\n");
  return `<ul class="seo-grid">${cards}</ul>`;
}

// ===== بيانات JSON-LD المنظّمة (تساعد SEO و GEO) =====
function jsonLd(section) {
  const url = `${SITE.url}/${section.slug}`;
  const itemList = {
    "@type": "ItemList",
    itemListElement: section.items.slice(0, 30).map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name || it.arName || it.char,
    })),
  };
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        name: section.h1,
        description: section.description,
        url,
        inLanguage: ["ar", "en"],
        educationalLevel: "Preschool",
        typicalAgeRange: "3-6",
        teaches: section.keywords.slice(0, 3).join(", "),
        isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
        hasPart: itemList,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE.url },
          { "@type": "ListItem", position: 2, name: section.h1, item: url },
        ],
      },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

// ===== روابط بقية الأقسام (ربط داخلي يقوّي الأرشفة) =====
function relatedLinks(currentSlug) {
  const links = SECTIONS.filter((s) => s.slug !== currentSlug)
    .map((s) => `<li><a href="/${s.slug}">${s.emoji} ${esc(s.h1)}</a></li>`)
    .join("\n");
  return `<nav class="seo-related" aria-label="أقسام أخرى">
    <h2>تعلّم المزيد مع عالم الاستكشاف السحري</h2>
    <ul>${links}</ul></nav>`;
}

// ===== الصفحة الكاملة لقسم =====
export function renderSectionPage(slug) {
  const section = getSection(slug);
  if (!section) return null;
  const url = `${SITE.url}/${section.slug}`;
  const intro = section.intro.map((p) => `<p>${esc(p)}</p>`).join("\n");
  const guide = guideForSection(section.slug);
  const guideCta = guide
    ? `<p class="seo-intro"><a href="/guides/${guide.slug}">📚 ${esc(guide.h1)} ←</a></p>`
    : "";

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>${esc(section.title)}</title>
<meta name="description" content="${esc(section.description)}" />
<meta name="keywords" content="${esc(section.keywords.join("، "))}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${esc(SITE.name)}" />
<meta property="og:locale" content="${SITE.locale}" />
<meta property="og:title" content="${esc(section.title)}" />
<meta property="og:description" content="${esc(section.description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE.url}/og.svg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="${SITE.twitter}" />
<meta name="twitter:title" content="${esc(section.title)}" />
<meta name="twitter:description" content="${esc(section.description)}" />
<meta name="twitter:image" content="${SITE.url}/og.svg" />
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${section.emoji}</text></svg>" />
<link rel="stylesheet" href="/css/seo.css" />
${jsonLd(section)}
</head>
<body>
<header class="seo-header">
  <a class="seo-logo" href="/explore">🦁 عالم الاستكشاف السحري</a>
</header>
<main class="seo-main">
  <h1>${section.emoji} ${esc(section.h1)}</h1>
  <div class="seo-intro">${intro}</div>
  <a class="seo-play" href="/app?region=${section.region}">▶ العب وتعلّم الآن</a>
  ${guideCta}
  <section aria-label="المحتوى التعليمي">
    <h2>محتوى ${esc(section.h1)}</h2>
    ${renderItems(section)}
  </section>
  ${relatedLinks(section.slug)}
</main>
<footer class="seo-footer">
  <p>عالم الاستكشاف السحري — تطبيق تعليمي تفاعلي للأطفال من ٣ إلى ٦ سنوات.</p>
  <p><a href="/explore">العودة إلى صفحة الاستكشاف</a></p>
</footer>
</body>
</html>`;
}

// ===== الصفحة الرئيسية الغنيّة (للأرشفة) =====
export function renderHomePage() {
  const sections = SECTIONS.map(
    (s) => `<li class="seo-home-card"><a href="/${s.slug}">
      <span class="seo-emoji">${s.emoji}</span>
      <span class="seo-name">${esc(s.h1)}</span></a></li>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>${esc(SITE.name)} — تطبيق تعليمي تفاعلي للأطفال</title>
<meta name="description" content="عالم الاستكشاف السحري: تطبيق مغامرات تعليمي للأطفال من ٣ إلى ٦ سنوات لتعليم الحروف العربية والإنجليزية والأرقام والحيوانات والألوان والأشكال بالصوت والألعاب." />
<meta name="keywords" content="تطبيق تعليمي للاطفال، تعليم الحروف، تعليم الارقام، العاب تعليمية، تعلم العربية والانجليزية للاطفال" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="${SITE.url}/explore" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${esc(SITE.name)}" />
<meta property="og:locale" content="${SITE.locale}" />
<meta property="og:title" content="${esc(SITE.name)}" />
<meta property="og:description" content="تطبيق مغامرات تعليمي للأطفال: حروف وأرقام وحيوانات وألوان وأشكال بالصوت والألعاب." />
<meta property="og:url" content="${SITE.url}/explore" />
<meta property="og:image" content="${SITE.url}/og.svg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="${SITE.twitter}" />
<meta name="twitter:image" content="${SITE.url}/og.svg" />
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦁</text></svg>" />
<link rel="stylesheet" href="/css/seo.css" />
<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  inLanguage: ["ar", "en"],
  description:
    "تطبيق مغامرات تعليمي للأطفال من ٣ إلى ٦ سنوات لتعليم الحروف والأرقام والحيوانات والألوان والأشكال.",
})}</script>
</head>
<body>
<header class="seo-header">
  <span class="seo-logo">🦁 عالم الاستكشاف السحري</span>
</header>
<main class="seo-main">
  <h1>🦁 عالم الاستكشاف السحري — تطبيق تعليمي للأطفال</h1>
  <div class="seo-intro">
    <p>عالم الاستكشاف السحري تطبيق مغامرات تعليمي تفاعلي للأطفال من عمر ٣ إلى ٦ سنوات. يتعلّم طفلك الحروف العربية والإنجليزية والأرقام والحيوانات والأسماك والطيور والفواكه والألوان والأشكال، بأسلوب اللعب والمكافآت لا التلقين.</p>
    <p>اختر قسماً لتبدأ رحلة التعلّم، أو افتح التطبيق التفاعلي كاملاً.</p>
  </div>
  <a class="seo-play" href="/app">▶ افتح التطبيق التفاعلي</a>
  <section aria-label="أقسام التعلّم">
    <h2>أقسام التعلّم</h2>
    <ul class="seo-home-grid">${sections}</ul>
  </section>
  <nav class="seo-related" aria-label="أدلة الآباء">
    <h2>📚 أدلة الآباء</h2>
    <ul><li><a href="/guides">نصائح وأدلة عملية لتعليم طفلك الحروف والأرقام والحيوانات ←</a></li></ul>
  </nav>
</main>
<footer class="seo-footer">
  <p>عالم الاستكشاف السحري — تطبيق تعليمي تفاعلي للأطفال من ٣ إلى ٦ سنوات.</p>
  <p><a href="/about">حول التطبيق</a> · <a href="/privacy">سياسة الخصوصية</a> · <a href="/guides">أدلة الآباء</a></p>
</footer>
</body>
</html>`;
}

// ===== sitemap.xml طبقاً لمواصفات Google =====
export function renderSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${SITE.url}/`, priority: "1.0", freq: "daily" },
    { loc: `${SITE.url}/explore`, priority: "0.9", freq: "weekly" },
    ...SECTIONS.map((s) => ({
      loc: `${SITE.url}/${s.slug}`,
      priority: "0.8",
      freq: "monthly",
    })),
    { loc: `${SITE.url}/guides`, priority: "0.7", freq: "monthly" },
    ...GUIDES.map((g) => ({
      loc: `${SITE.url}/guides/${g.slug}`,
      priority: "0.7",
      freq: "monthly",
    })),
    { loc: `${SITE.url}/about`, priority: "0.5", freq: "yearly" },
    { loc: `${SITE.url}/privacy`, priority: "0.4", freq: "yearly" },
    { loc: `${SITE.url}/contact`, priority: "0.4", freq: "yearly" },
  ];
  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

// ===== robots.txt =====
export function renderRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`;
}
