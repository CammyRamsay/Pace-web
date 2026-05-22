'use client';
import { useState } from 'react';
import { C } from '../lib/theme';
import { buildWeeks, computePBs, loadOf, daysAgo, fmtClock, fmtPace, gap } from '../lib/calc';
import { H, Card, Btn, Spinner } from '../components/ui';

function CoachBlock({ title, items, c, numbered }) {
  return (
    <Card>
      <div style={{ fontSize: 10, letterSpacing: 2, color: c, marginBottom: 10 }}>{title}</div>
      {(items || []).map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 9 }}>
          <span style={{ color: c, fontWeight: '700' }}>{numbered ? `${i + 1}.` : '›'}</span>
          <span style={{ color: C.txt2, fontSize: 13, lineHeight: '20px', flex: 1 }}>{it}</span>
        </div>
      ))}
    </Card>
  );
}

export default function CoachScreen({ runs, targets }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [err, setErr] = useState(null);

  const analyse = async () => {
    if (runs.length === 0) {
      setErr("Log at least one run first so I've got something to analyse."); return;
    }
    setLoading(true); setErr(null); setAnalysis(null);

    const weeks = buildWeeks(runs), pbs = computePBs(runs);
    const acute = runs.filter((r) => daysAgo(r.date) <= 7).reduce((a, r) => a + loadOf(r), 0);
    const chronic = runs.filter((r) => daysAgo(r.date) <= 28).reduce((a, r) => a + loadOf(r), 0) / 4;
    const summary = {
      totalRuns: runs.length,
      acuteChronicRatio: chronic > 0 ? +(acute / chronic).toFixed(2) : null,
      last12: runs.slice(0, 12).map((r) => ({
        date: new Date(r.date).toISOString().slice(0, 10), km: +r.distKm.toFixed(2),
        pace: fmtPace(r.pace), gap: r.elev > 0 ? fmtPace(gap(r)) : null, type: r.type, terrain: r.terrain,
        climb: r.elev, descent: r.descent, condition: r.terrain === 'Trail' ? r.condition : null,
        effort: r.effort, route: r.route || null, notes: r.notes || null,
      })),
      weekly: weeks.slice(0, 6).map((w) => ({ week: w.label, km: +w.km.toFixed(1), vert: w.vert, runs: w.runs })),
      pbs: {
        fastestKm: pbs.k1 ? fmtPace(pbs.k1) : null, best5k: pbs.k5 ? fmtClock(pbs.k5) : null,
        best10k: pbs.k10 ? fmtClock(pbs.k10) : null, longest: pbs.long,
        biggestClimb: pbs.climb, biggestDescent: pbs.desc, bestVAM: pbs.vam ? Math.round(pbs.vam) : null,
      },
      targets: {
        weeklyKm: targets.weeklyKm, weeklyVert: targets.weeklyVert,
        goal5k: fmtClock(targets.pb5k), goal10k: fmtClock(targets.pb10k), longRunGoal: targets.longRun,
      },
    };

    const prompt = `You are an elite trail & road running coach. Your athlete trains in KILOMETRES, wants to RUN FASTER and break PBs, and does a mix of road and trail. Trail terrain matters: judge trail efforts by GAP (grade-adjusted pace) and effort, NOT raw pace. Factor in climb/descent balance (untrained descending wrecks quads), training-load spikes (acute:chronic > 1.5 = injury risk; 0.8-1.3 = optimal), conditions (mud/snow explain slow days), and session variety. Be sharp, specific and reference their real numbers.

DATA:
${JSON.stringify(summary, null, 2)}

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "verdict":"one punchy sentence overall assessment",
  "score": <0-100 training quality>,
  "doingWell":["2-4 specifics citing their real numbers"],
  "watchOut":["2-3 risks: load spikes, climb/descent imbalance, too much hard running, no long run, etc"],
  "nextSessions":["3 specific workouts for next week with paces/distance/vert tailored to their data, including at least one trail/hill session if they run trails"],
  "trailInsight":"one trail-specific observation about their terrain, vert, descent or GAP trend",
  "targetCall":"honest take on whether they're on track for their targets and what must change"
}`;

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1800,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      const text = (data.content || []).map((i) => (i.type === 'text' ? i.text : '')).join('').replace(/```json|```/g, '').trim();
      setAnalysis(JSON.parse(text));
    } catch {
      setErr("Coach couldn't analyse right now — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = analysis
    ? analysis.score >= 70 ? C.acid : analysis.score >= 45 ? C.cyan : C.orange
    : C.acid;

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>
      <H title="AI Coach" sub="reads pace, GAP, vert, load — tells you straight" />

      {!analysis && !loading && (
        <Card style={{ textAlign: 'center', paddingTop: 30, paddingBottom: 30 }}>
          <div style={{ fontSize: 42, marginBottom: 10, color: C.acid }}>◈</div>
          <div style={{ color: C.dim2, fontSize: 13, lineHeight: '21px', marginBottom: 18 }}>
            I'll read every run — pace and grade-adjusted pace, weekly mileage and vert, climb vs descent, your training-load balance, conditions, PBs and targets — and give you a full coaching breakdown with specific sessions to run next.
          </div>
          <Btn label="ANALYSE MY TRAINING" onPress={analyse} />
          {!!err && <div style={{ color: C.red, fontSize: 12, marginTop: 12 }}>{err}</div>}
        </Card>
      )}

      {loading && (
        <Card style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 40 }}>
          <Spinner />
          <div style={{ color: C.dim2, fontSize: 13, marginTop: 14 }}>Coach is analysing your training…</div>
        </Card>
      )}

      {analysis && (
        <>
          <Card style={{ backgroundColor: C.panelAlt, textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: 48, color: scoreColor }}>{analysis.score}</div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: C.dim, marginBottom: 10 }}>TRAINING SCORE</div>
            <div style={{ fontSize: 14, fontWeight: '600', lineHeight: '20px', color: C.txt }}>{analysis.verdict}</div>
          </Card>
          <CoachBlock title="✓ DOING WELL" items={analysis.doingWell} c={C.acid} />
          <CoachBlock title="⚠ WATCH OUT" items={analysis.watchOut} c={C.orange} />
          <CoachBlock title="◈ NEXT SESSIONS" items={analysis.nextSessions} c={C.cyan} numbered />
          {!!analysis.trailInsight && (
            <Card>
              <div style={{ fontSize: 10, letterSpacing: 2, color: C.orange, marginBottom: 8 }}>⛰ TRAIL INSIGHT</div>
              <div style={{ fontSize: 13, lineHeight: '21px', color: C.txt }}>{analysis.trailInsight}</div>
            </Card>
          )}
          <Card>
            <div style={{ fontSize: 10, letterSpacing: 2, color: C.dim, marginBottom: 8 }}>◎ TARGET CALL</div>
            <div style={{ fontSize: 13, lineHeight: '21px', color: C.txt }}>{analysis.targetCall}</div>
          </Card>
          <Btn label="RE-ANALYSE" variant="ghost" onPress={analyse} />
        </>
      )}
    </div>
  );
}
