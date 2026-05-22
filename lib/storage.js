import { DEFAULT_TARGETS } from './calc';

const RUNS_KEY = 'pace.runs.v2';
const TARGETS_KEY = 'pace.targets.v2';

export function loadRuns() {
  try {
    const raw = localStorage.getItem(RUNS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRuns(runs) {
  try {
    localStorage.setItem(RUNS_KEY, JSON.stringify(runs));
  } catch {}
}

export function loadTargets() {
  try {
    const raw = localStorage.getItem(TARGETS_KEY);
    return raw ? { ...DEFAULT_TARGETS, ...JSON.parse(raw) } : { ...DEFAULT_TARGETS };
  } catch {
    return { ...DEFAULT_TARGETS };
  }
}

export function saveTargets(targets) {
  try {
    localStorage.setItem(TARGETS_KEY, JSON.stringify(targets));
  } catch {}
}
