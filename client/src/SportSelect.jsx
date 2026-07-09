import { useState } from "react";

const SPORTS = [
  { id: "afl",          label: "AFL",                emoji: "🏉", description: "Kicking, marking, handballing, tackling & game plans", color: "#F59E0B", bg: "linear-gradient(135deg, #1a1200, #2d2000)" },
  { id: "basketball",   label: "Basketball",         emoji: "🏀", description: "Offence, defence, shooting, ball handling & more",       color: "#00C896", bg: "linear-gradient(135deg, #001a12, #002d1f)" },
  { id: "hockey",       label: "Field Hockey",       emoji: "🏑", description: "Passing, dribbling, set plays & defensive structures",   color: "#3B82F6", bg: "linear-gradient(135deg, #00102d, #001a3d)" },
  { id: "football",     label: "Football (Soccer)",  emoji: "⚽", description: "Technical skills, tactics, formations & drills",         color: "#10B981", bg: "linear-gradient(135deg, #001a0d, #002d17)" },
  { id: "netball",      label: "Netball",            emoji: "🏐", description: "Passing, movement, shooting & defensive drills",        color: "#8B5CF6", bg: "linear-gradient(135deg, #12001a, #1f002d)" },
  { id: "rugby_league", label: "Rugby League",       emoji: "🏉", description: "Attack, defence, kicking & set play drills",            color: "#EF4444", bg: "linear-gradient(135deg, #1a0000, #2d0000)" },
  { id: "rugby_union",  label: "Rugby Union",        emoji: "🏉", description: "Scrums, lineouts, backs play & defensive systems",      color: "#EC4899", bg: "linear-gradient(135deg, #1a0012, #2d001f)" },
  { id: "tennis", label: "Tennis", emoji: "TEN", description: "Serve, groundstrokes, volleys, footwork & match tactics", color: "#84CC16", bg: "linear-gradient(135deg, #0d1a00, #172900)" },
];

export default function SportSelect({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080C14; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @media (max-width: 480px) { :root { --desc-display: none; } }
        @media (min-width: 768px) { .sport-grid { grid-template-columns: repeat(4, 1fr) !important; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080C14", color: "#E2E8F0", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>

        {/* Grid background */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.025) 47px, rgba(255,255,255,0.025) 48px), repeating-linear-gradient(90deg, transparent, transparent 47px, rgba(255,255,255,0.025) 47px, rgba(255,255,255,0.025) 48px)` }} />

        {/* NAV */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,12,20,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 8 }}>
            Drill<span style={{ color: "#00C896" }}>Vault</span> <span style={{ fontSize: 20 }}>🏆</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#00C896", background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)", padding: "4px 12px", borderRadius: 100 }}>
            Free · Junior Sport · Coaching Drills
          </div>
        </nav>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

          {/* HERO */}
          <div style={{ padding: "72px 0 56px", textAlign: "center" }}>
            <h1 style={{ fontSize: "clamp(32px, 7vw, 80px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-2px", marginBottom: 16, }}>
              Every drill.<br />
              <span style={{ color: "#00C896" }}>Every sport.</span>
            </h1>

            <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 24px" }}>
              The free coaching resource hub for junior sport coaches. Search by coaching terminology and watch videos right here — no endless YouTube scrolling.
            </p>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "#475569", fontWeight: 500 }}>
              Pick your sport to get started
            </div>
          </div>

          {/* SPORT GRID */}
<div className="sport-grid" style={{
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 12,
  paddingBottom: 40,
}}>
  {SPORTS.map((sport, i) => (
    <button
      key={sport.id}
      onClick={() => onSelect(sport)}
      onMouseEnter={() => setHovered(sport.id)}
      onMouseLeave={() => setHovered(null)}
      style={{
        background: hovered === sport.id ? sport.bg : "#0F1623",
        border: `1.5px solid ${hovered === sport.id ? sport.color : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14,
        padding: "clamp(16px, 3vw, 28px) clamp(14px, 2.5vw, 24px)",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s",
        transform: hovered === sport.id ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered === sport.id ? "0 16px 40px rgba(0,0,0,0.4)" : "none",
        animation: `fadeUp 0.4s ease ${i * 0.07}s both`,
        fontFamily: "inherit",
      }}
    >
      <div style={{ fontSize: "clamp(28px, 5vw, 40px)", marginBottom: 10 }}>{sport.emoji}</div>
      <div style={{
        fontSize: "clamp(13px, 2.5vw, 18px)",
        fontWeight: 800,
        color: hovered === sport.id ? sport.color : "#E2E8F0",
        marginBottom: 0,
        letterSpacing: "-0.3px",
        transition: "color 0.2s",
        lineHeight: 1.2,
      }}>
        {sport.label}
      </div>

      {/* Description — hidden on small screens */}
      <div style={{
        fontSize: 13,
        color: "#475569",
        lineHeight: 1.6,
        marginTop: 8,
        marginBottom: 16,
        display: "var(--desc-display, block)",
      }}>
        {sport.description}
      </div>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 12, fontWeight: 700,
        color: hovered === sport.id ? sport.color : "#334155",
        transition: "color 0.2s",
      }}>
        Find drills →
      </div>
    </button>
  ))}
</div>

          {/* FOOTER */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px 0", textAlign: "center", color: "#1E293B", fontSize: 12 }}>
            DrillVault · Free coaching resources for junior sport coaches
          </div>
        </div>
      </div>
    </>
  );
}
