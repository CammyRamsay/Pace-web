'use client';
import { useMemo } from 'react';
import { C } from '../lib/theme';
import { fmtClock } from '../lib/calc';
import { H, Card, Empty } from '../components/ui';

export default function RoutesScreen({ runs }) {
  const grouped = useMemo(() => {
    const m = {};
    runs.filter((r) => r.route).forEach((r) => { (m[r.route] = m[r.route] || []).push(r); });
    return Object.entries(m)
      .map(([name, list]) => ({ name, list: list.sort((a, b) => a.date - b.date) }))
      .filter((g) => g.list.length > 0);
  }, [runs]);

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>
      <H title="Routes" sub="same route over time = cleanest fitness signal" />
      {grouped.length === 0 ? (
        <Empty msg="Name a route when you log a run (e.g. 'Pentlands Loop') and repeat efforts will be compared here." />
      ) : (
        grouped.map((g) => {
          const best = g.list.reduce((a, r) => (r.durSec < a.durSec ? r : a), g.list[0]);
          const latest = g.list[g.list.length - 1];
          const first = g.list[0];
          const improved = g.list.length > 1 ? first.durSec - latest.durSec : 0;
          const maxSec = Math.max(...g.list.map((r) => r.durSec));
          const minSec = Math.min(...g.list.map((r) => r.durSec));

          return (
            <Card key={g.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontWeight: '700', fontSize: 16, color: C.txt }}>{g.name}</span>
                <span style={{ fontSize: 11, color: C.dim }}>{g.list.length}× · {latest.distKm.toFixed(1)}km</span>
              </div>
              <div style={{ fontSize: 11, color: C.dim2, marginBottom: 12 }}>
                Best{' '}
                <strong style={{ color: C.acid, fontFamily: 'monospace' }}>{fmtClock(best.durSec)}</strong>
                {g.list.length > 1 && (improved > 0
                  ? <span style={{ color: C.acid }}>{'  ▲ '}{fmtClock(Math.abs(improved))} faster since first</span>
                  : improved < 0
                  ? <span style={{ color: C.orange }}>{'  ▼ '}{fmtClock(Math.abs(improved))} slower since first</span>
                  : <span>{'  no change yet'}</span>)}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', height: 70, gap: 5 }}>
                {g.list.map((r) => {
                  const hPct = maxSec > minSec ? 100 - ((r.durSec - minSec) / (maxSec - minSec)) * 72 : 100;
                  const barH = Math.round((hPct / 100) * 58);
                  const isBest = r.id === best.id;
                  return (
                    <div key={r.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <div style={{
                        width: '100%', height: Math.max(4, barH),
                        borderTopLeftRadius: 4, borderTopRightRadius: 4,
                        backgroundColor: isBest ? C.acid : C.blue,
                      }} />
                      <div style={{ fontSize: 8, color: C.dim, marginTop: 4 }}>
                        {new Date(r.date).getDate()}/{new Date(r.date).getMonth() + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 9, color: C.dim, marginTop: 6, textAlign: 'center' }}>
                taller = faster · green = your best
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
