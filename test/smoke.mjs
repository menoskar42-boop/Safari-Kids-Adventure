// اختبار تشغيلي خفيف: يحاكي DOM ويستدعي دوال عرض الألعاب الجديدة
// للتأكد أنها تُنشئ الشاشة وتنفّذ منطق العرض دون أخطاء برمجية.
// لا يفحص الشكل البصري — فقط سلامة الكود وقت التشغيل.

const noop = () => {};
const ctxProxy = new Proxy({}, {
  get: (_t, p) => {
    if (p === "getImageData") return () => ({ data: new Uint8ClampedArray(300 * 300 * 4) });
    if (p === "measureText") return () => ({ width: 10 });
    return noop;
  },
});

function makeEl() {
  const store = {
    style: {},
    classList: { add: noop, remove: noop, contains: () => false, toggle: noop },
    children: [],
    dataset: {},
  };
  const handler = {
    get(_t, p) {
      if (p in store) return store[p];
      switch (p) {
        case "appendChild": return (n) => n;
        case "append": return noop;
        case "addEventListener":
        case "removeEventListener":
        case "setAttribute":
        case "removeAttribute":
        case "remove":
        case "focus":
        case "blur":
        case "play":
        case "pause": return noop;
        case "getContext": return () => ctxProxy;
        case "querySelector": return () => makeEl();
        case "querySelectorAll": return () => [];
        case "getBoundingClientRect": return () => ({ left: 0, top: 0, width: 300, height: 300 });
        default: return store[p];
      }
    },
    set(_t, p, v) { store[p] = v; return true; },
  };
  return new Proxy({}, handler);
}

// محاكاة Web Audio بما يطابق ما يستخدمه js/core/audio.js
const audioParam = { setValueAtTime: noop, exponentialRampToValueAtTime: noop, linearRampToValueAtTime: noop, value: 0 };
function makeAudioNode() {
  const n = { type: "", frequency: audioParam, gain: audioParam, start: noop, stop: noop };
  n.connect = () => n;
  return n;
}
const audioCtx = { state: "running", currentTime: 0, destination: {}, resume: noop, createOscillator: makeAudioNode, createGain: makeAudioNode };

global.window = {
  speechSynthesis: { getVoices: () => [], cancel: noop, speak: noop, onvoiceschanged: null },
  addEventListener: noop,
  matchMedia: () => ({ matches: false, addEventListener: noop }),
  location: { search: "" },
  AudioContext: class { constructor() { return audioCtx; } },
};
global.document = {
  createElement: makeEl,
  getElementById: () => makeEl(),
  querySelector: () => makeEl(),
  body: makeEl(),
  addEventListener: noop,
};
global.localStorage = { getItem: () => null, setItem: noop, removeItem: noop };
global.Audio = class {};
global.requestAnimationFrame = noop;
global.cancelAnimationFrame = noop;
// نشغّل المؤقّتات فوراً لتنفيذ منطق render() المؤجَّل (الآمن)
const realTimeout = global.setTimeout;
global.setTimeout = (fn) => { try { fn(); } catch (e) { console.error("timer:", e); throw e; } return 0; };

const cases = [
  ["memory", "../js/games/memory.js", "renderMemory", { regionId: "animals", regionIndex: 0, datasetKey: "animals", title: "t" }],
  ["coloring", "../js/games/coloring.js", "renderColoring", { regionId: "colors", regionIndex: 0, title: "t" }],
  ["coloring(home)", "../js/games/coloring.js", "renderColoring", { title: "t" }],
  ["pattern", "../js/games/pattern.js", "renderPattern", { regionId: "colors", regionIndex: 0, datasetKey: "colors", title: "t" }],
  ["puzzle", "../js/games/puzzle.js", "renderPuzzle", { regionId: "animals", regionIndex: 0, datasetKey: "animals", title: "t" }],
  ["sort", "../js/games/sort.js", "renderSort", { regionId: "fruits", regionIndex: 0, title: "t", groups: [{ label: "فواكه", datasetKey: "fruits" }, { label: "حيوانات", datasetKey: "animals" }] }],
  ["phonics", "../js/games/phonics.js", "renderPhonics", { regionId: "arabic", regionIndex: 0, datasetKey: "arabic", lang: "ar-EG", title: "t" }],
  ["trace(letters)", "../js/games/trace.js", "renderTrace", { regionId: "arabic", regionIndex: 0, datasetKey: "arabic", lang: "ar-EG" }],
  ["trace(numbers)", "../js/games/trace.js", "renderTrace", { regionId: "numbers", regionIndex: 0, datasetKey: "numbers", title: "✏️ ارسم الرقم" }],
  ["lesson(arabic)", "../js/games/lesson.js", "renderLesson", { regionId: "arabic", regionIndex: 0, datasetKey: "arabic", lang: "ar-EG", title: "t" }],
  ["lesson(numbers)", "../js/games/lesson.js", "renderLesson", { regionId: "numbers", regionIndex: 0, datasetKey: "numbers", title: "t" }],
  ["dailyPlan", "../js/screens/dailyPlan.js", "renderDailyPlan", {}],
  ["ruleLesson", "../js/games/ruleLesson.js", "renderRuleLesson", { regionId: "reading", regionIndex: 3, ruleId: "madd", title: "t" }],
  ["classify", "../js/games/classify.js", "renderClassify", { regionId: "reading", regionIndex: 3, setId: "lam", title: "t" }],
  ["wordBuild", "../js/games/wordbuild.js", "renderWordBuild", { regionId: "arabic", regionIndex: 0, title: "t" }],
  ["similar", "../js/games/similar.js", "renderSimilar", { regionId: "arabic", regionIndex: 0, title: "t" }],
  ["countPick", "../js/games/count.js", "renderCountPick", { regionId: "numbers", regionIndex: 0 }],
  ["addition", "../js/games/count.js", "renderAddition", { regionId: "numbers", regionIndex: 0 }],
  ["subtraction", "../js/games/count.js", "renderSubtraction", { regionId: "numbers", regionIndex: 0 }],
  ["compare", "../js/games/count.js", "renderCompare", { regionId: "numbers", regionIndex: 0 }],
];

let ok = 0, fail = 0;
for (const [name, mod, fn, params] of cases) {
  try {
    const m = await import(mod);
    const el = m[fn](params);
    if (!el) throw new Error("returned falsy");
    console.log(`✓ ${name}`);
    ok++;
  } catch (e) {
    console.error(`✗ ${name}: ${e.message}`);
    fail++;
  }
}
global.setTimeout = realTimeout;
console.log(`\nنتيجة: ${ok} نجح · ${fail} فشل`);
process.exit(fail ? 1 : 0);
