// ===== نقطة بداية التطبيق =====
import { Router } from "./core/router.js";
import { Sfx } from "./core/audio.js";
import { Speech, setAISpeech } from "./core/speech.js";
import { checkAI, setAIEnabled } from "./core/ai.js";
import { mountAssistantButton } from "./core/assistant.js";
import { REGIONS } from "./data/regions.js";
import { Store } from "./core/storage.js";
import { renderHome } from "./screens/home.js";
import { renderRegion } from "./screens/region.js";
import { renderRewards } from "./screens/rewards.js";
import { renderLearn } from "./games/learn.js";
import { renderFlashcards } from "./games/flashcards.js";
import { renderSequence } from "./games/sequence.js";
import { renderReview } from "./games/review.js";
import { renderCatch } from "./games/catch.js";
import { renderTrace } from "./games/trace.js";
import { renderCountLearn, renderFeed, renderCollect, renderBigNumbers, renderCountPick, renderAddition, renderSubtraction, renderCompare } from "./games/count.js";
import { renderHarakat } from "./games/harakat.js";
import { renderHarakatIntro } from "./games/harakatIntro.js";
import { renderLetterForms } from "./games/letterforms.js";
import { renderBoard } from "./games/board.js";
import { renderExplore } from "./games/explore.js";
import { renderShadowMatch, renderSoundMatch, renderFindIt } from "./games/match.js";
import { renderOppositesMatch } from "./games/opposites.js";
import { renderMemory } from "./games/memory.js";
import { renderColoring } from "./games/coloring.js";
import { renderPattern } from "./games/pattern.js";
import { renderPuzzle } from "./games/puzzle.js";
import { renderSort } from "./games/sort.js";
import { renderPhonics } from "./games/phonics.js";
import { renderLesson } from "./games/lesson.js";
import { renderGarden } from "./screens/garden.js";
import { renderParent } from "./screens/parent.js";
import { renderAR } from "./screens/ar.js";
import { renderVideos } from "./screens/videos.js";
import { renderStory } from "./screens/story.js";
import { renderProfile } from "./screens/profile.js";
import { renderDailyPlan } from "./screens/dailyPlan.js";
import { renderRuleLesson } from "./games/ruleLesson.js";
import { renderClassify } from "./games/classify.js";
import { renderWordBuild } from "./games/wordbuild.js";
import { renderSimilar } from "./games/similar.js";
import { renderTalkMizo } from "./games/talkMizo.js";
import { renderManners } from "./games/manners.js";
import { createCharacter } from "./games/character.js";

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
Router.register("countPick", renderCountPick);
Router.register("addition", renderAddition);
Router.register("subtraction", renderSubtraction);
Router.register("compare", renderCompare);
Router.register("harakat", renderHarakat);
Router.register("harakatIntro", renderHarakatIntro);
Router.register("letterForms", renderLetterForms);
Router.register("board", renderBoard);
Router.register("explore", renderExplore);
Router.register("shadowMatch", renderShadowMatch);
Router.register("soundMatch", renderSoundMatch);
Router.register("findIt", renderFindIt);
Router.register("oppositesMatch", renderOppositesMatch);
Router.register("memory", renderMemory);
Router.register("coloring", renderColoring);
Router.register("pattern", renderPattern);
Router.register("puzzle", renderPuzzle);
Router.register("sort", renderSort);
Router.register("phonics", renderPhonics);
Router.register("lesson", renderLesson);
Router.register("garden", renderGarden);
Router.register("parent", renderParent);
Router.register("ar", renderAR);
Router.register("videos", renderVideos);
Router.register("story", renderStory);
Router.register("profile", renderProfile);
Router.register("dailyPlan", renderDailyPlan);
Router.register("ruleLesson", renderRuleLesson);
Router.register("classify", renderClassify);
Router.register("wordBuild", renderWordBuild);
Router.register("similar", renderSimilar);
Router.register("talkMizo", renderTalkMizo);
Router.register("manners", renderManners);

// شاشة البداية
const splash = document.getElementById("splash");
const appEl = document.getElementById("app");
const startBtn = document.getElementById("startBtn");

// ميزو يرحّب في شاشة البداية (يلوّح) — بلا صوت قبل تفاعل المستخدم
const splashMizoSlot = document.getElementById("splashMizo");
if (splashMizoSlot) {
  const splashMizo = createCharacter();
  splashMizoSlot.appendChild(splashMizo.el);
  splashMizo.setMood("wave", 3000);
}

function startApp() {
  // فتح السياق الصوتي وتهيئة النطق بعد تفاعل المستخدم
  Sfx.unlock();

  // تحديث السلسلة اليومية (Streak)
  Store.touchDaily();

  // تذكير وقت الشاشة (إن فعّله ولي الأمر): رسالة لطيفة بعد المدّة المحدّدة
  const stMin = Store.screenTimeMin;
  if (stMin > 0) {
    setTimeout(() => showScreenTimeReminder(), stMin * 60 * 1000);
  }

  // احترام إعداد ولي الأمر لتعطيل الميكروفون/الذكاء الاصطناعي
  setAIEnabled(Store.aiEnabled);

  // فحص توفّر خادم OpenAI: إن توفّر (ولم يُعطّله ولي الأمر) نستخدم نطق الـ AI، وإلا Web Speech
  checkAI().then((ready) => {
    const on = ready && Store.aiEnabled;
    setAISpeech(on);
    if (!on) Speech.say(" ", { lang: "ar-EG" }); // تنشيط Web Speech الصامت
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

// رسالة تذكير لطيفة بانتهاء وقت اللعب (ليست قفلاً صارماً — تطبيق ويب)
function showScreenTimeReminder() {
  Speech.stop();
  const overlay = document.createElement("div");
  overlay.className = "cheer";
  overlay.innerHTML = `
    <div class="cheer-card">
      <div class="cheer-emoji">🌙</div>
      <div class="cheer-text">حان وقت الراحة!</div>
      <p style="font-size:18px;font-weight:700;color:var(--c-ink);margin:.2em 0 1em">
        أحسنت اليوم يا بطل 🌟<br>لنأخذ استراحة قصيرة.</p>
      <button class="candy-btn" id="stOk">حسناً 👍</button>
    </div>`;
  document.body.appendChild(overlay);
  Speech.ar("حان وقت الراحة، أحسنت اليوم يا بطل");
  overlay.querySelector("#stOk").addEventListener("click", () => overlay.remove());
}

// تسجيل Service Worker للعمل دون اتصال (اختياري وآمن إن لم يوجد)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
