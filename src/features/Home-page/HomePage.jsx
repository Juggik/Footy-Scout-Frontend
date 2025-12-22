import React from "react";
import declan from "../../assets/home-page-player-faces/declanrice.jpg";
import dembele from "../../assets/home-page-player-faces/dembele.webp";
import haaland from "../../assets/home-page-player-faces/Haaland.webp";
import mbappe from "../../assets/home-page-player-faces/mbappe.webp";
import messi from "../../assets/home-page-player-faces/messi.jpg";
import ronaldo from "../../assets/home-page-player-faces/ronaldo.jpg";
import salah from "../../assets/home-page-player-faces/salah.jpg";
import yamal from "../../assets/home-page-player-faces/yamal.jpg";
import Carousel from "../../Components/Carousel/Carousel";

export default function HomePage() {
  const slides = [declan, dembele, haaland, mbappe, messi, ronaldo, salah, yamal];

  return (
    <div>
      <Carousel slides={slides} />
    </div>
  );
}


// {slides.concat(slides).map((src, i) => (
//               <div className="marquee__item" key={i}>
//                 <img
//                   src={src}
//                   alt={`player-${i}`}
//                   style={{
//                     display: "block",
//                     width: "100%",
//                     height: "200px",
//                     objectFit: "cover",
//                     borderRadius: 8,
//                   }}