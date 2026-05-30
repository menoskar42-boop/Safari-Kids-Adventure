// ===== الواقع المعزّز (AR): حيوان يظهر "داخل الغرفة" عبر الكاميرا =====
// نهج خفيف بلا مكتبات: بثّ الكاميرا الخلفية + طبقة حيوان متحرك فوقها.
// يعمل على المتصفحات التي تدعم getUserMedia (HTTPS أو localhost).
import { Router } from "../core/router.js";
import { Speech } from "../core/speech.js";
import { Sfx } from "../core/audio.js";
import { ANIMALS } from "../data/animals.js";

export function renderAR() {
  const screen = document.createElement("div");
  screen.className = "region-screen ar-screen";

  const topbar = document.createElement("div");
  topbar.className = "topbar";
  topbar.innerHTML = `
    <button class="icon-btn" id="backBtn" title="رجوع">🏠</button>
    <h2>📸 الواقع المعزّز</h2>
    <span style="width:48px"></span>`;
  screen.appendChild(topbar);

  const stage = document.createElement("div");
  stage.className = "ar-stage";
  screen.appendChild(stage);

  const video = document.createElement("video");
  video.className = "ar-video";
  video.setAttribute("playsinline", "");
  video.muted = true;
  stage.appendChild(video);

  // الحيوان المعزّز
  const creature = document.createElement("div");
  creature.className = "ar-creature";
  stage.appendChild(creature);

  // شريط اختيار الحيوان
  const picker = document.createElement("div");
  picker.className = "ar-picker";
  screen.appendChild(picker);

  let stream = null;
  let current = ANIMALS[0];

  function speakCreature(a) {
    Speech.sequence([
      { text: a.name, lang: "ar-EG" },
      { text: a.en, lang: "en-US" },
      { text: a.sound, lang: "ar-EG" },
    ]);
  }

  function setCreature(a) {
    current = a;
    creature.textContent = a.emoji;
    creature.classList.remove("hop");
    void creature.offsetWidth; // إعادة تشغيل الحركة
    creature.classList.add("hop");
    Sfx.pop();
    speakCreature(a);
  }

  function buildPicker() {
    ANIMALS.slice(0, 10).forEach((a) => {
      const b = document.createElement("button");
      b.className = "ar-pick";
      b.textContent = a.emoji;
      b.addEventListener("click", () => setCreature(a));
      picker.appendChild(b);
    });
  }

  creature.addEventListener("click", () => {
    creature.classList.remove("hop");
    void creature.offsetWidth;
    creature.classList.add("hop");
    Sfx.pop();
    speakCreature(current);
  });

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      video.srcObject = stream;
      await video.play();
      setCreature(current);
      Speech.ar("وجّه الكاميرا حولك، وانظر من جاء لزيارتك!");
    } catch (e) {
      showNoCam();
    }
  }

  function showNoCam() {
    stage.classList.add("ar-nocam");
    const msg = document.createElement("div");
    msg.className = "ar-nocam-msg";
    msg.innerHTML =
      "📷<br>لم نتمكّن من فتح الكاميرا.<br>" +
      "<span style='font-size:.8em'>يمكنك مع ذلك اللعب مع الحيوان!</span>";
    stage.appendChild(msg);
    setCreature(current);
  }

  function cleanup() {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }

  setTimeout(() => {
    buildPicker();
    screen.querySelector("#backBtn").addEventListener("click", () => {
      Sfx.tap();
      cleanup();
      Router.go("home");
    });
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) startCamera();
    else showNoCam();
  }, 0);

  // تنظيف عند مغادرة الشاشة (يلاحظ الموجّه إزالة العقدة)
  const observer = new MutationObserver(() => {
    if (!screen.isConnected) {
      cleanup();
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById("app"), { childList: true });

  return screen;
}
