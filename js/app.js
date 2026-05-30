// ===== نقطة بداية التطبيق =====
import { Router } from "./core/router.js";
import { Sfx } from "./core/audio.js";
import { Speech } from "./core/speech.js";
import { renderHome } from "./screens/home.js";
import { renderRegion } from "./screens/region.js";
import { renderRewards } from "./screens/rewards.js";

// تسجيل الشاشات
Router.register("home", renderHome);
Router.register("region", renderRegion);
Router.register("rewards", renderRewards);

// شاشة البداية
const splash = document.getElementById("splash");
const appEl = document.getElementById("app");
const startBtn = document.getElementById("startBtn");

function startApp() {
  // فتح السياق الصوتي وتهيئة النطق بعد تفاعل المستخدم
  Sfx.unlock();
  // بعض المتصفحات تحتاج نطقاً صامتاً لتفعيل الأصوات
  Speech.say(" ", { lang: "ar-EG" });

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
