'use client';
import { useState, useEffect, useCallback } from 'react';
import { C } from '../lib/theme';
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

  useEffect(() => {
    setRuns(loadRuns());
    setTargets(loadTargets());
    setReady(true);
  }, []);

  useEffect(() => { if (ready) saveRuns(runs); }, [runs, ready]);
  useEffect(() => { if (ready && targets) saveTargets(targets); }, [targets, ready]);

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
        <div style={{ fontSize: 24, fontWeight: '700', letterSpacing: 4, color: C.txt }}>
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: C.bg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '8px 18px 12px',
        paddingTop: 'max(8px, env(safe-area-inset-top))',
        borderBottom: `1px solid ${C.line}`,
        backgroundColor: C.bg,
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 24, fontWeight: '700', letterSpacing: 4, color: C.txt }}>
          <span style={{ color: C.acid }}>P</span>ACE
        </div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: C.dim, marginTop: 2 }}>
          TRAIL COACH · KM · EFFORT-FIRST
        </div>
      </div>

      {/* Screen content */}
      <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
        {renderScreen()}
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        backgroundColor: C.panel2,
        borderTop: `1px solid ${C.line}`,
        paddingBottom: 'env(safe-area-inset-bottom)',
        flexShrink: 0,
      }}>
        {TABS.map(({ name, icon }) => {
          const active = tab === name;
          return (
            <button
              key={name}
              onClick={() => setTab(name)}
              style={{
                flex: '0 0 76px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', padding: '10px 0',
                border: 'none', background: 'none', cursor: 'pointer',
                color: active ? C.acid : C.dim,
              }}
            >
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ fontSize: 9, letterSpacing: 0.5, marginTop: 2 }}>{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
