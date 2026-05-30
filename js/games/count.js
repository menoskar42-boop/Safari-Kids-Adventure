// ===== ألعاب الأرقام والعدّ =====
import { NUMBERS, NUMBERS_10, COUNT_EMOJIS } from "../data/numbers.js";
import { Router } from "../core/router.js";
import { Speech } from "../core/speech.js";
import { Sfx } from "../core/audio.js";
import { awardStars } from "../core/rewards.js";
import { gameTopbar, progressDots, shuffle, showCheer, finishActivity } from "./common.js";

const rand = (arr) => arr[(Math.random() * arr.length) | 0];

function speakBoth(num) {
  Speech.sequence([
    { text: num.arName, lang: "ar-EG" },
    { text: num.enName, lang: "en-US" },
  ]);
}

function baseScreen(title, regionId, regionIndex) {
  const screen = document.createElement("div");
  screen.className = "region-screen";
  screen.style.background = "linear-gradient(180deg,#ffe29a,#ffb86c)";
  const back = () => Router.go("region", { id: regionId, index: regionIndex });
  screen.appendChild(gameTopbar(title, back));
  const stage = document.createElement("div");
  stage.className = "stage";
  screen.appendChild(stage);
  return { screen, stage, back };
}

// ===== لعبة ١: تعرّف على الأرقام والعدّ =====
export function renderCountLearn({ regionId, regionIndex }) {
  const { screen, stage, back } = baseScreen("🔢 تعرّف على الأرقام", regionId, regionIndex);
  let i = 0;

  function render() {
    const num = NUMBERS_10[i];
    const emoji = rand(COUNT_EMOJIS);
    stage.innerHTML = "";
    stage.appendChild(progressDots(NUMBERS_10.length, i - 1));

    const glyph = document.createElement("div");
    glyph.className = "hero-glyph";
    glyph.innerHTML = `${num.arDigit} <span style="font-size:.6em;opacity:.85">(${num.value})</span>`;
    glyph.style.cursor = "pointer";
    glyph.addEventListener("click", () => { Sfx.pop(); speakBoth(num); });
    stage.appendChild(glyph);

    const hint = document.createElement("p");
    hint.style.cssText = "font-weight:800;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.18);font-size:clamp(16px,4.5vw,22px)";
    hint.textContent = `المسهم وعُدّهم! (${num.value})`;
    stage.appendChild(hint);

    const row = document.createElement("div");
    row.className = "choice-row";
    let counted = 0;
    for (let k = 0; k < num.value; k++) {
      const b = document.createElement("button");
      b.className = "choice";
      b.textContent = emoji;
      b.addEventListener("click", () => {
        if (b.disabled) return;
        b.disabled = true;
        b.style.opacity = ".4";
        counted++;
        Sfx.pop();
        Speech.ar(String(counted));
        if (counted === num.value) {
          Sfx.correct();
          awardStars(1);
          setTimeout(() => { speakBoth(num); setTimeout(next, 1100); }, 500);
        }
      });
      row.appendChild(b);
    }
    stage.appendChild(row);
    speakBoth(num);
  }

  function next() {
    i++;
    if (i >= NUMBERS_10.length) finishActivity({ regionId, regionIndex, stars: 6, onDone: back });
    else render();
  }

  setTimeout(render, 0);
  return screen;
}

// ===== لعبة: تعرّف على الأرقام الكبيرة ١١–٢٠ (استمع ثم اختر الرقم) =====
export function renderBigNumbers({ regionId, regionIndex }) {
  const { screen, stage, back } = baseScreen("🔢 الأرقام حتى ٢٠", regionId, regionIndex);
  // نركّز على ١١–٢٠ مع مراجعة بعض الأصغر
  const pool = NUMBERS.slice(10); // 11..20
  const rounds = shuffle(pool);
  let r = 0;

  function render() {
    const target = rounds[r];
    stage.innerHTML = "";
    stage.appendChild(progressDots(rounds.length, r - 1));

    const ask = document.createElement("p");
    ask.style.cssText = "font-weight:800;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.18);font-size:clamp(18px,5vw,24px)";
    ask.textContent = "أين هذا الرقم؟ 🔊";
    stage.appendChild(ask);

    const listen = document.createElement("button");
    listen.className = "candy-btn";
    listen.style.fontSize = "clamp(20px,6vw,28px)";
    listen.textContent = "🔊 استمع";
    listen.addEventListener("click", () => { Sfx.tap(); speakBoth(target); });
    stage.appendChild(listen);

    // خيارات: الرقم الصحيح + جاران مشتّتان
    const others = shuffle(pool.filter((n) => n.value !== target.value)).slice(0, 2);
    const choices = shuffle([target, ...others]);

    const row = document.createElement("div");
    row.className = "choice-row";
    choices.forEach((n) => {
      const b = document.createElement("button");
      b.className = "choice";
      b.style.fontWeight = "800";
      b.textContent = n.arDigit;
      b.addEventListener("click", () => {
        if (n.value === target.value) {
          Sfx.correct();
          b.classList.add("correct");
          awardStars(1);
          speakBoth(target);
          r++;
          if (r >= rounds.length) setTimeout(() => finishActivity({ regionId, regionIndex, stars: 8, onDone: back }), 900);
          else setTimeout(render, 1000);
        } else {
          Sfx.wrong();
          b.classList.add("wrong");
          setTimeout(() => b.classList.remove("wrong"), 450);
        }
      });
      row.appendChild(b);
    });
    stage.appendChild(row);

    setTimeout(() => speakBoth(target), 300);
  }

  setTimeout(render, 0);
  return screen;
}

