import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, isAuthenticated } from "../services/authService";
import { toast } from "react-hot-toast";

/**
 * Logs out the user after inactivity (no clicks/mouse/keys/scroll/touch)
 * Default: 10 minutes
 */
export default function SessionTimeout({ idleMinutes = 10 }) {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const [armed, setArmed] = useState(false);

  const idleMs = idleMinutes * 60 * 1000;

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const doAutoLogout = () => {
    logout();
    toast.error("Session timed out due to inactivity. Please log in again.");
    navigate("/login");
  };

  const resetTimer = () => {
    // Only track when user is logged in
    if (!isAuthenticated()) return;

    // Arm after first interaction (prevents firing on initial mount quirks)
    if (!armed) setArmed(true);

    clearTimer();
    timerRef.current = setTimeout(() => {
      // If user still authenticated and idle timer expires → logout
      if (isAuthenticated()) doAutoLogout();
    }, idleMs);
  };

  useEffect(() => {
    // Start timer when component mounts
    resetTimer();

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "pointerdown",
      "click",
    ];

    const handler = () => resetTimer();

    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));

    return () => {
      clearTimer();
      events.forEach((e) => window.removeEventListener(e, handler));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idleMs, armed]);

  return null; // This is a “logic only” component
}
