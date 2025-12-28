import React, { useEffect, useRef, useState } from "react";
import CarouselCard from "../CarouselCard/CarouselCard";
import styles from "./Carousel.module.css";

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

    // Observe the track AND its parent container
    const parent = track.parentElement;

    const ro = new ResizeObserver(() => {
      if (loadedCountRef.current >= imagesToLoad) {
        measureTrack();
      }
    });

    ro.observe(track);
    if (parent) ro.observe(parent);

    return () => ro.disconnect();
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
          className={styles.marquee}
          style={{
            // duration in seconds
            "--marquee-duration": `${ANIMATION_DURATION}s`,
            // translate in px (negative value)
            "--marquee-translate": ready ? `-${translatePx}px` : `-0px`,
          }}
        >
          <div className={styles.marquee__track} ref={trackRef}>
            {doubled.map((players, i) => (
              <div className={styles.marquee__item} key={`${i}-${players.name || i}`}>
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
                  // optional: set hoverShimmer to true if you want shimmer only on hover
                  hoverShimmer={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
