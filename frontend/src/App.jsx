import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TopicDiscovery from './components/TopicDiscovery';
import SourceFilter from './components/SourceFilter';
import SignalFeed from './components/SignalFeed';
import BriefingModal from './components/BriefingModal';
import AudioBriefing from './components/AudioBriefing';
import AnalyticsChart from './components/AnalyticsChart';
import Watchlist from './components/Watchlist';
import { fetchTrendingTopics, searchNews } from './services/api';
import { Sparkles, Compass } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState('AI agents');
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [feedData, setFeedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState('all');
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedBriefing, setSelectedBriefing] = useState(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [apiMode, setApiMode] = useState('loading');
  const [showGuide, setShowGuide] = useState(() => {
    try {
      const saved = localStorage.getItem('devpulse_show_guide');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  const handleDismissGuide = () => {
    setShowGuide(false);
    localStorage.setItem('devpulse_show_guide', 'false');
  };

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('devpulse_bookmarkedIds');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [watchlists, setWatchlists] = useState(() => {
    try {
      const saved = localStorage.getItem('devpulse_watchlists');
      return saved ? JSON.parse(saved) : [
        { name: 'AI Agents', delta: '+184% velocity' },
        { name: 'Open Source LLMs', delta: '+128% velocity' },
        { name: 'Polymarket Tech Odds', delta: '+95% velocity' }
      ];
    } catch {
      return [
        { name: 'AI Agents', delta: '+184% velocity' },
        { name: 'Open Source LLMs', delta: '+128% velocity' },
        { name: 'Polymarket Tech Odds', delta: '+95% velocity' }
      ];
    }
  });

  // Persist bookmarks and watchlists
  useEffect(() => {
    localStorage.setItem('devpulse_bookmarkedIds', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('devpulse_watchlists', JSON.stringify(watchlists));
  }, [watchlists]);

  // Initial load
  useEffect(() => {
    async function init() {
      // Check for live Python backend connectivity
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${baseUrl}/health`);
        if (res.ok) {
          setApiMode('fullstack');
        } else {
          setApiMode('serverless');
        }
      } catch {
        setApiMode('serverless');
      }

      const topics = await fetchTrendingTopics();
      setTrendingTopics(topics);
      await handleSearch('AI agents');
    }
    init();
  }, []);

  const handleSearch = async (targetQuery) => {
    setLoading(true);
    setQuery(targetQuery);
    const data = await searchNews(targetQuery);
    setFeedData(data);
    setLoading(false);
  };

  const handleSelectSource = (srcId) => {
    setSelectedSource(srcId);
  };

  const handleBookmark = (id) => {
    setBookmarkedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddWatchlist = (name) => {
    if (!watchlists.some((w) => w.name.toLowerCase() === name.toLowerCase())) {
      setWatchlists([...watchlists, { name, delta: '+10% velocity' }]);
    }
  };

  const handleDeleteWatchlist = (name) => {
    setWatchlists(watchlists.filter((w) => w.name !== name));
  };

  // Filter items by source
  const rawResults = feedData?.results || [];
  const filteredResults = selectedSource === 'all'
    ? rawResults
    : rawResults.filter((item) => {
        const s = (item.source || '').toLowerCase();
        if (selectedSource === 'reddit') return s.includes('reddit');
        if (selectedSource === 'hackernews') return s.includes('hacker') || s.includes('hn');
        if (selectedSource === 'polymarket') return s.includes('poly');
        if (selectedSource === 'github') return s.includes('git');
        if (selectedSource === 'youtube') return s.includes('you') || s.includes('yt');
        if (selectedSource === 'arxiv') return s.includes('arxiv');
        return true;
      });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar Header */}
      <Header
        onSearch={handleSearch}
        currentQuery={query}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiMode={apiMode}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '24px 20px' }}>
        
        {/* Topic Discovery Carousel / Cards */}
        <TopicDiscovery
          topics={trendingTopics}
          activeTopic={query}
          onSelectTopic={handleSearch}
        />

        {showGuide && (
          <div className="glass-panel animate-fade-in" style={{ padding: '20px 24px', marginBottom: '24px', position: 'relative', border: '1px solid rgba(99, 102, 241, 0.25)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)' }}>
            <button 
              onClick={handleDismissGuide}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              title="Close guide"
            >
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>&times;</span>
            </button>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <Sparkles size={20} />
              </div>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Welcome to DevPulse! 🚀
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '12px' }}>
                  DevPulse aggregates real-time metrics, search signals, and prediction odds across Hacker News, GitHub, Reddit, Polymarket, and YouTube.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--accent-cyan)' }}>🔍</span>
                    <span><strong>Factual search:</strong> Type any query to get Wikipedia summaries and Google News RSS real-time feeds.</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--accent-purple)' }}>🔊</span>
                    <span><strong>Audio Briefing:</strong> Click the briefing player below to hear high-fidelity synthesized audio summaries.</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--accent-amber)' }}>📊</span>
                    <span><strong>Rich Analytics:</strong> Switch tabs to see momentum charts, platforms, and deduplicated signals.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audio Briefing Simulator Bar */}
        <AudioBriefing
          activeTopic={query}
          briefingSummary={feedData?.summary}
        />

        {/* View Switcher Tabs (Feed vs Analytics) */}
        {activeTab === 'feed' ? (
          <div>
            {/* Feed Controls Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  Multi-Source Intelligence Feed: <span className="text-gradient">"{query}"</span>
                </h2>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setSelectedBriefing({ query, summary: feedData?.summary, key_takeaways: feedData?.key_takeaways })}
                style={{ fontSize: '0.85rem' }}
              >
                <Sparkles size={16} /> View AI Briefing
              </button>
            </div>

            {/* Source Pill Filter */}
            <SourceFilter
              selectedSource={selectedSource}
              onSelectSource={handleSelectSource}
            />

            {/* Scored Signal Cards List */}
            <SignalFeed
              items={filteredResults}
              loading={loading}
              onOpenBriefing={(item) => setSelectedBriefing({ query: item.title, summary: item.summary, item, key_takeaways: feedData?.key_takeaways })}
              onBookmark={handleBookmark}
              bookmarkedIds={bookmarkedIds}
            />
          </div>
        ) : (
          <AnalyticsChart items={rawResults} />
        )}

      </main>

      {/* Footer */}
      <footer className="glass-panel" style={{ borderRadius: 0, padding: '20px', textAlign: 'center', marginTop: '40px', borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          DevPulse News & Intelligence • Powered by <code style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>devpulse</code> engine
        </p>
      </footer>

      {/* Modals */}
      <BriefingModal
        briefing={selectedBriefing}
        onClose={() => setSelectedBriefing(null)}
      />

      <Watchlist
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlists={watchlists}
        onAddTopic={handleAddWatchlist}
        onDeleteTopic={handleDeleteWatchlist}
        onSelectTopic={handleSearch}
      />

    </div>
  );
}
