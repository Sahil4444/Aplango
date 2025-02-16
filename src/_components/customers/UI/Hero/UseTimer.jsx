"use client";

import { useState, useEffect } from "react";

export function useTimer(seconds) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (seconds === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(interval);
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const remainingSeconds = timeLeft % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
