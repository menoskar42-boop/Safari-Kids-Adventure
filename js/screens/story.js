// ===== شاشة القصص التفاعلية: مشهد تلو الآخر مع نطق =====
import { getStory } from "../data/stories.js";
import { Router } from "../core/router.js";
import { Speech } from "../core/speech.js";
import { Sfx } from "../core/audio.js";
import { Confetti } from "../core/confetti.js";
import { gameTopbar, finishActivity } from "../games/common.js";

export function renderStory({ regionId, regionIndex, storyId }) {
  const story = getStory(storyId);
  let i = 0;

  const screen = document.createElement("div");
  screen.className = "region-screen";
  screen.style.background = "linear-gradient(180deg,#ffe6c2,#ff9a8b)";

  const back = () => Router.go("region", { id: regionId, index: regionIndex });
  screen.appendChild(gameTopbar(`${story.emoji} ${story.title}`, back));

  const stage = document.createElement("div");
  stage.className = "stage";
  screen.appendChild(stage);

  function speakScene(sc) {
    Speech.ar(sc.text);
  }

  function render() {
    const sc = story.scenes[i];
    stage.innerHTML = "";

    // عدّاد المشاهد
    const dots = document.createElement("div");
    dots.className = "progress-dots";
    for (let k = 0; k < story.scenes.length; k++) {
      const d = document.createElement("span");
      d.className = "dot" + (k <= i ? " active" : "");
      dots.appendChild(d);
    }
    stage.appendChild(dots);

    const big = document.createElement("div");
    big.className = "hero-emoji";
    big.textContent = sc.emoji;
    big.style.cursor = "pointer";
    big.addEventListener("click", () => { Sfx.pop(); speakScene(sc); });
    stage.appendChild(big);

    const text = document.createElement("p");
    text.style.cssText =
      "font-weight:800;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.2);font-size:clamp(18px,5vw,24px);max-width:560px;line-height:1.7;margin:8px auto";
    text.textContent = sc.text;
    stage.appendChild(text);

    const nav = document.createElement("div");
    nav.style.cssText = "display:flex;gap:12px;justify-content:center;margin-top:16px";
    const repeat = document.createElement("button");
    repeat.className = "candy-btn";
    repeat.style.background = "linear-gradient(180deg,#34d399,#16a34a)";
    repeat.textContent = "🔊 اقرأ لي";
    repeat.addEventListener("click", () => { Sfx.tap(); speakScene(sc); });
    nav.appendChild(repeat);

    if (i < story.scenes.length - 1) {
      const next = document.createElement("button");
      next.className = "candy-btn";
      next.textContent = "التالي ›";
      next.addEventListener("click", () => { Sfx.whoosh(); i++; render(); });
      nav.appendChild(next);
    } else {
      const done = document.createElement("button");
      done.className = "candy-btn";
      done.textContent = "النهاية 🎉";
      done.addEventListener("click", () => {
        Confetti.burst();
        finishActivity({ regionId, regionIndex, stars: 5, onDone: back });
      });
      nav.appendChild(done);
    }
    stage.appendChild(nav);

    speakScene(sc);
  }

  setTimeout(render, 0);
  return screen;
}
