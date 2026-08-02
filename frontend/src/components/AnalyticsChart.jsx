import React, { useState } from 'react';
import { BarChart2, Activity, Info, PieChart } from 'lucide-react';

export default function AnalyticsChart({ items }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredDonut, setHoveredDonut] = useState(null);

  // Compute platform distribution
  const counts = {
    reddit: 0,
    hackernews: 0,
    polymarket: 0,
    github: 0,
    youtube: 0,
    other: 0
  };

  const categories = {};
  let totalEngagement = 0;

  items.forEach((item) => {
    const s = (item.source || '').toLowerCase();
    if (s.includes('reddit')) counts.reddit++;
    else if (s.includes('hacker') || s.includes('hn')) counts.hackernews++;
    else if (s.includes('poly')) counts.polymarket++;
    else if (s.includes('git')) counts.github++;
    else if (s.includes('you') || s.includes('yt')) counts.youtube++;
    else counts.other++;

    // Map source categories dynamically
    let clusterCat = "General Signals";
    if (s.includes('git')) clusterCat = "Developer / Open Weights";
    else if (s.includes('poly')) clusterCat = "Markets & Macro Odds";
    else if (s.includes('reddit') || s.includes('you') || s.includes('yt')) clusterCat = "Social Sentiment";
    else if (s.includes('hacker') || s.includes('hn')) clusterCat = "Tech Discussion";
    categories[clusterCat] = (categories[clusterCat] || 0) + 1;

    totalEngagement += (item.score || 0) + (item.comments || 0);
  });

  const totalItems = items.length || 1;

  const platforms = [
    { name: 'Reddit', count: counts.reddit, color: '#ff4500' },
    { name: 'Hacker News', count: counts.hackernews, color: '#ff6600' },
    { name: 'Polymarket', count: counts.polymarket, color: '#10b981' },
    { name: 'GitHub', count: counts.github, color: '#e6edf3' },
    { name: 'YouTube', count: counts.youtube, color: '#ff4d4d' }
  ];

  const catColors = {
    "Developer / Open Weights": "#a855f7", // Purple
    "Markets & Macro Odds": "#10b981",    // Green
    "Social Sentiment": "#ff4500",        // Reddit Orange
    "Tech Discussion": "#06b6d4",        // Cyan
    "General Signals": "#6b7280"          // Gray
  };

  const categoriesArray = Object.keys(categories).map(name => ({
    name,
    count: categories[name],
    color: catColors[name] || "#6366f1"
  }));

  // SVG Bar Chart Dimensions
  const svgWidth = 500;
  const svgHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxCount = Math.max(...platforms.map((p) => p.count), 1);
  const gridLines = [0, Math.round(maxCount / 2), maxCount];

  // SVG Donut Chart Math
  const donutSize = 120;
  const r = 25; // Radius
  const cx = 60; // Center X
  const cy = 60; // Center Y
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * r; // ~157.08

  let accumulatedAngle = -90; // Start at 12 o'clock

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={20} color="var(--accent-purple)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Signal Intelligence Analytics
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Info size={14} /> Hover chart segments for details
        </div>
      </div>

      {/* Grid Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Signals Captured</span>
          <h4 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px', color: 'var(--primary)' }}>
            {items.length}
          </h4>
        </div>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aggregate Upvote Volume</span>
          <h4 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px', color: 'var(--accent-cyan)' }}>
            {totalEngagement.toLocaleString()}
          </h4>
        </div>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-Signal Threshold</span>
          <h4 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px', color: 'var(--accent-green)' }}>
            94.2%
          </h4>
        </div>
      </div>

      {/* Stacked Segment Bar */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-muted)' }}>
          Platform Distribution Spectrum
        </h4>
        <div style={{ 
          height: '20px', 
          display: 'flex', 
          borderRadius: '6px', 
          overflow: 'hidden', 
          background: 'rgba(255, 255, 255, 0.05)', 
          border: '1px solid rgba(255, 255, 255, 0.08)' 
        }}>
          {platforms.map((p) => {
            const pct = (p.count / totalItems) * 100;
            if (p.count === 0) return null;
            return (
              <div 
                key={p.name}
                title={`${p.name}: ${p.count} signals (${Math.round(pct)}%)`}
                style={{ 
                  width: `${pct}%`, 
                  height: '100%', 
                  background: p.color,
                  transition: 'all 0.25s ease',
                  opacity: 0.85,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = 1;
                  e.currentTarget.style.transform = 'scaleY(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = 0.85;
                  e.currentTarget.style.transform = 'scaleY(1)';
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Charts Split Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
        
        {/* Left: Custom SVG Bar Chart */}
        <div style={{ position: 'relative', width: '100%', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} color="var(--primary)" /> Source Platform Breakdown
          </h4>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="auto" style={{ overflow: 'visible' }}>
            
            {/* Grid Lines */}
            {gridLines.map((val, idx) => {
              const y = paddingTop + chartHeight - (val / maxCount) * chartHeight;
              return (
                <g key={idx}>
                  <line 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={svgWidth - paddingRight} 
                    y2={y} 
                    stroke="rgba(255, 255, 255, 0.06)" 
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x={paddingLeft - 10} 
                    y={y + 4} 
                    fill="var(--text-dim)" 
                    fontSize="9px" 
                    textAnchor="end"
                    fontFamily="var(--font-sans)"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Custom Bar Segments */}
            {platforms.map((p, idx) => {
              const barWidth = 28;
              const barSpacing = chartWidth / platforms.length;
              const x = paddingLeft + idx * barSpacing + (barSpacing - barWidth) / 2;
              
              const barHeight = (p.count / maxCount) * chartHeight;
              const y = paddingTop + chartHeight - barHeight;

              return (
                <g key={p.name}>
                  {/* Hover detector rect */}
                  <rect 
                    x={x - 6} 
                    y={paddingTop} 
                    width={barWidth + 12} 
                    height={chartHeight} 
                    fill="transparent" 
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => {
                      setHoveredBar({
                        name: p.name,
                        count: p.count,
                        color: p.color,
                        x: x + barWidth / 2,
                        y: y - 10
                      });
                    }}
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                  {/* Actual Chart Bar */}
                  <rect 
                    x={x} 
                    y={y} 
                    width={barWidth} 
                    height={Math.max(barHeight, 2)} 
                    fill={p.color} 
                    rx={3}
                    style={{ 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                      opacity: hoveredBar && hoveredBar.name === p.name ? 1 : 0.8 
                    }}
                  />
                  {/* X Axis Labels */}
                  <text 
                    x={x + barWidth / 2} 
                    y={svgHeight - 4} 
                    fill="var(--text-muted)" 
                    fontSize="9px" 
                    textAnchor="middle"
                    fontFamily="var(--font-sans)"
                    fontWeight="600"
                  >
                    {p.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* Bottom Base Line */}
            <line 
              x1={paddingLeft} 
              y1={paddingTop + chartHeight} 
              x2={svgWidth - paddingRight} 
              y2={paddingTop + chartHeight} 
              stroke="rgba(255, 255, 255, 0.15)" 
            />
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredBar && (
            <div style={{
              position: 'absolute',
              left: `${(hoveredBar.x / svgWidth) * 100}%`,
              top: `${(hoveredBar.y / svgHeight) * 100}%`,
              transform: 'translate(-50%, -110%)',
              background: 'rgba(9, 13, 22, 0.95)',
              border: `1px solid ${hoveredBar.color}`,
              boxShadow: `0 0 15px ${hoveredBar.color}44`,
              padding: '6px 10px',
              borderRadius: '4px',
              pointerEvents: 'none',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{hoveredBar.name}</span>
              <span style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 800, marginTop: '2px' }}>{hoveredBar.count} signals</span>
            </div>
          )}
        </div>

        {/* Right: Custom SVG Donut Chart */}
        <div style={{ position: 'relative', width: '100%', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PieChart size={14} color="var(--accent-purple)" /> Dynamic Topic Distribution
          </h4>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: `${donutSize}px`, height: `${donutSize}px` }}>
              <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`} style={{ overflow: 'visible' }}>
                {categoriesArray.map((cat) => {
                  const fraction = cat.count / totalItems;
                  const angle = fraction * 360;
                  const strokeDash = fraction * circumference;
                  const rotation = accumulatedAngle;
                  accumulatedAngle += angle;

                  const isHovered = hoveredDonut && hoveredDonut.name === cat.name;

                  return (
                    <circle
                      key={cat.name}
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill="transparent"
                      stroke={cat.color}
                      strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                      strokeDasharray={`${strokeDash} ${circumference}`}
                      strokeDashoffset={0}
                      transform={`rotate(${rotation} ${cx} ${cy})`}
                      style={{
                        cursor: 'pointer',
                        transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                        opacity: isHovered ? 1 : 0.8
                      }}
                      onMouseEnter={() => {
                        setHoveredDonut({
                          name: cat.name,
                          count: cat.count,
                          pct: Math.round(fraction * 100),
                          color: cat.color
                        });
                      }}
                      onMouseLeave={() => setHoveredDonut(null)}
                    />
                  );
                })}
              </svg>

              {/* Donut Center Count text */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Topics</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '-2px' }}>
                  {categoriesArray.length}
                </div>
              </div>
            </div>

            {/* Donut Chart Legend list */}
            <div style={{ flex: 1, minWidth: '160px', display: 'grid', gap: '8px' }}>
              {categoriesArray.map((cat) => {
                const isHovered = hoveredDonut && hoveredDonut.name === cat.name;
                const pct = Math.round((cat.count / totalItems) * 100);
                return (
                  <div 
                    key={cat.name} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      opacity: hoveredDonut && !isHovered ? 0.4 : 1,
                      transition: 'opacity 0.2s ease',
                      fontWeight: isHovered ? 700 : 500
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: cat.color }} />
                      <span style={{ color: 'var(--text-muted)' }}>{cat.name}</span>
                    </div>
                    <span style={{ color: cat.color }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Donut Tooltip */}
          {hoveredDonut && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(9, 13, 22, 0.95)',
              border: `1px solid ${hoveredDonut.color}`,
              boxShadow: `0 0 15px ${hoveredDonut.color}44`,
              padding: '6px 10px',
              borderRadius: '4px',
              pointerEvents: 'none',
              zIndex: 10,
              textAlign: 'center',
              width: '85%'
            }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>{hoveredDonut.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 800, marginTop: '2px' }}>
                {hoveredDonut.count} stories ({hoveredDonut.pct}%)
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
