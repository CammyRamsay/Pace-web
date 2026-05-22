'use client';
import { C, MONO } from '../lib/theme';

export const Card = ({ children, style }) => (
  <div style={{
    backgroundColor: C.panel,
    border: `1px solid ${C.line}`,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    ...style,
  }}>
    {children}
  </div>
);

export const H = ({ title, sub, right }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 24, fontWeight: '800', letterSpacing: 0.5, color: C.txt }}>{title}</div>
      {!!sub && <div style={{ fontSize: 11, color: C.dim, marginTop: 3, letterSpacing: 0.3 }}>{sub}</div>}
    </div>
    {right}
  </div>
);

export const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.dim, marginBottom: 7, fontWeight: '600' }}>{label}</div>
    {children}
  </div>
);

const inputBase = {
  backgroundColor: C.bg,
  border: `1.5px solid ${C.lineBright}`,
  borderRadius: 12,
  color: C.txt,
  padding: '13px 14px',
  fontFamily: MONO,
  fontSize: 15,
  width: '100%',
  outline: 'none',
  display: 'block',
};

export const Input = ({ multiline, style, ...props }) => {
  if (multiline) {
    return (
      <textarea
        {...props}
        style={{ ...inputBase, resize: 'none', height: 60, verticalAlign: 'top', ...style }}
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
            padding: '9px 14px',
            borderRadius: 10,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            border: `1.5px solid ${active ? C.acid : C.lineBright}`,
            backgroundColor: active ? C.acidGlow : 'transparent',
            color: active ? C.acid : C.dim2,
            fontWeight: active ? '700' : '400',
            fontSize: 12,
            cursor: 'pointer',
            letterSpacing: 0.3,
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
  if (variant === 'ghost') { bg = 'transparent'; color = C.acid; border = `1.5px solid ${C.lineBright}`; }
  if (variant === 'ok') { bg = C.green; color = '#000'; }
  if (variant === 'err') { bg = C.red; color = '#fff'; }
  return (
    <button
      onClick={onPress}
      style={{
        padding: '16px 0',
        borderRadius: 16,
        backgroundColor: bg,
        color,
        fontWeight: '800',
        fontSize: 14,
        letterSpacing: 3,
        width: '100%',
        border,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
};

export const Mini = ({ k, v, c }) => (
  <div>
    <div style={{ fontSize: 9, letterSpacing: 1, color: C.dim, marginBottom: 2, fontWeight: '600' }}>{k}</div>
    <div style={{ fontFamily: MONO, fontWeight: '700', fontSize: 13, color: c || C.txt }}>{v}</div>
  </div>
);

export const Stat = ({ n, l, c, big }) => (
  <div>
    <div style={{ fontFamily: MONO, fontWeight: '700', fontSize: big ? 26 : 18, color: c || C.txt, lineHeight: 1.1 }}>{n}</div>
    <div style={{ fontSize: 9, letterSpacing: 1, color: C.dim, marginTop: 4, fontWeight: '600' }}>{l}</div>
  </div>
);

export const Empty = ({ msg }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 30px' }}>
    <div style={{ fontSize: 40, opacity: 0.3, marginBottom: 14, color: C.dim }}>◎</div>
    <div style={{ fontSize: 13, lineHeight: '22px', color: C.dim, textAlign: 'center' }}>{msg}</div>
  </div>
);

export const Bar = ({ pct, color, targetPct }) => (
  <div style={{
    height: 8,
    backgroundColor: C.bg,
    borderRadius: 4,
    border: `1px solid ${C.line}`,
    overflow: 'hidden',
    position: 'relative',
  }}>
    <div style={{
      height: '100%',
      width: `${Math.min(100, pct)}%`,
      backgroundColor: color || C.blue,
      borderRadius: 4,
      transition: 'width 0.4s ease',
    }} />
    {targetPct != null && (
      <div style={{
        position: 'absolute', top: -2, bottom: -2,
        left: `${Math.min(100, targetPct)}%`,
        width: 2, backgroundColor: C.orange,
      }} />
    )}
  </div>
);

export const Spinner = () => (
  <div style={{
    width: 36, height: 36, borderRadius: '50%',
    border: `2.5px solid ${C.line}`,
    borderTopColor: C.acid,
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto',
  }} />
);
