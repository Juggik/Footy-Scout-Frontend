// src/components/Cursor/Cursor.jsx
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./Cursor.module.css";
import football from "../../assets/Cursor-design/football.svg";

export default function Cursor() {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const clientRef = useRef({ x: 0, y: 0 });
  const lastRef = useRef({ x: 0, y: 0 });
  const initializedRef = useRef(false);
  const particleIdRef = useRef(0);
  const particleCleanupRef = useRef(new Set());

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Disable on touch devices or when user prefers reduced motion
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduceMotion) {
      el.style.display = "none";
      return;
    }

    // Add body class to hide native cursor
    document.body.classList.add("has-custom-cursor");

    // helpers
    const lerp = (a, b, t) => a + (b - a) * t;
    const threshold = 0.4;

    // RAF loop that updates position and trail
    const loop = () => {
      const client = clientRef.current;
      const last = lastRef.current;

      last.x = lerp(last.x, client.x, 0.18);
      last.y = lerp(last.y, client.y, 0.18);

      // position container
      el.style.transform = `translate3d(${last.x}px, ${last.y}px, 0) translate(-50%, -50%)`;

      // update trail
      const trail = el.querySelector(`.${styles.trail}`);
      if (trail) {
        const dx = client.x - last.x;
        const dy = client.y - last.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const length = Math.min(Math.max(dist * 1.6, 6), 160);
        trail.style.width = `${length}px`;
        trail.style.transform = `translateX(${-(length / 2)}px) rotate(${angle}deg)`;
        trail.style.opacity = `${Math.min(dist / 18, 1)}`;
      }

      const dx = Math.abs(client.x - last.x);
      const dy = Math.abs(client.y - last.y);

      if (dx > threshold || dy > threshold) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = null;
      }
    };

    // create particle element appended to body
    const createParticle = (x, y) => {
      const id = ++particleIdRef.current;
      const p = document.createElement("div");
      p.className = styles.particle;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      const size = 6 + Math.random() * 10;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;

      // palette: blue, white, black, red
      const r = Math.random();
      if (r < 0.45) p.style.background = "rgba(46,163,255,0.95)"; // blue
      else if (r < 0.75) p.style.background = "rgba(255,255,255,0.95)"; // white
      else if (r < 0.9) p.style.background = "rgba(11,11,11,0.95)"; // black
      else p.style.background = "rgba(255,59,59,0.95)"; // red

      p.style.transform = `translate(-50%, -50%) scale(${0.6 + Math.random() * 0.9}) rotate(${Math.random() * 360}deg)`;
      p.dataset.pid = id;
      document.body.appendChild(p);
      particleCleanupRef.current.add(p);

      const remove = () => {
        if (p.parentNode) p.parentNode.removeChild(p);
        particleCleanupRef.current.delete(p);
      };
      p.addEventListener("animationend", remove, { once: true });
      // fallback
      setTimeout(remove, 900);
    };

    // pointer handlers
    const onPointerMove = (e) => {
      clientRef.current.x = e.clientX;
      clientRef.current.y = e.clientY;
      setVisible(true);

      // initialize last position on first move
      if (!initializedRef.current) {
        lastRef.current.x = e.clientX;
        lastRef.current.y = e.clientY;
        initializedRef.current = true;
        el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // spawn particles based on speed
      const last = lastRef.current;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const count = Math.min(4, Math.max(1, Math.floor(speed / 6)));
      for (let i = 0; i < count; i++) {
        const t = i / Math.max(1, count);
        const px = e.clientX - dx * (0.2 + t * 0.6) + (Math.random() - 0.5) * 8;
        const py = e.clientY - dy * (0.2 + t * 0.6) + (Math.random() - 0.5) * 8;
        createParticle(px, py);
      }

      // start RAF loop if not running
      if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
    };

    const onPointerLeave = () => setVisible(false);

    const onPointerDown = () => {
      el.classList.add(styles["cursor--active"]);
      el.classList.add(styles["cursor--kick"]);
      setTimeout(() => el.classList.remove(styles["cursor--kick"]), 260);
    };
    const onPointerUp = () => el.classList.remove(styles["cursor--active"]);

    // delegated hover handling for interactive elements
    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, [data-cursor-hover]';
    const onPointerOver = (e) => {
      const target = e.target;
      if (!target || !target.matches) return;
      if (target.matches(interactiveSelector)) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
          el.style.display = "none";
        } else {
          el.style.display = "";
          el.classList.add(styles["cursor--hover"]);
        }
      }
    };
    const onPointerOut = (e) => {
      const target = e.target;
      if (!target || !target.matches) return;
      if (target.matches(interactiveSelector)) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
          el.style.display = "";
        }
        el.classList.remove(styles["cursor--hover"]);
      }
    };

    const onFocusIn = (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) {
        el.style.display = "none";
      }
    };
    const onFocusOut = () => {
      el.style.display = "";
    };

    // attach listeners
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mouseup", onPointerUp);

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);

    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);

    // cleanup on unmount
    return () => {
      document.body.classList.remove("has-custom-cursor");

      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);

      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);

      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      // remove leftover particles
      particleCleanupRef.current.forEach((p) => {
        if (p.parentNode) p.parentNode.removeChild(p);
      });
      particleCleanupRef.current.clear();
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      ref={containerRef}
      className={styles.cursor}
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div className={styles.trail} />
      <div className={styles.inner}>
        <img src={football} alt="" className={styles.ballImg} />
        <div className={styles.glow} />
      </div>
    </div>,
    document.body
  );
}
