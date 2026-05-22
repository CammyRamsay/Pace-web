'use client';
import { C } from '../lib/theme';
import { loadRatio, daysAgo } from '../lib/calc';
import { H, Card, Stat, Empty } from '../components/ui';

export default function LoadScreen({ runs }) {
  const { acute, chronicWeekly, ratio } = loadRatio(runs);
  const lastRun = runs[0] ? Math.floor(daysAgo(runs[0].date)) : null;
  const runsThisWeek = runs.filter((r) => daysAgo(r.date) <= 7).length;

  let zone, zColor, zMsg;
  if (runs.length < 4) {
    zone = 'BUILDING BASELINE'; zColor = C.dim;
    zMsg = "Log a few weeks of running and the load model gets accurate. Right now there's not enough history to judge.";
  } else if (ratio < 0.8) {
    zone = 'DETRAINING / FRESH'; zColor = C.cyan;
    zMsg = "Your recent load is below your norm. Fine if you're recovering or tapering — but if this drags on, fitness slips. Time to build back up.";
  } else if (ratio <= 1.3) {
    zone = 'OPTIMAL'; zColor = C.acid;
    zMsg = "Sweet spot. You're progressively loading without spiking — exactly where adaptation happens and injury risk stays low. Keep it here.";
  } else if (ratio <= 1.5) {
    zone = 'PUSHING'; zColor = C.orange;
    zMsg = "Load is climbing faster than your body's used to. Fine short-term, but don't stack another big week on top. Watch for niggles.";
  } else {
    zone = 'DANGER SPIKE'; zColor = C.red;
    zMsg = "Your week is way above your 4-week norm. This is the classic injury setup. Back off — easy days, or a rest day, before something pulls.";
  }

  const ratioPct = Math.min(100, (ratio / 2) * 100);

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>
      <H title="Training Load" sub="acute:chronic — the injury early-warning" />
      {runs.length === 0 ? (
        <Empty msg="Log runs and your load balance appears here." />
      ) : (
        <>
          <Card style={{ backgroundColor: C.panelAlt, alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: 46, color: zColor }}>{ratio.toFixed(2)}</div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: C.dim }}>ACUTE : CHRONIC RATIO</div>

            <div style={{ width: '100%', height: 12, backgroundColor: C.bg, borderRadius: 6, marginTop: 16, marginBottom: 6, border: `1px solid ${C.line}`, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '40%', width: '25%', top: 0, bottom: 0, backgroundColor: C.acidGlow }} />
              <div style={{ position: 'absolute', left: `${ratioPct}%`, top: -3, bottom: -3, width: 3, backgroundColor: zColor }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: 9, color: C.dim }}>fresh</span>
              <span style={{ fontSize: 9, color: C.acid }}>optimal 0.8–1.3</span>
              <span style={{ fontSize: 9, color: C.dim }}>spike</span>
            </div>

            <div style={{ marginTop: 14, padding: '5px 14px', borderRadius: 20, border: `1px solid ${zColor}`, display: 'inline-block' }}>
              <span style={{ color: zColor, fontSize: 11, letterSpacing: 1, fontWeight: '700' }}>{zone}</span>
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 13, lineHeight: '21px', color: C.txt2 }}>{zMsg}</div>
          </Card>

          <Card>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {[
                ['THIS WEEK LOAD', Math.round(acute), C.orange],
                ['4-WK AVG LOAD', Math.round(chronicWeekly), C.cyan],
                ['LAST RUN', lastRun === 0 ? 'today' : lastRun === 1 ? '1 day' : `${lastRun} days`, null],
                ['RUNS THIS WEEK', runsThisWeek, null],
              ].map(([l, n, c]) => (
                <div key={l} style={{ width: '50%', marginBottom: 16 }}>
                  <Stat big n={n} l={l} c={c} />
                </div>
              ))}
            </div>
          </Card>

          <div style={{ fontSize: 10, color: C.dim, padding: '0 4px', lineHeight: '16px' }}>
            Load = distance × effort, weighted up for trail, hills and vert. It's a guide, not gospel — your body's the final judge.
          </div>
        </>
      )}
    </div>
  );
}