// ===== لعبة ٢: أطعم الحيوان عدداً معيّناً =====
export function renderFeed({ regionId, regionIndex }) {
  const { screen, stage, back } = baseScreen("🍌 أطعم الصديق", regionId, regionIndex);
  const animals = ["🐵", "🐰", "🐶", "🐱", "🐼", "🦁"];
  const foods = ["🍌", "🍎", "🥕", "🍪", "🐟"];
  const ROUNDS = 5;
  let round = 0;

  function render() {
    const target = 1 + ((Math.random() * 6) | 0); // 1..6
    const animal = rand(animals);
    const food = rand(foods);
    let delivered = 0;
    stage.innerHTML = "";

    const head = document.createElement("div");
    head.innerHTML = `<div style="font-size:clamp(70px,20vw,120px)">${animal}</div>`;
    stage.appendChild(head);

    const bubble = document.createElement("p");
    bubble.style.cssText = "font-weight:800;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.2);font-size:clamp(18px,5vw,24px)";
    bubble.textContent = `أطعمني ${target} من ${food}`;
    stage.appendChild(bubble);
    Speech.ar(`أطعمني ${target}`);

    const tray = document.createElement("div");
    tray.className = "choice-row";
    const count = target + 2;
    for (let k = 0; k < count; k++) {
      const b = document.createElement("button");
      b.className = "choice";
      b.textContent = food;
      b.addEventListener("click", () => {
        if (b.disabled || delivered >= target) return;
        b.disabled = true;
        b.style.transform = "scale(0)";
        delivered++;
        Sfx.pop();
        Speech.ar(String(delivered));
        if (delivered === target) {
          Sfx.correct();
          awardStars(1);
          head.querySelector("div").textContent = "😋";
          setTimeout(nextRound, 1100);
        }
      });
      tray.appendChild(b);
    }
    stage.appendChild(tray);
  }

  function nextRound() {
    round++;
    if (round >= ROUNDS) finishActivity({ regionId, regionIndex, stars: 6, onDone: back });
    else render();
  }

  setTimeout(render, 0);
  return screen;
}

// ===== لعبة ٣: اجمع الكنوز (نجوم) =====
export function renderCollect({ regionId, regionIndex }) {
  const { screen, stage, back } = baseScreen("⭐ اجمع الكنوز", regionId, regionIndex);
  const goals = shuffle([5, 7, 10]);
  let round = 0;

  function render() {
    const target = goals[round];
    let collected = 0;
    stage.innerHTML = "";

    const head = document.createElement("p");
    head.style.cssText = "font-weight:800;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.2);font-size:clamp(18px,5vw,26px)";
    head.textContent = `اجمع ${target} نجوم ⭐`;
    stage.appendChild(head);
    Speech.ar(`اجمع ${target} نجوم`);

    const counter = document.createElement("div");
    counter.style.cssText = "font-size:clamp(30px,9vw,48px);font-weight:800;color:#fff";
    counter.textContent = `0 / ${target}`;
    stage.appendChild(counter);

    const field = document.createElement("div");
    field.style.cssText =
      "position:relative;width:min(90vw,460px);height:46vh;margin:12px auto;background:rgba(255,255,255,.18);border-radius:24px;overflow:hidden";
    stage.appendChild(field);

    setTimeout(() => {
      const W = field.clientWidth, H = field.clientHeight;
      for (let k = 0; k < target; k++) {
        const s = document.createElement("button");
        s.className = "choice";
        s.textContent = "⭐";
        s.style.cssText =
          `position:absolute;background:transparent;box-shadow:none;` +
          `left:${10 + Math.random() * (W - 80)}px;top:${10 + Math.random() * (H - 80)}px`;
        s.addEventListener("click", () => {
          if (s.disabled) return;
          s.disabled = true;
          s.style.transform = "scale(0)";
          collected++;
          Sfx.star();
          counter.textContent = `${collected} / ${target}`;
          Speech.ar(String(collected));
          if (collected === target) {
            Sfx.correct();
            awardStars(2);
            setTimeout(nextRound, 1000);
          }
        });
        field.appendChild(s);
      }
    }, 30);
  }

  function nextRound() {
    round++;
    if (round >= goals.length) {
      showCheer("💎", "جمعت كل الكنوز!", () =>
        finishActivity({ regionId, regionIndex, stars: 8, onDone: back })
      );
    } else render();
  }

  setTimeout(render, 0);
  return screen;
}
