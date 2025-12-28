// components/Cursor/Cursor.jsx
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./Cursor.module.css";

export default function Cursor() {
  const elRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Hide on touch devices and when user prefers reduced motion
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduceMotion) {
      el.style.display = "none";
      return;
    }

    // Smooth follow using requestAnimationFrame
    let clientX = 0;
    let clientY = 0;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e) => {
      clientX = e.clientX;
      clientY = e.clientY;
      setVisible(true);
      // store raw pointer for other logic if needed
      posRef.current = { x: clientX, y: clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    const onLeave = () => setVisible(false);
    const onDown = () => el.classList.add(styles["cursor--active"]);
    const onUp = () => el.classList.remove(styles["cursor--active"]);

    function update() {
      // simple lerp for smoothing
      lastX += (clientX - lastX) * 0.18;
      lastY += (clientY - lastY) * 0.18;
      el.style.transform = `translate3d(${lastX}px, ${lastY}px, 0) translate(-50%, -50%)`;
      rafRef.current = null;
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Render into body so it overlays the whole site
  return ReactDOM.createPortal(
    <div
      ref={elRef}
      className={styles.cursor}
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div className={styles.inner} />
    </div>,
    document.body
  );
}
