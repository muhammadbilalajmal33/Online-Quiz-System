// ─── useToast Hook ────────────────────────────────────────────────────────────
import { useState, useRef, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState({ msg: "", type: "", show: false });
  const timerRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    clearTimeout(timerRef.current);
    setToast({ msg, type, show: true });
    timerRef.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      3000
    );
  }, []);

  return { toast, showToast };
}
