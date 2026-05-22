'use client';
import { useMemo } from 'react';
import { C } from '../lib/theme';
import { computePBs, fmtClock, fmtPace } from '../lib/calc';
import { H, Empty } from '../components/ui';

export default function PBsScreen({ runs }) {
  const pbs = useMemo(() => computePBs(runs), [runs]);
  const rows = [
    ['Fastest 1 km', pbs.k1 ? fmtPace(pbs.k1) + '/km' : '—', 'single fastest-pace effort'],
    ['Best 5 km', pbs.k5 ? fmtClock(pbs.k5) : '—', 'estimated from best pace'],
    ['Best 10 km', pbs.k10 ? fmtClock(pbs.k10) : '—', 'estimated from best pace'],
    ['Best Half', pbs.half ? fmtClock(pbs.half) : '—', '21.1 km'],
    ['Longest Run', pbs.long ? pbs.long.toFixed(2) + ' km' : '—', 'furthest single run'],
    ['Biggest Climb ▲', pbs.climb ? pbs.climb + ' m' : '—', 'most ascent in one run'],
    ['Biggest Descent ▼', pbs.desc ? pbs.desc + ' m' : '—', 'most descent in one run'],
    ['Best VAM', pbs.vam ? Math.round(pbs.vam) + ' m/hr' : '—', 'fastest vertical climb rate'],
  ];

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>
      <H title="Personal Bests" sub="road + trail · auto-updating" />
      {runs.length === 0 ? (
        <Empty msg="Log runs and your PBs will populate automatically." />
      ) : (
        rows.map(([n, v, e]) => (
          <div key={n} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: C.panel, border: `1px solid ${C.line}`, borderRadius: 12,
            padding: '13px 15px', marginBottom: 8,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: '600', letterSpacing: 1, color: C.txt }}>{n}</div>
              <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>{e}</div>
            </div>
            <div style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: 18, color: v === '—' ? C.dim : C.acid }}>
              {v}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
