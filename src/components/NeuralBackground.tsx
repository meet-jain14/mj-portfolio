"use client";

import { useEffect, useRef, useCallback } from "react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Node {
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   radius: number;
//   opacity: number;
//   pulsePhase: number;
//   pulseSpeed: number;
//   depth: number; // 0–1, simulates z-depth for parallax weight
// }

// interface Connection {
//   a: number;
//   b: number;
// }

// interface NeuralBackgroundProps {
//   /** Number of nodes. Keep 28–55 for the premium, sparse feel. Default: 38 */
//   nodeCount?: number;
//   /** Base emerald accent color in RGB. Default: [52, 211, 153] — emerald-400 */
//   accentRgb?: [number, number, number];
//   /** Max distance (px) to draw a connection line. Default: 180 */
//   connectionDistance?: number;
//   /** Overall opacity multiplier 0–1. Default: 0.55 */
//   globalOpacity?: number;
//   /** Animation speed multiplier. Default: 1 */
//   speed?: number;
//   className?: string;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const TWO_PI = Math.PI * 2;
// const BASE_VELOCITY = 0.18; // px/frame — intentionally glacial

// // ─── Component ───────────────────────────────────────────────────────────────

// export default function NeuralBackground({
//   nodeCount = 38,
//   accentRgb = [52, 211, 153],
//   connectionDistance = 180,
//   globalOpacity = 0.55,
//   speed = 1,
//   className = "",
// }: NeuralBackgroundProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const rafRef = useRef<number>(0);
//   const nodesRef = useRef<Node[]>([]);
//   const connectionsRef = useRef<Connection[]>([]);
//   const dimensionsRef = useRef({ w: 0, h: 0 });
//   const frameRef = useRef(0);

//   // ── Initialise nodes ───────────────────────────────────────────────────────
//   const initNodes = useCallback(
//     (w: number, h: number) => {
//       nodesRef.current = Array.from({ length: nodeCount }, () => {
//         const depth = Math.random(); // 0 = far, 1 = near
//         const angle = Math.random() * TWO_PI;
//         const vel = (BASE_VELOCITY + Math.random() * 0.12) * speed;
//         return {
//           x: Math.random() * w,
//           y: Math.random() * h,
//           vx: Math.cos(angle) * vel,
//           vy: Math.sin(angle) * vel,
//           radius: 1.2 + depth * 2.2, // near nodes are slightly larger
//           opacity: 0.25 + depth * 0.55,
//           pulsePhase: Math.random() * TWO_PI,
//           pulseSpeed: 0.008 + Math.random() * 0.012,
//           depth,
//         };
//       });
//     },
//     [nodeCount, speed]
//   );

//   // ── Rebuild static connection list (recalculated each frame is fine at N≈38) ─
//   const buildConnections = useCallback(() => {
//     const nodes = nodesRef.current;
//     const dist2 = connectionDistance * connectionDistance;
//     const conns: Connection[] = [];
//     for (let i = 0; i < nodes.length; i++) {
//       for (let j = i + 1; j < nodes.length; j++) {
//         const dx = nodes[i].x - nodes[j].x;
//         const dy = nodes[i].y - nodes[j].y;
//         if (dx * dx + dy * dy < dist2) {
//           conns.push({ a: i, b: j });
//         }
//       }
//     }
//     connectionsRef.current = conns;
//   }, [connectionDistance]);

//   // ── Main render loop ───────────────────────────────────────────────────────
//   const draw = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const { w, h } = dimensionsRef.current;
//     const nodes = nodesRef.current;
//     const [r, g, b] = accentRgb;

//     frameRef.current++;

//     // Clear
//     ctx.clearRect(0, 0, w, h);

//     // ── Update node positions ──────────────────────────────────────────────
//     for (const node of nodes) {
//       node.x += node.vx * speed;
//       node.y += node.vy * speed;
//       node.pulsePhase += node.pulseSpeed;

