'use client';
import { useMemo } from 'react';
import { C } from '../lib/theme';
import { buildWeeks, fmtClock, fmtPace } from '../lib/calc';
import { H, Card, Stat, Bar, Empty } from '../components/ui';

function DeltaRow({ label, v, d }) {
  const up = d >= 0;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.line}` }}>
      <span style={{ color: C.dim2, fontSize: 13 }}>{label}</span>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: C.txt }}>{v}</span>
        <span style={{ fontSize: 11, color: up ? C.acid : C.orange }}>{up ? '▲' : '▼'} {Math.abs(d).toFixed(0)}%</span>
      </div>
    </div>
  );
}

export default function WeeklyScreen({ runs, targets }) {
  const weeks = useMemo(() => buildWeeks(runs), [runs]);
  const cur = weeks[0], prev = weeks[1];

  if (!cur) {
    return (
      <div style={{ padding: 14 }}>
        <H title="This Week" sub="at a glance" />
        <Empty msg="No runs yet this week." />
      </div>
    );
  }

  const delta = (a, b) => (b ? ((a - b) / b) * 100 : 0);
  const km = cur.km;

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>
      <H title="This Week" sub={cur.label} />
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: 52, color: C.acid }}>{km.toFixed(1)}</div>
          <div style={{ fontSize: 11, letterSpacing: 2, color: C.dim }}>KILOMETRES · TARGET {targets.weeklyKm}</div>
          <div style={{ width: '100%', marginTop: 12 }}>
            <Bar pct={(km / targets.weeklyKm) * 100} color={C.acid} />
          </div>
          <div style={{ fontSize: 11, color: km >= targets.weeklyKm ? C.green : C.dim2, marginTop: 6 }}>
            {km >= targets.weeklyKm ? '✓ Weekly target smashed' : `${(targets.weeklyKm - km).toFixed(1)} km to target`}
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {[
            ['RUNS', cur.runs, null],
            ['TIME ON FEET', fmtClock(cur.sec), null],
            ['AVG PACE', cur.km > 0 ? fmtPace(cur.sec / cur.km) : '—', C.cyan],
            ['VERT CLIMBED', cur.vert + 'm', C.orange],
          ].map(([l, n, c]) => (
            <div key={l} style={{ width: '50%', marginBottom: 16 }}>
              <Stat big n={n} l={l} c={c} />
            </div>
          ))}
        </div>
      </Card>

      {prev && (
        <Card>
          <div style={{ fontSize: 10, letterSpacing: 2, color: C.dim, marginBottom: 10 }}>// VS LAST WEEK</div>
          <DeltaRow label="Distance" v={`${km.toFixed(1)} km`} d={delta(km, prev.km)} />
          <DeltaRow label="Runs" v={`${cur.runs}`} d={delta(cur.runs, prev.runs)} />
          <DeltaRow label="Vert" v={`${cur.vert} m`} d={delta(cur.vert, prev.vert)} />
        </Card>
      )}
    </div>
  );
}
