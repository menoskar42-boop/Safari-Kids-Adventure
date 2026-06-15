// ===== موجّه بسيط بين الشاشات =====
import { Speech } from "./speech.js";
import { showAdBar, hideAdBar } from "./ads.js";

const routes = new Map();
const app = document.getElementById("app");
let current = null;

export const Router = {
  /** تسجيل شاشة: name -> render(params) => يُرجع HTMLElement أو يكتب داخل app */
  register(name, renderFn) {
    routes.set(name, renderFn);
  },

  /** الانتقال إلى شاشة */
  go(name, params = {}) {
    Speech.stop();
    const render = routes.get(name);
    if (!render) {
      console.warn("Route not found:", name);
      return;
    }
    app.innerHTML = "";
    app.scrollTop = 0;
    current = { name, params };
    // توافق COPPA/Families: الإعلان على شاشة الكبار (ولي الأمر) فقط، ويُزال على
    // كل شاشات الطفل — فلا يُطلَب أيّ إعلان في سياق موجَّه للأطفال.
    if (name === "parent") showAdBar();
    else hideAdBar();
    const node = render(params);
    if (node instanceof Node) app.appendChild(node);
  },

  get current() {
    return current;
  },

  back() {
    // افتراضياً نعود للخريطة الرئيسية
    this.go("home");
  },
};

// زر رجوع الجهاز (إن وُجد)
window.addEventListener("popstate", () => {
  if (current && current.name !== "home") Router.go("home");
});
