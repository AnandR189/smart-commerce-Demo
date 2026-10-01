// Lightweight SVG sparkline — no external dep needed
export default function Sparkline({ data = [], width = 120, height = 40, color = '#6366f1' }) {
  if (!data || data.length < 2) return null;

  const prices = data.map(d => (typeof d === 'object' ? d.price : d));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const pts = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const pathD = `M ${pts.join(' L ')}`;
  // Area fill
  const areaD = `M ${pts[0]} L ${pts.join(' L ')} L ${width},${height} L 0,${height} Z`;

  // Current vs lowest
  const current = prices[prices.length - 1];
  const lowest = Math.min(...prices);
  const isAtLow = current === lowest;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Area */}
        <path d={areaD} fill={`url(#sg-${color.replace('#','')})`} />
        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* Current dot */}
        <circle cx={width} cy={height - ((current - min) / range) * (height - 4) - 2} r="3" fill={color} />
      </svg>
      {isAtLow && (
        <span style={{ position: 'absolute', top: -8, right: 0, fontSize: 9, fontWeight: 700, background: 'rgba(16,185,129,0.12)', color: '#10b981', padding: '1px 5px', borderRadius: 100, border: '1px solid rgba(16,185,129,0.25)', whiteSpace: 'nowrap' }}>
          30D Low
        </span>
      )}
    </div>
  );
}
