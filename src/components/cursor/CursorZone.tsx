"use client";

import React from "react";
import { useCursorVariant, useMagneticCursor, useCursorHidden } from "./useCursor";
import { CursorVariant } from "./CursorProvider";

// ─────────────────────────────────────────────────────────────────────────────
// <CursorZone>
// Wrap any element to change cursor variant on hover.
// ─────────────────────────────────────────────────────────────────────────────

interface CursorZoneProps {
  variant?: CursorVariant;
  children: React.ReactElement;
}

/**
 * Wraps a single child element and injects cursor variant handlers.
 *
 * @example
 * <CursorZone variant="hover">
 *   <a href="/about">About</a>
 * </CursorZone>
 */
export function CursorZone({ variant = "hover", children }: CursorZoneProps) {
  const handlers = useCursorVariant(variant);
  return React.cloneElement(children, handlers);
}

// ─────────────────────────────────────────────────────────────────────────────
// <MagneticElement>
// Wrap a button / link / icon to get full magnetic cursor pull.
// ─────────────────────────────────────────────────────────────────────────────

interface MagneticElementProps {
  children: React.ReactElement;
  /** Pass className / style overrides to the inner element */
  className?: string;
}

/**
 * Makes the child element magnetically attract the cursor.
 * The child must accept a `ref` and `onMouseEnter`.
 *
 * @example
 * <MagneticElement>
 *   <button>Hire me</button>
 * </MagneticElement>
 */
export function MagneticElement({ children }: MagneticElementProps) {
  const { ref, onMouseEnter } = useMagneticCursor<HTMLElement>();
  return React.cloneElement(children, { ref, onMouseEnter });
}

// ─────────────────────────────────────────────────────────────────────────────
// <HiddenCursorZone>
// Hides the custom cursor while hovering (WebGL, video, canvas).
// ─────────────────────────────────────────────────────────────────────────────

interface HiddenCursorZoneProps {
  children: React.ReactElement;
}

/**
 * Temporarily hides the custom cursor while the pointer is over the child.
 * The child receives native cursor behaviour from the OS.
 *
 * @example
 * <HiddenCursorZone>
 *   <canvas ref={webglCanvas} />
 * </HiddenCursorZone>
 */
export function HiddenCursorZone({ children }: HiddenCursorZoneProps) {
  const handlers = useCursorHidden();
  return React.cloneElement(children, handlers);
}
