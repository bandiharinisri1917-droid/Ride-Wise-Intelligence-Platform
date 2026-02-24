const STORAGE_KEY = 'ridewise.preferences.v1';

export const loadPersistedState = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return parsed;
  } catch {
    return {};
  }
};

export const persistState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
