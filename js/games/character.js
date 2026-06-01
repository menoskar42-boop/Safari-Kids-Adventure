// ===== ميزو: شخصية الطفل المعلّم (SVG متحرّكة بفمٍ يتزامن مع الكلام) =====
// شبه‑مجسّمة بالتدرّجات والظلال، تطرف بعينيها وتتمايل، وفمها يتحرّك أثناء النطق.
// خفيفة، بلا أصول خارجية، وتعمل دون إنترنت. تُستخدم في شاشة "معلّم الحروف".
export const CHARACTER_NAME = "ميزو";

// جُمَل ميزو (مبسّطة ودافئة لعمر ٣–٦، تبني الألفة والثقة)
export const MIZO_INTRO = [
  "أهلاً يا صديقي، أنا ميزو صاحبك الجديد!",
  "سنتعلّم ونلعب معاً، هيا بنا نبدأ!",
];
export const MIZO_PRAISE = [
  "أحسنت يا بطل!",
  "رائع، أنت ذكيّ جداً!",
  "ما شاء الله عليك!",
  "أنت تتعلّم بسرعة، واصل!",
  "عملٌ جميل، أنا فخورٌ بك!",
  "ممتاز يا صديقي، أنت تبدع!",
];

export function createCharacter(name = CHARACTER_NAME) {
  const el = document.createElement("div");
  el.className = "miz";
  el.setAttribute("aria-label", name);
  el.innerHTML = `
    <svg viewBox="0 0 200 220" class="miz-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mizFace" cx="50%" cy="40%" r="62%">
          <stop offset="0%" stop-color="#ffe3c6"/>
          <stop offset="100%" stop-color="#f3b98e"/>
        </radialGradient>
        <linearGradient id="mizShirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ff9a63"/>
          <stop offset="100%" stop-color="#ff6a3d"/>
        </linearGradient>
        <linearGradient id="mizHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6b4226"/>
          <stop offset="100%" stop-color="#46291a"/>
        </linearGradient>
      </defs>

      <!-- الجسم/القميص -->
      <path d="M52 220 Q52 162 100 158 Q148 162 148 220 Z" fill="url(#mizShirt)"/>
      <path d="M86 160 Q100 174 114 160 L108 158 Q100 166 92 158 Z" fill="#ff6a3d"/>
      <!-- الرقبة -->
      <rect x="88" y="138" width="24" height="26" rx="9" fill="#eaa87a"/>
      <!-- الأذنان -->
      <circle cx="54" cy="92" r="11" fill="url(#mizFace)"/>
      <circle cx="146" cy="92" r="11" fill="url(#mizFace)"/>
      <!-- الرأس -->
      <ellipse cx="100" cy="86" rx="52" ry="56" fill="url(#mizFace)"/>
      <!-- الشعر المجعّد -->
      <g fill="url(#mizHair)">
        <circle cx="70" cy="46" r="21"/>
        <circle cx="100" cy="36" r="23"/>
        <circle cx="130" cy="46" r="21"/>
        <circle cx="52" cy="64" r="16"/>
        <circle cx="148" cy="64" r="16"/>
      </g>
      <!-- الحاجبان -->
      <path d="M66 72 Q78 65 91 72" stroke="#46291a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M109 72 Q122 65 134 72" stroke="#46291a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <!-- العينان (تطرفان) -->
      <g class="miz-eyes">
        <ellipse cx="80" cy="90" rx="11" ry="13" fill="#fff"/>
        <ellipse cx="120" cy="90" rx="11" ry="13" fill="#fff"/>
        <circle cx="82" cy="92" r="5.5" fill="#39271f"/>
        <circle cx="118" cy="92" r="5.5" fill="#39271f"/>
        <circle cx="84" cy="90" r="1.8" fill="#fff"/>
        <circle cx="120" cy="90" r="1.8" fill="#fff"/>
      </g>
      <!-- الأنف -->
      <path d="M98 98 Q100 107 105 104" stroke="#d9966a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- الخدّان -->
      <circle cx="66" cy="110" r="8" fill="#ff9d9d" opacity=".55"/>
      <circle cx="134" cy="110" r="8" fill="#ff9d9d" opacity=".55"/>
      <!-- الفم (يتحرّك مع الكلام) -->
      <ellipse class="miz-mouth" cx="100" cy="118" rx="14" ry="9" fill="#8a3a2c"/>
    </svg>`;

  const mouth = el.querySelector(".miz-mouth");
  let stopTimer = null;

  function startTalking(ms) {
    el.classList.add("talking");
    clearTimeout(stopTimer);
    if (ms) stopTimer = setTimeout(stopTalking, ms);
  }
  function stopTalking() {
    clearTimeout(stopTimer);
    el.classList.remove("talking");
  }

  return { el, startTalking, stopTalking, name, mouth };
}
