import React, { useState } from 'react';
import { X, Bookmark, Plus, TrendingUp, Trash2 } from 'lucide-react';

export default function Watchlist({ isOpen, onClose, watchlists, onAddTopic, onDeleteTopic, onSelectTopic }) {
  const [newTopic, setNewTopic] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTopic.trim()) {
      onAddTopic(newTopic.trim());
      setNewTopic('');
    }
  };

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
        maxWidth: '540px',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '24px',
        position: 'relative'
      }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Bookmark size={22} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            Saved Topic Watchlists
          </h2>
        </div>

        {/* Add Topic Input */}
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Add new watchlist topic (e.g. OpenAI, Nvidia)..."
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'white',
              fontSize: '0.88rem'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>
            <Plus size={16} /> Add
          </button>
        </form>

        {/* Watchlist Items */}
        <div style={{ display: 'grid', gap: '10px' }}>
          {watchlists.map((item, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div 
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  onSelectTopic(item.name);
                  onClose();
                }}
              >
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <TrendingUp size={12} /> {item.delta || '+24% upvotes this week'}
                </div>
              </div>

              <button
                onClick={() => onDeleteTopic(item.name)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '6px' }}
                title="Delete watchlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
