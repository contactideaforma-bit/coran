"use client";

import { useEffect } from "react";

/** Enregistre le service worker (cache hors-ligne) en production. */
export default function EnregistrerSW() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
