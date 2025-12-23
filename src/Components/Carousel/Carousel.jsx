import React, { useEffect, useRef, useState } from "react";
import CarouselCard from "../CarouselCard/CarouselCard";

export default function Carousel({ slides = [] }) {
  // internal speed control (seconds per full loop)
  const ANIMATION_DURATION = 30; // smaller = faster

  const trackRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [translatePx, setTranslatePx] = useState(0);

  // count loaded images so we measure after all images have natural sizes
  const imagesToLoad = slides.length;
  const loadedCountRef = useRef(0);

  // reset counters and ready state when slides change
  useEffect(() => {
    loadedCountRef.current = 0;
    setReady(false);
    setTranslatePx(0);
  }, [slides]);

  // measure function (reusable)
  const measureTrack = () => {
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = track.scrollWidth;
    const half = totalWidth / 2;
    // round to avoid subpixel artifacts; add +1 if you still see a seam
    setTranslatePx(Math.round(half));
    setReady(true);
  };

  // initial measurement attempt (in case images are cached)
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    // small timeout to allow layout to settle
    const t = setTimeout(() => {
      if (loadedCountRef.current >= imagesToLoad) measureTrack();
    }, 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides]);

  // re-measure on resize using ResizeObserver for precision
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => {
      // only re-measure if we've already been ready once
      if (loadedCountRef.current >= imagesToLoad) {
        measureTrack();
      }
    });
    ro.observe(track);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides, imagesToLoad]);

  // image onLoad handler (count only unique images)
  const handleImgLoad = () => {
    loadedCountRef.current += 1;
    if (loadedCountRef.current >= imagesToLoad) {
      // measure after a tiny delay to ensure layout settled
      requestAnimationFrame(() => {
        measureTrack();
      });
    }
  };

  if (!slides || slides.length === 0) return null;

  // duplicate slides for seamless loop
  const doubled = slides.concat(slides);

  return (
    <div>
      <section
        aria-label="Players carousel"
        style={{ overflow: "hidden", width: "100%", padding: "12px 0" }}
      >
        {/* set CSS variables for duration and translate (px) */}
        <div
          className="marquee"
          style={{
            // duration in seconds
            "--marquee-duration": `${ANIMATION_DURATION}s`,
            // translate in px (negative value)
            "--marquee-translate": ready ? `-${translatePx}px` : `-0px`,
          }}
        >
          <div className="marquee__track" ref={trackRef}>
            {doubled.map((players, i) => (
              <div className="marquee__item" key={`${i}-${players}`}>
                <CarouselCard
                  src={players.src}
                  alt={`player ${(i % slides.length) + 1}`}
                  name={players.name}
                  nationality={players.nationality}
                  emoji={players.emoji}
                  club={players.club}
                  foot={players.foot}
                  
                  // attach onLoad only for the first copy of each unique slide
                  onLoad={i < slides.length ? handleImgLoad : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        :root { --gap-default: 20px; }

        .marquee { --gap: var(--gap-default); }

        .marquee__track {
          display: flex;
          align-items: center;
          /* animate using the pixel translate variable for exactness */
          animation: marquee var(--marquee-duration) linear infinite;
          will-change: transform;
          /* GPU hint */
          transform: translate3d(0,0,0);
        }

        .marquee__item {
          box-sizing: border-box;
          /* 4 items visible on wide screens; adjust if you want different visible count */
          flex: 0 0 calc(25% - (var(--gap) * 3 / 4));
          max-width: 330px;
          margin-right: var(--gap);
        }

        /* remove trailing margin on last duplicated item to avoid tiny extra space */
        .marquee__track > .marquee__item:last-child {
          margin-right: 0;
        }

        @media (max-width: 1024px) {
          .marquee__item {
            flex: 0 0 calc(50% - (var(--gap) / 2));
            max-width: 45%;
          }
        }

        @media (max-width: 464px) {
          .marquee__item {
            flex: 0 0 calc(100% - var(--gap));
            max-width: 100%;
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(var(--marquee-translate));
          }
        }
      `}</style>
    </div>
  );
}


// <div className="marquee__track" ref={trackRef}>
//             {doubled.map((src, i) => (
//               <div className="marquee__item" key={`${i}-${src}`}>
//                 <img
//                   src={src}
//                   alt={`player ${(i % slides.length) + 1}`}
//                   onLoad={handleImgLoad}
//                   style={{
//                     display: "block",
//                     width: "100%",
//                     height: "200px",
//                     objectFit: "cover",
//                     borderRadius: 8,
//                   }}
//                 />
//               </div>