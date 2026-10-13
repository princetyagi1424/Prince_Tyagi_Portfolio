import { useEffect, useMemo, useRef, useState } from 'react';

export type SubmissionCalendar = Record<string, number>;

interface LeetCodeHeatmapProps {
  calendar: SubmissionCalendar | null | undefined;
  totalActiveDays?: number | null;
  maxStreak?: number | string | null;
  submissionsPastYear?: number | null;
  isLive?: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function level(count: number, maxInRange: number): number {
  if (count <= 0) return 0;
  if (maxInRange <= 1) return 1;
  const t = count / maxInRange;
  if (t < 0.2) return 1;
  if (t < 0.4) return 2;
  if (t < 0.7) return 3;
  return 4;
}

function startOfUtcDay(d: Date): number {
  return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000);
}

function buildGrid(calendar: SubmissionCalendar, weeksToShow: number) {
  const today = new Date();
  const endTs = startOfUtcDay(today);
  const endDate = new Date(endTs * 1000);
  const dayOfWeek = endDate.getUTCDay();
  const daysToShow = weeksToShow * 7 + dayOfWeek + 1;
  const startTs = endTs - (daysToShow - 1) * 86400;

  const cells: { ts: number; count: number; date: Date }[] = [];
  for (let i = 0; i < daysToShow; i += 1) {
    const ts = startTs + i * 86400;
    const c = Number(calendar[String(ts)] ?? 0);
    cells.push({ ts, count: c, date: new Date(ts * 1000) });
  }

  const maxInRange = Math.max(1, ...cells.map((c) => c.count));

  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const mid = week[Math.min(3, week.length - 1)];
    if (!mid) return;
    const m = mid.date.getUTCMonth();
    if (m !== lastMonth) {
      monthLabels.push({ weekIndex: wi, label: MONTHS[m] });
      lastMonth = m;
    }
  });

  return { weeks, maxInRange, monthLabels };
}

export function LeetCodeHeatmap({
  calendar,
  totalActiveDays,
  maxStreak,
  submissionsPastYear,
  isLive,
}: LeetCodeHeatmapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState(11);
  const [gap, setGap] = useState(3);
  const [weeksToShow, setWeeksToShow] = useState(52);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth || 320;
      if (w < 360) {
        setWeeksToShow(20);
        setCell(9);
        setGap(2);
      } else if (w < 480) {
        setWeeksToShow(26);
        setCell(9);
        setGap(2);
      } else if (w < 640) {
        setWeeksToShow(40);
        setCell(10);
        setGap(2);
      } else {
        setWeeksToShow(52);
        setCell(11);
        setGap(3);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const grid = useMemo(() => {
    if (!calendar || Object.keys(calendar).length === 0) return null;
    return buildGrid(calendar, weeksToShow);
  }, [calendar, weeksToShow]);

  const subs =
    submissionsPastYear ??
    (calendar ? Object.values(calendar).reduce((a, b) => a + (Number(b) || 0), 0) : null);
  const active =
    totalActiveDays ?? (calendar ? Object.keys(calendar).length : null);
  const streakVal =
    maxStreak === null || maxStreak === undefined
      ? null
      : typeof maxStreak === 'string'
        ? maxStreak.replace(/\s*days?/i, '').trim()
        : maxStreak;

  if (!grid) {
    return (
      <div className="lc-card lc-card--empty" ref={wrapRef}>
        <p className="lc-card-empty">Activity heatmap loads when calendar data is available.</p>
      </div>
    );
  }

  const colTemplate = `repeat(${grid.weeks.length}, ${cell}px)`;

  return (
    <div
      ref={wrapRef}
      className="lc-card"
      role="img"
      aria-label={`${subs ?? '—'} LeetCode submissions in the past year. ${active ?? '—'} active days. Max streak ${streakVal ?? '—'}.`}
    >
      <div className="lc-card-head">
        <div className="lc-card-title">
          <strong>{subs ?? '—'}</strong>
          <span>
            {' '}
            submissions{weeksToShow < 52 ? ` · last ${weeksToShow} weeks` : ' in the past year'}
          </span>
          {isLive && <span className="lc-live">Live</span>}
        </div>
        <div className="lc-card-meta">
          <span>
            Active <b>{active ?? '—'}</b>
          </span>
          <span className="lc-dot" aria-hidden="true" />
          <span>
            Streak <b>{streakVal ?? '—'}</b>
          </span>
        </div>
      </div>

      <div className="lc-card-body">
        <div className="lc-months" style={{ gridTemplateColumns: colTemplate, gap }}>
          {grid.monthLabels.map((m) => (
            <span key={`${m.label}-${m.weekIndex}`} style={{ gridColumn: m.weekIndex + 1 }}>
              {m.label}
            </span>
          ))}
        </div>

        <div
          className="lc-grid"
          style={{
            gridTemplateColumns: colTemplate,
            gridTemplateRows: `repeat(7, ${cell}px)`,
            gap,
          }}
        >
          {grid.weeks.map((week, wi) =>
            week.map((c) => {
              const lv = level(c.count, grid.maxInRange);
              const label = c.date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC',
              });
              return (
                <span
                  key={c.ts}
                  className={`lc-cell lc-cell--${lv}`}
                  title={`${label}: ${c.count} submission${c.count === 1 ? '' : 's'}`}
                  style={{
                    gridColumn: wi + 1,
                    gridRow: c.date.getUTCDay() + 1,
                    width: cell,
                    height: cell,
                  }}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="lc-legend" aria-hidden="true">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`lc-cell lc-cell--${i}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
