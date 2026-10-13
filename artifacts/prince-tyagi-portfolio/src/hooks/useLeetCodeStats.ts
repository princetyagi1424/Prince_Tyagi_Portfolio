import { useState, useEffect, useCallback, useRef } from 'react';
import { portfolio } from '../data/portfolio';

export type SubmissionCalendar = Record<string, number>;

export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating: number | string | null;
  contestsAttended: number | null;
  streak: number | string | null;
  totalActiveDays: number | null;
  submissionsPastYear: number | null;
  submissionCalendar: SubmissionCalendar | null;
  badgesCount: number | null;
  badgeNote: string | null;
  lastUpdated: string;
  isLive: boolean;
  isStale?: boolean;
}

const FALLBACK_CALENDAR: SubmissionCalendar = {"1769817600":19,"1770076800":3,"1770163200":4,"1770249600":2,"1770336000":3,"1770422400":2,"1770508800":2,"1770595200":6,"1770681600":6,"1770768000":2,"1770854400":1,"1770940800":2,"1771027200":3,"1771113600":1,"1771200000":2,"1771286400":1,"1771372800":1,"1771459200":1,"1771545600":2,"1771632000":1,"1771718400":1,"1771804800":1,"1771891200":2,"1771977600":1,"1772064000":1,"1772236800":1,"1772323200":1,"1773187200":1,"1773446400":2,"1773792000":3,"1773878400":2,"1773964800":1,"1774224000":1,"1774310400":3,"1774569600":9,"1774742400":4,"1774915200":2,"1775088000":1,"1775174400":1,"1775520000":2,"1775692800":2,"1775779200":1,"1776038400":2,"1776211200":2,"1776297600":2,"1776470400":3,"1776556800":1,"1776643200":5,"1776729600":2,"1776902400":2,"1777075200":1,"1778889600":1,"1779062400":1,"1780012800":1,"1780358400":1,"1780704000":3,"1780790400":1,"1780876800":2,"1781222400":1,"1781308800":1,"1781481600":1,"1781568000":2,"1781654400":1,"1783641600":5,"1785283200":1,"1785542400":1,"1785801600":2,"1785888000":1,"1785974400":1,"1786406400":2,"1786492800":1,"1786579200":3,"1786665600":3,"1786752000":3,"1786838400":4,"1786924800":2,"1787011200":1,"1787097600":3,"1787184000":2,"1787270400":6,"1787356800":6,"1787443200":1,"1787529600":2,"1787702400":3,"1787788800":1,"1787875200":1,"1787961600":1,"1788048000":1,"1788134400":3,"1788220800":5,"1788307200":1,"1788393600":1,"1788480000":8,"1788566400":7,"1788652800":1,"1788739200":6,"1788825600":6,"1788912000":11,"1788998400":2,"1789084800":8,"1789171200":14,"1789257600":2,"1789344000":6,"1789430400":6,"1789516800":5,"1789603200":8,"1789689600":8,"1789776000":6,"1789862400":6,"1789948800":7,"1790035200":6,"1790121600":3,"1790208000":5,"1790294400":7,"1790380800":4,"1790467200":5,"1790553600":1,"1790640000":1,"1790726400":1,"1790812800":1,"1790899200":1,"1790985600":2,"1791072000":4,"1791158400":1,"1791244800":1,"1791331200":3,"1791417600":1,"1791504000":1,"1791590400":5,"1791676800":1,"1791763200":2};

const HISTORICAL_SNAPSHOT: LeetCodeStats = {
  username: 'princeytyagi',
  totalSolved: 264,
  easySolved: 206,
  mediumSolved: 52,
  hardSolved: 6,
  contestRating: 1480,
  contestsAttended: 1,
  streak: 48,
  totalActiveDays: 131,
  submissionsPastYear: 383,
  submissionCalendar: FALLBACK_CALENDAR,
  badgesCount: 2,
  badgeNote: '100 Days Badge 2026, 50 Days Badge 2026',
  lastUpdated: portfolio.leetcode.lastReported,
  isLive: false,
  isStale: true,
};

const STORAGE_KEY = 'pt_leetcode_stats_v5';
const REFRESH_INTERVAL_MS = 3 * 60 * 1000;

function loadCached(): LeetCodeStats | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.totalSolved === 'number') {
      return { ...parsed, isLive: Boolean(parsed.isLive) };
    }
  } catch {
    // ignore
  }
  return null;
}

