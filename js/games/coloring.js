// ===== لعبة التلوين: لوّن الصور باختيار الألوان =====
// تظهر صورة بخطوط فارغة، يختار الطفل لوناً ويضغط على أي جزء ليملأه.
// رسومات SVG بسيطة قابلة للتلوين (كل جزء مستقل). تنتقل بين عدة صور.
import { Router } from "../core/router.js";
import { Sfx } from "../core/audio.js";
import { Speech } from "../core/speech.js";
import { gameTopbar, finishActivity, shuffle } from "./common.js";

const PALETTE = [
  "#ff5d5d", "#ff924c", "#ffd23f", "#34d399",
  "#38bdf8", "#7c5fe6", "#ff6fb5", "#8b5e34", "#2b2b2b", "#ffffff",
];

// كل صورة: اسم عربي + أجزاء SVG قابلة للتلوين (class="cl")
const PICTURES = [
  {
    name: "تُفّاحة",
    svg: `
      <rect class="cl" x="96" y="38" width="9" height="26" rx="4"/>
      <ellipse class="cl" cx="122" cy="48" rx="18" ry="9" transform="rotate(-25 122 48)"/>
      <path class="cl" d="M100 62 C70 42 40 64 46 102 C50 142 80 166 100 166 C120 166 150 142 154 102 C160 64 130 42 100 62 Z"/>`,
  },
  {
    name: "سمكة",
    svg: `
      <polygon class="cl" points="150,100 192,68 192,132"/>
      <ellipse class="cl" cx="95" cy="100" rx="62" ry="40"/>
      <polygon class="cl" points="95,60 122,38 128,72"/>
      <circle class="cl" cx="62" cy="88" r="10"/>`,
  },
  {
    name: "منزل",
    svg: `
      <polygon class="cl" points="38,102 100,48 162,102"/>
      <rect class="cl" x="50" y="102" width="100" height="80"/>
      <rect class="cl" x="86" y="135" width="30" height="47"/>
      <rect class="cl" x="60" y="116" width="22" height="22"/>
      <rect class="cl" x="118" y="116" width="22" height="22"/>`,
  },
  {
    name: "فَراشة",
    svg: `
      <ellipse class="cl" cx="72" cy="78" rx="30" ry="24"/>
      <ellipse class="cl" cx="128" cy="78" rx="30" ry="24"/>
      <ellipse class="cl" cx="74" cy="126" rx="25" ry="19"/>
      <ellipse class="cl" cx="126" cy="126" rx="25" ry="19"/>
      <ellipse class="cl" cx="100" cy="100" rx="9" ry="42"/>`,
  },
  {
    name: "بالون",
    svg: `
      <line x1="100" y1="148" x2="100" y2="186" stroke="#3a2c66" stroke-width="3"/>
      <ellipse class="cl" cx="100" cy="82" rx="50" ry="60"/>
      <polygon class="cl" points="92,140 108,140 100,154"/>`,
  },
  {
    name: "زَهرة",
    svg: `
      <rect class="cl" x="96" y="100" width="8" height="76"/>
      <ellipse class="cl" cx="128" cy="150" rx="22" ry="11"/>
      <circle class="cl" cx="100" cy="56" r="22"/>
      <circle class="cl" cx="68" cy="80" r="22"/>
      <circle class="cl" cx="132" cy="80" r="22"/>
      <circle class="cl" cx="80" cy="116" r="22"/>
      <circle class="cl" cx="120" cy="116" r="22"/>
      <circle class="cl" cx="100" cy="90" r="20"/>`,
  },
  {
    name: "سيّارة",
    svg: `
      <path class="cl" d="M68 96 L84 64 L134 64 L152 96 Z"/>
      <rect class="cl" x="34" y="96" width="132" height="42" rx="12"/>
      <circle class="cl" cx="70" cy="142" r="18"/>
      <circle class="cl" cx="132" cy="142" r="18"/>`,
  },
];

export function renderColoring({ regionId, regionIndex, title, bg }) {
  const pics = shuffle(PICTURES);
  let index = 0;

  const screen = document.createElement("div");
  screen.className = "region-screen";
  screen.style.background = bg || "linear-gradient(180deg,#fff3d6,#ffd6ec)";

  const back = () => Router.go(regionId ? "region" : "home", regionId ? { id: regionId, index: regionIndex } : {});
  screen.appendChild(gameTopbar(title || "🎨 التلوين", back));

  const wrap = document.createElement("div");
  wrap.style.cssText = "max-width:560px;margin:0 auto;padding:6px 14px 30px";
  screen.appendChild(wrap);

  const name = document.createElement("p");
  name.style.cssText = "text-align:center;font-weight:800;color:#5b3fb5;font-size:clamp(18px,5vw,26px);margin:6px 0 10px";
  wrap.appendChild(name);

  const stage = document.createElement("div");
  stage.className = "color-stage";
  wrap.appendChild(stage);

  let color = PALETTE[0];

  function loadPicture() {
    const pic = pics[index];
    name.textContent = `لوّن: ${pic.name} 🖌️`;
    stage.innerHTML =
      `<svg viewBox="0 0 200 200" class="color-svg" preserveAspectRatio="xMidYMid meet">${pic.svg}</svg>`;
    const svg = stage.querySelector("svg");
    svg.querySelectorAll(".cl").forEach((part) => {
      part.setAttribute("fill", "#ffffff");
      part.setAttribute("stroke", "#3a2c66");
      part.setAttribute("stroke-width", "2.5");
      part.style.cursor = "pointer";
      part.addEventListener("click", () => {
        part.setAttribute("fill", color);
        Sfx.pop();
      });
    });
    Speech.ar(`لوّن ${pic.name}`);
  }

  // شريط الألوان
  const palette = document.createElement("div");
  palette.style.cssText = "display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:14px";
  PALETTE.forEach((col, idx) => {
    const b = document.createElement("button");
    b.style.cssText =
      `width:38px;height:38px;border-radius:50%;border:4px solid ${idx === 0 ? "#5b3fb5" : "#fff"};` +
      `background:${col};box-shadow:var(--shadow-card);transition:transform .12s ease`;
    b.addEventListener("click", () => {
      color = col; Sfx.tap();
      palette.querySelectorAll("button").forEach((x) => (x.style.border = "4px solid #fff"));
      b.style.border = "4px solid #5b3fb5";
      b.style.transform = "scale(1.15)";
      setTimeout(() => (b.style.transform = ""), 150);
    });
    palette.appendChild(b);
  });
  wrap.appendChild(palette);

  // الأزرار: التالي / تم
  const ctrl = document.createElement("div");
  ctrl.style.cssText = "display:flex;gap:12px;justify-content:center;margin-top:16px;flex-wrap:wrap";
  const nextBtn = document.createElement("button");
  nextBtn.className = "candy-btn";
  nextBtn.textContent = "صورة أخرى 🔄";
  nextBtn.addEventListener("click", () => {
    Sfx.tap();
    index = (index + 1) % pics.length;
    loadPicture();
  });
  const doneBtn = document.createElement("button");
  doneBtn.className = "candy-btn";
  doneBtn.style.background = "linear-gradient(180deg,#34d399,#10b981)";
  doneBtn.textContent = "✓ انتهيت";
  doneBtn.addEventListener("click", () => {
    finishActivity({ regionId, regionIndex, stars: 5, onDone: back });
  });
  ctrl.append(nextBtn, doneBtn);
  wrap.appendChild(ctrl);

  setTimeout(loadPicture, 30);
  return screen;
}