//       // Soft wrap — nodes reappear on the opposite edge with slight randomness
//       if (node.x < -20) node.x = w + 10;
//       if (node.x > w + 20) node.x = -10;
//       if (node.y < -20) node.y = h + 10;
//       if (node.y > h + 20) node.y = -10;
//     }

//     // ── Rebuild connections (cheap at N≈38) ───────────────────────────────
//     const dist2 = connectionDistance * connectionDistance;
//     const conns: Connection[] = [];
//     for (let i = 0; i < nodes.length; i++) {
//       for (let j = i + 1; j < nodes.length; j++) {
//         const dx = nodes[i].x - nodes[j].x;
//         const dy = nodes[i].y - nodes[j].y;
//         if (dx * dx + dy * dy < dist2) conns.push({ a: i, b: j });
//       }
//     }
//     connectionsRef.current = conns;

//     // ── Draw connections ──────────────────────────────────────────────────
//     for (const { a, b } of conns) {
//       const na = nodes[a];
//       const nb = nodes[b];
//       const dx = na.x - nb.x;
//       const dy = na.y - nb.y;
//       const dist = Math.sqrt(dx * dx + dy * dy);
//       const fade = 1 - dist / connectionDistance;
//       const depthFade = (na.depth + nb.depth) / 2;

//       // Gradient line — subtler at ends
//       const grad = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
//       const lineAlpha = fade * depthFade * 0.22 * globalOpacity;
//       grad.addColorStop(0, `rgba(${r},${g},${b},${lineAlpha})`);
//       grad.addColorStop(0.5, `rgba(${r},${g},${b},${lineAlpha * 1.6})`);
//       grad.addColorStop(1, `rgba(${r},${g},${b},${lineAlpha})`);

//       ctx.beginPath();
//       ctx.strokeStyle = grad;
//       ctx.lineWidth = 0.6 + depthFade * 0.4;
//       ctx.moveTo(na.x, na.y);
//       ctx.lineTo(nb.x, nb.y);
//       ctx.stroke();
//     }

//     // ── Draw nodes ────────────────────────────────────────────────────────
//     for (const node of nodes) {
//       const pulse = 0.7 + 0.3 * Math.sin(node.pulsePhase);
//       const coreAlpha = node.opacity * pulse * globalOpacity;
//       const glowAlpha = coreAlpha * 0.35;
//       const glowRadius = node.radius * 3.5;

//       // Outer glow
//       const glow = ctx.createRadialGradient(
//         node.x, node.y, 0,
//         node.x, node.y, glowRadius
//       );
//       glow.addColorStop(0, `rgba(${r},${g},${b},${glowAlpha})`);
//       glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
//       ctx.beginPath();
//       ctx.fillStyle = glow;
//       ctx.arc(node.x, node.y, glowRadius, 0, TWO_PI);
//       ctx.fill();

//       // Core dot
//       ctx.beginPath();
//       ctx.fillStyle = `rgba(${r},${g},${b},${coreAlpha})`;
//       ctx.arc(node.x, node.y, node.radius * pulse, 0, TWO_PI);
//       ctx.fill();
//     }

//     // ── Vignette overlay ──────────────────────────────────────────────────
//     // Painted once every 60 frames to save fillRect overdraw
//     {
//       const vig = ctx.createRadialGradient(
//         w / 2, h / 2, h * 0.25,
//         w / 2, h / 2, h * 0.9
//       );
//       vig.addColorStop(0, "rgba(0,0,0,0)");
//       vig.addColorStop(1, "rgba(0,0,0,0.45)");
//       ctx.fillStyle = vig;
//       ctx.fillRect(0, 0, w, h);
//     }

//     rafRef.current = requestAnimationFrame(draw);
//   }, [accentRgb, connectionDistance, globalOpacity, speed]);

//   // ── Resize handler ─────────────────────────────────────────────────────────
//   const handleResize = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const dpr = Math.min(window.devicePixelRatio ?? 1, 2); // cap at 2× for perf
//     const w = canvas.offsetWidth;
//     const h = canvas.offsetHeight;
//     canvas.width = w * dpr;
//     canvas.height = h * dpr;
//     const ctx = canvas.getContext("2d");
//     if (ctx) ctx.scale(dpr, dpr);
//     dimensionsRef.current = { w, h };
//     initNodes(w, h);
//   }, [initNodes]);

