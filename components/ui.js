'use client';
import { C, MONO } from '../lib/theme';

export const Card = ({ children, style }) => (
  <div style={{
    backgroundColor: C.panel, border: `1px solid ${C.line}`,
    borderRadius: 14, padding: 16, marginBottom: 12, ...style,
  }}>
    {children}
  </div>
);

export const H = ({ title, sub, right }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 22, fontWeight: '700', letterSpacing: 1, color: C.txt }}>{title}</div>
      {!!sub && <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{sub}</div>}
    </div>
    {right}
  </div>
);

export const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.dim, marginBottom: 6 }}>{label}</div>
    {children}
  </div>
);

const inputBase = {
  backgroundColor: C.bg, border: `1px solid ${C.lineBright}`, borderRadius: 8,
  color: C.txt, padding: '11px 12px', fontFamily: MONO, fontSize: 15,
  width: '100%', outline: 'none', display: 'block',
};

export const Input = ({ multiline, style, ...props }) => {
  if (multiline) {
    return (
      <textarea
        {...props}
        style={{ ...inputBase, resize: 'none', height: 56, verticalAlign: 'top', ...style }}
      />
    );
  }
  return <input {...props} style={{ ...inputBase, ...style }} />;
};

export const Segmented = ({ opts, val, on }) => (
  <div style={{ display: 'flex', flexDirection: 'row', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
    {opts.map((o) => {
      const active = val === o;
      return (
        <button
          key={o}
          onClick={() => on(o)}
          style={{
            padding: '8px 13px', borderRadius: 8, flexShrink: 0, whiteSpace: 'nowrap',
            border: `1px solid ${active ? C.acid : C.lineBright}`,
            backgroundColor: active ? C.acid : C.bg,
            color: active ? C.bg : C.dim2, fontWeight: active ? '700' : '400',
            fontSize: 12, cursor: 'pointer',
          }}
        >
          {o}
        </button>
      );
    })}
  </div>
);

export const Btn = ({ label, onPress, variant }) => {
  let bg = C.acid, color = C.bg, border = 'none';
  if (variant === 'ghost') { bg = C.line; color = C.acid; }
  if (variant === 'ok') { bg = C.green; }
  if (variant === 'err') { bg = C.red; color = '#fff'; }
  return (
    <button
      onClick={onPress}
      style={{
        padding: '15px 0', borderRadius: 12, backgroundColor: bg, color,
        fontWeight: '700', fontSize: 15, letterSpacing: 2, width: '100%',
        border, cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
};

export const Mini = ({ k, v, c }) => (
  <div>
    <div style={{ fontSize: 9, letterSpacing: 1, color: C.dim }}>{k}</div>
    <div style={{ fontFamily: MONO, fontWeight: '700', fontSize: 13, color: c || C.txt }}>{v}</div>
  </div>
);

export const Stat = ({ n, l, c, big }) => (
  <div>
    <div style={{ fontFamily: MONO, fontWeight: '700', fontSize: big ? 24 : 18, color: c || C.txt }}>{n}</div>
    <div style={{ fontSize: 9, letterSpacing: 1, color: C.dim, marginTop: 2 }}>{l}</div>
  </div>
);

export const Empty = ({ msg }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 30px' }}>
    <div style={{ fontSize: 36, opacity: 0.4, marginBottom: 12, color: C.dim }}>◎</div>
    <div style={{ fontSize: 13, lineHeight: '20px', color: C.dim, textAlign: 'center' }}>{msg}</div>
  </div>
);

export const Bar = ({ pct, color, targetPct }) => (
  <div style={{
    height: 10, backgroundColor: C.bg, borderRadius: 5,
    border: `1px solid ${C.line}`, overflow: 'hidden', position: 'relative',
  }}>
    <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, backgroundColor: color || C.blue, borderRadius: 5 }} />
    {targetPct != null && (
      <div style={{
        position: 'absolute', top: -2, bottom: -2,
        left: `${Math.min(100, targetPct)}%`, width: 2, backgroundColor: C.orange,
      }} />
    )}
  </div>
);

export const Spinner = () => (
  <div style={{
    width: 40, height: 40, borderRadius: '50%',
    border: `3px solid ${C.line}`, borderTopColor: C.acid,
    animation: 'spin 1s linear infinite', margin: '0 auto',
  }} />
);
