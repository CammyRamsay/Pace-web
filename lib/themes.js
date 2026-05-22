export const THEMES = {
  circuit: {
    name: 'Circuit',
    bg: '#070a12',
    panel: '#0e1220',
    panelAlt: '#0a1028',
    panel2: '#090c18',
    line: '#182038',
    lineBright: '#253360',
    txt: '#edf2ff',
    txt2: '#c5cfe8',
    dim: '#4a5980',
    dim2: '#6878a8',
    acid: '#d4ff5c',
    cyan: '#22d3ee',
    orange: '#ff7043',
    red: '#ff4466',
    blue: '#4477ff',
    green: '#30d980',
    acidGlow: 'rgba(212,255,92,0.12)',
  },
  ember: {
    name: 'Ember',
    bg: '#0c0906',
    panel: '#1a120a',
    panelAlt: '#150e06',
    panel2: '#100c06',
    line: '#2a1a0c',
    lineBright: '#3d2816',
    txt: '#fff8f0',
    txt2: '#fde8cc',
    dim: '#7a5a3a',
    dim2: '#a07858',
    acid: '#ff6b2c',
    cyan: '#fbbf24',
    orange: '#ff9f1c',
    red: '#ff3344',
    blue: '#f97316',
    green: '#84cc16',
    acidGlow: 'rgba(255,107,44,0.12)',
  },
  arctic: {
    name: 'Arctic',
    bg: '#060d1c',
    panel: '#0d1629',
    panelAlt: '#08102a',
    panel2: '#080f1e',
    line: '#142035',
    lineBright: '#1e3050',
    txt: '#f0f8ff',
    txt2: '#bdd4f8',
    dim: '#3d5878',
    dim2: '#5a78a8',
    acid: '#60a5fa',
    cyan: '#e0f2fe',
    orange: '#fb923c',
    red: '#f43f5e',
    blue: '#818cf8',
    green: '#34d399',
    acidGlow: 'rgba(96,165,250,0.12)',
  },
  forest: {
    name: 'Forest',
    bg: '#050e08',
    panel: '#0c1a10',
    panelAlt: '#08140a',
    panel2: '#060f08',
    line: '#122016',
    lineBright: '#1c3222',
    txt: '#f0fff4',
    txt2: '#c0f0cc',
    dim: '#3a6048',
    dim2: '#588060',
    acid: '#4ade80',
    cyan: '#86efac',
    orange: '#fb923c',
    red: '#f43f5e',
    blue: '#38bdf8',
    green: '#a3e635',
    acidGlow: 'rgba(74,222,128,0.12)',
  },
};

export const DEFAULT_THEME = 'circuit';

const toVar = (key) => '--' + key.replace(/([A-Z])/g, (m) => '-' + m.toLowerCase());

export function applyTheme(name) {
  const theme = THEMES[name] || THEMES[DEFAULT_THEME];
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    if (key !== 'name') root.style.setProperty(toVar(key), value);
  });
}
