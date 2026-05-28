import { useEffect, useRef, useState } from "react";

interface UndoToastProps {
  visible: boolean;
  message: string;
  durationMs?: number;
  onUndo: () => void;
  onDismiss: () => void;
}

/**
 * UndoToast — bottom-center "Sold: X. Undo" toast with a 10s countdown ring.
 * Stays out of the hot path. Dismisses on timeout or on undo.
 */
export function UndoToast({
  visible,
  message,
  durationMs = 10000,
  onUndo,
  onDismiss,
}: UndoToastProps) {
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible) {
      setElapsed(0);
      startRef.current = null;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now();

    const tick = (now: number) => {
      if (startRef.current === null) return;
      const delta = now - startRef.current;
      setElapsed(delta);
      if (delta >= durationMs) {
        onDismiss();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, durationMs, onDismiss]);

  if (!visible) return null;

  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const remaining = Math.max(0, 1 - elapsed / durationMs);
  const dashOffset = circumference * (1 - remaining);

  return (
    <div
      role="status"
      aria-live="polite"
      className="crumb-toast-in fixed left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-white shadow-[0_12px_32px_rgba(42,31,24,0.16)] border border-[var(--pastry-edge)] flex items-center gap-3"
      style={{ bottom: 24 }}
    >
      <span style={{ color: "var(--char)", fontSize: 15, fontWeight: 500 }}>
        {message}
      </span>
      <span aria-hidden="true" className="opacity-50" style={{ color: "var(--soft-ash)" }}>·</span>
      <button
        type="button"
        onClick={onUndo}
        className="text-sm font-semibold underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
        style={{ color: "var(--strawberry-jam)" }}
      >
        Undo
      </button>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          stroke="var(--pastry-edge)"
          strokeWidth="2"
        />
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          stroke="var(--strawberry-jam)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 14 14)"
        />
      </svg>
    </div>
  );
}
