// ===== نقطة بداية التطبيق =====
import { Router } from "./core/router.js";
import { Sfx } from "./core/audio.js";
import { Speech, setAISpeech } from "./core/speech.js";
import { checkAI } from "./core/ai.js";
import { mountAssistantButton } from "./core/assistant.js";
import { renderHome } from "./screens/home.js";
import { renderRegion } from "./screens/region.js";
import { renderRewards } from "./screens/rewards.js";
import { renderLearn } from "./games/learn.js";
import { renderCatch } from "./games/catch.js";
import { renderTrace } from "./games/trace.js";
import { renderCountLearn, renderFeed, renderCollect } from "./games/count.js";
import { renderExplore } from "./games/explore.js";
import { renderShadowMatch, renderSoundMatch, renderFindIt } from "./games/match.js";
import { renderGarden } from "./screens/garden.js";
import { renderParent } from "./screens/parent.js";
import { renderAR } from "./screens/ar.js";

// تسجيل الشاشات
Router.register("home", renderHome);
Router.register("region", renderRegion);
Router.register("rewards", renderRewards);
Router.register("learn", renderLearn);
Router.register("catch", renderCatch);
Router.register("trace", renderTrace);
Router.register("countLearn", renderCountLearn);
Router.register("feed", renderFeed);
Router.register("collect", renderCollect);
Router.register("explore", renderExplore);
Router.register("shadowMatch", renderShadowMatch);
Router.register("soundMatch", renderSoundMatch);
Router.register("findIt", renderFindIt);
Router.register("garden", renderGarden);
Router.register("parent", renderParent);
Router.register("ar", renderAR);

// شاشة البداية
const splash = document.getElementById("splash");
const appEl = document.getElementById("app");
const startBtn = document.getElementById("startBtn");

function startApp() {
  // فتح السياق الصوتي وتهيئة النطق بعد تفاعل المستخدم
  Sfx.unlock();

  // فحص توفّر خادم OpenAI: إن توفّر نستخدم نطق الـ AI، وإلا Web Speech
  checkAI().then((ready) => {
    setAISpeech(ready);
    if (!ready) Speech.say(" ", { lang: "ar-EG" }); // تنشيط Web Speech الصامت
    else mountAssistantButton(); // المساعد الصوتي يحتاج خادم OpenAI
  });

  splash.classList.add("hidden");
  appEl.classList.remove("hidden");
  Router.go("home");
}

startBtn.addEventListener("click", startApp);

// تسجيل Service Worker للعمل دون اتصال (اختياري وآمن إن لم يوجد)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
