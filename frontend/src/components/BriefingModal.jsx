import React from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

export default function BriefingModal({ briefing, onClose }) {
  if (!briefing) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        boxShadow: '0 0 40px rgba(168, 85, 247, 0.2)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: 'var(--text-main)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            padding: '8px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <Sparkles size={22} color="var(--accent-purple)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              AI Executive Briefing: <span className="text-gradient">{briefing.query || 'Topic Overview'}</span>
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Synthesized from multi-platform upvotes, betting odds, and discussions
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={16} /> Executive Summary
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
            {briefing.summary}
          </p>
        </div>

        {/* Key Takeaways */}
        {briefing.key_takeaways && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} color="var(--accent-green)" /> Key Signals & Community Consensus
            </h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {briefing.key_takeaways.map((point, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(16, 185, 129, 0.05)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-green)' }}>
                  <CheckCircle2 size={16} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Card Focus if modal was opened for a single item */}
        {briefing.item && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Focused Signal Source</h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>{briefing.item.title}</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>{briefing.item.summary}</p>
              <a href={briefing.item.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'inline-flex' }}>
                Open Original Source &rarr;
              </a>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn btn-glass" onClick={onClose}>Close Briefing</button>
        </div>
      </div>
    </div>
  );
}
