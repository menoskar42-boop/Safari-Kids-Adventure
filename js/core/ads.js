// ===== شريط إعلان سفلي متوافق (Google AdSense) =====
// مخفيّ افتراضياً (FEATURES.ads=false) حتى تُعتمد في AdSense وتضع المُعرّفات أدناه.
// متوافق مع سياسة الأطفال: إعلان عرض (display) أسفل الصفحة فقط، غير مزعج،
// وبلا فيديو بيني يقطع التنقّل. فعّل المعاملة "موجَّه للأطفال" + إعلانات غير
// مخصّصة (NPA) من إعدادات حساب AdSense قبل تشغيله.
import { FEATURES } from "./features.js";

// ✅ بعد اعتماد موقعك في AdSense، ضع المُعرّفين هنا ثم اجعل FEATURES.ads = true
export const ADS = {
  publisherId: "ca-pub-3132188303904900", // معرّف ناشر AdSense (للحساب كله)
  slotId: "",      // ← ضع معرّف وحدة الإعلان من لوحة AdSense بعد القبول (مثال: "1234567890")
};

let shown = false;
let scriptLoaded = false;

function loadAdSenseScript() {
  if (scriptLoaded || !ADS.publisherId) return;
  scriptLoaded = true;
  // المكتبة لم تعُد في <head> — تُحقَن هنا ديناميكياً مرّة واحدة (guard أعلاه)،
  // ولا يحدث ذلك إلا من showAdBar داخل قسم ولي الأمر بعد اجتياز البوّابة.
  if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS.publisherId}`;
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

/**
 * يُظهر شريط الإعلان السفلي — يُستدعى فقط من شاشات الكبار (لوحة ولي الأمر).
 * توافق COPPA/Families: لا يُطلَب أيّ إعلان إطلاقاً على شاشات الطفل، لأن الطلب
 * (push) يحدث هنا فقط. ويبقى الشريط مخفياً حتى تُفعَّل FEATURES.ads وتُضبَط المُعرّفات.
 */
export function showAdBar() {
  if (shown) return;
  if (!FEATURES.ads || !ADS.publisherId || !ADS.slotId) return; // يبقى مخفياً حتى الاعتماد
  shown = true;
  document.body.classList.add("has-ad-bar");

  const bar = document.createElement("div");
  bar.className = "ad-bar";
  bar.id = "adBar";
  bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = `
    <span class="ad-bar-label">إعلان</span>
    <ins class="adsbygoogle" style="display:block;width:100%;height:60px"
      data-ad-client="${ADS.publisherId}"
      data-ad-slot="${ADS.slotId}"
      data-ad-format="horizontal"
      data-full-width-responsive="false"></ins>`;
  document.body.appendChild(bar);

  // ===== توافق COPPA: محتوى موجَّه للأطفال + إعلانات غير مخصّصة (قبل أيّ ad push) =====
  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.requestNonPersonalizedAds = 1; // إعلانات غير مخصّصة (NPA)
  try {
    window.adsbygoogle.push({ params: { tag_for_child_directed_treatment: 1 } });
  } catch (_e) {}

  loadAdSenseScript();
  try { window.adsbygoogle.push({}); } catch (_e) {}
}

/** يُزيل شريط الإعلان — يُستدعى عند مغادرة شاشة الكبار (وعلى كل شاشات الطفل). */
export function hideAdBar() {
  document.body.classList.remove("has-ad-bar");
  const bar = document.getElementById("adBar");
  if (bar) bar.remove();
  shown = false; // أيّ دخول لاحق لشاشة الكبار يُنشئ طلباً جديداً نظيفاً
}
