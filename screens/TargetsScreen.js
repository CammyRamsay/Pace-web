'use client';
import { useState, useMemo } from 'react';
import { C } from '../lib/theme';
import { computePBs, buildWeeks, fmtClock } from '../lib/calc';
import { H, Card, Field, Input, Bar } from '../components/ui';

export default function TargetsScreen({ runs, targets, setTargets }) {
  const pbs = useMemo(() => computePBs(runs), [runs]);
  const weeks = useMemo(() => buildWeeks(runs), [runs]);
  const curWk = weeks[0]?.km || 0;
  const curVert = weeks[0]?.vert || 0;
  const [edit, setEdit] = useState(false);
  const [t, setT] = useState({
    weeklyKm: String(targets.weeklyKm),
    pb5kMin: String(Math.floor(targets.pb5k / 60)), pb5kSec: String(targets.pb5k % 60),
    pb10kMin: String(Math.floor(targets.pb10k / 60)), pb10kSec: String(targets.pb10k % 60),
    longRun: String(targets.longRun), weeklyVert: String(targets.weeklyVert),
  });

  const save = () => {
    setTargets({
      weeklyKm: parseFloat(t.weeklyKm) || 0,
      pb5k: (parseInt(t.pb5kMin) || 0) * 60 + (parseInt(t.pb5kSec) || 0),
      pb10k: (parseInt(t.pb10kMin) || 0) * 60 + (parseInt(t.pb10kSec) || 0),
      longRun: parseFloat(t.longRun) || 0,
      weeklyVert: parseInt(t.weeklyVert) || 0,
    });
    setEdit(false);
  };

  const items = [
    { name: 'Weekly mileage', cur: curWk, tgt: targets.weeklyKm, unit: 'km', higher: true, fmt: (x) => x.toFixed(1) },
    { name: 'Weekly vert', cur: curVert, tgt: targets.weeklyVert, unit: 'm', higher: true, fmt: (x) => String(Math.round(x)) },
    { name: '5 km time', cur: pbs.k5, tgt: targets.pb5k, unit: '', higher: false, fmt: fmtClock },
    { name: '10 km time', cur: pbs.k10, tgt: targets.pb10k, unit: '', higher: false, fmt: fmtClock },
    { name: 'Long run', cur: pbs.long || 0, tgt: targets.longRun, unit: 'km', higher: true, fmt: (x) => x.toFixed(1) },
  ];

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>
      <H
        title="Targets"
        sub="how far from your goals"
        right={
          <button
            onClick={() => (edit ? save() : setEdit(true))}
            style={{
              backgroundColor: C.line, borderRadius: 8, padding: '6px 14px',
              border: 'none', cursor: 'pointer', color: C.acid, fontSize: 11, letterSpacing: 1,
            }}
          >
            {edit ? 'SAVE' : 'EDIT'}
          </button>
        }
      />

      {edit ? (
        <Card>
          <Field label="WEEKLY MILEAGE (KM)">
            <Input type="number" inputMode="decimal" value={t.weeklyKm} onChange={(e) => setT({ ...t, weeklyKm: e.target.value })} />
          </Field>
          <Field label="WEEKLY VERT (M)">
            <Input type="number" inputMode="numeric" value={t.weeklyVert} onChange={(e) => setT({ ...t, weeklyVert: e.target.value })} />
          </Field>
          <Field label="5 KM GOAL (MIN : SEC)">
            <div style={{ display: 'flex', gap: 8 }}>
              <Input type="number" inputMode="numeric" style={{ flex: 1 }} value={t.pb5kMin} onChange={(e) => setT({ ...t, pb5kMin: e.target.value })} />
              <Input type="number" inputMode="numeric" style={{ flex: 1 }} value={t.pb5kSec} onChange={(e) => setT({ ...t, pb5kSec: e.target.value })} />
            </div>
          </Field>
          <Field label="10 KM GOAL (MIN : SEC)">
            <div style={{ display: 'flex', gap: 8 }}>
              <Input type="number" inputMode="numeric" style={{ flex: 1 }} value={t.pb10kMin} onChange={(e) => setT({ ...t, pb10kMin: e.target.value })} />
              <Input type="number" inputMode="numeric" style={{ flex: 1 }} value={t.pb10kSec} onChange={(e) => setT({ ...t, pb10kSec: e.target.value })} />
            </div>
          </Field>
          <Field label="LONG RUN GOAL (KM)">
            <Input type="number" inputMode="decimal" value={t.longRun} onChange={(e) => setT({ ...t, longRun: e.target.value })} />
          </Field>
        </Card>
      ) : (
        items.map((it) => {
          const has = it.cur > 0;
          let pct, gapv, onTrack;
          if (it.higher) {
            pct = Math.min(100, (it.cur / it.tgt) * 100);
            gapv = it.tgt - it.cur;
            onTrack = it.cur >= it.tgt;
          } else {
            pct = has ? Math.min(100, (it.tgt / it.cur) * 100) : 0;
            gapv = it.cur - it.tgt;
            onTrack = has && it.cur <= it.tgt;
          }
          return (
            <Card key={it.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: '600', letterSpacing: 1, color: C.txt }}>{it.name}</span>
                <span style={{ fontSize: 12, color: onTrack ? C.green : C.dim2 }}>{onTrack ? '✓ HIT' : 'in progress'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 13, color: C.dim }}>
                  now <span style={{ color: C.cyan }}>{has ? it.fmt(it.cur) : '—'}{it.unit && has ? ' ' + it.unit : ''}</span>
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 13, color: C.dim }}>
                  goal <span style={{ color: C.orange }}>{it.fmt(it.tgt)}{it.unit ? ' ' + it.unit : ''}</span>
                </span>
              </div>
              <Bar pct={pct} color={onTrack ? C.green : C.blue} />
              {has && !onTrack && (
                <div style={{ fontSize: 11, color: C.dim2, marginTop: 6 }}>
                  {it.higher ? `${gapv.toFixed(it.unit === 'm' ? 0 : 1)} ${it.unit} to go` : `${fmtClock(gapv)} faster needed`}
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
