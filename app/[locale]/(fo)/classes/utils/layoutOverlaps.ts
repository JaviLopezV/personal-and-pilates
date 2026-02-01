import type { ClassSessionDto } from "../types/classes";

export type LayoutInfo = { col: number; cols: number };

export function layoutOverlaps(
  sessions: ClassSessionDto[],
): Record<string, LayoutInfo> {
  const sorted = sessions
    .slice()
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));

  const out: Record<string, LayoutInfo> = {};
  let cluster: ClassSessionDto[] = [];
  let activeEnds: number[] = [];

  const flushCluster = () => {
    if (cluster.length === 0) return;

    const clusterSorted = cluster
      .slice()
      .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));

    const active: { end: number; col: number; id: string }[] = [];
    const freeCols: number[] = [];
    let maxCols = 1;

    for (const s of clusterSorted) {
      const start = +new Date(s.startsAt);
      const end = +new Date(s.endsAt);

      for (let i = active.length - 1; i >= 0; i--) {
        if (active[i].end <= start) {
          freeCols.push(active[i].col);
          active.splice(i, 1);
        }
      }
      freeCols.sort((a, b) => a - b);

      const col = freeCols.length ? freeCols.shift()! : active.length;
      active.push({ end, col, id: s.id });

      const colsNow = active.reduce((m, x) => Math.max(m, x.col + 1), 1);
      maxCols = Math.max(maxCols, colsNow);

      out[s.id] = { col, cols: 1 };
    }

    for (const s of cluster) {
      out[s.id].cols = maxCols;
    }

    cluster = [];
  };

  for (const s of sorted) {
    const start = +new Date(s.startsAt);
    const end = +new Date(s.endsAt);

    activeEnds = activeEnds.filter((e) => e > start);
    if (activeEnds.length === 0 && cluster.length > 0) flushCluster();

    cluster.push(s);
    activeEnds.push(end);
  }

  flushCluster();
  return out;
}
