import React from 'react';
import { Filter, Check } from 'lucide-react';

const SOURCES_LIST = [
  { id: 'all', label: 'All Sources', color: '#6366f1' },
  { id: 'reddit', label: 'Reddit', color: '#ff4500' },
  { id: 'hackernews', label: 'Hacker News', color: '#ff6600' },
  { id: 'polymarket', label: 'Polymarket Odds', color: '#10b981' },
  { id: 'github', label: 'GitHub', color: '#e6edf3' },
  { id: 'youtube', label: 'YouTube', color: '#ff4d4d' },
  { id: 'arxiv', label: 'arXiv Papers', color: '#a855f7' }
];

export default function SourceFilter({ selectedSource, onSelectSource }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, paddingRight: '8px' }}>
        <Filter size={15} /> Filter:
      </div>

      {SOURCES_LIST.map((src) => {
        const isActive = selectedSource === src.id;
        return (
          <button
            key={src.id}
            onClick={() => onSelectSource(src.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: isActive ? `1px solid ${src.color}` : '1px solid var(--border-color)',
              background: isActive ? `${src.color}22` : 'rgba(255, 255, 255, 0.04)',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            {isActive && <Check size={12} color={src.color} />}
            {src.label}
          </button>
        );
      })}
    </div>
  );
}
