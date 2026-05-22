// Pure calculation helpers — no UI, easy to test and reuse.

export const pad = (n) => String(n).padStart(2, '0');

export const fmtClock = (s) => {
  s = Math.round(s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
};

export const fmtPace = (s) => {
  if (!isFinite(s) || s <= 0) return '—';
  const m = Math.floor(s / 60), sec = Math.round(s % 60);
  return `${m}:${pad(sec)}`;
};

export const startOfWeek = (d) => {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x;
};

export const weekKey = (d) => startOfWeek(d).toISOString().slice(0, 10);
export const daysAgo = (ts) => (Date.now() - ts) / 86400000;

export function gap(run) {
  if (!run.distKm || !run.pace) return run.pace;
  const gradePct = ((run.elev || 0) / (run.distKm * 1000)) * 100;
  const factor = 1 - Math.min(0.28, gradePct * 0.033);
  return run.pace * factor;
}

export function vam(run) {
  if (!run.elev || !run.durSec) return 0;
  return run.elev / (run.durSec / 3600);
}

export const loadOf = (r) =>
  r.distKm * r.effort * (r.terrain === 'Trail' ? 1.3 : r.type === 'Hills' ? 1.25 : 1) +
  (r.elev || 0) / 100;

export function buildWeeks(runs) {
  const map = {};
  runs.forEach((r) => {
    const k = weekKey(r.date);
    if (!map[k]) map[k] = { key: k, km: 0, sec: 0, runs: 0, longest: 0, vert: 0 };
    map[k].km += r.distKm;
    map[k].sec += r.durSec;
    map[k].runs++;
    map[k].vert += r.elev || 0;
    if (r.distKm > map[k].longest) map[k].longest = r.distKm;
  });
  return Object.values(map)
    .sort((a, b) => b.key.localeCompare(a.key))
    .map((w) => {
      const d = new Date(w.key), end = new Date(d);
      end.setDate(end.getDate() + 6);
      w.label = `${d.getDate()}/${d.getMonth() + 1} – ${end.getDate()}/${end.getMonth() + 1}`;
      return w;
    });
}

export function computePBs(runs) {
  let long = null, climb = null, desc = null, bestVam = 0, bestPace = Infinity;
  runs.forEach((r) => {
    if (r.pace < bestPace) bestPace = r.pace;
    if (long === null || r.distKm > long) long = r.distKm;
    if (r.elev && (climb === null || r.elev > climb)) climb = r.elev;
    if (r.descent && (desc === null || r.descent > desc)) desc = r.descent;
    const v = vam(r);
    if (v > bestVam) bestVam = v;
  });
  const bp = isFinite(bestPace) ? bestPace : null;
  return {
    k1: bp, k5: bp ? bp * 5 : null, k10: bp ? bp * 10 : null,
    half: bp ? bp * 21.0975 : null, long, climb, desc, vam: bestVam || null,
  };
}

export function loadRatio(runs) {
  const acute = runs.filter((r) => daysAgo(r.date) <= 7).reduce((a, r) => a + loadOf(r), 0);
  const chronic = runs.filter((r) => daysAgo(r.date) <= 28).reduce((a, r) => a + loadOf(r), 0) / 4;
  return { acute, chronicWeekly: chronic, ratio: chronic > 0 ? acute / chronic : 0 };
}

export const DEFAULT_TARGETS = {
  weeklyKm: 30, pb5k: 25 * 60, pb10k: 52 * 60, longRun: 15, weeklyVert: 600,
};
