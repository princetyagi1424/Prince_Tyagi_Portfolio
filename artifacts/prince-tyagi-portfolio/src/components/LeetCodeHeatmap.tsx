import { useMemo } from 'react';

export type SubmissionCalendar = Record<string, number>;

interface LeetCodeHeatmapProps {
  calendar: SubmissionCalendar | null | undefined;
  totalActiveDays?: number | null;
  maxStreak?: number | string | null;
  submissionsPastYear?: number | null;
  isLive?: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const LEVEL_BG = [
  'rgba(148,163,184,0.12)',
  '#0e4429',
  '#006d32',
  '#26a641',
  '#39d353',
];

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

function buildGrid(calendar: SubmissionCalendar) {
  const today = new Date();
  const endTs = startOfUtcDay(today);
  const endDate = new Date(endTs * 1000);
  const dayOfWeek = endDate.getUTCDay();
  const daysToShow = 52 * 7 + dayOfWeek + 1;
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
  const grid = useMemo(() => {
    if (!calendar || Object.keys(calendar).length === 0) return null;
    return buildGrid(calendar);
  }, [calendar]);

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
      <div
        style={{
          marginTop: 18,
          padding: 20,
          borderRadius: 12,
          border: '1px solid rgba(145,165,197,0.14)',
          background: 'rgba(255,255,255,0.03)',
          textAlign: 'center',
          color: '#8491a4',
          fontSize: 12,
        }}
      >
        Activity heatmap loads when calendar data is available.
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${subs ?? '—'} LeetCode submissions in the past year. ${active ?? '—'} active days. Max streak ${streakVal ?? '—'}.`}
      style={{
        marginTop: 18,
        padding: '16px 18px 14px',
        borderRadius: 12,
        border: '1px solid rgba(145,165,197,0.14)',
        background: 'rgba(255,255,255,0.03)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '10px 16px',
          marginBottom: 12,
          fontSize: 13,
          color: '#a6b0c1',
        }}
      >
        <span>
          <strong style={{ color: '#e8edf5', fontWeight: 600 }}>{subs ?? '—'}</strong>
          {' '}submissions in the past one year
          {isLive && (
            <span style={{ color: '#8cdfcb', fontSize: 11 }} title="Synced live from LeetCode">
              {' '}· Live
            </span>
          )}
        </span>
        <span style={{ fontSize: 12.5, color: '#8b97a9' }}>
          Total active days: <strong style={{ color: '#d5dee8' }}>{active ?? '—'}</strong>
          <span style={{ display: 'inline-block', width: 12 }} />
          Max streak: <strong style={{ color: '#d5dee8' }}>{streakVal ?? '—'}</strong>
        </span>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${grid.weeks.length}, 11px)`,
            gap: 3,
            marginBottom: 4,
            minWidth: 'max-content',
            height: 16,
          }}
        >
          {grid.monthLabels.map((m) => (
            <span
              key={`${m.label}-${m.weekIndex}`}
              style={{
                gridColumn: m.weekIndex + 1,
                fontSize: 10,
                color: '#7f8ba0',
                whiteSpace: 'nowrap',
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(7, 11px)',
            gridTemplateColumns: `repeat(${grid.weeks.length}, 11px)`,
            gap: 3,
            minWidth: 'max-content',
          }}
        >
          {grid.weeks.map((week, wi) =>
            week.map((cell) => {
              const lv = level(cell.count, grid.maxInRange);
              const label = cell.date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC',
              });
              return (
                <span
                  key={cell.ts}
                  title={`${label}: ${cell.count} submission${cell.count === 1 ? '' : 's'}`}
                  style={{
                    gridColumn: wi + 1,
                    gridRow: cell.date.getUTCDay() + 1,
                    width: 11,
                    height: 11,
                    borderRadius: 2,
                    background: LEVEL_BG[lv],
                    border: lv === 0 ? '1px solid rgba(148,163,184,0.06)' : undefined,
                    boxSizing: 'border-box',
                  }}
                />
              );
            })
          )}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 4,
          marginTop: 10,
          fontSize: 10,
          color: '#7f8ba0',
        }}
        aria-hidden="true"
      >
        <span>Less</span>
        {LEVEL_BG.map((bg, i) => (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: bg,
              border: i === 0 ? '1px solid rgba(148,163,184,0.06)' : undefined,
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
