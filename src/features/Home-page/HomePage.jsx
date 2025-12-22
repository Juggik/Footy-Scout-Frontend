import React from "react";
import declan from "../../assets/home-page-player-faces/declanrice.jpg";
import dembele from "../../assets/home-page-player-faces/dembele.webp";
import haaland from "../../assets/home-page-player-faces/Haaland.webp";
import mbappe from "../../assets/home-page-player-faces/mbappe.webp";
import messi from "../../assets/home-page-player-faces/messi.jpg";
import ronaldo from "../../assets/home-page-player-faces/ronaldo.jpg";
import salah from "../../assets/home-page-player-faces/salah.jpg";
import yamal from "../../assets/home-page-player-faces/yamal.jpg";

export default function HomePage() {
  const slides = [declan, dembele, haaland, mbappe, messi, ronaldo, salah, yamal];

  // Larger = slower. Tune to taste (e.g., 20, 30, 60)
  const ANIMATION_DURATION =10; // seconds for one full loop of the duplicated track

  return (
    <div>

      <section
        aria-label="Players carousel"
        style={{ overflow: "hidden", width: "100%", padding: "12px 0" }}
      >
        <div
          className="marquee"
          style={{ ["--marquee-duration"]: `${ANIMATION_DURATION}s` }}
        >
          <div className="marquee__track">
            {slides.concat(slides).map((src, i) => (
              <div className="marquee__item" key={i}>
                <img
                  src={src}
                  alt={`player-${i}`}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .marquee {
          --gap: 20px;
        }

        .marquee__track {
          display: flex;
          gap: var(--gap);
          align-items: center;
          animation: marquee var(--marquee-duration) linear infinite;
          will-change: transform;
        }

        .marquee__item {
          flex: 0 0 calc((100% / 4) - (var(--gap) * 3 / 4));
          max-width: 330px;
        }

        @media (max-width: 1024px) {
          .marquee__item {
            flex: 0 0 calc((100% / 2) - (var(--gap) / 2));
            max-width: 45%;
          }
        }

        @media (max-width: 464px) {
          .marquee__item {
            flex: 0 0 calc(100% - var(--gap));
            max-width: 100%;
          }
        }

        /* Pause on hover/focus for accessibility */
        .marquee:hover .marquee__track,
        .marquee:focus-within .marquee__track {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
