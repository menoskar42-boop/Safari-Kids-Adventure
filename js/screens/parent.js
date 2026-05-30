// ===== متابعة ولي الأمر: تقدّم الطفل في كل منطقة =====
import { REGIONS } from "../data/regions.js";
import { COLLECTIBLES } from "../core/rewards.js";
import { Store } from "../core/storage.js";
import { Router } from "../core/router.js";
import { Sfx } from "../core/audio.js";
import { updateStarCounter } from "../core/rewards.js";

export function renderParent() {
  const screen = document.createElement("div");
  screen.className = "region-screen";
  screen.style.background = "linear-gradient(180deg,#eef1ff,#dfe4ff)";

  const topbar = document.createElement("div");
  topbar.className = "topbar";
  topbar.innerHTML = `
    <button class="icon-btn" id="backBtn" title="رجوع">🏠</button>
    <h2>👨‍👩‍👧 متابعة ولي الأمر</h2>
    <span style="width:48px"></span>`;
  screen.appendChild(topbar);

  const wrap = document.createElement("div");
  wrap.style.cssText = "max-width:620px;margin:0 auto;padding:16px 16px 40px";

  // ملخّص
  const collected = Store.state.collection.length;
  const doneCount = REGIONS.filter((r) => Store.regionProgress(r.id).completed).length;
  const summary = document.createElement("div");
  summary.style.cssText = "display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-bottom:18px";
  summary.innerHTML = `
    ${stat("⭐", Store.stars, "نجمة")}
    ${stat("🗺️", `${doneCount}/${REGIONS.length}`, "مناطق")}
    ${stat("🎁", `${collected}/${COLLECTIBLES.length}`, "كنوز")}`;
  wrap.appendChild(summary);

  // تفصيل المناطق
  REGIONS.forEach((r) => {
    const p = Store.regionProgress(r.id);
    const row = document.createElement("div");
    row.style.cssText =
      "display:flex;align-items:center;gap:12px;background:#fff;border-radius:18px;padding:12px 14px;margin-bottom:10px;box-shadow:var(--shadow-card)";
    row.innerHTML = `
      <span style="font-size:34px">${r.emoji}</span>
      <div style="flex:1">
        <div style="font-weight:800;color:var(--c-ink)">${r.name}</div>
        <div style="font-size:13px;color:#7a6ca8">${r.nameEn}</div>
      </div>
      <div style="text-align:center;font-weight:800;color:var(--c-purple)">
        ⭐ ${p.stars || 0}<br><span style="font-size:18px">${p.completed ? "✅" : "⏳"}</span>
      </div>`;
    wrap.appendChild(row);
  });

  // روابط الآباء: أدلة ومعلومات (صفحات المحتوى/الأرشفة)
  const guidesLink = document.createElement("a");
  guidesLink.className = "candy-btn";
  guidesLink.href = "/explore";
  guidesLink.style.cssText =
    "display:block;width:fit-content;margin:24px auto 0;text-decoration:none;text-align:center;background:linear-gradient(180deg,#7c5fe6,#5b3fb5)";
  guidesLink.textContent = "📖 أدلة ومعلومات للآباء";
  wrap.appendChild(guidesLink);

  // إعادة ضبط
  const reset = document.createElement("button");
  reset.className = "candy-btn";
  reset.style.cssText = "display:block;margin:14px auto 0;background:linear-gradient(180deg,#ff8a8a,#ff5d5d)";
  reset.textContent = "🗑️ إعادة ضبط التقدّم";
  reset.addEventListener("click", () => {
    Sfx.tap();
    if (confirm("هل تريد محو كل تقدّم الطفل والبدء من جديد؟")) {
      Store.reset();
      updateStarCounter();
      Router.go("home");
    }
  });
  wrap.appendChild(reset);

  const note = document.createElement("p");
  note.style.cssText = "text-align:center;color:#7a6ca8;font-size:13px;margin-top:14px";
  note.textContent = "يُحفظ التقدّم على هذا الجهاز فقط.";
  wrap.appendChild(note);

  screen.appendChild(wrap);

  setTimeout(() => {
    screen.querySelector("#backBtn").addEventListener("click", () => { Sfx.tap(); Router.go("home"); });
  }, 0);

  return screen;
}

function stat(icon, value, label) {
  return `<div style="background:#fff;border-radius:18px;padding:12px 18px;text-align:center;box-shadow:var(--shadow-card);min-width:90px">
    <div style="font-size:28px">${icon}</div>
    <div style="font-weight:800;font-size:22px;color:var(--c-purple)">${value}</div>
    <div style="font-size:12px;color:#7a6ca8">${label}</div>
  </div>`;
}
