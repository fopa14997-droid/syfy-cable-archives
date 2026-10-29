const STORAGE_KEY = 'syfy-cable-archives-recordings';

export function loadRecordings() {
  if (typeof window === 'undefined') return [];

  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function saveRecordings(recordings: unknown[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
}
