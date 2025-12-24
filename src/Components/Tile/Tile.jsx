import React from "react";
import styles from "../StatCard/StatCard.module.css"

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

/* Split full name into first + last */
function splitName(fullName) {
  const full = (fullName || "").trim();
  if (!full) return { first: "", last: "" };
  const parts = full.split(" ");
  if (parts.length === 1) return { first: parts[0], last: "" };
  const last = parts.pop();
  const first = parts.join(" ");
  return { first, last };
}

/* Reusable Tile Component */
export default function Tile({ title, items, statKey, statLabel, colorFrom, colorTo }) {
  const values = items.map((it) =>
    statKey === "g+a" ? (it.goals || 0) + (it.assists || 0) : it[statKey] ?? 0
  );

  const maxVal = Math.max(...values, 1);
  const hoverColor = hexToRgba(colorTo, 0.18);

  return (
    <div className={styles.mtTile} style={{ ["--hover-color"]: hoverColor }}>
      <div
        className={styles.mtTitle}
        style={{ background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})` }}
      >
        <div className={styles.mtTitleText}>{title}</div>
      </div>

      <div className={styles.mtList}>
        <div className={styles.mtHead}>
          <div className={styles.mtHeadCell}>Rank</div>
          <div className={styles.mtHeadCell}>Info</div>
          <div className={styles.mtHeadCell}>M</div>
          <div className={styles.mtHeadCell}>{statLabel}</div>
        </div>

        {items.slice(0, 10).map((p) => {
          const statValue =
            statKey === "g+a"
              ? (p.goals || 0) + (p.assists || 0)
              : p[statKey] ?? 0;

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
                <div className={styles.mtStatWrap}>
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
