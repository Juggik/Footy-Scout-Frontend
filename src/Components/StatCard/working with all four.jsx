// statcard.jsx
import React from "react";

/**
 * Masonry Tiles — hover overlay fixes and stronger opacity
 *
 * - Fixes the overlay stacking so the translucent color sits behind row content.
 * - Increases overlay opacity so the color is more noticeable (but still translucent).
 * - Keeps all sizing and layout unchanged.
 *
 * Paste this entire file into statcard.jsx to replace the component.
 */

const sampleBase = [
  { rank: 1, name: "Lautaro Martinez", club: "Inter Milan", league: "Serie A", matches: 28, goals: 18, assists: 10, cs: 12 },
  { rank: 2, name: "Bruno Fernandes", club: "Manchester United", league: "Premier League", matches: 27, goals: 16, assists: 11, cs: 10 },
  { rank: 3, name: "Kylian Mbappé", club: "Paris Saint-Germain", league: "Ligue 1", matches: 26, goals: 14, assists: 9, cs: 9 },
  { rank: 4, name: "Mohamed Salah", club: "Liverpool", league: "Premier League", matches: 26, goals: 12, assists: 7, cs: 8 },
  { rank: 5, name: "Harry Kane", club: "Bayern Munich", league: "Bundesliga", matches: 25, goals: 10, assists: 6, cs: 7 },
  { rank: 6, name: "Marcus Rashford", club: "Manchester United", league: "Premier League", matches: 24, goals: 9, assists: 5, cs: 6 },
  { rank: 7, name: "Phil Foden", club: "Manchester City", league: "Premier League", matches: 24, goals: 8, assists: 6, cs: 5 },
  { rank: 8, name: "Jude Bellingham", club: "Real Madrid", league: "La Liga", matches: 23, goals: 7, assists: 5, cs: 4 },
  { rank: 9, name: "Ousmane Dembélé", club: "Barcelona", league: "La Liga", matches: 22, goals: 6, assists: 4, cs: 3 },
  { rank: 10, name: "Riyad Mahrez", club: "Al-Ahli", league: "Saudi Pro League", matches: 21, goals: 5, assists: 3, cs: 2 },
];

function hexToRgba(hex, alpha = 1) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function splitName(fullName) {
  const full = (fullName || "").trim();
  if (!full) return { first: "", last: "" };
  const parts = full.split(" ");
  if (parts.length === 1) return { first: parts[0], last: "" };
  const last = parts.pop();
  const first = parts.join(" ");
  return { first, last };
}

