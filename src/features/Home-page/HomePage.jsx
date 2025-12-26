import React, { useEffect, useState } from "react";
import client from "../../api/client";

import declan from "../../assets/home-page-player-faces/declanrice.jpg";
import dembele from "../../assets/home-page-player-faces/dembele.webp";
import haaland from "../../assets/home-page-player-faces/Haaland.webp";
import mbappe from "../../assets/home-page-player-faces/mbappe.webp";
import messi from "../../assets/home-page-player-faces/messi.jpg";
import ronaldo from "../../assets/home-page-player-faces/ronaldo.jpg";
import salah from "../../assets/home-page-player-faces/salah.jpg";
import yamal from "../../assets/home-page-player-faces/yamal.jpg";
import england from "../../assets/Nation-flags/England.svg";
import argentina from "../../assets/Nation-flags/Argentina.svg";
import egypt from "../../assets/Nation-flags/Egypt.svg";
import french from "../../assets/Nation-flags/French.svg";
import norway from "../../assets/Nation-flags/Norway.svg";
import spain from "../../assets/Nation-flags/Spain.svg";
import portugal from "../../assets/Nation-flags/Portugal.svg";

import Carousel from "../../Components/Carousel/Carousel";
import StatCard from "../../Components/StatCard/StatCard";

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const slides = [
    {
      id: 1,
      name: "Declan Rice",
      club: "Arsenal FC",
      emoji: england,
      nationality: "English",
      foot: "Right",
      src: declan,
    },
    {
      id: 2,
      name: "Ousmane Dembele",
      club: "Paris Saint Germain",
      emoji: french,
      nationality: "French",
      foot: "Both",
      src: dembele,
    },
    {
      id: 3,
      name: "Erling Haaland",
      club: "Manchester City",
      emoji: norway,
      nationality: "Norwegian",
      foot: "Left",
      src: haaland,
    },
    {
      id: 4,
      name: "Kylian Mbappe",
      src: mbappe,
      club: "Paris Saint Germain",
      emoji: french,
      nationality: "French",
      foot: "Right",
    },
    {
      id: 5,
      name: "Lionel Messi",
      src: messi,
      club: "Inter Miami FC",
      emoji: argentina,
      nationality: "Argentinian",
      foot: "Left",
    },
    {
      id: 6,
      name: "Cristiano Ronaldo",
      src: ronaldo,
      club: "Al-Nassr",
      emoji: portugal,
      nationality: "Portugal",
      foot: "Right",
    },
    {
      id: 7,
      name: "Mohamed Salah",
      src: salah,
      club: "Liverpool FC",
      emoji: egypt,
      nationality: "Egyptian",
      foot: "Left",
    },
    {
      id: 8,
      name: "Lamine Yamal",
      src: yamal,
      club: "Barcelona FC",
      emoji: spain,
      nationality: "Spanish",
      foot: "Left",
    },
  ];

  useEffect(() => {
    async function loadStats() {
      const res = await client.get("/homePageStats/topStats");
      const data = res.data.data;

      // inside useEffect -> loadStats()
      const mapPlayers = (arr) =>
        arr.map((p, i) => ({
          id: p.id,
          rank: i + 1,
          name: p.player_name,
          club: p.team_name,
          league: p.competition,
          matches: p.played_matches,
          goals: p.goals,
          assists: p.assists,
        }));

      setStats({
        topScorers: mapPlayers(data.top_scorers),
        topAssists: mapPlayers(data.top_assists),
        topGA: mapPlayers(data.top_g_a),
      });
    }
    loadStats();
  }, []);

  if (!stats) return <div>Loading…</div>;

  return (
    <div>
      <Carousel slides={slides} />

      <StatCard
        topScorers={stats.topScorers}
        topAssists={stats.topAssists}
        topGA={stats.topGA}
      />
    </div>
  );
}
