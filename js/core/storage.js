// ===== إدارة الحفظ (التقدّم والمكافآت) =====
const KEY = "safari-kids-save-v1";

const DEFAULT_STATE = {
  stars: 0,
  childName: "",
  // تقدّم كل منطقة: regionId -> { stars, completed:boolean }
  regions: {},
  // المكافآت المجمّعة: مصفوفة معرّفات
  collection: [],
  // أعلى منطقة مفتوحة (الفهرس) — تُفتح المناطق تدريجياً
  unlockedIndex: 0,
  // العناصر التي رآها الطفل (للمراجعة المتباعدة): "datasetKey:itemKey"
  seen: [],
  // السلسلة اليومية والهدف
  streak: 0,
  lastActiveDate: "", // "YYYY-MM-DD"
  dailyStars: 0,
  dailyDate: "",
  dailyGoal: 5,
  // تذكير وقت الشاشة بالدقائق (0 = مُعطّل)
  screenTimeMin: 0,
  // أفاتار الطفل (معرّف من الكنوز المجموعة) — افتراضي المرشد
  avatarId: "",
};

// تاريخ اليوم محلياً بصيغة YYYY-MM-DD
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function yesterdayOf(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    return { ...structuredClone(DEFAULT_STATE), ...JSON.parse(raw) };
  } catch (e) {
    return structuredClone(DEFAULT_STATE);
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    /* قد يكون التخزين ممتلئاً أو محظوراً — نتجاهل بهدوء */
  }
}

export const Store = {
  get state() {
    return state;
  },

  addStars(n) {
    state.stars += n;
    persist();
    return state.stars;
  },

  get stars() {
    return state.stars;
  },

  regionProgress(id) {
    return state.regions[id] || { stars: 0, completed: false };
  },

  setRegionStars(id, stars) {
    const cur = this.regionProgress(id);
    state.regions[id] = { ...cur, stars: Math.max(cur.stars, stars) };
    persist();
  },

  markRegionDone(id) {
    const cur = this.regionProgress(id);
    state.regions[id] = { ...cur, completed: true };
    persist();
  },

  isUnlocked(index) {
    return index <= state.unlockedIndex;
  },

  // عدد المناطق المكتملة (لفتح المناطق المتقدّمة تدريجياً)
  completedCount() {
    return Object.values(state.regions).filter((r) => r && r.completed).length;
  },

  // تسجيل أن الطفل رأى عنصراً (حرف/رقم) — للمراجعة المتباعدة
  markSeen(datasetKey, itemKey) {
    const id = `${datasetKey}:${itemKey}`;
    if (!state.seen.includes(id)) {
      state.seen.push(id);
      if (state.seen.length > 400) state.seen.shift();
      persist();
    }
  },
  // العناصر المرئية من مجموعة معيّنة (مصفوفة مفاتيح العناصر)
  seenKeys(datasetKey) {
    const p = datasetKey + ":";
    return state.seen.filter((s) => s.startsWith(p)).map((s) => s.slice(p.length));
  },

  // ===== السلسلة اليومية =====
  // تُستدعى عند فتح التطبيق: تُحدّث السلسلة وتعيد ضبط تقدّم اليوم
  touchDaily() {
    const t = today();
    if (state.lastActiveDate === t) {
      // نفس اليوم — لا تغيير
    } else if (state.lastActiveDate === yesterdayOf(t)) {
      state.streak = (state.streak || 0) + 1; // يوم متتالٍ
    } else {
      state.streak = 1; // انقطعت السلسلة أو أول مرة
    }
    state.lastActiveDate = t;
    if (state.dailyDate !== t) {
      state.dailyDate = t;
      state.dailyStars = 0;
    }
    persist();
  },
  get streak() {
    return state.streak || 0;
  },
  get dailyStars() {
    return state.dailyStars || 0;
  },
  get dailyGoal() {
    return state.dailyGoal || 5;
  },
  // تذكير وقت الشاشة (بالدقائق)
  get screenTimeMin() {
    return state.screenTimeMin || 0;
  },
  setScreenTime(min) {
    state.screenTimeMin = Math.max(0, min | 0);
    persist();
  },

  // أفاتار الطفل
  get avatarId() {
    return state.avatarId || "";
  },
  setAvatar(id) {
    state.avatarId = id;
    persist();
  },
  // اسم الطفل
  get childName() {
    return state.childName || "";
  },
  setChildName(name) {
    state.childName = String(name || "").slice(0, 20);
    persist();
  },

  // الرقم السري لبوّابة ولي الأمر (٤ أرقام). فارغ = لم يُضبط بعد
  get parentPin() {
    return state.parentPin || "";
  },
  setParentPin(pin) {
    state.parentPin = String(pin || "").replace(/\D/g, "").slice(0, 4);
    persist();
  },

  // الفئة العمرية لتدرّج الصعوبة: "" غير محدّد، "small" ٣–٤، "big" ٥–٦
  get ageBand() {
    return state.ageBand || "";
  },
  setAgeBand(band) {
    state.ageBand = band === "small" || band === "big" ? band : "";
    persist();
  },

  // تقدّم اليوم؛ تعيد true عند بلوغ الهدف لأول مرة اليوم
  addDailyProgress(n = 1) {
    const t = today();
    if (state.dailyDate !== t) {
      state.dailyDate = t;
      state.dailyStars = 0;
    }
    const before = state.dailyStars;
    state.dailyStars += n;
    persist();
    return before < state.dailyGoal && state.dailyStars >= state.dailyGoal;
  },

  unlockNext(index) {
    if (index + 1 > state.unlockedIndex) {
      state.unlockedIndex = index + 1;
      persist();
    }
  },

  addToCollection(itemId) {
    if (!state.collection.includes(itemId)) {
      state.collection.push(itemId);
      persist();
      return true; // جديد
    }
    return false;
  },

  hasCollected(itemId) {
    return state.collection.includes(itemId);
  },

  reset() {
    state = structuredClone(DEFAULT_STATE);
    persist();
  },
};
