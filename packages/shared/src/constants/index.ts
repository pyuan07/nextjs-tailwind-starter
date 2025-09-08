export * from "./api";

export const APP_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_TIMEOUT: 10000,
  DEBOUNCE_DELAY: 300,

  STORAGE_KEYS: {
    THEME: "theme-preference",
    USER: "user-data",
    SETTINGS: "app-settings",
  },

  DATE_FORMATS: {
    SHORT: "MMM dd, yyyy",
    LONG: "MMMM dd, yyyy",
    WITH_TIME: "MMM dd, yyyy HH:mm",
    ISO: "yyyy-MM-dd",
  },
} as const;
