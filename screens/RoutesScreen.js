'use client';
import { useState, useMemo } from 'react';
import { C } from '../lib/theme';
import { fmtClock, fmtPace, vam } from '../lib/calc';
import { H, Card, Stat, Empty } from '../components/ui';
import RunCard from '../components/RunCard';

const SUB = ['Trail', 'Routes'];

function TrailView({ runs }) {
  const trail = runs.filter((r) => r.terrain === 'Trail');
  const totalKm = trail.reduce((a, r) => a + r.distKm, 0);
  const totalElev = trail.reduce((a, r) => a + r.elev, 0);
  const totalDesc = trail.reduce((a, r) => a + (r.descent || 0), 0);
  const avgPace = totalKm > 0 ? trail.reduce((a, r) => a + r.durSec, 0) / totalKm : 0;
  const bestVam = Math.max(0, ...trail.map(vam));
  const vertPerKm = totalKm > 0 ? Math.round(totalElev / totalKm) : 0;
  const road = runs.filter((r) => r.terrain === 'Road');
  const roadKm = road.reduce((a, r) => a + r.distKm, 0);
  const roadPace = roadKm > 0 ? road.reduce((a, r) => a + r.durSec, 0) / roadKm : 0;
  const climbVsDesc = totalDesc > 0 ? totalElev / totalDesc : null;

  if (trail.length === 0) {
    return (
      <div style={{ padding: 14 }}>
        <Empty msg="No trail runs logged. Set terrain to Trail when logging." />
      </div>
    );
  }

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>
      <Card style={{ backgroundColor: C.panelAlt }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {[
            ['TRAIL KM', totalKm.toFixed(1), C.acid],
            ['TOTAL CLIMB ▲', totalElev + 'm', C.orange],
            ['TOTAL DESCENT ▼', totalDesc + 'm', C.cyan],
            ['VERT PER KM', vertPerKm + 'm', null],
            ['BEST VAM (m/hr)', Math.round(bestVam), C.orange],
            ['TRAIL RUNS', trail.length, null],
          ].map(([l, n, c]) => (
            <div key={l} style={{ width: '50%', marginBottom: 16 }}>
              <Stat big n={n} l={l} c={c} />
            </div>
          ))}
        </div>
      </Card>

      {roadPace > 0 && avgPace > 0 && (
        <Card>
          <div style={{ fontSize: 10, letterSpacing: 2, color: C.dim, marginBottom: 8 }}>// EFFORT, NOT PACE</div>
          <div style={{ fontSize: 13, lineHeight: '20px', color: C.dim2 }}>
            Trail pace runs{' '}
            <strong style={{ color: C.orange }}>
              {fmtPace(Math.abs(avgPace - roadPace))}/km {avgPace > roadPace ? 'slower' : 'faster'}
            </strong>{' '}
            than road — that's the climbing, not lost fitness. Watch your{' '}
            <strong style={{ color: C.cyan }}>GAP</strong> and effort instead.
          </div>
        </Card>
      )}

      {climbVsDesc !== null && (
        <Card>
          <div style={{ fontSize: 10, letterSpacing: 2, color: C.dim, marginBottom: 8 }}>// DESCENT BALANCE</div>
          <div style={{ fontSize: 13, lineHeight: '20px', color: C.dim2 }}>
            {climbVsDesc > 1.25
              ? "You're logging far more climb than descent. If real downhill is missing, your quads aren't trained for it — and that's where trail races wreck people. Add some honest descending."
              : climbVsDesc < 0.8
              ? 'Lots of descent relative to climb — great for downhill durability. Make sure the climbing legs are getting work too.'
              : "Climb and descent are nicely balanced. Good — you're training both halves of the hill."}
          </div>
        </Card>
      )}

      {trail.map((r) => <RunCard key={r.id} r={r} onDel={null} />)}
    </div>
  );
}

function RoutesView({ runs }) {
  const grouped = useMemo(() => {
    const m = {};
    runs.filter((r) => r.route).forEach((r) => { (m[r.route] = m[r.route] || []).push(r); });
    return Object.entries(m)
      .map(([name, list]) => ({ name, list: list.sort((a, b) => a.date - b.date) }))
      .filter((g) => g.list.length > 0);
  }, [runs]);

  if (grouped.length === 0) {
    return (
      <div style={{ padding: 14 }}>
        <Empty msg="Name a route when you log a run (e.g. 'Pentlands Loop') and repeat efforts will be compared here." />
      </div>
    );
  }

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>
      {grouped.map((g) => {
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
                ? <span style={{ color: C.green }}>{'  ▲ '}{fmtClock(Math.abs(improved))} faster since first</span>
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
                      backgroundColor: isBest ? C.green : C.blue,
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
      })}
    </div>
  );
}

export default function RoutesScreen({ runs }) {
  const [sub, setSub] = useState('Trail');

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
        {sub === 'Trail' && <TrailView runs={runs} />}
        {sub === 'Routes' && <RoutesView runs={runs} />}
      </div>
    </div>
  );
}