function normalize(json: any, live: boolean, label: string): LeetCodeStats {
  const cal =
    json.submissionCalendar && typeof json.submissionCalendar === 'object'
      ? (json.submissionCalendar as SubmissionCalendar)
      : null;
  const subs =
    typeof json.submissionsPastYear === 'number'
      ? json.submissionsPastYear
      : cal
        ? Object.values(cal).reduce((a, b) => a + (Number(b) || 0), 0)
        : null;

  return {
    username: json.username || 'princeytyagi',
    totalSolved: json.totalSolved,
    easySolved: typeof json.easySolved === 'number' ? json.easySolved : 0,
    mediumSolved: typeof json.mediumSolved === 'number' ? json.mediumSolved : 0,
    hardSolved: typeof json.hardSolved === 'number' ? json.hardSolved : 0,
    contestRating: json.contestRating ?? null,
    contestsAttended: json.contestsAttended ?? null,
    streak: json.streak ?? null,
    totalActiveDays:
      typeof json.totalActiveDays === 'number'
        ? json.totalActiveDays
        : cal
          ? Object.keys(cal).length
          : null,
    submissionsPastYear: subs,
    submissionCalendar: cal,
    badgesCount: json.badgesCount ?? null,
    badgeNote: json.badgeNote ?? null,
    lastUpdated: label,
    isLive: live,
    isStale: !live,
  };
}

export function useLeetCodeStats() {
  const [stats, setStats] = useState<LeetCodeStats>(() => loadCached() ?? HISTORICAL_SNAPSHOT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const isFetchingRef = useRef(false);

  const fetchStats = useCallback(async (isManual = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      let liveData: LeetCodeStats | null = null;

      try {
        const res = await fetch('/api/leetcode/stats', {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(8000),
        });

        if (res.ok) {
          const json = await res.json();
          if (json && typeof json.totalSolved === 'number' && json.isLive === true) {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = new Date().toLocaleDateString([], { day: 'numeric', month: 'short' });
            liveData = normalize(json, true, `Live · ${dateStr}, ${timeStr}`);
          } else if (json && typeof json.totalSolved === 'number') {
            const data = normalize(
              json,
              false,
              json.lastReported || portfolio.leetcode.lastReported
            );
            setStats(data);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch {
              // ignore
            }
            if (isManual) setError('Live sync unavailable · Showing verified data with calendar');
            return;
          }
        }
      } catch {
        // fall through
      }

      if (!liveData) {
        try {
          const res = await fetch(
            'https://alfa-leetcode-api.onrender.com/userProfile/princeytyagi',
            { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(5000) }
          );
          if (res.ok) {
            const data = await res.json();
            if (typeof data.totalSolved === 'number') {
              const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const dateStr = new Date().toLocaleDateString([], { day: 'numeric', month: 'short' });
              liveData = {
                ...HISTORICAL_SNAPSHOT,
                totalSolved: data.totalSolved,
                easySolved: data.easySolved ?? 0,
                mediumSolved: data.mediumSolved ?? 0,
                hardSolved: data.hardSolved ?? 0,
                contestRating: typeof data.rating === 'number' ? Math.round(data.rating) : null,
                lastUpdated: `Live (proxy) · ${dateStr}, ${timeStr}`,
                isLive: true,
                isStale: false,
              };
            }
          }
        } catch {
          // ignore
        }
      }

      if (liveData) {
        setStats(liveData);
        setLastRefreshedAt(new Date());
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(liveData));
        } catch {
          // ignore
        }
      } else {
        setStats((prev) => ({
          ...prev,
          isLive: false,
          isStale: true,
          lastUpdated: prev.isLive
            ? `${prev.lastUpdated} (cached)`
            : portfolio.leetcode.lastReported,
        }));
        if (isManual) setError('Live sync temporarily unavailable · Showing last known data');
      }
    } catch {
      setError('Could not reach statistics servers · Retaining cached data');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchStats(false);
  }, [fetchStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) fetchStats(false);
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchStats]);

  useEffect(() => {
    const handler = () => {
      if (!document.hidden) fetchStats(false);
    };
    window.addEventListener('visibilitychange', handler);
    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener('visibilitychange', handler);
      window.removeEventListener('focus', handler);
    };
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    lastRefreshedAt,
    refresh: () => fetchStats(true),
  };
}
