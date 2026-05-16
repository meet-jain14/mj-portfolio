"use client";

import { useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulsePhase: number;
  pulseSpeed: number;
  depth: number; // 0–1, simulates z-depth for parallax weight
}

interface Connection {
  a: number;
  b: number;
}

interface NeuralBackgroundProps {
  /** Number of nodes. Keep 28–55 for the premium, sparse feel. Default: 38 */
  nodeCount?: number;
  /** Base emerald accent color in RGB. Default: [52, 211, 153] — emerald-400 */
  accentRgb?: [number, number, number];
  /** Max distance (px) to draw a connection line. Default: 180 */
  connectionDistance?: number;
  /** Overall opacity multiplier 0–1. Default: 0.55 */
  globalOpacity?: number;
  /** Animation speed multiplier. Default: 1 */
  speed?: number;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TWO_PI = Math.PI * 2;
const BASE_VELOCITY = 0.18; // px/frame — intentionally glacial

// ─── Component ───────────────────────────────────────────────────────────────

export default function NeuralBackground({
  nodeCount = 38,
  accentRgb = [52, 211, 153],
  connectionDistance = 180,
  globalOpacity = 0.55,
  speed = 1,
  className = "",
}: NeuralBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const dimensionsRef = useRef({ w: 0, h: 0 });
  const frameRef = useRef(0);

  // ── Initialise nodes ───────────────────────────────────────────────────────
  const initNodes = useCallback(
    (w: number, h: number) => {
      nodesRef.current = Array.from({ length: nodeCount }, () => {
        const depth = Math.random(); // 0 = far, 1 = near
        const angle = Math.random() * TWO_PI;
        const vel = (BASE_VELOCITY + Math.random() * 0.12) * speed;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * vel,
          vy: Math.sin(angle) * vel,
          radius: 1.2 + depth * 2.2, // near nodes are slightly larger
          opacity: 0.25 + depth * 0.55,
          pulsePhase: Math.random() * TWO_PI,
          pulseSpeed: 0.008 + Math.random() * 0.012,
          depth,
        };
      });
    },
    [nodeCount, speed]
  );

  // ── Rebuild static connection list (recalculated each frame is fine at N≈38) ─
  const buildConnections = useCallback(() => {
    const nodes = nodesRef.current;
    const dist2 = connectionDistance * connectionDistance;
    const conns: Connection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < dist2) {
          conns.push({ a: i, b: j });
        }
      }
    }
    connectionsRef.current = conns;
  }, [connectionDistance]);

  // ── Main render loop ───────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = dimensionsRef.current;
    const nodes = nodesRef.current;
    const [r, g, b] = accentRgb;

    frameRef.current++;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // ── Update node positions ──────────────────────────────────────────────
    for (const node of nodes) {
      node.x += node.vx * speed;
      node.y += node.vy * speed;
      node.pulsePhase += node.pulseSpeed;

      // Soft wrap — nodes reappear on the opposite edge with slight randomness
      if (node.x < -20) node.x = w + 10;
      if (node.x > w + 20) node.x = -10;
      if (node.y < -20) node.y = h + 10;
      if (node.y > h + 20) node.y = -10;
    }

    // ── Rebuild connections (cheap at N≈38) ───────────────────────────────
    const dist2 = connectionDistance * connectionDistance;
    const conns: Connection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < dist2) conns.push({ a: i, b: j });
      }
    }
    connectionsRef.current = conns;

    // ── Draw connections ──────────────────────────────────────────────────
    for (const { a, b } of conns) {
      const na = nodes[a];
      const nb = nodes[b];
      const dx = na.x - nb.x;
      const dy = na.y - nb.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const fade = 1 - dist / connectionDistance;
      const depthFade = (na.depth + nb.depth) / 2;

      // Gradient line — subtler at ends
      const grad = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
      const lineAlpha = fade * depthFade * 0.22 * globalOpacity;
      grad.addColorStop(0, `rgba(${r},${g},${b},${lineAlpha})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${lineAlpha * 1.6})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},${lineAlpha})`);

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.6 + depthFade * 0.4;
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.stroke();
    }

    // ── Draw nodes ────────────────────────────────────────────────────────
    for (const node of nodes) {
      const pulse = 0.7 + 0.3 * Math.sin(node.pulsePhase);
      const coreAlpha = node.opacity * pulse * globalOpacity;
      const glowAlpha = coreAlpha * 0.35;
      const glowRadius = node.radius * 3.5;

      // Outer glow
      const glow = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, glowRadius
      );
      glow.addColorStop(0, `rgba(${r},${g},${b},${glowAlpha})`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.fillStyle = glow;
      ctx.arc(node.x, node.y, glowRadius, 0, TWO_PI);
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.fillStyle = `rgba(${r},${g},${b},${coreAlpha})`;
      ctx.arc(node.x, node.y, node.radius * pulse, 0, TWO_PI);
      ctx.fill();
    }

    // ── Vignette overlay ──────────────────────────────────────────────────
    // Painted once every 60 frames to save fillRect overdraw
    {
      const vig = ctx.createRadialGradient(
        w / 2, h / 2, h * 0.25,
        w / 2, h / 2, h * 0.9
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [accentRgb, connectionDistance, globalOpacity, speed]);

  // ── Resize handler ─────────────────────────────────────────────────────────
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2); // cap at 2× for perf
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    dimensionsRef.current = { w, h };
    initNodes(w, h);
  }, [initNodes]);

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  useEffect(() => {
    handleResize();

    const ro = new ResizeObserver(handleResize);
    if (canvasRef.current) ro.observe(canvasRef.current);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [handleResize, draw]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}