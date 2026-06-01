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
    ${stat("🔥", Store.streak, "يوم متتالٍ")}
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

  // تذكير وقت الشاشة
  const stBox = document.createElement("div");
  stBox.style.cssText =
    "background:#fff;border-radius:18px;padding:14px;margin-top:18px;box-shadow:var(--shadow-card);text-align:center";
  const opts = [0, 10, 15, 20, 30];
  stBox.innerHTML = `<div style="font-weight:800;color:var(--c-ink);margin-bottom:10px">⏰ تذكير وقت اللعب</div>`;
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;justify-content:center";
  opts.forEach((m) => {
    const b = document.createElement("button");
    b.className = "video-cat" + (Store.screenTimeMin === m ? " active" : "");
    b.textContent = m === 0 ? "بدون" : `${m} دقيقة`;
    b.addEventListener("click", () => {
      Sfx.tap();
      Store.setScreenTime(m);
      row.querySelectorAll(".video-cat").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
    });
    row.appendChild(b);
  });
  stBox.appendChild(row);
  const stNote = document.createElement("p");
  stNote.style.cssText = "font-size:12px;color:#7a6ca8;margin:10px 0 0";
  stNote.textContent = "تذكير لطيف داخل التطبيق بعد المدّة (يُطبّق عند فتح التطبيق التالي).";
  stBox.appendChild(stNote);
  wrap.appendChild(stBox);

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

  // ===== بوّابة الآباء: رقم سري من ٤ أرقام =====
  const gate = document.createElement("div");
  gate.className = "stage";
  const hasPin = !!Store.parentPin;
  // وضع الإعداد عند أول مرّة (لا يوجد رقم سري بعد)، وإلا وضع الإدخال
  let setupStep = hasPin ? null : 1; // 1=اكتب رقماً جديداً، 2=أكّده
  let firstPin = "";

  gate.innerHTML = `
    <div class="hero-emoji">🔒</div>
    <p style="font-weight:800;color:var(--c-purple);font-size:clamp(18px,5vw,24px)">للآباء فقط</p>
    <p id="gateMsg" style="font-weight:800;color:var(--c-ink);font-size:clamp(18px,5vw,24px)"></p>
    <input id="gateInput" type="password" inputmode="numeric" maxlength="4" autocomplete="off"
      style="font-size:34px;font-weight:800;text-align:center;letter-spacing:14px;width:160px;padding:10px;border-radius:16px;border:3px solid var(--c-purple)" />
    <div style="margin-top:14px"><button class="candy-btn" id="gateOk">تأكيد</button></div>
    <p id="gateErr" style="color:var(--c-red);font-weight:700;margin-top:8px;min-height:1.2em"></p>`;
  screen.appendChild(gate);

  setTimeout(() => {
    screen.querySelector("#backBtn").addEventListener("click", () => { Sfx.tap(); Router.go("home"); });
    const input = gate.querySelector("#gateInput");
    const msg = gate.querySelector("#gateMsg");
    const err = gate.querySelector("#gateErr");
    const refresh = () => {
      err.textContent = "";
      input.value = "";
      msg.textContent = !hasPin
        ? (setupStep === 1 ? "اختر رقماً سرياً جديداً (٤ أرقام)" : "أعد كتابة الرقم السري للتأكيد")
        : "أدخل الرقم السري";
      input.focus();
    };
    const unlock = () => { Sfx.correct(); gate.remove(); screen.appendChild(wrap); };

    const submit = () => {
      const v = (input.value || "").replace(/\D/g, "");
      if (v.length !== 4) { Sfx.wrong(); err.textContent = "اكتب ٤ أرقام"; return; }
      if (!hasPin) {
        // إعداد رقم جديد بخطوتين (كتابة + تأكيد)
        if (setupStep === 1) { firstPin = v; setupStep = 2; refresh(); return; }
        if (v !== firstPin) { Sfx.wrong(); err.textContent = "الرقمان غير متطابقين، أعد المحاولة"; setupStep = 1; refresh(); return; }
        Store.setParentPin(v);
        unlock();
      } else if (v === Store.parentPin) {
        unlock();
      } else {
        Sfx.wrong(); err.textContent = "رقم سري غير صحيح"; input.value = ""; input.focus();
      }
    };
    gate.querySelector("#gateOk").addEventListener("click", submit);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
    refresh();
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
