'use client';
import { C, MONO } from '../lib/theme';
import { fmtClock, fmtPace, gap } from '../lib/calc';
import { Mini } from './ui';

export default function RunCard({ r, onDel }) {
  const d = new Date(r.date);
  const showGap = r.terrain === 'Trail' && r.elev > 0;
  const dateStr = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const isTrail = r.terrain === 'Trail';

  return (
    <div style={{
      backgroundColor: C.panel,
      border: `1px solid ${C.line}`,
      borderLeft: `3px solid ${C.acid}`,
      borderRadius: 16,
      padding: 16,
      marginBottom: 10,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 10, letterSpacing: 1, color: C.dim, textTransform: 'uppercase', flex: 1, fontWeight: '600' }}>
          {dateStr}{r.route ? ` · ${r.route}` : ''}
        </div>
        <div style={{
          padding: '4px 10px',
          borderRadius: 20,
          flexShrink: 0,
          marginLeft: 8,
          border: `1px solid ${isTrail ? C.orange : C.lineBright}`,
          backgroundColor: C.acidGlow,
        }}>
          <span style={{ fontSize: 9, letterSpacing: 1, color: isTrail ? C.orange : C.acid, fontWeight: '700' }}>
            {r.type} · {r.terrain}
          </span>
        </div>
      </div>

      <div style={{ fontFamily: MONO, fontWeight: '700', fontSize: 32, marginTop: 8, color: C.txt, lineHeight: 1 }}>
        {r.distKm.toFixed(2)}<span style={{ fontSize: 14, color: C.dim, fontWeight: '400' }}> km</span>
      </div>

      <div style={{ display: 'flex', gap: 18, marginTop: 12, flexWrap: 'wrap' }}>
        <Mini k="TIME" v={fmtClock(r.durSec)} />
        <Mini k="PACE" v={fmtPace(r.pace)} />
        {showGap && <Mini k="GAP" v={fmtPace(gap(r))} c={C.cyan} />}
        {r.elev > 0 && <Mini k="▲" v={`${r.elev}m`} c={C.orange} />}
        {r.descent > 0 && <Mini k="▼" v={`${r.descent}m`} />}
        <Mini k="EFFORT" v={'●'.repeat(r.effort) + '○'.repeat(5 - r.effort)} />
      </div>

      {(r.shoes || r.fuel || (isTrail && r.condition)) && (
        <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
          {isTrail && !!r.condition && <span style={{ fontSize: 10, color: C.dim }}>⛅ {r.condition}</span>}
          {!!r.shoes && <span style={{ fontSize: 10, color: C.dim }}>👟 {r.shoes}</span>}
          {!!r.fuel && <span style={{ fontSize: 10, color: C.dim }}>🍌 {r.fuel}</span>}
        </div>
      )}

      {!!r.notes && (
        <div style={{ fontSize: 12, color: C.dim2, marginTop: 10, fontStyle: 'italic', lineHeight: '18px' }}>"{r.notes}"</div>
      )}

      {onDel && (
        <button
          onClick={onDel}
          style={{
            position: 'absolute', bottom: 14, right: 14,
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.dim, fontSize: 10, letterSpacing: 1, fontWeight: '600',
          }}
        >
          DELETE
        </button>
      )}
    </div>
  );
}
