"use client";

import React, { createContext, useContext, useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import gsap from "gsap";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type CursorVariant = "default" | "hover" | "click" | "magnetic" | "text" | "hidden";

interface CursorContextValue {
  variant: CursorVariant;
  setVariant: (v: CursorVariant) => void;
  /** Call with the target element to activate magnetic pull */
  setMagneticTarget: (el: HTMLElement | null) => void;
}

const CursorContext = createContext<CursorContextValue>({
  variant: "default",
  setVariant: () => {},
  setMagneticTarget: () => {},
});

export const useCursor = () => useContext(CursorContext);

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const EMERALD = {
  core:   "rgba(52, 211, 153, 1)",
  mid:    "rgba(16, 185, 129, 0.55)",
  outer:  "rgba(6,  95,  70,  0.18)",
  faint:  "rgba(52, 211, 153, 0.06)",
};

const SPRING_CORE   = { stiffness: 620, damping: 38, mass: 0.5 };
const SPRING_RING   = { stiffness: 180, damping: 26, mass: 0.8 };
const SPRING_TRAIL  = { stiffness: 90,  damping: 22, mass: 1.2 };

// ─────────────────────────────────────────────────────────────────────────────
// Cursor Renderer
// ─────────────────────────────────────────────────────────────────────────────

function CursorRenderer() {
  // Raw pointer position
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  // Layered spring positions
  const coreX  = useSpring(rawX, SPRING_CORE);
  const coreY  = useSpring(rawY, SPRING_CORE);
  const ringX  = useSpring(rawX, SPRING_RING);
  const ringY  = useSpring(rawY, SPRING_RING);
  const trailX = useSpring(rawX, SPRING_TRAIL);
  const trailY = useSpring(rawY, SPRING_TRAIL);

  const { variant } = useCursor();
  const pulseRef   = useRef<HTMLDivElement>(null);
  const gsapTweenRef = useRef<gsap.core.Tween | null>(null);
  const isVisible  = variant !== "hidden";

  // ── Pointer tracking ──────────────────────────────────────────────────────
  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY]);

  // ── Energy pulse (GSAP) ───────────────────────────────────────────────────
  useEffect(() => {
    if (!pulseRef.current) return;

    gsapTweenRef.current?.kill();

    if (variant === "hover" || variant === "magnetic") {
      gsapTweenRef.current = gsap.to(pulseRef.current, {
        scale: 1.55,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        repeat: -1,
        repeatDelay: 0.15,
      });
    } else {
      gsap.set(pulseRef.current, { scale: 1, opacity: 0 });
    }

    return () => { gsapTweenRef.current?.kill(); };
  }, [variant]);

  // ── Click ripple ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (variant !== "click" || !pulseRef.current) return;
    gsap.fromTo(
      pulseRef.current,
      { scale: 0.8, opacity: 0.9 },
      { scale: 2.2, opacity: 0, duration: 0.45, ease: "power3.out" }
    );
  }, [variant]);

  // ── Derived visual states ─────────────────────────────────────────────────
  const coreDot = {
    default:  { scale: 1,    opacity: 1    },
    hover:    { scale: 1.4,  opacity: 1    },
    click:    { scale: 0.7,  opacity: 1    },
    magnetic: { scale: 1.6,  opacity: 0.9  },
    text:     { scale: 0.35, opacity: 0.7  },
    hidden:   { scale: 0,    opacity: 0    },
  };

  const ringState = {
    default:  { scale: 1,    opacity: 0.55, borderWidth: 1   },
    hover:    { scale: 1.6,  opacity: 0.85, borderWidth: 1.5 },
    click:    { scale: 0.85, opacity: 0.95, borderWidth: 2   },
    magnetic: { scale: 2,    opacity: 0.5,  borderWidth: 1   },
    text:     { scale: 2.8,  opacity: 0.35, borderWidth: 1   },
    hidden:   { scale: 0,    opacity: 0,    borderWidth: 1   },
  };

  const trailState = {
    default:  { scale: 1,   opacity: 0.18 },
    hover:    { scale: 1.4, opacity: 0.28 },
    click:    { scale: 0.8, opacity: 0.35 },
    magnetic: { scale: 1.8, opacity: 0.22 },
    text:     { scale: 2,   opacity: 0.1  },
    hidden:   { scale: 0,   opacity: 0    },
  };

  const cd = coreDot[variant];
  const rs = ringState[variant];
  const ts = trailState[variant];

  const transition = { type: "spring", stiffness: 380, damping: 28 };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* ── Trail / glow blob ───────────────────────────────────────── */}
          <motion.div
            aria-hidden
            style={{
              position:     "fixed",
              top:          0,
              left:         0,
              pointerEvents:"none",
              zIndex:       99997,
              x:            trailX,
              y:            trailY,
              translateX:   "-50%",
              translateY:   "-50%",
              width:        48,
              height:       48,
              borderRadius: "50%",
              background:   `radial-gradient(circle, ${EMERALD.mid} 0%, ${EMERALD.outer} 55%, transparent 75%)`,
              filter:       "blur(10px)",
              willChange:   "transform",
            }}
            animate={{ scale: ts.scale, opacity: ts.opacity }}
            transition={transition}
          />

          {/* ── Outer ring ──────────────────────────────────────────────── */}
          <motion.div
            aria-hidden
            style={{
              position:     "fixed",
              top:          0,
              left:         0,
              pointerEvents:"none",
              zIndex:       99998,
              x:            ringX,
              y:            ringY,
              translateX:   "-50%",
              translateY:   "-50%",
              width:        28,
              height:       28,
              borderRadius: "50%",
              border:       `${rs.borderWidth}px solid ${EMERALD.core}`,
              boxShadow:    `0 0 8px 1px ${EMERALD.outer}, inset 0 0 6px 0px ${EMERALD.faint}`,
              willChange:   "transform",
            }}
            animate={{
              scale:        rs.scale,
              opacity:      rs.opacity,
              borderWidth:  rs.borderWidth,
            }}
            transition={transition}
          />

          {/* ── Energy pulse ring (GSAP-driven) ─────────────────────────── */}
          <motion.div
            aria-hidden
            ref={pulseRef}
            style={{
              position:     "fixed",
              top:          0,
              left:         0,
              pointerEvents:"none",
              zIndex:       99997,
              x:            ringX,
              y:            ringY,
              translateX:   "-50%",
              translateY:   "-50%",
              width:        28,
              height:       28,
              borderRadius: "50%",
              border:       `1px solid ${EMERALD.mid}`,
              opacity:      0,
              willChange:   "transform, opacity",
            }}
          />

          {/* ── Core dot ────────────────────────────────────────────────── */}
          <motion.div
            aria-hidden
            style={{
              position:     "fixed",
              top:          0,
              left:         0,
              pointerEvents:"none",
              zIndex:       99999,
              x:            coreX,
              y:            coreY,
              translateX:   "-50%",
              translateY:   "-50%",
              width:        5,
              height:       5,
              borderRadius: "50%",
              background:   EMERALD.core,
              boxShadow:    `0 0 6px 2px ${EMERALD.mid}, 0 0 14px 3px ${EMERALD.outer}`,
              willChange:   "transform",
            }}
            animate={{ scale: cd.scale, opacity: cd.opacity }}
            transition={transition}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [isTouch, setIsTouch] = useState(false);
  const [variant, setVariantState] = useState<CursorVariant>("default");
  const magneticTargetRef = useRef<HTMLElement | null>(null);
  const magneticTweenRef  = useRef<gsap.core.Tween | null>(null);

  // Detect touch device once on mount
  useEffect(() => {
    const check = () =>
      setIsTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
    check();
  }, []);

  const setVariant = useCallback((v: CursorVariant) => setVariantState(v), []);

  const setMagneticTarget = useCallback((el: HTMLElement | null) => {
    // Clean up previous magnetic tween
    if (magneticTweenRef.current) {
      magneticTweenRef.current.kill();
      if (magneticTargetRef.current) {
        gsap.to(magneticTargetRef.current, {
          x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.4)",
        });
      }
    }

    magneticTargetRef.current = el;

    if (!el) {
      setVariant("default");
      return;
    }

    setVariant("magnetic");

    const onMove = (e: MouseEvent) => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      const strength = 0.32;

      magneticTweenRef.current = gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", () => {
      el.removeEventListener("mousemove", onMove);
      gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.35)" });
      setVariant("default");
      magneticTargetRef.current = null;
    }, { once: true });
  }, [setVariant]);

  // Hide system cursor globally
  useEffect(() => {
    if (isTouch) return;
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [isTouch]);

  if (isTouch) {
    return <>{children}</>;
  }

  return (
    <CursorContext.Provider value={{ variant, setVariant, setMagneticTarget }}>
      {children}
      <CursorRenderer />
    </CursorContext.Provider>
  );
}
