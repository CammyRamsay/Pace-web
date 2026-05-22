'use client';
import { C } from '../lib/theme';
import { fmtPace, vam } from '../lib/calc';
import { H, Card, Stat, Empty } from '../components/ui';
import RunCard from '../components/RunCard';

export default function TrailScreen({ runs }) {
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

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>
      <H title="Trail" sub="terrain is the opponent — pace lies up here" />
      {trail.length === 0 ? (
        <Empty msg="No trail runs logged. Set terrain to Trail when logging." />
      ) : (
        <>
          <Card style={{ backgroundColor: '#141b15' }}>
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
        </>
      )}
    </div>
  );
}
