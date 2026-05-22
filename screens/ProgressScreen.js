'use client';
import { useMemo } from 'react';
import { C } from '../lib/theme';
import { buildWeeks, fmtPace } from '../lib/calc';
import { H, Card, Bar, Empty } from '../components/ui';

export default function ProgressScreen({ runs, targets }) {
  const weeks = useMemo(() => buildWeeks(runs), [runs]);
  const maxKm = Math.max(targets.weeklyKm, ...weeks.map((w) => w.km), 1);

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>
      <H title="Progress" sub={`weekly mileage · target ${targets.weeklyKm} km/wk`} />
      {weeks.length === 0 ? (
        <Empty msg="Log some runs and your weekly build will appear here." />
      ) : (
        <Card>
          {weeks.slice(0, 10).map((w) => {
            const hit = w.km >= targets.weeklyKm;
            return (
              <div key={w.key} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: C.dim2 }}>{w.label}</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: 12, color: hit ? C.acid : C.txt }}>
                    {w.km.toFixed(1)} km{hit ? ' ✓' : ''}
                  </span>
                </div>
                <Bar pct={(w.km / maxKm) * 100} color={hit ? C.acid : C.blue} targetPct={(targets.weeklyKm / maxKm) * 100} />
                <div style={{ fontSize: 10, color: C.dim, marginTop: 3 }}>
                  {w.runs} runs · {w.vert}m vert · avg {fmtPace(w.sec / w.km)}/km
                </div>
              </div>
            );
          })}
          <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>
            <span style={{ color: C.orange }}>▏</span> orange line = weekly target
          </div>
        </Card>
      )}
    </div>
  );
}
