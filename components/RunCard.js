'use client';
import { C, MONO } from '../lib/theme';
import { fmtClock, fmtPace, gap } from '../lib/calc';
import { Mini } from './ui';

export default function RunCard({ r, onDel }) {
  const d = new Date(r.date);
  const showGap = r.terrain === 'Trail' && r.elev > 0;
  const dateStr = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div style={{
      backgroundColor: C.panel, border: `1px solid ${C.line}`,
      borderLeft: `3px solid ${C.acid}`, borderRadius: 12,
      padding: 14, marginBottom: 10, position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 10, letterSpacing: 1, color: C.dim, textTransform: 'uppercase', flex: 1 }}>
          {dateStr}{r.route ? ` · ${r.route}` : ''}
        </div>
        <div style={{
          padding: '3px 8px', borderRadius: 10, flexShrink: 0, marginLeft: 8,
          border: `1px solid ${r.terrain === 'Trail' ? '#7a4326' : C.lineBright}`,
          backgroundColor: 'rgba(196,255,61,0.1)',
        }}>
          <span style={{ fontSize: 9, letterSpacing: 1, color: r.terrain === 'Trail' ? C.orange : C.acid }}>
            {r.type} · {r.terrain}
          </span>
        </div>
      </div>

      <div style={{ fontFamily: MONO, fontWeight: '700', fontSize: 30, marginTop: 6, color: C.txt }}>
        {r.distKm.toFixed(2)}<span style={{ fontSize: 13, color: C.dim }}> km</span>
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
        <Mini k="TIME" v={fmtClock(r.durSec)} />
        <Mini k="PACE" v={fmtPace(r.pace)} />
        {showGap && <Mini k="GAP" v={fmtPace(gap(r))} c={C.cyan} />}
        {r.elev > 0 && <Mini k="▲" v={`${r.elev}m`} c={C.orange} />}
        {r.descent > 0 && <Mini k="▼" v={`${r.descent}m`} />}
        <Mini k="EFFORT" v={'●'.repeat(r.effort) + '○'.repeat(5 - r.effort)} />
      </div>

      {(r.shoes || r.fuel || (r.terrain === 'Trail' && r.condition)) && (
        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          {r.terrain === 'Trail' && !!r.condition && <span style={{ fontSize: 10, color: C.dim }}>⛅ {r.condition}</span>}
          {!!r.shoes && <span style={{ fontSize: 10, color: C.dim }}>👟 {r.shoes}</span>}
          {!!r.fuel && <span style={{ fontSize: 10, color: C.dim }}>🍌 {r.fuel}</span>}
        </div>
      )}

      {!!r.notes && (
        <div style={{ fontSize: 12, color: C.dim2, marginTop: 8, fontStyle: 'italic' }}>"{r.notes}"</div>
      )}

      {onDel && (
        <button
          onClick={onDel}
          style={{
            position: 'absolute', bottom: 12, right: 12,
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.dim, fontSize: 10, letterSpacing: 1,
          }}
        >
          DELETE
        </button>
      )}
    </div>
  );
}
