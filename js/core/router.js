// ===== موجّه بسيط بين الشاشات =====
import { Speech } from "./speech.js";
import { hideAdBar } from "./ads.js";

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
    // توافق COPPA/Families: نُزيل أيّ إعلان عند كل انتقال. الإعلان لا يظهر إلا بعد
    // اجتياز بوّابة الآباء داخل شاشة ولي الأمر (تُستدعى showAdBar من هناك حصراً).
    hideAdBar();
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
