'use client';
import { useState, useEffect, useCallback } from 'react';
import { C } from '../lib/theme';
import { THEMES, DEFAULT_THEME, applyTheme } from '../lib/themes';
import { loadRuns, saveRuns, loadTargets, saveTargets } from '../lib/storage';

import PlanScreen from '../screens/PlanScreen';
import ProgressScreen from '../screens/ProgressScreen';
import LogScreen from '../screens/LogScreen';
import TrailScreen from '../screens/TrailScreen';
import RoutesScreen from '../screens/RoutesScreen';
import LoadScreen from '../screens/LoadScreen';
import WeeklyScreen from '../screens/WeeklyScreen';
import PBsScreen from '../screens/PBsScreen';
import TargetsScreen from '../screens/TargetsScreen';
import CoachScreen from '../screens/CoachScreen';

const TABS = [
  { name: 'Plan', icon: '✎' },
  { name: 'Progress', icon: '📈' },
  { name: 'Log', icon: '≡' },
  { name: 'Trail', icon: '⛰' },
  { name: 'Routes', icon: '↻' },
  { name: 'Load', icon: '◐' },
  { name: 'Weekly', icon: '▦' },
  { name: 'PBs', icon: '★' },
  { name: 'Targets', icon: '◎' },
  { name: 'Coach', icon: '◈' },
];

export default function Home() {
  const [tab, setTab] = useState('Plan');
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
          <span style={{ color: C.acid }}>P</span>ACE
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (tab) {
      case 'Plan': return <PlanScreen runs={runs} addRun={addRun} />;
      case 'Progress': return <ProgressScreen runs={runs} targets={targets} />;
      case 'Log': return <LogScreen runs={runs} delRun={delRun} />;
      case 'Trail': return <TrailScreen runs={runs} />;
      case 'Routes': return <RoutesScreen runs={runs} />;
      case 'Load': return <LoadScreen runs={runs} />;
      case 'Weekly': return <WeeklyScreen runs={runs} targets={targets} />;
      case 'PBs': return <PBsScreen runs={runs} />;
      case 'Targets': return <TargetsScreen runs={runs} targets={targets} setTargets={setTargets} />;
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
            <span style={{ color: C.acid }}>P</span>ACE
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
        <div style={{ display: 'flex', overflowX: 'auto', padding: '6px 6px 2px', gap: 2 }}>
          {TABS.map(({ name, icon }) => {
            const active = tab === name;
            return (
              <button
                key={name}
                onClick={() => setTab(name)}
                style={{
                  flex: '0 0 auto',
                  minWidth: 68,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '8px 10px 6px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: active ? C.acidGlow : 'transparent',
                  cursor: 'pointer',
                  color: active ? C.acid : C.dim,
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
                <span style={{
                  fontSize: 9,
                  letterSpacing: 0.5,
                  marginTop: 4,
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
