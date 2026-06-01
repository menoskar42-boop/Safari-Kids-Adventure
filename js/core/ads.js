// ===== شريط إعلان سفلي متوافق (Google AdSense) =====
// مخفيّ افتراضياً (FEATURES.ads=false) حتى تُعتمد في AdSense وتضع المُعرّفات أدناه.
// متوافق مع سياسة الأطفال: إعلان عرض (display) أسفل الصفحة فقط، غير مزعج،
// وبلا فيديو بيني يقطع التنقّل. فعّل المعاملة "موجَّه للأطفال" + إعلانات غير
// مخصّصة (NPA) من إعدادات حساب AdSense قبل تشغيله.
import { FEATURES } from "./features.js";

// ✅ بعد اعتماد موقعك في AdSense، ضع المُعرّفين هنا ثم اجعل FEATURES.ads = true
export const ADS = {
  publisherId: "", // مثال: "ca-pub-XXXXXXXXXXXXXXXX"
  slotId: "",      // مثال: "1234567890"
};

let mounted = false;
let scriptLoaded = false;

function loadAdSenseScript() {
  if (scriptLoaded || !ADS.publisherId) return;
  scriptLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS.publisherId}`;
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

/** يركّب شريط الإعلان السفلي مرّة واحدة — لا يفعل شيئاً ما لم يُفعَّل وتُضبَط المُعرّفات */
export function mountAdBar() {
  if (mounted) return;
  if (!FEATURES.ads || !ADS.publisherId || !ADS.slotId) return; // يبقى مخفياً حتى الاعتماد
  mounted = true;
  document.body.classList.add("has-ad-bar");

  const bar = document.createElement("div");
  bar.className = "ad-bar";
  bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = `
    <span class="ad-bar-label">إعلان</span>
    <ins class="adsbygoogle" style="display:block;width:100%;height:60px"
      data-ad-client="${ADS.publisherId}"
      data-ad-slot="${ADS.slotId}"
      data-ad-format="horizontal"
      data-full-width-responsive="false"></ins>`;
  document.body.appendChild(bar);

  loadAdSenseScript();
  try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (_e) {}
}
