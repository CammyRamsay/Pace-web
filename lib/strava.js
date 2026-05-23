const KEY = 'pace.strava';

export function getStravaAuth() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); }
  catch { return null; }
}

export function saveStravaAuth(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearStravaAuth() {
  localStorage.removeItem(KEY);
}

export function stravaConnectUrl() {
  const params = new URLSearchParams({
    client_id: '249788',
    redirect_uri: `${window.location.origin}/api/strava/callback`,
    response_type: 'code',
    scope: 'activity:read_all',
  });
  return `https://www.strava.com/oauth/authorize?${params}`;
}

export async function ensureFreshToken(auth) {
  if (!auth) return null;
  const now = Math.floor(Date.now() / 1000);
  if (auth.expires_at > now + 60) return auth;

  const res = await fetch('/api/strava/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: auth.refresh_token }),
  });
  if (!res.ok) return null;

  const data = await res.json();
  const updated = { ...auth, ...data };
  saveStravaAuth(updated);
  return updated;
}

const TYPE_MAP = { 0: 'Easy', 1: 'Race', 2: 'Long', 3: 'Tempo' };
const TERRAIN_MAP = { Run: 'Road', TrailRun: 'Trail', VirtualRun: 'Treadmill' };

export function stravaToRun(a) {
  const distKm = a.distance / 1000;
  const durSec = a.moving_time;
  const sportType = a.sport_type || a.type || 'Run';
  return {
    id: a.id,
    stravaId: a.id,
    date: new Date(a.start_date).getTime(),
    distKm: parseFloat(distKm.toFixed(3)),
    durSec,
    pace: distKm > 0 ? durSec / distKm : 0,
    elev: Math.round(a.total_elevation_gain || 0),
    descent: 0,
    type: TYPE_MAP[a.workout_type] || 'Easy',
    terrain: TERRAIN_MAP[sportType] || 'Road',
    route: a.name || '',
    condition: 'Dry',
    effort: 3,
    shoes: '',
    fuel: '',
    notes: a.description || '',
  };
}
