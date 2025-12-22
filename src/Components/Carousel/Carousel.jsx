import React, { useEffect, useRef, useState } from "react";

export default function Carousel({ slides = [] }) {
  // internal speed control (seconds per full loop)
  const ANIMATION_DURATION = 20; // smaller = faster

  const trackRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [translatePx, setTranslatePx] = useState(0);

  // count loaded images so we measure after all images have natural sizes
  const imagesToLoad = slides.length;
  const loadedCountRef = useRef(0);

  useEffect(() => {
    // if no slides, nothing to do
    if (!slides || slides.length === 0) return;

    // if track already measured and ready, nothing to do
    if (ready) return;

    // measure function
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;

      // total width of the track (both copies)
      const totalWidth = track.scrollWidth;
      // half width is the width of one set of slides
      const half = totalWidth / 2;

      // set translate to negative half in pixels
      setTranslatePx(Math.round(half));
      setReady(true);
    };

    // If images already loaded (cached), measure immediately
    // Otherwise, measurement will be triggered by onLoad handlers below
    // Use a small timeout to allow layout to settle
    const t = setTimeout(() => {
      // only measure if all images appear loaded
      if (loadedCountRef.current >= imagesToLoad) measure();
    }, 50);

    return () => clearTimeout(t);
  }, [slides, ready]);

  // image onLoad handler
  const handleImgLoad = () => {
    loadedCountRef.current += 1;
    if (loadedCountRef.current >= imagesToLoad) {
      // measure after a tiny delay to ensure layout settled
      requestAnimationFrame(() => {
        const track = trackRef.current;
        if (!track) return;
        const totalWidth = track.scrollWidth;
        const half = totalWidth / 2;
        setTranslatePx(Math.round(half));
        setReady(true);
      });
    }
  };

  if (!slides || slides.length === 0) return null;

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
            {doubled.map((src, i) => (
              <div className="marquee__item" key={`${i}-${src}`}>
                <img
                  src={src}
                  alt={`player ${(i % slides.length) + 1}`}
                  onLoad={handleImgLoad}
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
        :root { --gap-default: 20px; }

        .marquee { --gap: var(--gap-default); }

        .marquee__track {
          display: flex;
          align-items: center;
          /* animate using the pixel translate variable for exactness */
          animation: marquee var(--marquee-duration) linear infinite;
          will-change: transform;
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
