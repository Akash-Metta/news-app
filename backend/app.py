import json
import os
import asyncio
import subprocess
import sys
import logging
import time
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import re
from pathlib import Path
from typing import Dict, List, Optional
from fastapi import FastAPI, Query, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from security import SecurityHeadersMiddleware, RateLimitMiddleware, SignatureVerificationMiddleware, sanitize_input, verify_client_signature

# Configure production logging format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [DevPulse] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("DevPulseApp")

app = FastAPI(
    title="DevPulse Developer Signals API",
    version="2.5.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Apply enterprise middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SignatureVerificationMiddleware)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]
origins_env = os.environ.get("DEVPULSE_ALLOWED_ORIGINS")
if origins_env:
    allowed_origins.extend([o.strip() for o in origins_env.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent.resolve()
CACHE_DIR = BASE_DIR / "cache"
CACHE_DIR.mkdir(exist_ok=True)

# In-Memory Cache configuration to resolve CPU-heavy subprocess blocks
IN_MEMORY_CACHE = {}
CACHE_TTL = 300  # Cache items for 5 minutes

SKILL_SCRIPT_ENV = os.environ.get("DEVPULSE_SKILL_SCRIPT")
if SKILL_SCRIPT_ENV:
    SKILL_SCRIPT = Path(SKILL_SCRIPT_ENV)
else:
    SKILL_SCRIPT = BASE_DIR.parent.parent / "last30days-skill" / "skills" / "last30days" / "scripts" / "last30days.py"

DEFAULT_TOPICS = [
    {
        "id": "ai-agents",
        "title": "AI Agents & Autonomous Systems",
        "category": "AI & Tech",
        "momentum": "+184%",
        "volume": "14.2K signals",
        "description": "Multi-agent frameworks, task execution, and autonomous software engineers.",
        "icon": "bot",
    },
    {
        "id": "open-models",
        "title": "Open Source LLMs & Fine-Tuning",
        "category": "Developer",
        "momentum": "+128%",
        "volume": "9.8K signals",
        "description": "Local model runtimes, quantized weights, and agentic code generators.",
        "icon": "code",
    },
    {
        "id": "prediction-markets",
        "title": "Polymarket & Macro Odds",
        "category": "Markets",
        "momentum": "+95%",
        "volume": "22.5K signals",
        "description": "Real-money betting odds on tech releases, elections, and global events.",
        "icon": "trending-up",
    },
    {
        "id": "tech-policy",
        "title": "AI Policy & Infrastructure",
        "category": "World",
        "momentum": "+72%",
        "volume": "8.1K signals",
        "description": "Data privacy gateways, compute restrictions, and enterprise deployments.",
        "icon": "globe",
    },
]

MOCK_FEEDS = {
    "ai agents": {
        "query": "AI agents",
        "summary": "AI Agent execution frameworks and autonomous developer tools dominate developer discussions. Open-source agents are shifting from chat interfaces to multi-step task runners with runtime safety guardrails.",
        "key_takeaways": [
            "Meta, OpenAI, and community developers are replacing single prompts with continuous workflow loops.",
            "Runtime evidence tools (e.g. Halo, Noisegate) are emerging for differential privacy and untrusted agent execution.",
            "Polymarket odds show a 74% likelihood of autonomous agent-assisted software releases before year-end."
        ],
        "sources": [
            {
                "id": "1",
                "source": "reddit",
                "title": "Turns out Dead Internet Theory was right: AI agents are eating the Web, growing by nearly 8,000%",
                "url": "https://www.reddit.com/r/technology/comments/1v5fxac/turns_out_dead_internet_theory_was_right_ai/",
                "published_at": "2026-07-24",
                "score": 16462,
                "comments": 531,
                "summary": "Discussion around the exponential growth of autonomous web bots and AI agent web crawlers reshaping API economics.",
                "author": "u/tech_insider",
                "top_comment": "We are powering bots to interact with other bots, fundamentally shifting how web search and server traffic work."
            },
            {
                "id": "2",
                "source": "hackernews",
                "title": "Show HN: Noisegate – a differential-privacy gateway for untrusted AI agents",
                "url": "https://github.com/yashmahajan10/llm-differential-privacy-gateway",
                "published_at": "2026-07-30",
                "score": 142,
                "comments": 38,
                "summary": "An open-source privacy firewall that sits between LLM agents and enterprise data streams to prevent credential leakage.",
                "author": "yashmahajan",
                "top_comment": "This solves a major security blocker for developers deploying autonomous agents in production environments."
            },
            {
                "id": "3",
                "source": "polymarket",
                "title": "Will major tech firm deploy fully autonomous code-generating agents by Q4 2026?",
                "url": "https://polymarket.com/event/ai-agents-code-2026",
                "published_at": "2026-07-29",
                "score": 78,
                "comments": 210,
                "summary": "Current market odds: 78% YES ($145K volume). Real-money consensus reflects high confidence in enterprise rollouts.",
                "author": "Polymarket Odds",
                "top_comment": "Traders are betting heavily on agentic IDE plugins replacing traditional autocomplete extensions."
            }
        ]
    }
}

def fetch_google_news(query: str) -> list:
    """Fetch and parse Google News XML RSS feed directly to broaden source scope."""
    clean_q = sanitize_input(query)
    url = f"https://news.google.com/rss/search?q={urllib.parse.quote(clean_q)}&hl=en-US&gl=US&ceid=US:en"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        logger.info(f"Fetching mainstream RSS signals from Google News for: '{clean_q}'")
        with urllib.request.urlopen(req, timeout=8) as response:
            xml_data = response.read()
        root = ET.fromstring(xml_data)
        results = []
        for idx, item in enumerate(root.findall('.//item')[:12]):
            title = item.find('title').text if item.find('title') is not None else "Untitled Mainstream News"
            link = item.find('link').text if item.find('link') is not None else "#"
            pub_date = item.find('pubDate').text if item.find('pubDate') is not None else "Recent"
            source = item.find('source').text if item.find('source') is not None else "Google News"
            
            # Formulate year-month-day timestamp
            if " " in pub_date:
                parts = pub_date.split(" ")
                if len(parts) >= 4:
                    pub_date = f"{parts[3]}-{parts[2]}-{parts[1]}"

            results.append({
                "id": f"gnews-{idx}",
                "source": "google_news",
                "title": sanitize_input(title),
                "url": link,
                "published_at": pub_date,
                "score": 120,
                "comments": 0,
                "summary": sanitize_input(f"Mainstream coverage from {source} discussing: {title}"),
                "author": sanitize_input(source),
                "relevance_score": 85,
                "cluster": 4
            })
        return results
    except Exception as e:
        logger.warning(f"Failed to fetch Google News RSS: {e}")
        return []

def get_jaccard_similarity(str1: str, str2: str) -> float:
    """Compute lexical token Jaccard similarity ratio to identify duplicate story entries."""
    w1 = set(re.findall(r'\w+', str1.lower()))
    w2 = set(re.findall(r'\w+', str2.lower()))
    if not w1 or not w2:
        return 0.0
    return len(w1.intersection(w2)) / len(w1.union(w2))

def deduplicate_signals(results: list) -> list:
    """Filter out duplicate articles utilizing token-overlap calculations."""
    unique = []
    for item in results:
        is_duplicate = False
        for existing in unique:
            # Group titles with higher than 45% matching word tokens
            if get_jaccard_similarity(item["title"], existing["title"]) > 0.45:
                is_duplicate = True
                existing["score"] = max(existing["score"], item["score"])
                existing["comments"] = max(existing["comments"], item["comments"])
                break
        if not is_duplicate:
            unique.append(item)
    return unique

@app.get("/api/v1/health")
@app.get("/api/health")
def health_check(request: Request):
    logger.info(f"Health audit requested from {request.client.host}")
    return {
        "status": "healthy",
        "environment": "production",
        "version": "2.5.0",
        "engine_available": SKILL_SCRIPT.exists(),
        "timestamp": int(time.time())
    }

@app.get("/api/v1/trending")
@app.get("/api/trending")
def get_trending_topics():
    return {"status": "success", "topics": DEFAULT_TOPICS}

async def run_last30days_engine(query: str, sources_str: Optional[str] = None) -> dict:
    clean_q = sanitize_input(query)
    cache_key = f"{clean_q.lower().strip()}_{sources_str or 'default'}"
    cache_file = CACHE_DIR / f"{cache_key}.json"
    
    # 1. In-Memory Cache check
    now = time.time()
    if cache_key in IN_MEMORY_CACHE:
        cached_time, cached_data = IN_MEMORY_CACHE[cache_key]
        if now - cached_time < CACHE_TTL:
            logger.info(f"In-memory cache hit for: '{clean_q}'")
            return cached_data

    # 2. Disk Cache check
    if cache_file.exists():
      try:
        with open(cache_file, "r", encoding="utf-8") as f:
          logger.info(f"Disk cache hit for: '{clean_q}'. Populating in-memory.")
          data = json.load(f)
          IN_MEMORY_CACHE[cache_key] = (time.time(), data)
          return data
      except Exception as e:
        logger.warning(f"Failed to read cache for '{clean_q}': {e}")

    # 3. Slow Subprocess Engine runner (async stream)
    cmd = [sys.executable, str(SKILL_SCRIPT), clean_q, "--emit=json"]
    if sources_str:
      clean_sources = sanitize_input(sources_str)
      cmd.extend(["--search", clean_sources])
    else:
      cmd.extend(["--search", "reddit,hackernews,polymarket,github"])

    try:
      logger.info(f"Executing last30days engine process for '{clean_q}'")
      proc = await asyncio.create_subprocess_exec(
          *cmd,
          stdout=asyncio.subprocess.PIPE,
          stderr=asyncio.subprocess.PIPE
      )
      try:
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=25.0)
        if proc.returncode == 0:
          data = json.loads(stdout.decode('utf-8', errors='replace'))
          with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
          IN_MEMORY_CACHE[cache_key] = (time.time(), data)
          return data
        else:
          logger.error(f"Engine process exited with code {proc.returncode}: {stderr.decode('utf-8', errors='replace')}")
      except asyncio.TimeoutError:
        try:
          proc.kill()
        except ProcessLookupError:
          pass
        logger.error(f"Execution timeout for '{clean_q}'")
    except Exception as e:
      logger.error(f"Execution error for '{clean_q}': {e}")

    # Fallback dataset
    for mock_key in MOCK_FEEDS:
      if mock_key in clean_q.lower():
        return MOCK_FEEDS[mock_key]
        
    return MOCK_FEEDS["ai agents"]

@app.get("/api/v1/search")
@app.get("/api/search")
async def search_news(q: str = Query(..., description="Query topic"), sources: Optional[str] = None):
    clean_q = sanitize_input(q)
    if not clean_q:
      raise HTTPException(status_code=400, detail="Invalid or empty query string")
      
    raw_data = await run_last30days_engine(clean_q, sources)

    formatted_sources = []
    candidates = raw_data.get("candidates", [])
    if candidates:
      for idx, item in enumerate(candidates[:30]):
        src_type = item.get("source", "web")
        eng = item.get("engagement", {})
        score = eng.get("score") or eng.get("points") or eng.get("upvotes") or 0
        comments = eng.get("num_comments") or eng.get("comments") or 0
        
        formatted_sources.append({
            "id": str(idx + 1),
            "source": src_type,
            "title": sanitize_input(item.get("title") or "Untitled Signal"),
            "url": item.get("url") or "#",
            "published_at": item.get("published_at") or "Recent",
            "score": score,
            "comments": comments,
            "summary": sanitize_input(item.get("summary") or "Scored intelligence card from " + src_type),
            "author": sanitize_input(item.get("author") or src_type.capitalize()),
            "relevance_score": round(item.get("relevance_score", 0.5) * 100),
            "cluster": item.get("cluster", 1)
        })
    else:
      formatted_sources = list(raw_data.get("sources", MOCK_FEEDS["ai agents"]["sources"]))

    # Integrate Google News XML Feeds directly to broaden source scope
    if not sources or "google" in sources.lower():
        gnews_data = fetch_google_news(clean_q)
        formatted_sources.extend(gnews_data)

    # Perform Jaccard deduplication to group duplicate text cards
    deduplicated_sources = deduplicate_signals(formatted_sources)

    # Sort final aggregated records by engagement score descending
    deduplicated_sources.sort(key=lambda x: x.get("score", 0), reverse=True)

    return {
        "status": "success",
        "query": clean_q,
        "summary": raw_data.get("summary") or f"Synthesized community briefing for topic: '{clean_q}'. High engagement observed across social platforms.",
        "key_takeaways": raw_data.get("key_takeaways") or [
            f"Significant community activity recorded for '{clean_q}' in the past 30 days.",
            "High user engagement and upvote velocity indicate strong community interest.",
            "Cross-platform discussion highlights key developments and user sentiment."
        ],
        "sources_count": len(deduplicated_sources),
        "results": deduplicated_sources
    }

# Mount static files if frontend/dist exists (production build)
FRONTEND_DIR = BASE_DIR.parent / "frontend" / "dist"
if FRONTEND_DIR.exists():
    logger.info(f"Frontend distribution detected at {FRONTEND_DIR}. Mounting static files at /")
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
else:
    logger.warning(f"Frontend distribution not found at {FRONTEND_DIR}. App will run in API-only mode.")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")
    uvicorn.run("app:app", host=host, port=port, reload=True)
