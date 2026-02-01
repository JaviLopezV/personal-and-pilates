"use client";

import * as React from "react";

export function useNowTickEveryMinute() {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const msToNextMinute = 60000 - (Date.now() % 60000);

    const t1 = window.setTimeout(() => {
      setNow(new Date());
      const t2 = window.setInterval(() => setNow(new Date()), 60000);
      // Cleanup interval
      return () => window.clearInterval(t2);
    }, msToNextMinute);

    return () => window.clearTimeout(t1);
  }, []);

  return now;
}
