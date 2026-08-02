import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Headphones } from 'lucide-react';

export default function AudioBriefing({ activeTopic, briefingSummary }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);

  // Sync tick counter for sine-wave animation when playing
  useEffect(() => {
    let animInterval;
    if (isPlaying) {
      animInterval = setInterval(() => {
        setTick((t) => t + 1);
      }, 100);
    } else {
      setTick(0);
    }
    return () => clearInterval(animInterval);
  }, [isPlaying]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      // Initialize speech synthesis narration
      window.speechSynthesis.cancel();
      const narrationText = `Pulse 30 executive briefing for ${activeTopic}. ${briefingSummary || "Preparing community intelligence feeds."}`;
      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.rate = 1.05; // Slightly faster for dynamic feel
      
      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };
      
      window.speechSynthesis.speak(utterance);

      // Waveform / progress bar simulation (30s duration)
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            window.speechSynthesis.cancel();
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    } else {
      window.speechSynthesis.cancel();
    }

    return () => {
      clearInterval(interval);
      window.speechSynthesis.cancel();
    };
  }, [isPlaying, activeTopic, briefingSummary]);

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Left: Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
              transition: 'transform 0.2s ease'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Headphones size={15} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Audio Briefing Narrator
              </span>
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              30-Second Summary: {activeTopic}
            </h4>
          </div>
        </div>

        {/* Animated Waveform & Progress Bar */}
        <div style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '24px', marginBottom: '6px' }}>
            {Array.from({ length: 24 }).map((_, i) => {
              let pctHeight = 15;
              if (isPlaying) {
                // Rolling dual sine wave equations
                pctHeight = 45 + Math.sin(i * 0.6 + tick * 0.45) * 30 + Math.cos(i * 0.3 - tick * 0.25) * 20;
                pctHeight = Math.max(12, Math.min(100, pctHeight));
              } else {
                // Low-intensity idle wave
                pctHeight = 15 + Math.sin(i * 0.4) * 4;
              }
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${pctHeight}%`,
                    background: isPlaying ? 'linear-gradient(to top, var(--primary), var(--accent-cyan))' : 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '2px',
                    transition: 'height 0.1s linear, background 0.2s ease'
                  }}
                />
              );
            })}
          </div>

          <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent-purple))', transition: 'width 0.3s linear' }} />
          </div>
        </div>

        {/* Right Stats */}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Volume2 size={16} />
          <span>{isPlaying ? '0:14 / 0:30' : '0:00 / 0:30'}</span>
        </div>

      </div>
    </div>
  );
}
