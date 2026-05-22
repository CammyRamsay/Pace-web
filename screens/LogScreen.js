'use client';
import { useState } from 'react';
import { C } from '../lib/theme';
import { H, Empty } from '../components/ui';
import RunCard from '../components/RunCard';

export default function LogScreen({ runs, delRun }) {
  const [filter, setFilter] = useState('All');
  const types = ['All', 'Easy', 'Tempo', 'Intervals', 'Long', 'Race', 'Recovery', 'Hills'];
  const shown = filter === 'All' ? runs : runs.filter((r) => r.type === filter);

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>
      <H title="Logbook" sub={`${runs.length} runs recorded`} />
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12, paddingBottom: 2 }}>
        {types.map((t) => {
          const active = filter === t;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: '6px 14px', borderRadius: 20, flexShrink: 0, cursor: 'pointer',
                border: `1px solid ${active ? C.acid : C.lineBright}`,
                backgroundColor: active ? C.panel : C.bg,
                color: active ? C.acid : C.dim2, fontSize: 12,
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
      {shown.length === 0
        ? <Empty msg="No runs here yet. Head to Plan to log one." />
        : shown.map((r) => <RunCard key={r.id} r={r} onDel={() => delRun(r.id)} />)}
    </div>
  );
}
