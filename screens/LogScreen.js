'use client';
import { useState } from 'react';
import { C } from '../lib/theme';
import { fmtPace, gap } from '../lib/calc';
import { H, Card, Field, Input, Segmented, Btn, Empty } from '../components/ui';
import RunCard from '../components/RunCard';
import { stravaConnectUrl } from '../lib/strava';

const SUB = ['Add', 'History'];

function AddView({ addRun }) {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    date: today, dist: '', h: '', m: '', s: '', type: 'Easy', terrain: 'Road',
    elev: '', descent: '', route: '', condition: 'Dry', effort: 3, shoes: '', fuel: '', notes: '',
  });
  const [flash, setFlash] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const secs = (parseInt(f.h || 0) * 3600) + (parseInt(f.m || 0) * 60) + parseInt(f.s || 0);
  const dist = parseFloat(f.dist);
  const livePace = dist > 0 && secs > 0 ? fmtPace(secs / dist) : '—';
  const liveGap = dist > 0 && secs > 0 ? fmtPace(gap({ distKm: dist, pace: secs / dist, elev: parseInt(f.elev || 0) })) : '—';

  const submit = () => {
    if (!dist || dist <= 0 || secs <= 0) {
      setFlash('err'); setTimeout(() => setFlash(false), 1500); return;
    }
    addRun({
      date: new Date(f.date + 'T12:00:00').getTime(), distKm: dist, durSec: secs, pace: secs / dist,
      type: f.type, terrain: f.terrain, elev: parseInt(f.elev || 0), descent: parseInt(f.descent || 0),
      route: f.route.trim(), condition: f.condition, effort: f.effort,
      shoes: f.shoes.trim(), fuel: f.fuel.trim(), notes: f.notes,
    });
    setF((p) => ({ ...p, dist: '', h: '', m: '', s: '', elev: '', descent: '', notes: '' }));
    setFlash('ok'); setTimeout(() => setFlash(false), 1800);
  };

  const isTrail = f.terrain === 'Trail';
  const effortWord = ['', 'very easy', 'easy', 'moderate', 'hard', 'max'][f.effort];

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>
      <Card>
        <Field label="DATE">
          <Input type="date" value={f.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
        <Field label="DISTANCE (KM)">
          <Input type="number" inputMode="decimal" value={f.dist} onChange={(e) => set('dist', e.target.value)} placeholder="0.00" />
        </Field>
        <Field label="TIME (H : M : S)">
          <div style={{ display: 'flex', gap: 8 }}>
            <Input type="number" inputMode="numeric" style={{ flex: 1 }} value={f.h} onChange={(e) => set('h', e.target.value)} placeholder="hh" />
            <Input type="number" inputMode="numeric" style={{ flex: 1 }} value={f.m} onChange={(e) => set('m', e.target.value)} placeholder="mm" />
            <Input type="number" inputMode="numeric" style={{ flex: 1 }} value={f.s} onChange={(e) => set('s', e.target.value)} placeholder="ss" />
          </div>
        </Field>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 13, color: C.dim, letterSpacing: 1 }}>
            PACE <strong style={{ color: C.txt }}>{livePace}</strong>/km
          </span>
          <span style={{ fontSize: 13, color: C.dim, letterSpacing: 1, marginLeft: 18 }}>
            GAP <strong style={{ color: C.cyan }}>{liveGap}</strong>/km
          </span>
        </div>

        <Field label="SESSION TYPE">
          <Segmented opts={['Easy', 'Tempo', 'Intervals', 'Long', 'Race', 'Recovery', 'Hills']} val={f.type} on={(v) => set('type', v)} />
        </Field>
        <Field label="TERRAIN">
          <Segmented opts={['Road', 'Trail', 'Track', 'Treadmill']} val={f.terrain} on={(v) => set('terrain', v)} />
        </Field>

        {isTrail && (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Field label="CLIMB (M ▲)">
                  <Input type="number" inputMode="numeric" value={f.elev} onChange={(e) => set('elev', e.target.value)} placeholder="0" />
                </Field>
              </div>
              <div style={{ flex: 1 }}>
                <Field label="DESCENT (M ▼)">
                  <Input type="number" inputMode="numeric" value={f.descent} onChange={(e) => set('descent', e.target.value)} placeholder="0" />
                </Field>
              </div>
            </div>
            <Field label="CONDITIONS">
              <Segmented opts={['Dry', 'Muddy', 'Wet', 'Snow', 'Technical', 'Runnable']} val={f.condition} on={(v) => set('condition', v)} />
            </Field>
          </>
        )}

        <Field label="ROUTE NAME (optional)">
          <Input value={f.route} onChange={(e) => set('route', e.target.value)} placeholder="e.g. Arthur's Seat Loop" />
        </Field>

        <Field label={`PERCEIVED EFFORT — ${effortWord}`}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => set('effort', n)}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 10, cursor: 'pointer',
                  border: `1px solid ${f.effort >= n ? C.acid : C.lineBright}`,
                  backgroundColor: f.effort >= n ? C.acid : C.bg,
                  color: f.effort >= n ? C.bg : C.dim2, fontWeight: '700', fontSize: 15,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </Field>

        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <Field label="SHOES">
              <Input value={f.shoes} onChange={(e) => set('shoes', e.target.value)} placeholder="optional" />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="FUEL">
              <Input value={f.fuel} onChange={(e) => set('fuel', e.target.value)} placeholder="optional" />
            </Field>
          </div>
        </div>

        <Field label="NOTES">
          <Input multiline value={f.notes} onChange={(e) => set('notes', e.target.value)} placeholder="how did the legs feel?" />
        </Field>

        <Btn
          label={flash === 'ok' ? '✓ LOGGED' : flash === 'err' ? 'ENTER DISTANCE & TIME' : 'LOG RUN'}
          variant={flash === 'ok' ? 'ok' : flash === 'err' ? 'err' : undefined}
          onPress={submit}
        />
      </Card>
    </div>
  );
}

