import React from 'react';
import { Flame, TrendingUp, Bot, Code, Globe, Sparkles } from 'lucide-react';

const iconMap = {
  bot: Bot,
  code: Code,
  'trending-up': TrendingUp,
  globe: Globe
};

export default function TopicDiscovery({ topics, activeTopic, onSelectTopic }) {
  return (
    <section style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame size={20} color="var(--accent-amber)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            30-Day Trending Topics
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• Scored by community velocity</span>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '14px' 
      }}>
        {topics.map((item) => {
          const IconComp = iconMap[item.icon] || Sparkles;
          const isSelected = activeTopic.toLowerCase() === item.title.toLowerCase() || activeTopic.toLowerCase() === item.id;
          
          return (
            <div
              key={item.id}
              onClick={() => onSelectTopic(item.title)}
              className="glass-card"
              style={{
                padding: '16px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.25)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.06)', color: 'var(--accent-cyan)', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <IconComp size={12} />
                  {item.category}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={12} /> {item.momentum}
                </span>
              </div>

              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span>{item.volume}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Explore Signals &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
