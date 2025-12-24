import styles from "./StatCard.module.css";
import Tile from "../Tile/Tile"



export default function StatCard({ topScorers, topAssists, topGA }) {
  return (
    <div className={styles.mtGrid}>
      <Tile
        title="Top Scorers"
        items={topScorers}
        statKey="goals"
        statLabel="G"
        colorFrom="#ff7a18"
        colorTo="#af002d"
      />

      <Tile
        title="Top Assists"
        items={topAssists}
        statKey="assists"
        statLabel="A"
        colorFrom="#00b4ff"
        colorTo="#0072ff"
      />

      <Tile
        title="Top G/A"
        items={topGA}
        statKey="g+a"
        statLabel="G/A"
        colorFrom="#ffd166"
        colorTo="#ff6b6b"
      />
    </div>
  );
}
