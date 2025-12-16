// For example, 0 for English, 1 for Italian.
export var langIndex = 1;

export const localMode = false;

export const shouldShowImage = false;

export const allowNewlines = false;

export const useTallTr = false;

export const useSmallTr = false;

export const usePieChart = true;

// Fixed chart size (500×500)
export const CANVAS_SIZE = 500;

export const enableCollections = allowNewlines && true;

export const sellerMode = true;

export function setLangIndex(val) {
    langIndex = val;
}

export const isUsingAndroidApp = false;

export const isAndroidApp = (() => {
    let cached = isUsingAndroidApp;
    return () => cached;
})();