function Tile({ title, items, statKey, statLabel, colorFrom = "#ff7a18", colorTo = "#af002d" }) {
  const values = items.map((it) => (statKey === "g+a" ? (it.goals || 0) + (it.assists || 0) : it[statKey] ?? 0));
  const maxVal = Math.max(...values, 1);

  // stronger but still translucent overlay (adjust alpha here if you want it stronger/weaker)
  const hoverColor = hexToRgba(colorTo, 0.18);

  // set CSS variable for the tile so overlay matches the tile color
  return (
    <div className="mt-tile" style={{ "--hover-color": hoverColor }}>
      <div className="mt-title" style={{ background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})` }}>
        <div className="mt-title-text">{title}</div>
      </div>

      <div className="mt-list" role="region" aria-label={title + " list"}>
        <div className="mt-head">
          <div className="mt-head-cell">Rank</div>
          <div className="mt-head-cell">Info</div>
          <div className="mt-head-cell">M</div>
          <div className="mt-head-cell">{statLabel}</div>
        </div>

        {items.slice(0, 10).map((p) => {
          const statValue = statKey === "g+a" ? (p.goals || 0) + (p.assists || 0) : p[statKey] ?? 0;
          const pct = Math.round((statValue / maxVal) * 100);
          const { first, last } = splitName(p.name);

          return (
            <div className="mt-row" key={p.rank}>
              <div className="mt-row-rank">#{p.rank}</div>

              <div className="mt-row-info">
                <div className="mt-info-line player-line">
                  <span className="mt-info-label">Player:</span>
                  <div className="mt-player-name">
                    <div className="mt-player-first">{first}</div>
                    <div className="mt-player-last">{last}</div>
                  </div>
                </div>

                <div className="mt-info-line">
                  <span className="mt-info-label">Club:</span>
                  <span className="mt-info-value">{p.club}</span>
                </div>
                <div className="mt-info-line">
                  <span className="mt-info-label">League:</span>
                  <span className="mt-info-value">{p.league}</span>
                </div>
              </div>

              <div className="mt-row-matches">{p.matches}</div>

              <div className="mt-row-stat">
                <div className="mt-stat-wrap" aria-hidden>
                  <div
                    className="mt-stat-bar"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
                      boxShadow: `0 6px 18px ${hexToRgba(colorTo, 0.12)}`,
                    }}
                  />
                </div>
                <div className="mt-stat-num">{statValue}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StatCard() {
  const scorers = sampleBase.map((s) => ({ ...s }));
  const assisters = sampleBase.map((s, i) => ({ ...s, assists: Math.max(1, 12 - i) }));
  const ga = sampleBase.map((s) => ({ ...s }));
  const cleanSheets = sampleBase.map((s, i) => ({ ...s, cs: Math.max(0, 12 - i) }));

  return (
    <div className="mt-grid">
      <style>{`
        :root{
          --tile-radius:12px;
          --tile-shadow:0 8px 24px rgba(12,20,60,0.04);
          --gap:12px;
          --bg:#ffffff;
          --muted:#6b7280;
          --accent-text:#ffffff;

          --head-h:44px;
          --row-h:72px;
        }

        * { box-sizing: border-box; }

        .mt-grid{
          display:grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--gap);
          padding: 16px 6px;
          align-items: start;
        }

        .mt-tile{
          background: var(--bg);
          border-radius: var(--tile-radius);
          overflow: hidden;
          box-shadow: var(--tile-shadow);
          display:flex;
          flex-direction:column;
          min-height: 220px;
          /* fallback hover color */
          --hover-color: rgba(11,110,237,0.08);
        }

        .mt-title{
          padding: 12px 14px;
          color: var(--accent-text);
          font-weight: 800;
          display:flex;
          align-items:center;
          justify-content:space-between;
        }
        .mt-title-text{ font-size:14px; letter-spacing:0.4px; }

        .mt-list{
          padding: 0 10px 10px 10px;
          display:grid;
          grid-auto-rows: minmax(var(--row-h), auto);
          gap:10px;
          max-height: calc(var(--head-h) + var(--row-h) * 5);
          overflow:auto;
          -webkit-overflow-scrolling: touch;
        }

        .mt-head{
          position: sticky;
          top: 0;
          z-index: 2;
          background: rgba(255,255,255,0.98);
          padding: 8px 6px;
          margin-bottom: 6px;
          border-radius: 8px;
          box-shadow: 0 1px 0 rgba(0,0,0,0.02);
          display: grid;
          grid-template-columns: 48px minmax(180px, 1fr) 48px minmax(120px, 1fr);
          gap: 8px;
          align-items: center;
          font-weight: 800;
          font-size: 12px;
          color: var(--muted);
        }
        .mt-head-cell { text-align: left; padding-left: 4px; font-weight:700; }

        .mt-row {
          display: grid;
          grid-template-columns: 48px minmax(180px, 1fr) 48px minmax(120px, 1fr);
          gap: 8px;
          align-items: start;
          padding: 12px 8px;
          border-radius: 8px;
          transition: background .12s, transform .12s;
          min-height: var(--row-h);
          box-sizing: border-box;
          position: relative;
        }

        /* Hover: translucent overlay using the tile's --hover-color.
           Ensure overlay sits behind content by giving children higher stacking context. */
        .mt-row:hover{
          transform: translateY(-3px);
        }
        .mt-row::after{
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 8px;
          background: transparent;
          pointer-events: none;
          transition: background .12s;
          z-index: 0;
        }
        .mt-row:hover::after{
          background: var(--hover-color);
        }

        /* make sure row children render above the overlay */
        .mt-row > * { position: relative; z-index: 1; }

        .mt-row-rank { font-weight:700; color:#0b6efd; width:48px; text-align:left; }
        .mt-row-info{ display:flex; flex-direction:column; gap:8px; min-width:0; }

        .mt-info-line{ display:flex; gap:8px; align-items:center; }
        .mt-info-line.player-line { align-items:flex-start; }
        .mt-info-label{ font-weight:700; color:#374151; font-size:13px; min-width:56px; flex: 0 0 56px; }

        .mt-player-name { display:flex; flex-direction:column; line-height:1.05; min-height: 44px; }
        .mt-player-first { font-weight:400; color:#111; font-size:14px; word-break: break-word; overflow-wrap: anywhere; }
        .mt-player-last { font-weight:600; color:#374151; font-size:13px; margin-top:2px; word-break: break-word; overflow-wrap: anywhere; }

        .mt-info-value{ color:#111; font-weight:600; font-size:13px; white-space:normal; word-break:break-word; overflow-wrap:anywhere; }

        .mt-row-matches{
          text-align: left;
          padding-left: 6px;
          font-weight:700;
          color:#111;
          width:48px;
        }

        .mt-row-stat{ display:flex; align-items:center; gap:2px; min-width:0; }
        .mt-stat-wrap{
          flex:1;
          height:18px;
          background:#f1f5ff;
          border-radius:999px;
          overflow:hidden;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
        }
        .mt-stat-bar{ height:100%; transition: width .5s ease; border-radius:999px; }
        .mt-stat-num{ width:28px; text-align:right; font-weight:800; color:#111; }

        .mt-list::-webkit-scrollbar { height: 8px; width: 8px; }
        .mt-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 8px; }
        .mt-list::-webkit-scrollbar-track { background: transparent; }

        @media (max-width:1200px){
          .mt-grid{ grid-template-columns: repeat(2, 1fr); }
          .mt-list{ max-height: calc(var(--head-h) + var(--row-h) * 5); }
          .mt-row { grid-template-columns: 44px minmax(160px, 1fr) 44px minmax(100px, 1fr); gap:8px; padding: 10px; min-height: 64px; }
          .mt-head { grid-template-columns: 44px minmax(160px, 1fr) 44px minmax(100px, 1fr); gap:8px; }
          .mt-stat-wrap{ height:14px; }
        }

        @media (max-width:700px){
          .mt-grid{ grid-template-columns: 1fr; }
          .mt-list{ max-height: calc(var(--head-h) + var(--row-h) * 5); }
          .mt-row { grid-template-columns: 36px minmax(140px, 1fr) 40px minmax(90px, 1fr); gap:8px; padding: 10px 8px; min-height: 60px; align-items: start; }
          .mt-head { grid-template-columns: 36px minmax(140px, 1fr) 40px minmax(90px, 1fr); padding: 6px 8px; gap:8px; }
          .mt-title{ padding:10px 12px; }
          .mt-stat-wrap{ height:12px; }
          .mt-info-label{ min-width:48px; font-size:12px; }
          .mt-info-value{ font-size:13px; }
        }

        .mt-row + .mt-row{ border-top: 1px solid rgba(0,0,0,0.02); }
      `}</style>

      <Tile title="Top Scorers" items={scorers} statKey="goals" statLabel="G" colorFrom="#ff7a18" colorTo="#af002d" />
      <Tile title="Top Assists" items={assisters} statKey="assists" statLabel="A" colorFrom="#00b4ff" colorTo="#0072ff" />
      <Tile title="Top G/A" items={ga} statKey="g+a" statLabel="G/A" colorFrom="#ffd166" colorTo="#ff6b6b" />
      <Tile title="Top Clean Sheets" items={cleanSheets} statKey="cs" statLabel="CS" colorFrom="#7bffb2" colorTo="#00b894" />
    </div>
  );
}
