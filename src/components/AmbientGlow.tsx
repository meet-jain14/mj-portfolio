"use client";

import { useEffect, useRef, memo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GlowOrb {
  /** Horizontal starting position as a CSS string, e.g. "30%" or "200px" */
  x: string;
  /** Vertical starting position as a CSS string, e.g. "20%" or "100px" */
  y: string;
  /** Tailwind / CSS width, e.g. "600px" or "50vw" */
  width: string;
  /** Tailwind / CSS height, e.g. "600px" or "40vh" */
  height: string;
  /** Any CSS color — recommend hsla() for fine opacity control */
  color: string;
  /** Animation drift amplitude in px (horizontal). Default: 40 */
  driftX?: number;
  /** Animation drift amplitude in px (vertical). Default: 30 */
  driftY?: number;
  /** Full drift cycle in seconds. Default: 18 */
  duration?: number;
  /** Delay before animation starts, in seconds. Default: 0 */
  delay?: number;
}

export interface AmbientGlowProps {
  /** Override the default orb set with your own configuration */
  orbs?: GlowOrb[];
  /** Extra className on the outermost wrapper */
  className?: string;
  /** Respond subtly to mouse position (desktop only). Default: true */
  mouseParallax?: boolean;
  /** How strongly orbs react to mouse movement (0–1). Default: 0.018 */
  parallaxStrength?: number;
  /** Apply a fine noise-grain overlay for cinematic texture. Default: true */
  grain?: boolean;
  /** Blend mode for each glow layer. Default: "screen" */
  blendMode?: React.CSSProperties["mixBlendMode"];
  /** z-index of the entire background layer. Default: 0 */
  zIndex?: number;
  /** Whether the component fills a fixed viewport or its parent. Default: "fixed" */
  position?: "fixed" | "absolute";
}

// ─── Default emerald palette orbs ─────────────────────────────────────────────

const DEFAULT_ORBS: GlowOrb[] = [
  // Deep anchor — large, barely-there, bottom-left
  {
    x: "-10%",
    y: "55%",
    width: "80vw",
    height: "70vh",
    color: "hsla(158, 64%, 22%, 0.28)",
    driftX: 25,
    driftY: 20,
    duration: 28,
    delay: 0,
  },
  // Mid focal — centre-right, medium presence
  {
    x: "42%",
    y: "8%",
    width: "55vw",
    height: "60vh",
    color: "hsla(161, 72%, 30%, 0.22)",
    driftX: 35,
    driftY: 28,
    duration: 22,
    delay: 3,
  },
  // Accent — small, top-left, slight blue-green tint for depth
  {
    x: "5%",
    y: "2%",
    width: "38vw",
    height: "42vh",
    color: "hsla(172, 60%, 26%, 0.18)",
    driftX: 20,
    driftY: 15,
    duration: 32,
    delay: 6,
  },
  // Specular — tiny, bottom-right, lightest
  {
    x: "68%",
    y: "62%",
    width: "32vw",
    height: "38vh",
    color: "hsla(155, 80%, 34%, 0.14)",
    driftX: 30,
    driftY: 22,
    duration: 20,
    delay: 1.5,
  },
  // Vignette brightener — subtle centre core
  {
    x: "25%",
    y: "30%",
    width: "50vw",
    height: "50vh",
    color: "hsla(160, 55%, 18%, 0.12)",
    driftX: 15,
    driftY: 12,
    duration: 36,
    delay: 9,
  },
];

// ─── Single animated orb ──────────────────────────────────────────────────────

const GlowOrbLayer = memo(function GlowOrbLayer({
  orb,
  blendMode,
  mouseX,
  mouseY,
  parallaxStrength,
  index,
}: {
  orb: GlowOrb;
  blendMode: React.CSSProperties["mixBlendMode"];
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
  parallaxStrength: number;
  index: number;
}) {
  const {
    x,
    y,
    width,
    height,
    color,
    driftX = 40,
    driftY = 30,
    duration = 18,
    delay = 0,
  } = orb;

  // Each orb gets a unique parallax depth factor so they separate in z-space
  const depthFactor = 0.6 + index * 0.25;

  const translateX = useTransform(
    mouseX,
    (v) => v * parallaxStrength * depthFactor
  );
  const translateY = useTransform(
    mouseY,
    (v) => v * parallaxStrength * depthFactor
  );

  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
        mixBlendMode: blendMode,
        willChange: "transform",
        translateX,
        translateY,
      }}
      animate={{
        x: [0, driftX, -driftX * 0.6, driftX * 0.3, 0],
        y: [0, -driftY * 0.5, driftY, -driftY * 0.3, 0],
        scale: [1, 1.04, 0.97, 1.02, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
  );
});

// ─── Grain overlay (SVG-based, GPU-friendly) ──────────────────────────────────

const GrainOverlay = memo(function GrainOverlay() {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.035,
        pointerEvents: "none",
      }}
    >
      <filter id="ambient-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.72"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#ambient-grain)" />
    </svg>
  );
});

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * AmbientGlow
 *
 * Drop-in atmospheric background for dark portfolio sites.
 * Renders a stack of slow-drifting emerald radial glows that
 * respond subtly to mouse position. Stays below all content.
 *
 * @example
 * // In your root layout:
 * <AmbientGlow />
 * <main>{children}</main>
 */
export const AmbientGlow = memo(function AmbientGlow({
  orbs = DEFAULT_ORBS,
  className = "",
  mouseParallax = true,
  parallaxStrength = 0.018,
  grain = true,
  blendMode = "screen",
  zIndex = 0,
  position = "fixed",
}: AmbientGlowProps) {
  // Raw mouse position motion values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-smooth the mouse for buttery parallax
  const mouseX = useSpring(rawX, { stiffness: 40, damping: 30, mass: 1.2 });
  const mouseY = useSpring(rawY, { stiffness: 40, damping: 30, mass: 1.2 });

  useEffect(() => {
    if (!mouseParallax) return;

    const handleMove = (e: MouseEvent) => {
      // Center-relative coordinates
      rawX.set(e.clientX - window.innerWidth / 2);
      rawY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseParallax, rawX, rawY]);

  return (
    <div
      aria-hidden
      className={className}
      style={{
        position,
        inset: 0,
        zIndex,
        overflow: "hidden",
        pointerEvents: "none",
        // Isolate blending to this layer so it never bleeds into sibling UI
        isolation: "isolate",
        // Dark base — almost-black with a faint emerald undertone
        background: "hsl(160, 12%, 4%)",
      }}
    >
      {orbs.map((orb, i) => (
        <GlowOrbLayer
          key={i}
          orb={orb}
          blendMode={blendMode}
          mouseX={mouseX}
          mouseY={mouseY}
          parallaxStrength={parallaxStrength}
          index={i}
        />
      ))}

      {grain && <GrainOverlay />}
    </div>
  );
});

export default AmbientGlow;