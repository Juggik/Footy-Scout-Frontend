import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getPlayerStats } from "./PlayerDetailsPageApi";
import styles from "./PlayerDetailsPage.module.css";
import LoadingAnimation from "../../Components/LoadingAnimation/LoadingAnimation";

function countryEmoji(country) {
  const map = {
    France: "🇫🇷",
    England: "🏴",
    Spain: "🇪🇸",
    Portugal: "🇵🇹",
    Germany: "🇩🇪",
  };
  return map[country] || "🌍";
}

function StatBar({ label, value, max = 200, color = "#6EE7B7" }) {
  const pct = Math.min(100, Math.round((Number(value) / max) * 100));
  return (
    <div className={styles.statBar}>
      <div className={styles.statBarHeader}>
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className={styles.statTrack}>
        <div
          className={styles.statFill}
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function PitchMap({ player, pitchPosFromState }) {
  const roleMap = {
    "Attacking Mid": { x: 65, y: 50 },
    Attacker: { x: 75, y: 50 },
    Forward: { x: 78, y: 50 },
    Midfielder: { x: 55, y: 50 },
    Defender: { x: 35, y: 50 },
    Goalkeeper: { x: 10, y: 50 },
  };

  const pitchPos = pitchPosFromState ||
    (player?.position && roleMap[player.position]) || { x: 65, y: 50 };

  const svgX = (pitchPos.x / 100) * 300;
  const svgY = (pitchPos.y / 100) * 180;

  return (
    <div className={styles.pitchWrap}>
      <div className={styles.pitchHeader}>
        <div className={styles.pitchTitle}>Pitch Map</div>
        <div className={styles.pitchRole}>
          {player.position ?? "Preferred area"}
        </div>
      </div>

      <svg viewBox="0 0 300 180" className={styles.pitchSvg}>
        <defs>
          <linearGradient id="pitchGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#063447" stopOpacity="0.9" />
            <stop offset="1" stopColor="#042b3a" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <rect
          x="0"
          y="0"
          width="300"
          height="180"
          fill="url(#pitchGrad)"
          rx="8"
        />

        <g stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" fill="none">
          <rect x="10" y="10" width="280" height="160" rx="6" />
          <line x1="150" y1="10" x2="150" y2="170" />
          <circle cx="150" cy="90" r="18" />
          <rect x="10" y="60" width="40" height="60" />
          <rect x="250" y="60" width="40" height="60" />
        </g>

        <g transform={`translate(${svgX},${svgY})`}>
          <circle r="22" fill="#00d4ff" opacity="0.08" />
          <circle r="12" fill="#00d4ff" />
          <circle
            r="12"
            fill="none"
            stroke="#00d4ff"
            strokeOpacity="0.6"
            strokeWidth="2"
          >
            <animate
              attributeName="r"
              from="12"
              to="36"
              dur="1.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.9"
              to="0"
              dur="1.6s"
              repeatCount="indefinite"
            />
          </circle>
          <text x="18" y="-14" fill="#dbeafe" fontSize="10" fontWeight="700">
            {player.name.split(" ")[0]}
          </text>
        </g>
      </svg>
    </div>
  );
}

export default function PlayerDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const nameFromState = location.state?.name;
  const pitchPosFromState = location.state?.pitchPos;
  const [player, setPlayer] = useState(location.state?.player ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (player) return;

    async function fetchPlayer() {
      setLoading(true);
      try {
        const key = nameFromState || id;
        const res = await getPlayerStats(key);
        const p = res?.data?.player ?? res?.player ?? null;
        setPlayer(p);
      } finally {
        setLoading(false);
      }
    }

    if (nameFromState || id) fetchPlayer();
  }, [id, nameFromState, player]);

  if (loading) {
    return (
      <div className={styles.pageWrap}>
        <LoadingAnimation />
      </div>
    );
  }

  if (!player) return <div className={styles.pageWrap}>No player found</div>;

  const {
    name,
    firstname,
    lastname,
    age,
    birth,
    nationality,
    height,
    weight,
    photo,
    raw,
  } = player;

  const instagramPeopleSearch = name
    ? `https://www.instagram.com/explore/people/?q=${encodeURIComponent(name)}`
    : null;

  return (
    <div className={styles.pageWrap}>
      <header className={styles.hero}>
        <div
          className={styles.heroBg}
          style={{ backgroundImage: `url(${photo})` }}
        />
        <div className={styles.heroContent}>
          <img className={styles.playerPhoto} src={photo} alt={name} />
          <div>
            <h1 className={styles.playerName}>{name}</h1>
            <div className={styles.metaRow}>
              <span className={styles.pill}>{age} yrs</span>
              <span className={styles.pill}>
                {countryEmoji(nationality)} {nationality}
              </span>
              <span className={styles.leagueBadge}>
                League #{player.matched_league}
              </span>
            </div>
            <p className={styles.tagline}>
              Born {birth?.date} in {birth?.place}, {birth?.country}
            </p>
          </div>
        </div>
      </header>

      <main className={styles.mainGrid}>
        <section className={styles.card}>
          <h2>Bio</h2>
          <p>
            <strong>Full name:</strong> {firstname} {lastname}
          </p>
          <p>
            <strong>Nationality:</strong> {nationality}
          </p>
          <p>
            <strong>Birth:</strong> {birth?.date} — {birth?.place},{" "}
            {birth?.country}
          </p>
          <p>
            <strong>Player ID:</strong> {player.id}
          </p>

          <div className={styles.actionRow}>
            {instagramPeopleSearch ? (
              <a
                href={instagramPeopleSearch}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Follow
              </a>
            ) : (
              <button className={`${styles.btn} ${styles.btnPrimary}`} disabled>
                Follow
              </button>
            )}
            <button className={`${styles.btn} ${styles.btnGhost}`}>
              Share
            </button>
          </div>

          <PitchMap player={player} pitchPosFromState={pitchPosFromState} />
        </section>

        <section className={styles.card}>
          <h2>Physicals & Visuals</h2>

          <div className={styles.physRow}>
            <div className={styles.physItem}>
              <div className={styles.physValue}>{height} cm</div>
              <div className={styles.physLabel}>Height</div>
            </div>
            <div className={styles.physItem}>
              <div className={styles.physValue}>{weight} kg</div>
              <div className={styles.physLabel}>Weight</div>
            </div>
            <div className={styles.physItem}>
              <div className={styles.physValue}>{age}</div>
              <div className={styles.physLabel}>Age</div>
            </div>
          </div>

          <h3>Visual meters</h3>
          <StatBar
            label="Height (cm)"
            value={height}
            max={220}
            color="#7DD3FC"
          />
          <StatBar
            label="Weight (kg)"
            value={weight}
            max={110}
            color="#FBCFE8"
          />

          <details>
            <summary>Raw data</summary>
            <pre className={styles.rawBlock}>
              {JSON.stringify(raw ?? player, null, 2)}
            </pre>
          </details>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          Matched league: <strong>{player.matched_league}</strong>
        </div>
        <div>
          Injured: <strong>{String(raw?.injured ?? false)}</strong>
        </div>
      </footer>
    </div>
  );
}
