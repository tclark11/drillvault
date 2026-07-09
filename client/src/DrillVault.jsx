import { useState, useCallback, useEffect } from "react";
import { SPORTS_CONFIG, AGE_GROUPS, AGE_QUERY_MAP } from "./sportsdata";

function buildQuery(sportQueryName, skillId, age, custom) {
  if (custom.trim()) return `${custom.trim()} ${sportQueryName} drill`;
  const ageTerm = AGE_QUERY_MAP[age] || "";
  return [skillId, ageTerm, "drill"].filter(Boolean).join(" ");
}

function formatCount(n) {
  if (!n) return null;
  const num = parseInt(n, 10);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
  if (num >= 1_000) return `${Math.round(num / 1_000)}K views`;
  return `${num} views`;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (days < 1) return "Today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// ─── VIDEO MODAL ──────────────────────────────────────────────────────────────
function VideoModal({ video, onClose, onSave, saved, onNext, onPrev, hasNext, hasPrev, color }) {
  const videoId = video.id?.videoId || video.id;
  const { snippet, statistics } = video;
  const views = formatCount(statistics?.viewCount);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0F1623", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 18, width: "100%", maxWidth: 860, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>

        {/* iframe player */}
        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
          <iframe
            width="100%" height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
            title={snippet.title}
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
        </div>

        {/* Info */}
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color, marginBottom: 5 }}>{snippet.channelTitle}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", lineHeight: 1.4, marginBottom: 6 }}>{snippet.title}</div>
            <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#475569" }}>
              {views && <span>{views}</span>}
              <span>{timeAgo(snippet.publishedAt)}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
            <button onClick={() => onSave(videoId)} style={{ background: saved ? `${color}20` : "rgba(255,255,255,0.05)", border: `1.5px solid ${saved ? color : "rgba(255,255,255,0.1)"}`, color: saved ? color : "#64748B", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {saved ? "♥ Saved" : "♡ Save"}
            </button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", color: "#94A3B8", borderRadius: 8, width: 34, height: 34, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</button>
          </div>
        </div>

        {/* Prev / Next */}
        <div style={{ display: "flex", gap: 8, padding: "0 20px 16px" }}>
          <button onClick={onPrev} disabled={!hasPrev} style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: hasPrev ? "rgba(255,255,255,0.05)" : "transparent", border: `1.5px solid ${hasPrev ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"}`, color: hasPrev ? "#94A3B8" : "#2D3748", fontSize: 13, fontWeight: 600, cursor: hasPrev ? "pointer" : "default", fontFamily: "inherit" }}>← Previous</button>
          <button onClick={onNext} disabled={!hasNext} style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: hasNext ? `${color}18` : "transparent", border: `1.5px solid ${hasNext ? color : "rgba(255,255,255,0.04)"}`, color: hasNext ? color : "#2D3748", fontSize: 13, fontWeight: 600, cursor: hasNext ? "pointer" : "default", fontFamily: "inherit" }}>Next →</button>
        </div>
      </div>
    </div>
  );
}

