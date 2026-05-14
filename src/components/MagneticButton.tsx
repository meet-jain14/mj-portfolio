"use client";

import { useRef, useState, useCallback, type ReactNode, type CSSProperties } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MagneticButtonProps {
  children: ReactNode;
  /** Magnetic pull strength. Range 0–1. Default: 0.35 */
  strength?: number;
  /** Extra classes on the outer wrapper (for sizing, positioning). */
  className?: string;
  /** Extra classes on the inner animated element. */
  innerClassName?: string;
  /** Whether the magnetic effect is active. Default: true */
  enabled?: boolean;
  /** Callback forwarded as the button's onClick. */
  onClick?: () => void;
  /** Any additional inline style on the wrapper. */
  style?: CSSProperties;
}

// ─── Spring config ────────────────────────────────────────────────────────────

/** Feels responsive yet silky – no bounce, no lag. */
const SPRING = { stiffness: 160, damping: 22, mass: 0.6 };

// ─── Component ────────────────────────────────────────────────────────────────

export function MagneticButton({
  children,
  strength = 0.35,
  className = "",
  innerClassName = "",
  enabled = true,
  onClick,
  style,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw target values (pixels)
  const rawX = useRef(0);
  const rawY = useRef(0);

  // Springy animated values
  const springX = useSpring(0, SPRING);
  const springY = useSpring(0, SPRING);

  // Subtle scale pulse on hover
  const scale = useSpring(1, { stiffness: 200, damping: 20, mass: 0.5 });

  // Derived: slight text / icon counter-shift for a "depth" feel
  const innerX = useTransform(springX, (v) => v * -0.12);
  const innerY = useTransform(springY, (v) => v * -0.12);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Distance from cursor to button center
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      rawX.current = dx * strength;
      rawY.current = dy * strength;

      springX.set(rawX.current);
      springY.set(rawY.current);
    },
    [enabled, strength, springX, springY]
  );

  const handleMouseEnter = useCallback(() => {
    if (!enabled) return;
    setIsHovered(true);
    scale.set(1.04);
  }, [enabled, scale]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Snap back to origin
    springX.set(0);
    springY.set(0);
    scale.set(1);
  }, [springX, springY, scale]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        x: springX,
        y: springY,
        scale,
        ...style,
      }}
      className={`relative inline-flex cursor-pointer select-none ${className}`}
      // Slight glow pulse using Framer's animate prop
      animate={
        isHovered
          ? { filter: "drop-shadow(0 0 18px rgba(255,255,255,0.08))" }
          : { filter: "drop-shadow(0 0 0px rgba(255,255,255,0))" }
      }
      transition={{ filter: { duration: 0.3 } }}
    >
      {/* Inner layer — counter-shifts slightly for parallax depth */}
      <motion.span
        style={{ x: innerX, y: innerY }}
        className={`inline-flex items-center justify-center ${innerClassName}`}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}

export default MagneticButton;