function HistoryView({ runs, delRun, stravaAuth, stravaSync, onStravaSync }) {
  const [filter, setFilter] = useState('All');
  const types = ['All', 'Easy', 'Tempo', 'Intervals', 'Long', 'Race', 'Recovery', 'Hills'];
  const shown = filter === 'All' ? runs : runs.filter((r) => r.type === filter);

  return (
    <div style={{ padding: 14, paddingBottom: 40 }}>

      {/* Strava banner */}
      {stravaAuth ? (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: C.panel, borderRadius: 14, padding: '12px 16px',
          border: `1px solid ${C.lineBright}`, marginBottom: 14,
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: '700', letterSpacing: 1, color: '#FC4C02' }}>⚡ STRAVA</div>
            {stravaAuth.athlete_name && (
              <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>{stravaAuth.athlete_name}</div>
            )}
          </div>
          <button
            onClick={onStravaSync}
            disabled={stravaSync === 'loading'}
            style={{
              backgroundColor: stravaSync === 'done' ? C.green : '#FC4C02',
              color: stravaSync === 'done' ? '#000' : '#fff',
              border: 'none', borderRadius: 10, padding: '8px 16px',
              fontSize: 11, fontWeight: '700', letterSpacing: 1, cursor: 'pointer',
            }}
          >
            {stravaSync === 'loading' ? 'SYNCING...' : stravaSync === 'done' ? '✓ SYNCED' : stravaSync === 'error' ? 'ERROR' : 'SYNC RUNS'}
          </button>
        </div>
      ) : (
        <button
          onClick={() => { window.location.href = stravaConnectUrl(); }}
          style={{
            width: '100%', backgroundColor: '#FC4C02', color: '#fff',
            border: 'none', borderRadius: 14, padding: '14px',
            fontSize: 13, fontWeight: '700', letterSpacing: 2, cursor: 'pointer',
            marginBottom: 14,
          }}
        >
          CONNECT STRAVA
        </button>
      )}
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
      <div style={{ fontSize: 11, color: C.dim, marginBottom: 10, letterSpacing: 1 }}>
        {runs.length} RUNS RECORDED
      </div>
      {shown.length === 0
        ? <Empty msg="No runs here yet. Add one in the Add tab." />
        : shown.map((r) => <RunCard key={r.id} r={r} onDel={() => delRun(r.id)} />)}
    </div>
  );
}

export default function LogScreen({ runs, delRun, addRun, stravaAuth, stravaSync, onStravaSync }) {
  const [sub, setSub] = useState('Add');

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
        {sub === 'Add' && <AddView addRun={addRun} />}
        {sub === 'History' && <HistoryView runs={runs} delRun={delRun} stravaAuth={stravaAuth} stravaSync={stravaSync} onStravaSync={onStravaSync} />}
      </div>
    </div>
  );
}
