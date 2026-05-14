"use client";

import { useRef, useCallback } from "react";
import { useCursor, CursorVariant } from "./CursorProvider";

// ─────────────────────────────────────────────────────────────────────────────
// useCursorVariant
// Attach hover/leave handlers to any element to switch cursor variant.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns event handlers that toggle the cursor variant on enter/leave.
 *
 * @example
 * const handlers = useCursorVariant("hover");
 * <a {...handlers}>Link</a>
 */
export function useCursorVariant(hoverVariant: CursorVariant = "hover") {
  const { setVariant } = useCursor();

  const onMouseEnter = useCallback(() => setVariant(hoverVariant), [setVariant, hoverVariant]);
  const onMouseLeave = useCallback(() => setVariant("default"),   [setVariant]);
  const onMouseDown  = useCallback(() => setVariant("click"),     [setVariant]);
  const onMouseUp    = useCallback(() => setVariant(hoverVariant),[setVariant, hoverVariant]);

  return { onMouseEnter, onMouseLeave, onMouseDown, onMouseUp };
}

// ─────────────────────────────────────────────────────────────────────────────
// useMagneticCursor
// Attach to a button/link to get the full magnetic pull + cursor variant.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a ref to attach to the element you want magnetic behaviour on.
 * The element will be pulled toward the cursor while it hovers nearby,
 * then spring back when it leaves.
 *
 * @example
 * const ref = useMagneticCursor();
 * <button ref={ref}>Magnetic</button>
 */
export function useMagneticCursor<T extends HTMLElement = HTMLElement>() {
  const { setMagneticTarget } = useCursor();
  const ref = useRef<T>(null);

  const onMouseEnter = useCallback(() => {
    if (ref.current) setMagneticTarget(ref.current);
  }, [setMagneticTarget]);

  // leave is handled internally by the provider; we just expose the ref
  return { ref, onMouseEnter };
}

// ─────────────────────────────────────────────────────────────────────────────
// useCursorHidden
// Temporarily hide the cursor (e.g. over videos, canvas, WebGL)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns handlers that hide the cursor while the pointer is over the element.
 *
 * @example
 * const handlers = useCursorHidden();
 * <canvas {...handlers} />
 */
export function useCursorHidden() {
  const { setVariant } = useCursor();

  const onMouseEnter = useCallback(() => setVariant("hidden"),  [setVariant]);
  const onMouseLeave = useCallback(() => setVariant("default"), [setVariant]);

  return { onMouseEnter, onMouseLeave };
}
