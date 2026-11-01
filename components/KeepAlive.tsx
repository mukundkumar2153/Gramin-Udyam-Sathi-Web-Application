"use client";

import { useEffect } from "react";

export default function KeepAlive() {
  useEffect(() => {
    // Ping keep-alive immediately on initial load
    const ping = () => {
      fetch("/api/keep-alive", { cache: "no-store" }).catch(() => {});
    };

    // Ping once on mount
    ping();

    // Ping every 10 minutes (600,000 ms) to keep server & database warm and prevent sleep mode
    const interval = setInterval(ping, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
