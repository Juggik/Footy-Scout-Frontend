import React from "react";

export default function LoadingAnimation() {
  const DURATION = 2.6; // seconds for a full loop

  return (
    <div
      className="loader-wrap"
      aria-label="Loading animation: Welcome to Footy Scouter"
      style={{
        // percentage bounds matching the SVG goal inner edges (16% and 84%)
        // then inset them slightly using --edge-inset so the ball stops earlier
        "--left-bound": "calc(16% + var(--edge-inset))",
        "--right-bound": "calc(84% - var(--edge-inset))",
        "--edge-inset": "2%",   // increase to stop further inside; decrease to move closer to goals
        "--duration": `${DURATION}s`,
      }}
    >
      {/* <div className="welcome">VAR CHECK UNDERWAY</div> */}

      <div className="stadium">
        <div className="lights" />
        <div className="pitch">
          <svg className="pitch-lines" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" aria-hidden>
            <rect x="20" y="20" width="960" height="560" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="4"/>
            <line x1="500" y1="20" x2="500" y2="580" stroke="rgba(255,255,255,0.85)" strokeWidth="3"/>
            <circle cx="500" cy="300" r="80" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3"/>
            <circle cx="500" cy="300" r="4" fill="rgba(255,255,255,0.95)"/>
            <rect x="20" y="170" width="140" height="260" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3"/>
            <rect x="840" y="170" width="140" height="260" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3"/>
            <rect x="20" y="245" width="60" height="110" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
            <rect x="920" y="245" width="60" height="110" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
            <line x1="20" y1="260" x2="20" y2="340" stroke="rgba(255,255,255,0.95)" strokeWidth="6"/>
            <line x1="980" y1="260" x2="980" y2="340" stroke="rgba(255,255,255,0.95)" strokeWidth="6"/>
          </svg>

          {/* Ball only — goals removed */}
          <div className="ball" />
        </div>
      </div>

      <style>{`
        :root {
          --width: min(92vw, 1200px);
          --height: min(56vh, 640px);
          --ball-size: 4.6%;
          --gap: 6%;
        }

        .loader-wrap {
          width: var(--width);
          margin: 28px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .welcome {
          font-size: clamp(18px, 2.2vw, 28px);
          color: #f7f7f7;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.6);
        }

        .welcome span {
          color: #ffd24d;
          padding: 6px 10px;
          border-radius: 6px;
          margin-left: 8px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.45);
        }

        .stadium {
          width: 100%;
          height: var(--height);
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 28px 60px rgba(0,0,0,0.6);
          background: linear-gradient(180deg, #0f6b2f 0%, #0b5a28 100%);
        }

        .lights {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(60% 30% at 50% 6%, rgba(255,255,240,0.12), transparent 18%),
            radial-gradient(80% 40% at 50% 94%, rgba(0,0,0,0.35), rgba(0,0,0,0.6) 70%);
          mix-blend-mode: screen;
          filter: blur(8px);
          z-index: 1;
          animation: lightsPulse calc(var(--duration) * 2) ease-in-out infinite;
        }

        @keyframes lightsPulse {
          0% { opacity: 0.95; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.01); }
          100% { opacity: 0.95; transform: scale(1); }
        }

        .pitch {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 2;
          padding: 0;
        }

        .pitch::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.00) 10%),
            linear-gradient(90deg, rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.00) 30%),
            linear-gradient(90deg, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.00) 50%),
            linear-gradient(90deg, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.00) 70%),
            linear-gradient(90deg, rgba(255,255,255,0.02) 80%, rgba(255,255,255,0.00) 90%);
          background-size: 200% 100%;
          opacity: 0.12;
          mix-blend-mode: overlay;
        }

        .pitch-lines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 6;
          pointer-events: none;
          opacity: 0.95;
        }

        /* ball only — no outer goals */
        .ball {
          position: absolute;
          width: var(--ball-size);
          height: var(--ball-size);
          min-width: 44px;
          min-height: 44px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 30%, #fff 55%, #e6e6e6 56%),
            linear-gradient(135deg, #222 0%, #111 100%);
          box-shadow: 0 18px 30px rgba(0,0,0,0.55), inset -6px -6px 12px rgba(255,255,255,0.06);
          z-index: 8;
          left: var(--left-bound, 16%);
          top: 62%;
          transform: translateY(-50%);
          animation: ballPath var(--duration) linear infinite;
          will-change: transform, left, top;
        }

        .ball::before {
          content: "";
          position: absolute;
          inset: 8%;
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12), transparent 30%),
            repeating-linear-gradient(45deg, rgba(0,0,0,0.18) 0 6px, transparent 6px 12px);
          mix-blend-mode: overlay;
          opacity: 0.95;
          animation: spinSheen calc(var(--duration) * 0.6) linear infinite;
        }

        .ball::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -18%;
          transform: translateX(-50%);
          width: 140%;
          height: 18%;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(0,0,0,0.5), rgba(0,0,0,0.12) 40%, transparent 70%);
          filter: blur(6px);
          z-index: -1;
          animation: shadowScale var(--duration) linear infinite;
        }

        /* ball path uses percentage bounds so it travels between the SVG goals,
           but inset slightly using --edge-inset so it stops earlier than the openings */
        @keyframes ballPath {
          0% {
            left: var(--left-bound, 16%);
            top: 62%;
            transform: translateY(-50%) scale(1) rotate(0deg);
            animation-timing-function: cubic-bezier(.4,0,.2,1);
          }
          12% {
            left: calc( var(--left-bound, 16%) + ( (var(--right-bound, 84%) - var(--left-bound, 16%)) * 0.22 ) );
            top: 28%;
            transform: translateY(-50%) scale(0.98) rotate(40deg);
          }
          24% {
            left: calc( var(--left-bound, 16%) + ( (var(--right-bound, 84%) - var(--left-bound, 16%)) * 0.38 ) );
            top: 72%;
            transform: translateY(-50%) scale(1.02) rotate(120deg);
          }
          36% {
            left: calc( var(--left-bound, 16%) + ( (var(--right-bound, 84%) - var(--left-bound, 16%)) * 0.52 ) );
            top: 40%;
            transform: translateY(-50%) scale(0.96) rotate(200deg);
          }
          50% {
            left: var(--right-bound, 84%);
            top: 62%;
            transform: translateY(-50%) scale(1) rotate(360deg);
          }
          62% {
            left: calc( var(--left-bound, 16%) + ( (var(--right-bound, 84%) - var(--left-bound, 16%)) * 0.78 ) );
            top: 28%;
            transform: translateY(-50%) scale(0.98) rotate(420deg);
          }
          74% {
            left: calc( var(--left-bound, 16%) + ( (var(--right-bound, 84%) - var(--left-bound, 16%)) * 0.62 ) );
            top: 72%;
            transform: translateY(-50%) scale(1.02) rotate(520deg);
          }
          86% {
            left: calc( var(--left-bound, 16%) + ( (var(--right-bound, 84%) - var(--left-bound, 16%)) * 0.42 ) );
            top: 36%;
            transform: translateY(-50%) scale(0.96) rotate(640deg);
          }
          100% {
            left: var(--left-bound, 16%);
            top: 62%;
            transform: translateY(-50%) scale(1) rotate(720deg);
          }
        }

        @keyframes shadowScale {
          0% { transform: translateX(-50%) scaleX(1); opacity: 0.9; }
          12% { transform: translateX(-50%) scaleX(0.6); opacity: 0.45; }
          24% { transform: translateX(-50%) scaleX(1.05); opacity: 0.95; }
          36% { transform: translateX(-50%) scaleX(0.6); opacity: 0.45; }
          50% { transform: translateX(-50%) scaleX(1); opacity: 0.9; }
          62% { transform: translateX(-50%) scaleX(0.6); opacity: 0.45; }
          74% { transform: translateX(-50%) scaleX(1.05); opacity: 0.95; }
          86% { transform: translateX(-50%) scaleX(0.6); opacity: 0.45; }
          100% { transform: translateX(-50%) scaleX(1); opacity: 0.9; }
        }

        @keyframes spinSheen {
          0% { transform: rotate(0deg); opacity: 0.95; }
          50% { transform: rotate(180deg); opacity: 0.6; }
          100% { transform: rotate(360deg); opacity: 0.95; }
        }

        /* responsive tweaks */
        @media (max-width: 900px) {
          :root {
            --ball-size: 6.8%;
            --gap: 7%;
          }
        }

        @media (max-width: 520px) {
          :root {
            --ball-size: 10%;
            --gap: 8%;
            --height: 46vh;
          }
          .welcome { font-size: 18px; }
        }
      `}</style>
    </div>
  );
}
