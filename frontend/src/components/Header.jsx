import React, { useState } from 'react';
import { Search, Radio, Activity, Bookmark } from 'lucide-react';

export default function Header({ onSearch, currentQuery, onOpenWatchlist, activeTab, setActiveTab, apiMode = 'loading' }) {
  const [inputVal, setInputVal] = useState(currentQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  return (
    <header className="glass-panel" style={{ borderRadius: '0 0 20px 20px', padding: '16px 28px', position: 'sticky', top: 0, zIndex: 50, borderTop: 'none' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Activity size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="text-gradient">
                DevPulse
              </h1>
              {apiMode === 'loading' && (
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                  ⚪ Connecting...
                </span>
              )}
              {apiMode === 'fullstack' && (
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', fontSize: '0.65rem' }}>
                  <span className="pulse-dot"></span> FastAPI Core
                </span>
              )}
              {apiMode === 'serverless' && (
                <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', fontSize: '0.65rem' }}>
                  <span className="pulse-dot"></span> Live CORS
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Social-Scored News & Multi-Platform Intelligence
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: '280px', maxWidth: '520px', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search people, tools, topics (e.g. AI Agents, Polymarket, Kanye)..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 46px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ position: 'absolute', right: '4px', padding: '7px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Header Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className={`btn ${activeTab === 'feed' ? 'btn-primary' : 'btn-glass'}`}
            onClick={() => setActiveTab('feed')}
            style={{ fontSize: '0.85rem' }}
          >
            <Radio size={16} /> Signal Feed
          </button>
          <button 
            className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-glass'}`}
            onClick={() => setActiveTab('analytics')}
            style={{ fontSize: '0.85rem' }}
          >
            <Activity size={16} /> Analytics
          </button>
          <button 
            className="btn btn-glass"
            onClick={onOpenWatchlist}
            style={{ fontSize: '0.85rem' }}
          >
            <Bookmark size={16} color="var(--accent-cyan)" /> Watchlists
          </button>
        </div>

      </div>
    </header>
  );
}