//   // ── Lifecycle ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     handleResize();

//     const ro = new ResizeObserver(handleResize);
//     if (canvasRef.current) ro.observe(canvasRef.current);

//     rafRef.current = requestAnimationFrame(draw);

//     return () => {
//       cancelAnimationFrame(rafRef.current);
//       ro.disconnect();
//     };
//   }, [handleResize, draw]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className={`absolute inset-0 w-full h-full ${className}`}
//       style={{ display: "block" }}
//       aria-hidden="true"
//     />
//   );
// }

// "use client";

/**
 * NeuralBackground — v2
 * ─────────────────────
 * A full-page, FIXED-position canvas that sits behind ALL page content.
 * Mount once in your root layout — it persists across every scroll section.
 *
 * What changed from v1:
 *  • position: fixed + 100vw/100vh  → effect covers entire page, not just the hero
 *  • No createLinearGradient per connection → flat alpha stroke (much cheaper)
 *  • Vignette on an offscreen canvas built once, composited each frame (zero overdraw)
 *  • globalAlpha batching per render pass
 *  • pointer-events: none → never blocks clicks / hovers on content above
 *  • Nodes initialized across the full visible viewport
 */

// import { useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  pulsePhase: number;
  pulseSpeed: number;
  depth: number;
}

export interface NeuralBackgroundProps {
  /** Nodes rendered. 30–50 is the sweet spot. Default: 40 */
  nodeCount?: number;
  /** Emerald accent in RGB. Default: [52, 211, 153] */
  accentRgb?: [number, number, number];
  /** Max px distance to draw a connection. Default: 170 */
  connectionDistance?: number;
  /** Master opacity 0–1. Default: 0.45 */
  globalOpacity?: number;
  /** Motion speed multiplier. Default: 1 */
  speed?: number;
  /** CSS z-index for the canvas layer. Default: 0 */
  zIndex?: number;
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const TWO_PI = Math.PI * 2;
const BASE_VEL = 0.16; // px / frame — intentionally glacial

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

// ─── Component ───────────────────────────────────────────────────────────────

export default function NeuralBackground({
  nodeCount = 40,
  accentRgb = [52, 211, 153],
  connectionDistance = 170,
  globalOpacity = 0.45,
  speed = 1,
  zIndex = 0,
}: NeuralBackgroundProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const vigRef       = useRef<HTMLCanvasElement | null>(null); // offscreen vignette
  const rafRef       = useRef<number>(0);
  const nodesRef     = useRef<Node[]>([]);
  const sizeRef      = useRef({ w: 0, h: 0 });

  // ── Build the vignette once, reuse every frame ─────────────────────────────
  const buildVignette = useCallback((w: number, h: number, dpr: number) => {
    const oc  = document.createElement("canvas");
    oc.width  = w * dpr;
    oc.height = h * dpr;
    const oc2 = oc.getContext("2d")!;
    oc2.scale(dpr, dpr);
    const g = oc2.createRadialGradient(
      w / 2, h / 2, h * 0.1,
      w / 2, h / 2, h * 0.9
    );
    g.addColorStop(0,   "rgba(0,0,0,0)");
    g.addColorStop(0.5, "rgba(0,0,0,0.12)");
    g.addColorStop(1,   "rgba(0,0,0,0.52)");
    oc2.fillStyle = g;
    oc2.fillRect(0, 0, w, h);
    vigRef.current = oc;
  }, []);

  // ── Seed nodes across the full viewport ───────────────────────────────────
  const initNodes = useCallback((w: number, h: number) => {
    nodesRef.current = Array.from({ length: nodeCount }, () => {
      const depth = Math.random();
      const angle = rand(0, TWO_PI);
      const vel   = (BASE_VEL + Math.random() * 0.1) * speed;
      return {
        x:           rand(-20, w + 20),
        y:           rand(-20, h + 20),
        vx:          Math.cos(angle) * vel,
        vy:          Math.sin(angle) * vel,
        radius:      1.0 + depth * 2.0,
        baseOpacity: 0.18 + depth * 0.44,
        pulsePhase:  rand(0, TWO_PI),
        pulseSpeed:  rand(0.006, 0.016),
        depth,
      };
    });
  }, [nodeCount, speed]);

  // ── Resize — canvas tracks the viewport window ─────────────────────────────
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w   = window.innerWidth;
    const h   = window.innerHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx?.scale(dpr, dpr);
    sizeRef.current = { w, h };
    buildVignette(w, h, dpr);
    // First mount → create nodes; resize → preserve + clamp
    if (nodesRef.current.length === 0) {
      initNodes(w, h);
    } else {
      for (const n of nodesRef.current) {
        if (n.x > w + 50) n.x = rand(0, w);
        if (n.y > h + 50) n.y = rand(0, h);
      }
    }
  }, [buildVignette, initNodes]);

  // ── Render loop ───────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    const nodes     = nodesRef.current;
    const [r, g, b] = accentRgb;
    const cd        = connectionDistance;
    const cd2       = cd * cd;

    // ① Clear
    ctx.clearRect(0, 0, w, h);

    // ② Advance positions
    for (const n of nodes) {
      n.x += n.vx * speed;
      n.y += n.vy * speed;
      n.pulsePhase += n.pulseSpeed;
      if (n.x < -30)    n.x = w + 20;
      else if (n.x > w + 30) n.x = -20;
      if (n.y < -30)    n.y = h + 20;
      else if (n.y > h + 30) n.y = -20;
    }

    // ③ Connection lines — flat strokes, no per-line gradient objects
    ctx.lineCap     = "round";
    ctx.strokeStyle = `rgb(${r},${g},${b})`;

    for (let i = 0; i < nodes.length; i++) {
      const na = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const nb   = nodes[j];
        const dx   = na.x - nb.x;
        const dy   = na.y - nb.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 >= cd2) continue;

        const dist      = Math.sqrt(dist2);
        const proximity = 1 - dist / cd;       // 1 = touching, 0 = threshold
        const depthAvg  = (na.depth + nb.depth) * 0.5;
        // Quadratic falloff — lines vanish gracefully as nodes drift apart
        const alpha = proximity * proximity * depthAvg * 0.16 * globalOpacity;

        ctx.globalAlpha = alpha;
        ctx.lineWidth   = 0.45 + depthAvg * 0.35;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      }
    }

    // ④ Nodes — soft aura + crisp core
    for (const n of nodes) {
      const pulse      = 0.76 + 0.24 * Math.sin(n.pulsePhase);
      const coreAlpha  = n.baseOpacity * pulse * globalOpacity;
      const glowRadius = n.radius * 4.2;

      // Aura (one radial gradient per node — unavoidable but cheap at N≤50)
      ctx.globalAlpha = coreAlpha * 0.26;
      const aura = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowRadius);
      aura.addColorStop(0, `rgb(${r},${g},${b})`);
      aura.addColorStop(1, "transparent");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(n.x, n.y, glowRadius, 0, TWO_PI);
      ctx.fill();

      // Core dot
      ctx.globalAlpha = coreAlpha;
      ctx.fillStyle   = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius * pulse, 0, TWO_PI);
      ctx.fill();
    }

    // ⑤ Composite the pre-rendered vignette — single drawImage, no gradient math
    ctx.globalAlpha = 1;
    if (vigRef.current) {
      ctx.drawImage(vigRef.current, 0, 0, w, h);
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [accentRgb, connectionDistance, globalOpacity, speed]);

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    handleResize();
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, draw]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "fixed",      // ← covers every scroll section, always
        top:           0,
        left:          0,
        width:         "100vw",
        height:        "100vh",
        display:       "block",
        pointerEvents: "none",       // ← never blocks any interaction above it
        zIndex,
        willChange:    "transform",  // compositor hint: own GPU layer
      }}
    />
  );
}