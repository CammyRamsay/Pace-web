'use client';
import { useState } from 'react';
import { C } from '../lib/theme';
import WeeklyScreen from './WeeklyScreen';
import ProgressScreen from './ProgressScreen';
import PBsScreen from './PBsScreen';
import TargetsScreen from './TargetsScreen';

const SUB = ['Weekly', 'Progress', 'PBs', 'Targets'];

export default function StatsScreen({ runs, targets, setTargets }) {
  const [sub, setSub] = useState('Weekly');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex',
        padding: '0 14px',
        gap: 4,
        borderBottom: `1px solid ${C.line}`,
        backgroundColor: C.bg,
        flexShrink: 0,
      }}>
        {SUB.map((t) => {
          const active = sub === t;
          return (
            <button
              key={t}
              onClick={() => setSub(t)}
              style={{
                flex: 1,
                padding: '12px 4px',
                border: 'none',
                borderBottom: active ? `2px solid ${C.acid}` : '2px solid transparent',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: active ? C.acid : C.dim,
                fontSize: 11,
                fontWeight: active ? '700' : '400',
                letterSpacing: 1,
              }}
            >
              {t.toUpperCase()}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
        {sub === 'Weekly' && <WeeklyScreen runs={runs} targets={targets} />}
        {sub === 'Progress' && <ProgressScreen runs={runs} targets={targets} />}
        {sub === 'PBs' && <PBsScreen runs={runs} />}
        {sub === 'Targets' && <TargetsScreen runs={runs} targets={targets} setTargets={setTargets} />}
      </div>
    </div>
  );
}
