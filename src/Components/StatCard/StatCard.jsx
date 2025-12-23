import React from "react";
import styles from "./StatCard.module.css";

/* Sample data (replace with your API data) */
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

/* Utility: convert hex to rgba string */
function hexToRgba(hex, alpha = 1) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* Split full name into first + last (last = last token) */
function splitName(fullName) {
  const full = (fullName || "").trim();
  if (!full) return { first: "", last: "" };
  const parts = full.split(" ");
  if (parts.length === 1) return { first: parts[0], last: "" };
  const last = parts.pop();
  const first = parts.join(" ");
  return { first, last };
}

/* Tile component */
function Tile({ title, items, statKey, statLabel, colorFrom = "#ff7a18", colorTo = "#af002d" }) {
  const values = items.map((it) => (statKey === "g+a" ? (it.goals || 0) + (it.assists || 0) : it[statKey] ?? 0));
  const maxVal = Math.max(...values, 1);

  // stronger but still translucent overlay (adjust alpha if needed)
  const hoverColor = hexToRgba(colorTo, 0.18);

  return (
    <div className={styles.mtTile} style={{ ["--hover-color"]: hoverColor }}>
      <div className={styles.mtTitle} style={{ background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})` }}>
        <div className={styles.mtTitleText}>{title}</div>
      </div>

      <div className={styles.mtList} role="region" aria-label={`${title} list`}>
        <div className={styles.mtHead}>
          <div className={styles.mtHeadCell}>Rank</div>
          <div className={styles.mtHeadCell}>Info</div>
          <div className={styles.mtHeadCell}>M</div>
          <div className={styles.mtHeadCell}>{statLabel}</div>
        </div>

        {items.slice(0, 10).map((p) => {
          const statValue = statKey === "g+a" ? (p.goals || 0) + (p.assists || 0) : p[statKey] ?? 0;
          const pct = Math.round((statValue / maxVal) * 100);
          const { first, last } = splitName(p.name);

          return (
            <div className={styles.mtRow} key={p.rank}>
              <div className={styles.mtRowRank}>#{p.rank}</div>

              <div className={styles.mtRowInfo}>
                <div className={`${styles.mtInfoLine} ${styles.playerLine}`}>
                  <span className={styles.mtInfoLabel}>Player:</span>
                  <div className={styles.mtPlayerName}>
                    <div className={styles.mtPlayerFirst}>{first}</div>
                    <div className={styles.mtPlayerLast}>{last}</div>
                  </div>
                </div>

                <div className={styles.mtInfoLine}>
                  <span className={styles.mtInfoLabel}>Club:</span>
                  <span className={styles.mtInfoValue}>{p.club}</span>
                </div>

                <div className={styles.mtInfoLine}>
                  <span className={styles.mtInfoLabel}>League:</span>
                  <span className={styles.mtInfoValue}>{p.league}</span>
                </div>
              </div>

              <div className={styles.mtRowMatches}>{p.matches}</div>

              <div className={styles.mtRowStat}>
                <div className={styles.mtStatWrap} aria-hidden>
                  <div
                    className={styles.mtStatBar}
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
                      boxShadow: `0 6px 18px ${hexToRgba(colorTo, 0.12)}`,
                    }}
                  />
                </div>
                <div className={styles.mtStatNum}>{statValue}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Main export */
export default function StatCard() {
  const scorers = sampleBase.map((s) => ({ ...s }));
  const assisters = sampleBase.map((s, i) => ({ ...s, assists: Math.max(1, 12 - i) }));
  const ga = sampleBase.map((s) => ({ ...s }));
  const cleanSheets = sampleBase.map((s, i) => ({ ...s, cs: Math.max(0, 12 - i) }));

  return (
    <div className={styles.mtGrid}>
      <Tile title="Top Scorers" items={scorers} statKey="goals" statLabel="G" colorFrom="#ff7a18" colorTo="#af002d" />
      <Tile title="Top Assists" items={assisters} statKey="assists" statLabel="A" colorFrom="#00b4ff" colorTo="#0072ff" />
      <Tile title="Top G/A" items={ga} statKey="g+a" statLabel="G/A" colorFrom="#ffd166" colorTo="#ff6b6b" />
      <Tile title="Top Clean Sheets" items={cleanSheets} statKey="cs" statLabel="CS" colorFrom="#7bffb2" colorTo="#00b894" />
    </div>
  );
}
