import React from 'react';
import { ExternalLink, MessageSquare, ThumbsUp, Sparkles, Bookmark, Award } from 'lucide-react';

const getBadgeStyle = (source) => {
  const s = (source || '').toLowerCase();
  if (s.includes('reddit')) return 'badge-reddit';
  if (s.includes('hacker') || s.includes('hn')) return 'badge-hackernews';
  if (s.includes('poly')) return 'badge-polymarket';
  if (s.includes('git')) return 'badge-github';
  if (s.includes('you') || s.includes('yt')) return 'badge-youtube';
  return 'badge-default';
};

export default function SignalFeed({ items, loading, onOpenBriefing, onBookmark, bookmarkedIds }) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gap: '16px', padding: '20px 0' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card" style={{ padding: '20px', minHeight: '120px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '30%', height: '16px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}></div>
            <div style={{ width: '80%', height: '22px', background: 'rgba(255,255,255,0.09)', borderRadius: '4px' }}></div>
            <div style={{ width: '60%', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '48px 32px', textAlign: 'center', margin: '24px 0', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
        <Award size={48} color="var(--accent-purple)" style={{ marginBottom: '16px', opacity: 0.8 }} />
        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>No Active Signals Detected</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '460px', margin: '0 auto 20px', lineHeight: '1.5' }}>
          We couldn't capture any matching developer signals or metrics for your filter criteria. Try broadening your source search filter or selecting one of our high-volume channels.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {items.map((item, index) => {
        const isBookmarked = bookmarkedIds.includes(item.id);
        const badgeClass = getBadgeStyle(item.source);

        return (
          <article
            key={item.id || index}
            className="glass-card animate-fade-in"
            style={{
              padding: '20px',
              animationDelay: `${index * 0.05}s`
            }}
          >
            {/* Card Header Info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={`badge ${badgeClass}`}>
                  {item.source.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  By {item.author || item.source} • {item.published_at}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {item.relevance_score && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    {item.relevance_score}% Signal Match
                  </span>
                )}
                <button
                  onClick={() => onBookmark(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmarked ? 'var(--accent-amber)' : 'var(--text-dim)', transition: 'color 0.2s ease' }}
                  title="Bookmark signal"
                >
                  <Bookmark size={18} fill={isBookmarked ? 'var(--accent-amber)' : 'none'} />
                </button>
              </div>
            </div>

            {/* Title */}
            <h3 style={{ fontSize: '1.08rem', fontWeight: 700, lineHeight: '1.4', marginBottom: '10px' }}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-main)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-main)'}
              >
                {item.title}
              </a>
            </h3>

            {/* Summary / Excerpt */}
            {item.summary && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
                {item.summary}
              </p>
            )}

            {/* Top Comment quote callout if available */}
            {item.top_comment && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderLeft: '3px solid var(--accent-purple)', padding: '8px 12px', borderRadius: '0 8px 8px 0', fontSize: '0.8rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '14px' }}>
                "{item.top_comment}"
              </div>
            )}

            {/* Footer Stats & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {item.source === 'polymarket' ? (
                  <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Award size={15} /> Odds Score: {item.score}% YES
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ThumbsUp size={14} color="var(--primary)" /> {item.score ? item.score.toLocaleString() : '0'} upvotes
                  </span>
                )}

                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MessageSquare size={14} color="var(--accent-cyan)" /> {item.comments ? item.comments.toLocaleString() : '0'} comments
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  className="btn btn-glass"
                  style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                  onClick={() => onOpenBriefing(item)}
                >
                  <Sparkles size={14} color="var(--accent-purple)" /> AI Deep Dive
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glass"
                  style={{ padding: '5px 10px', fontSize: '0.78rem', textDecoration: 'none' }}
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

          </article>
        );
      })}
    </div>
  );
}
