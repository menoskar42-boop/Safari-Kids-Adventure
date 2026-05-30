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
};

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
