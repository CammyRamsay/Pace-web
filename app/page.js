'use client';
import { useState, useEffect, useCallback } from 'react';
import { C } from '../lib/theme';
import { THEMES, DEFAULT_THEME, applyTheme } from '../lib/themes';
import { loadRuns, saveRuns, loadTargets, saveTargets } from '../lib/storage';

import LogScreen from '../screens/LogScreen';
import StatsScreen from '../screens/StatsScreen';
import RoutesScreen from '../screens/RoutesScreen';
import LoadScreen from '../screens/LoadScreen';
import CoachScreen from '../screens/CoachScreen';

const TABS = [
  { name: 'Log', icon: '✎' },
  { name: 'Stats', icon: '▦' },
  { name: 'Routes', icon: '⛰' },
  { name: 'Load', icon: '◐' },
  { name: 'Coach', icon: '◈' },
];

export default function Home() {
  const [tab, setTab] = useState('Log');
  const [runs, setRuns] = useState([]);
  const [targets, setTargets] = useState(null);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [showThemePicker, setShowThemePicker] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pace.theme') || DEFAULT_THEME;
    setTheme(saved);
    applyTheme(saved);
    setRuns(loadRuns());
    setTargets(loadTargets());
    setReady(true);
  }, []);

  useEffect(() => { if (ready) saveRuns(runs); }, [runs, ready]);
  useEffect(() => { if (ready && targets) saveTargets(targets); }, [targets, ready]);

  const switchTheme = (name) => {
    setTheme(name);
    applyTheme(name);
    localStorage.setItem('pace.theme', name);
    setShowThemePicker(false);
  };

  const addRun = useCallback((r) => {
    setRuns((p) => [{ ...r, id: Date.now() }, ...p].sort((a, b) => b.date - a.date));
  }, []);
  const delRun = useCallback((id) => setRuns((p) => p.filter((x) => x.id !== id)), []);

  if (!ready || !targets) {
    return (
      <div style={{
        height: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg,
      }}>
        <div style={{ fontSize: 32, fontWeight: '800', letterSpacing: 8, color: C.txt }}>
          <span style={{ color: C.acid }}>P</span>ACE PRO
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (tab) {
      case 'Log': return <LogScreen runs={runs} delRun={delRun} addRun={addRun} />;
      case 'Stats': return <StatsScreen runs={runs} targets={targets} setTargets={setTargets} />;
      case 'Routes': return <RoutesScreen runs={runs} />;
      case 'Load': return <LoadScreen runs={runs} />;
      case 'Coach': return <CoachScreen runs={runs} targets={targets} />;
      default: return null;
    }
  };

  const currentTheme = THEMES[theme];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: C.bg, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '0 20px 14px',
        paddingTop: 'max(14px, env(safe-area-inset-top))',
        borderBottom: `1px solid ${C.line}`,
        backgroundColor: C.bg,
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 30, fontWeight: '800', letterSpacing: 7, color: C.txt, lineHeight: 1 }}>
            <span style={{ color: C.acid }}>P</span>ACE PRO
          </div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: C.dim, marginTop: 4, fontWeight: '600' }}>
            TRAIL COACH · KM · EFFORT-FIRST
          </div>
        </div>

        {/* Theme picker button */}
        <button
          onClick={() => setShowThemePicker((p) => !p)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
          title="Switch theme"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            {[currentTheme.acid, currentTheme.cyan, currentTheme.orange, currentTheme.green].map((col, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: col }} />
            ))}
          </div>
        </button>
      </div>

      {/* Screen content */}
      <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
        {renderScreen()}
      </div>

      {/* Tab bar */}
      <div style={{
        backgroundColor: C.panel2,
        borderTop: `1px solid ${C.line}`,
        paddingBottom: 'env(safe-area-inset-bottom)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', padding: '4px 8px 2px' }}>
          {TABS.map(({ name, icon }) => {
            const active = tab === name;
            return (
              <button
                key={name}
                onClick={() => setTab(name)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '8px 4px 6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: active ? C.acid : C.dim,
                }}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
                <span style={{
                  fontSize: 10,
                  letterSpacing: 0.5,
                  marginTop: 3,
                  fontWeight: active ? '700' : '400',
                }}>{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme picker overlay */}
      {showThemePicker && (
        <>
          <div
            onClick={() => setShowThemePicker(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          />
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: C.panel,
            borderTop: `1px solid ${C.lineBright}`,
            borderRadius: '20px 20px 0 0',
            padding: '20px 16px',
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)',
            zIndex: 100,
            animation: 'slideUp 0.2s ease',
          }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: C.dim, marginBottom: 14, fontWeight: '600' }}>
              THEME
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {Object.entries(THEMES).map(([key, t]) => {
                const active = theme === key;
                return (
                  <button
                    key={key}
                    onClick={() => switchTheme(key)}
                    style={{
                      padding: '14px 12px',
                      borderRadius: 16,
                      border: `2px solid ${active ? t.acid : 'transparent'}`,
                      backgroundColor: t.bg,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 5 }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: t.acid }} />
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: t.cyan }} />
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: t.orange }} />
                    </div>
                    <div style={{ fontSize: 11, color: t.txt2, letterSpacing: 1, fontWeight: '700' }}>
                      {t.name.toUpperCase()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
