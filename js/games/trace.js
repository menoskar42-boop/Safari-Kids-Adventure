// ===== لعبة "ارسم الحرف": يتتبّع الطفل الحرف بإصبعه فيضيء =====
import { getDataset } from "../data/datasets.js";
import { Router } from "../core/router.js";
import { Speech } from "../core/speech.js";
import { Sfx } from "../core/audio.js";
import { gameTopbar, shuffle, showCheer, finishActivity, examplePhrase } from "./common.js";

const TRACE_COUNT = 6;
const RES = 300; // دقّة داخلية ثابتة
const THRESHOLD = 0.45; // نسبة التغطية المطلوبة

export function renderTrace({ regionId, regionIndex, datasetKey, lang }) {
  const ds = getDataset(datasetKey);
  const speakLang = lang || ds.lang;
  const letters = shuffle(ds.items).slice(0, TRACE_COUNT);
  let idx = 0;

  const screen = document.createElement("div");
  screen.className = "region-screen";
  screen.style.background = "linear-gradient(180deg,#d9c2ff,#9a7bff)";

  const back = () => Router.go("region", { id: regionId, index: regionIndex });
  screen.appendChild(gameTopbar("✏️ ارسم الحرف", back));

  const stage = document.createElement("div");
  stage.className = "stage";
  screen.appendChild(stage);

  function makeCanvas(z, pointer) {
    const c = document.createElement("canvas");
    c.width = c.height = RES;
    c.style.cssText =
      `position:absolute;inset:0;width:100%;height:100%;border-radius:24px;` +
      (pointer ? "touch-action:none;" : "pointer-events:none;");
    c.style.zIndex = z;
    return c;
  }

  function render() {
    const it = letters[idx];
    stage.innerHTML = "";

    const title = document.createElement("p");
    title.style.cssText = "font-weight:800;font-size:clamp(18px,5vw,24px);color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.18)";
    title.textContent = `تتبّع الحرف: ${it.name}`;
    stage.appendChild(title);

    const box = document.createElement("div");
    box.style.cssText =
      "position:relative;width:min(72vw,300px);aspect-ratio:1;background:#fff;border-radius:24px;box-shadow:var(--shadow-card);margin:10px auto";
    stage.appendChild(box);

    const guide = makeCanvas(0, false);
    const draw = makeCanvas(1, true);
    box.appendChild(guide);
    box.appendChild(draw);

    const gctx = guide.getContext("2d");
    const dctx = draw.getContext("2d");

    // رسم الحرف الإرشادي
    function paintGuide(color) {
      gctx.clearRect(0, 0, RES, RES);
      gctx.fillStyle = color;
      gctx.font = `bold ${RES * 0.8}px "Baloo Bhaijaan 2", sans-serif`;
      gctx.textAlign = "center";
      gctx.textBaseline = "middle";
      gctx.fillText(it.char, RES / 2, RES / 2 + RES * 0.04);
    }
    paintGuide("#d9d0f0");

    // قناع الحرف لحساب التغطية
    const mask = document.createElement("canvas");
    mask.width = mask.height = RES;
    const mctx = mask.getContext("2d");
    mctx.fillStyle = "#000";
    mctx.font = `bold ${RES * 0.8}px "Baloo Bhaijaan 2", sans-serif`;
    mctx.textAlign = "center";
    mctx.textBaseline = "middle";
    mctx.fillText(it.char, RES / 2, RES / 2 + RES * 0.04);
    const maskData = mctx.getImageData(0, 0, RES, RES).data;
    let maskTotal = 0;
    for (let p = 3; p < maskData.length; p += 4) if (maskData[p] > 40) maskTotal++;

    // إعداد قلم الرسم
    dctx.lineCap = dctx.lineJoin = "round";
    dctx.lineWidth = 36;
    dctx.strokeStyle = "#ff6fb5";

    let drawing = false;
    let done = false;
    let last = null;

    function pos(e) {
      const r = draw.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return {
        x: (t.clientX - r.left) * (RES / r.width),
        y: (t.clientY - r.top) * (RES / r.height),
      };
    }
    function start(e) {
      e.preventDefault();
      drawing = true;
      last = pos(e);
      Sfx.pop();
    }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      const p = pos(e);
      dctx.beginPath();
      dctx.moveTo(last.x, last.y);
      dctx.lineTo(p.x, p.y);
      dctx.stroke();
      last = p;
    }
    function end() {
      if (!drawing) return;
      drawing = false;
      checkCoverage();
    }

    function checkCoverage() {
      if (done || maskTotal === 0) return;
      const dData = dctx.getImageData(0, 0, RES, RES).data;
      let covered = 0;
      for (let p = 3; p < dData.length; p += 4) {
        if (maskData[p] > 40 && dData[p] > 40) covered++;
      }
      if (covered / maskTotal >= THRESHOLD) {
        done = true;
        paintGuide("#34d399");
        Sfx.correct();
        Speech.say(examplePhrase(it, speakLang), { lang: speakLang });
        box.animate(
          [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }],
          { duration: 500 }
        );
        setTimeout(next, 1100);
      }
    }

    draw.addEventListener("pointerdown", start);
    draw.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    draw.addEventListener("touchstart", start, { passive: false });
    draw.addEventListener("touchmove", move, { passive: false });
    draw.addEventListener("touchend", end);

    // أدوات
    const tools = document.createElement("div");
    tools.style.cssText = "margin-top:14px;display:flex;gap:12px;justify-content:center";
    const clearBtn = document.createElement("button");
    clearBtn.className = "candy-btn";
    clearBtn.textContent = "🧽 امسح";
    clearBtn.addEventListener("click", () => { Sfx.tap(); dctx.clearRect(0, 0, RES, RES); });
    const sayBtn = document.createElement("button");
    sayBtn.className = "candy-btn";
    sayBtn.textContent = "🔊 الحرف";
    sayBtn.addEventListener("click", () => { Sfx.tap(); Speech.say(it.name, { lang: speakLang }); });
    tools.append(sayBtn, clearBtn);
    stage.appendChild(tools);

    Speech.ar(`ارسم حرف ${it.name}`);
  }

  function next() {
    idx++;
    if (idx >= letters.length) {
      showCheer("🌟", "رسمت كل الحروف!", () =>
        finishActivity({ regionId, regionIndex, stars: 6, onDone: back })
      );
    } else {
      render();
    }
  }

  setTimeout(render, 0);
  return screen;
}
