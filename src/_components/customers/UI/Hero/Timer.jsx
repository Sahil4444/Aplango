"use client";

import { useState, useEffect } from "react";

export function Timer({ duration, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onExpire]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="font-mono">
      {`${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
    </span>
  );
}
