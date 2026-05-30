// ===== نقطة بداية التطبيق =====
import { Router } from "./core/router.js";
import { Sfx } from "./core/audio.js";
import { Speech, setAISpeech } from "./core/speech.js";
import { checkAI } from "./core/ai.js";
import { mountAssistantButton } from "./core/assistant.js";
import { REGIONS } from "./data/regions.js";
import { renderHome } from "./screens/home.js";
import { renderRegion } from "./screens/region.js";
import { renderRewards } from "./screens/rewards.js";
import { renderLearn } from "./games/learn.js";
import { renderFlashcards } from "./games/flashcards.js";
import { renderSequence } from "./games/sequence.js";
import { renderReview } from "./games/review.js";
import { renderCatch } from "./games/catch.js";
import { renderTrace } from "./games/trace.js";
import { renderCountLearn, renderFeed, renderCollect, renderBigNumbers } from "./games/count.js";
import { renderHarakat } from "./games/harakat.js";
import { renderExplore } from "./games/explore.js";
import { renderShadowMatch, renderSoundMatch, renderFindIt } from "./games/match.js";
import { renderOppositesMatch } from "./games/opposites.js";
import { renderGarden } from "./screens/garden.js";
import { renderParent } from "./screens/parent.js";
import { renderAR } from "./screens/ar.js";
import { renderVideos } from "./screens/videos.js";
import { renderStory } from "./screens/story.js";

// تسجيل الشاشات
Router.register("home", renderHome);
Router.register("region", renderRegion);
Router.register("rewards", renderRewards);
Router.register("learn", renderLearn);
Router.register("flashcards", renderFlashcards);
Router.register("sequence", renderSequence);
Router.register("review", renderReview);
Router.register("catch", renderCatch);
Router.register("trace", renderTrace);
Router.register("countLearn", renderCountLearn);
Router.register("feed", renderFeed);
Router.register("collect", renderCollect);
Router.register("bigNumbers", renderBigNumbers);
Router.register("harakat", renderHarakat);
Router.register("explore", renderExplore);
Router.register("shadowMatch", renderShadowMatch);
Router.register("soundMatch", renderSoundMatch);
Router.register("findIt", renderFindIt);
Router.register("oppositesMatch", renderOppositesMatch);
Router.register("garden", renderGarden);
Router.register("parent", renderParent);
Router.register("ar", renderAR);
Router.register("videos", renderVideos);
Router.register("story", renderStory);

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

  // رابط عميق: ?region=arabic يفتح المنطقة مباشرة (قادم من صفحات SEO)
  const wanted = new URLSearchParams(location.search).get("region");
  const idx = wanted ? REGIONS.findIndex((r) => r.id === wanted) : -1;
  if (idx >= 0) Router.go("region", { id: REGIONS[idx].id, index: idx });
  else Router.go("home");
}

startBtn.addEventListener("click", startApp);

// تسجيل Service Worker للعمل دون اتصال (اختياري وآمن إن لم يوجد)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
