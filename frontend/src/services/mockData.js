export const FALLBACK_TOPICS = [
  {
    id: "ai-agents",
    title: "AI Agents & Autonomous Systems",
    category: "AI & Tech",
    momentum: "+184%",
    volume: "14.2K signals",
    description: "Multi-agent frameworks, task execution, and autonomous software engineers.",
    icon: "Bot"
  },
  {
    id: "open-models",
    title: "Open Source LLMs & Fine-Tuning",
    category: "Developer",
    momentum: "+128%",
    volume: "9.8K signals",
    description: "Local model runtimes, quantized weights, and agentic code generators.",
    icon: "Code"
  },
  {
    id: "prediction-markets",
    title: "Polymarket & Macro Odds",
    category: "Markets",
    momentum: "+95%",
    volume: "22.5K signals",
    description: "Real-money betting odds on tech releases, elections, and global events.",
    icon: "TrendingUp"
  },
  {
    id: "tech-policy",
    title: "AI Policy & Infrastructure",
    category: "World",
    momentum: "+72%",
    volume: "8.1K signals",
    description: "Data privacy gateways, compute restrictions, and enterprise deployments.",
    icon: "Globe"
  }
];

export const MOCK_FEED_DATA = {
  "ai agents": {
    query: "AI agents",
    summary: "Multi-agent execution frameworks and autonomous developer tools dominate current community discussions. Scored social signals reveal a heavy shift from single-prompt chat UIs to autonomous multi-step execution loops with cryptographic runtime logging.",
    key_takeaways: [
      "Open-source projects like Halo and Noisegate are establishing privacy gateways and audit trails for untrusted agent runtimes.",
      "Reddit community discussions highlight agentic workflows outperforming traditional prompt engineering by over 80%.",
      "Polymarket odds place a 78% probability ($145K volume) on major tech firms shipping fully autonomous agent platforms before Q4 2026."
    ],
    results: [
      {
        id: "ai-1",
        source: "reddit",
        title: "Turns out Dead Internet Theory was right: AI agents are eating the Web, growing by nearly 8,000%",
        url: "https://www.reddit.com/r/technology/comments/1v5fxac/turns_out_dead_internet_theory_was_right_ai/",
        published_at: "2026-07-24",
        score: 16462,
        comments: 531,
        summary: "Exponential surge in autonomous web bots and AI agent crawlers rewiring modern search engine traffic and API monetization.",
        author: "u/tech_insider",
        relevance_score: 98,
        cluster: 1
      },
      {
        id: "ai-2",
        source: "hackernews",
        title: "Show HN: Noisegate – a differential-privacy gateway for untrusted AI agents",
        url: "https://github.com/yashmahajan10/llm-differential-privacy-gateway",
        published_at: "2026-07-30",
        score: 142,
        comments: 38,
        summary: "Differential privacy firewall preventing agentic workflows from accidentally leaking private customer tokens or API credentials.",
        author: "yashmahajan",
        relevance_score: 94,
        cluster: 1
      },
      {
        id: "ai-3",
        source: "polymarket",
        title: "Will major tech firm deploy fully autonomous code-generating agents by Q4 2026?",
        url: "https://polymarket.com/event/ai-agents-code-2026",
        published_at: "2026-07-29",
        score: 78,
        comments: 210,
        summary: "Real-money market consensus odds: 78% YES. Total volume: $145,000. Higher confidence than traditional market surveys.",
        author: "Polymarket",
        relevance_score: 92,
        cluster: 2
      },
      {
        id: "ai-4",
        source: "github",
        title: "Halo – open-source, tamper-evident runtime evidence for AI agents",
        url: "https://github.com/bkuan001/halo-record",
        published_at: "2026-07-27",
        score: 850,
        comments: 45,
        summary: "Cryptographic state persistence and audit trail specification for multi-agent tool execution.",
        author: "bkuan001",
        relevance_score: 90,
        cluster: 2
      },
      {
        id: "ai-5",
        source: "youtube",
        title: "Building Autonomous Multi-Agent Workflows: Architecture & Tooling",
        url: "https://youtube.com/watch?v=demo_agent",
        published_at: "2026-07-20",
        score: 3200,
        comments: 184,
        summary: "Full transcript analysis: 45-minute breakdown of context window management, tool calling error handling, and memory indexing.",
        author: "AI Engineering Channel",
        relevance_score: 86,
        cluster: 3
      }
    ]
  },
  "open source llms": {
    query: "Open Source LLMs & Fine-Tuning",
    summary: "Open weights model efficiency is catching up to closed models rapidly. Fine-tuning models under 10B parameters for domain-specific tasks is now a primary enterprise focus, driven by local quantizations and optimized memory architectures.",
    key_takeaways: [
      "Quantized LLMs are now running locally on standard laptop chipsets with minimal memory overhead.",
      "Custom LoRA fine-tunes on 8B parameter models outperform GPT-4o for specific API orchestration tasks.",
      "Developer channels show that 73% of new AI projects leverage open-source weights for local inference."
    ],
    results: [
      {
        id: "os-1",
        source: "hackernews",
        title: "Llama 3.3 running locally at 65 tokens/sec using quantized CPU inference",
        url: "https://news.ycombinator.com",
        published_at: "2026-07-28",
        score: 812,
        comments: 142,
        summary: "Detailed breakdown of quantization methods enabling full-scale local open weights execution on standard consumer grade chipsets.",
        author: "local_dev",
        relevance_score: 97,
        cluster: 1
      },
      {
        id: "os-2",
        source: "github",
        title: "Unsloth: Train Llama 3 and Mistral 2x faster with 70% less memory",
        url: "https://github.com/unslothai/unsloth",
        published_at: "2026-07-26",
        score: 4120,
        comments: 110,
        summary: "Open-source fine-tuning wrapper that optimizes backpropagation and gradient descent memory footprints.",
        author: "daniel_unsloth",
        relevance_score: 95,
        cluster: 1
      },
      {
        id: "os-3",
        source: "reddit",
        title: "Fine-tuning a 8B Llama model locally on a single GPU vs renting cloud H100s",
        url: "https://reddit.com/r/LocalLLaMA",
        published_at: "2026-07-25",
        score: 1890,
        comments: 312,
        summary: "Cost comparison and performance audit showcasing local setup efficiency for small-scale enterprise fine-tuning.",
        author: "u/gpu_hoarder",
        relevance_score: 91,
        cluster: 2
      },
      {
        id: "os-4",
        source: "youtube",
        title: "Fine-Tuning Local Models: A Step-by-Step Practical Tutorial",
        url: "https://youtube.com",
        published_at: "2026-07-22",
        score: 11200,
        comments: 480,
        summary: "Video walkthrough on datasets preparing, LoRA parameter tuning, and exporting models to GGUF format.",
        author: "AI Hacker Hub",
        relevance_score: 88,
        cluster: 2
      }
    ]
  },
  "polymarket": {
    query: "Polymarket & Macro Odds",
    summary: "Prediction markets have emerged as highly responsive gauges for real-world milestones. Traders are active on AI deployment timelines, chip infrastructure rollouts, and regulatory updates, representing real-money consensus views.",
    key_takeaways: [
      "Prediction market odds show a sharp increase in bets predicting compute supply surpluses in Q4 2026.",
      "Real-money consensus places a 62% likelihood on advanced open-source models matching leading closed models by next month.",
      "Traditional polling is being bypassed by predictive trading signals for assessing enterprise regulatory outcomes."
    ],
    results: [
      {
        id: "poly-1",
        source: "polymarket",
        title: "Will the next leading frontier model match GPT-4o on logic tasks by October?",
        url: "https://polymarket.com",
        published_at: "2026-07-31",
        score: 82,
        comments: 345,
        summary: "Prediction odds ($210K volume) showing a rising YES probability. Reflects trader expectations for rapid open-source logical capabilities.",
        author: "Polymarket Odds",
        relevance_score: 96,
        cluster: 1
      },
      {
        id: "poly-2",
        source: "reddit",
        title: "Why prediction markets are outperforming traditional tech sector analysts",
        url: "https://reddit.com",
        published_at: "2026-07-27",
        score: 940,
        comments: 124,
        summary: "Discussion analyzing the economic incentives of prediction markets vs standard expert consensus reviews in tech forecasting.",
        author: "u/finance_tech",
        relevance_score: 92,
        cluster: 1
      },
      {
        id: "poly-3",
        source: "hackernews",
        title: "Polymarket volume reaches all-time high as tech releases trigger betting spikes",
        url: "https://news.ycombinator.com",
        published_at: "2026-07-29",
        score: 304,
        comments: 89,
        summary: "Analysis of market liquidity showing significant real-money backing for technical adoption forecasts.",
        author: "market_watcher",
        relevance_score: 89,
        cluster: 2
      }
    ]
  },
  "ai policy": {
    query: "AI Policy & Infrastructure",
    summary: "Global regulatory agencies are transitioning from static safety guidelines to concrete infrastructure limits. Discussions are centering on compute hardware tracking, data privacy gates, and local host deployment protocols.",
    key_takeaways: [
      "New policy drafts propose strict tracking requirements for high-performance GPU data centers.",
      "Enterprise software architectures are adopting local gateways to comply with rising cross-border data privacy guidelines.",
      "Open weights models are facing pushback from regulators proposing liability metrics for unauthorized derivatives."
    ],
    results: [
      {
        id: "pol-1",
        source: "arxiv",
        title: "Governing Compute: Hardware-Level Tracking Protocols for AI Safety",
        url: "https://arxiv.org",
        published_at: "2026-07-29",
        score: 85,
        comments: 32,
        summary: "Academic proposal for cryptographic audit logging directly on accelerator chips to ensure regulatory compliance.",
        author: "Dr. L. Vance, Stanford",
        relevance_score: 95,
        cluster: 1
      },
      {
        id: "pol-2",
        source: "hackernews",
        title: "EU AI Act enters enforcement phase: What it means for local developers",
        url: "https://news.ycombinator.com",
        published_at: "2026-07-30",
        score: 512,
        comments: 201,
        summary: "Discussion surrounding practical compliance rules for model deployments, open source exceptions, and compute scoring.",
        author: "legal_coder",
        relevance_score: 93,
        cluster: 1
      },
      {
        id: "pol-3",
        source: "reddit",
        title: "How GPU export restrictions are shaping international developer hubs",
        url: "https://reddit.com",
        published_at: "2026-07-24",
        score: 1105,
        comments: 184,
        summary: "Discussion of tech development shifts as regional hubs invest in custom localized quantization clusters.",
        author: "u/global_tech",
        relevance_score: 89,
        cluster: 2
      }
    ]
  }
};