// ─── VIDEO CARD ───────────────────────────────────────────────────────────────
function VideoCard({ video, saved, onSave, onWatch, isActive, color }) {
  const videoId = video.id?.videoId || video.id;
  const { snippet, statistics } = video;
  const thumb = snippet?.thumbnails?.medium?.url;
  const views = formatCount(statistics?.viewCount);

  return (
    <div
      onClick={() => onWatch(videoId)}
      style={{ background: "#0F1623", border: `1.5px solid ${isActive ? color : "rgba(255,255,255,0.07)"}`, borderRadius: 14, overflow: "hidden", transition: "all 0.18s", cursor: "pointer", boxShadow: isActive ? `0 0 0 3px ${color}25` : "none" }}
    >
      <div style={{ position: "relative", paddingBottom: "56.25%" }}>
        {thumb && <img src={thumb} alt={snippet.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,12,20,0.65) 0%, transparent 55%)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 48, height: 48, borderRadius: "50%", background: color, border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff" }}>▶</div>
      </div>
      <div style={{ padding: "13px 15px 10px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color, marginBottom: 5 }}>{snippet.channelTitle}</div>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.42, color: "#E2E8F0", marginBottom: 7, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{snippet.title}</div>
        <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#475569" }}>
          {views && <span>{views}</span>}
          <span>{timeAgo(snippet.publishedAt)}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 15px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button style={{ background: `${color}18`, border: `1.5px solid ${color}40`, color, borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }} onClick={e => { e.stopPropagation(); onWatch(videoId); }}>▶ Watch</button>
        <button style={{ background: saved ? `${color}18` : "rgba(255,255,255,0.04)", border: `1.5px solid ${saved ? color : "rgba(255,255,255,0.08)"}`, color: saved ? color : "#475569", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }} onClick={e => { e.stopPropagation(); onSave(videoId); }}>
          {saved ? "♥ Saved" : "♡ Save"}
        </button>
      </div>
    </div>
  );
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ background: "#0F1623", border: "1.5px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ width: "100%", paddingBottom: "56.25%", background: "#161D2E" }} />
      <div style={{ padding: 14 }}>
        {[["55%",9,9],["100%",13,5],["75%",13,14],["40%",9,0]].map(([w,h,mb],i) => (
          <div key={i} style={{ background: "#161D2E", borderRadius: 5, width: w, height: h, marginBottom: mb, animation: "blink 1.5s ease infinite" }} />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DrillVault({ sport, onBack }) {
  const config = SPORTS_CONFIG[sport.id];
  const { color, queryName, categories } = config;

  const [age, setAge] = useState("");
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const [activeTerm, setActiveTerm] = useState(null);
  const [customQ, setCustomQ] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [saved, setSaved] = useState({});
  const [savedVideos, setSavedVideos] = useState([]);
  const [view, setView] = useState("search");
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [activeVideoId, setActiveVideoId] = useState(null);

  const cat = categories.find(c => c.id === activeCat);

  const search = useCallback(async (pageToken = null, termOverride = null) => {
  const termToUse = termOverride !== null ? termOverride : activeTerm;
  const query = buildQuery(queryName, termToUse?.id || "", age, customQ);
  const first = !pageToken;
  if (first) { setLoading(true); setError(null); setVideos([]); setLastQuery(query); }
  else setLoadingMore(true);

  try {
    const params = new URLSearchParams({ q: query, ...(pageToken ? { pageToken } : {}) });
    const base = import.meta.env.VITE_API_URL || "";
    const res = await fetch(`${base}/api/search?${params}`);
    const data = await res.json();
    if (!res.ok) { setError(data?.error || "Search failed."); return; }
    const items = data.items || [];
    setVideos(prev => first ? items : [...prev, ...items]);
    setNextPage(data.nextPageToken || null);
    setSearched(true);
  } catch {
    setError("Network error — make sure the server is running on port 3001.");
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
}, [activeTerm, age, customQ, queryName]);

const selectTerm = (term) => {
  const newTerm = activeTerm?.id === term.id ? null : term;
  setActiveTerm(newTerm);
  setCustomQ("");
  if (newTerm) search(null, newTerm);
};

  const toggleSave = (videoId) => {
    const allVideos = [...videos, ...savedVideos];
    const vid = allVideos.find(v => (v.id?.videoId || v.id) === videoId);
    setSaved(prev => {
      const next = { ...prev };
      if (next[videoId]) { delete next[videoId]; setSavedVideos(l => l.filter(v => (v.id?.videoId || v.id) !== videoId)); }
      else { next[videoId] = true; if (vid) setSavedVideos(l => [...l, vid]); }
      return next;
    });
  };

  const displayVideos = view === "saved" ? savedVideos : videos;
  const activeIndex = displayVideos.findIndex(v => (v.id?.videoId || v.id) === activeVideoId);
  const activeVideo = activeIndex >= 0 ? displayVideos[activeIndex] : null;
  const savedCount = Object.keys(saved).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#080C14;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.35}}
        button:hover{filter:brightness(1.1);}
        input:focus{border-color:${color}80!important;box-shadow:0 0 0 3px ${color}15;}
      `}</style>

      {/* MODAL */}
      {activeVideo && (
        <VideoModal
          video={activeVideo} color={color}
          onClose={() => setActiveVideoId(null)}
          onSave={toggleSave} saved={!!saved[activeVideoId]}
          onNext={() => { if (activeIndex < displayVideos.length - 1) setActiveVideoId(displayVideos[activeIndex + 1].id?.videoId || displayVideos[activeIndex + 1].id); }}
          onPrev={() => { if (activeIndex > 0) setActiveVideoId(displayVideos[activeIndex - 1].id?.videoId || displayVideos[activeIndex - 1].id); }}
          hasNext={activeIndex < displayVideos.length - 1}
          hasPrev={activeIndex > 0}
        />
      )}

      <div style={{ minHeight: "100vh", background: "#080C14", color: "#E2E8F0", fontFamily: "'DM Sans', sans-serif" }}>

        {/* NAV */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,12,20,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={onBack} style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", color: "#94A3B8", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              ← All Sports
            </button>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 6 }}>
              Drill<span style={{ color }}>Vault</span>
              <span style={{ fontSize: 16 }}>{sport.emoji}</span>
              <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{sport.label}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setView("search")} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${view === "search" ? `${color}55` : "rgba(255,255,255,0.08)"}`, background: view === "search" ? `${color}18` : "transparent", color: view === "search" ? color : "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Search</button>
            <button onClick={() => setView("saved")} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${view === "saved" ? `${color}55` : "rgba(255,255,255,0.08)"}`, background: view === "saved" ? `${color}18` : "transparent", color: view === "saved" ? color : "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              ♥ Saved{savedCount > 0 && <span style={{ background: color, color: "#080C14", borderRadius: 100, fontSize: 10, fontWeight: 800, padding: "1px 6px", marginLeft: 4 }}>{savedCount}</span>}
            </button>
          </div>
        </nav>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

          {/* SAVED VIEW */}
          {view === "saved" && (
            <div style={{ padding: "40px 0" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Saved Drills</h2>
              <p style={{ color: "#475569", fontSize: 13, marginBottom: 28 }}>{savedCount} video{savedCount !== 1 ? "s" : ""} saved this session</p>
              {savedCount === 0
                ? <div style={{ textAlign: "center", padding: "72px 0" }}><div style={{ fontSize: 44, marginBottom: 14 }}>♡</div><div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Nothing saved yet</div><div style={{ fontSize: 14, color: "#475569" }}>Hit Save on any video to collect it here.</div></div>
                : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {savedVideos.map(v => { const vid = v.id?.videoId || v.id; return <VideoCard key={vid} video={v} saved={!!saved[vid]} onSave={toggleSave} onWatch={setActiveVideoId} isActive={vid === activeVideoId} color={color} />; })}
                  </div>
              }
            </div>
          )}

          {/* SEARCH VIEW */}
          {view === "search" && (
            <>
              {/* HERO */}
              <div style={{ padding: "48px 0 36px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${color}15`, border: `1px solid ${color}35`, color, borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 18 }}>
                  <div style={{ width: 6, height: 6, background: color, borderRadius: "50%", animation: "blink 2s ease infinite" }} />
                  {sport.label} Coaching · Free Drills
                </div>
                <h1 style={{ fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-1.5px", marginBottom: 14 }}>
                  Find the right drill.<br /><span style={{ color }}>By the term coaches use.</span>
                </h1>
                <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 480 }}>
                  Search by {sport.label} coaching terminology and watch videos right here without leaving the page.
                </p>
              </div>

              {/* SEARCH BAR */}
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <input
                  style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#E2E8F0", padding: "11px 16px", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                  placeholder={`Search ${sport.label} drills… e.g. "${cat?.skills[0]?.label || "passing drill"}"`}
                  value={customQ}
                  onChange={e => { setCustomQ(e.target.value); setActiveTerm(null); }}
                  onKeyDown={e => e.key === "Enter" && search()}
                />
                {customQ && <button style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#64748B", padding: "11px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }} onClick={() => setCustomQ("")}>✕</button>}
                <button style={{ background: loading ? "#1a1a1a" : color, color: loading ? "#555" : "#080C14", border: "none", borderRadius: 10, padding: "11px 28px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }} onClick={() => search()} disabled={loading}>
                  {loading ? "Searching…" : "Search"}
                </button>
              </div>

              {/* AGE FILTER */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#334155" }}>Age Group</span>
                {AGE_GROUPS.map(a => (
                  <button key={a.id} onClick={() => setAge(a.id)} style={{ padding: "5px 14px", borderRadius: 100, border: `1.5px solid ${age === a.id ? color : "rgba(255,255,255,0.09)"}`, background: age === a.id ? `${color}20` : "rgba(255,255,255,0.03)", color: age === a.id ? color : "#64748B", fontSize: 12, fontWeight: 600, cursor: "pointer", userSelect: "none", fontFamily: "inherit" }}>
                    {a.label}
                  </button>
                ))}
              </div>

              {/* CATEGORY TABS */}
              <div style={{ padding: "28px 0 0" }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#334155", marginBottom: 16 }}>Browse by Coaching Concept</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => { setActiveCat(c.id); setActiveTerm(null); setCustomQ(""); }} style={{ padding: "7px 16px", borderRadius: 100, border: `1.5px solid ${activeCat === c.id ? c.color : "rgba(255,255,255,0.08)"}`, background: activeCat === c.id ? `${c.color}18` : "rgba(255,255,255,0.03)", color: activeCat === c.id ? c.color : "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", userSelect: "none", transition: "all 0.15s", fontFamily: "inherit" }}>
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>

                {/* TERM GRID */}
                {cat && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8, marginBottom: 24 }}>
                    {cat.skills.map(sk => (
                      <button key={sk.id} onClick={() => selectTerm(sk)} style={{ padding: "9px 14px", borderRadius: 8, textAlign: "left", border: `1.5px solid ${activeTerm?.id === sk.id ? cat.color : "rgba(255,255,255,0.07)"}`, background: activeTerm?.id === sk.id ? `${cat.color}14` : "rgba(255,255,255,0.02)", color: activeTerm?.id === sk.id ? cat.color : "#94A3B8", fontSize: 13, fontWeight: activeTerm?.id === sk.id ? 600 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all 0.12s" }}>
                        {activeTerm?.id === sk.id ? "✓ " : ""}{sk.label}
                      </button>
                    ))}
                  </div>
                )}

              </div>

              {/* ERROR */}
              {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "13px 18px", color: "#FCA5A5", fontSize: 13, marginBottom: 20 }}>⚠️ {error}</div>}

              {/* LOADING SKELETONS */}
              {loading && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>{Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} />)}</div>}

              {/* RESULTS */}
              {!loading && searched && (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 0 20px" }}>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>
                      {activeTerm?.label || lastQuery}
                      {age ? <span style={{ color: "#475569", fontWeight: 400 }}> · {AGE_GROUPS.find(a => a.id === age)?.label}</span> : ""}
                    </div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{videos.length} videos</div>
                  </div>

                  {videos.length === 0
                    ? <div style={{ textAlign: "center", padding: "72px 0" }}><div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div><div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No results</div><div style={{ fontSize: 14, color: "#475569" }}>Try a different term or adjust the age filter.</div></div>
                    : <>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                          {videos.map(v => { const vid = v.id?.videoId || v.id; return <VideoCard key={vid} video={v} saved={!!saved[vid]} onSave={toggleSave} onWatch={setActiveVideoId} isActive={vid === activeVideoId} color={color} />; })}
                        </div>
                        {nextPage && (
                          <div style={{ textAlign: "center", padding: "32px 0 48px" }}>
                            <button style={{ background: color, color: "#080C14", border: "none", borderRadius: 10, padding: "12px 36px", fontSize: 14, fontWeight: 700, cursor: loadingMore ? "not-allowed" : "pointer", fontFamily: "inherit" }} onClick={() => search(nextPage)} disabled={loadingMore}>
                              {loadingMore ? "Loading…" : "Load more videos"}
                            </button>
                          </div>
                        )}
                      </>
                  }
                </>
              )}

              {/* IDLE */}
              {!loading && !searched && !error && (
                <div style={{ textAlign: "center", padding: "72px 0" }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>{sport.emoji}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Pick a coaching concept above</div>
                  <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.65 }}>Select a category, choose a term, then hit Go — or type anything into the search bar.</div>
                </div>
              )}
            </>
          )}

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 64, padding: "24px 0", textAlign: "center", color: "#1E293B", fontSize: 12 }}>
            DrillVault · {sport.label} Edition · Powered by YouTube Data API v3 · Free for junior sport coaches
          </div>
        </div>
      </div>
    </>
  );
}
