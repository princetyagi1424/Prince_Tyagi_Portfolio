import { useState, useEffect, useCallback, useRef } from 'react';
import { portfolio } from '../data/portfolio';

export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating: number | string | null;
  contestsAttended: number | null;
  streak: number | string | null;
  badgesCount: number | null;
  badgeNote: string | null;
  lastUpdated: string;
  isLive: boolean;
  isStale?: boolean;
}

/**
 * Verified historical snapshot — never presented as live.
 * Audited against public LeetCode stats API on 13 Oct 2026, 14:05 IST.
 * totalSolved 264 · easy 206 · medium 52 · hard 6
 */
const HISTORICAL_SNAPSHOT: LeetCodeStats = {
  username: 'princeytyagi',
  totalSolved: 264,
  easySolved: 206,
  mediumSolved: 52,
  hardSolved: 6,
  contestRating: 1480,
  contestsAttended: 1,
  streak: '46 days',
  badgesCount: 2,
  badgeNote: '100 Days Badge 2026, 50 Days Badge 2026',
  lastUpdated: portfolio.leetcode.lastReported,
  isLive: false,
  isStale: true,
};

const STORAGE_KEY = 'pt_leetcode_stats_v4';
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/** Parse cached localStorage value. Returns null if invalid or stale format. */
function loadCached(): LeetCodeStats | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.totalSolved === 'number') {
      return {
        ...parsed,
        isLive: Boolean(parsed.isLive),
      };
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

export function useLeetCodeStats() {
  const [stats, setStats] = useState<LeetCodeStats>(() => {
    const cached = loadCached();
    return cached ?? HISTORICAL_SNAPSHOT;
  });

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
          signal: AbortSignal.timeout(6000),
        });

        if (res.ok) {
          const json = await res.json();
          if (json && typeof json.totalSolved === 'number' && json.isLive === true) {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = new Date().toLocaleDateString([], { day: 'numeric', month: 'short' });
            liveData = {
              username: json.username || 'princeytyagi',
              totalSolved: json.totalSolved,
              easySolved: typeof json.easySolved === 'number' ? json.easySolved : 0,
              mediumSolved: typeof json.mediumSolved === 'number' ? json.mediumSolved : 0,
              hardSolved: typeof json.hardSolved === 'number' ? json.hardSolved : 0,
              contestRating: json.contestRating ?? null,
              contestsAttended: json.contestsAttended ?? null,
              streak: json.streak ?? null,
              badgesCount: json.badgesCount ?? null,
              badgeNote: json.badgeNote ?? null,
              lastUpdated: `Live · ${dateStr}, ${timeStr}`,
              isLive: true,
              isStale: false,
            };
          } else if (json && json.isLive === false && typeof json.totalSolved === 'number') {
            setStats({
              username: json.username || 'princeytyagi',
              totalSolved: json.totalSolved,
              easySolved: json.easySolved ?? 0,
              mediumSolved: json.mediumSolved ?? 0,
              hardSolved: json.hardSolved ?? 0,
              contestRating: json.contestRating ?? null,
              contestsAttended: json.contestsAttended ?? null,
              streak: json.streak ?? null,
              badgesCount: json.badgesCount ?? null,
              badgeNote: json.badgeNote ?? null,
              lastUpdated: json.lastReported || portfolio.leetcode.lastReported,
              isLive: false,
              isStale: true,
            });
            if (isManual) setError('Live sync unavailable · Showing verified historical data');
            return;
          }
        }
      } catch {
        // /api not reachable — fall through
      }

      if (!liveData) {
        const publicEndpoints = [
          'https://alfa-leetcode-api.onrender.com/userProfile/princeytyagi',
          'https://leetcode-stats-api.herokuapp.com/princeytyagi',
        ];

        for (const url of publicEndpoints) {
          try {
            const res = await fetch(url, {
              headers: { Accept: 'application/json' },
              signal: AbortSignal.timeout(5000),
            });

            if (!res.ok) continue;
            const data = await res.json();

            const total = typeof data.totalSolved === 'number' ? data.totalSolved : null;
            const easy = typeof data.easySolved === 'number' ? data.easySolved : null;
            const medium = typeof data.mediumSolved === 'number' ? data.mediumSolved : null;
            const hard = typeof data.hardSolved === 'number' ? data.hardSolved : null;

            if (total === null && easy === null) continue;

            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = new Date().toLocaleDateString([], { day: 'numeric', month: 'short' });

            liveData = {
              username: 'princeytyagi',
              totalSolved: total ?? (easy ?? 0) + (medium ?? 0) + (hard ?? 0),
              easySolved: easy ?? 0,
              mediumSolved: medium ?? 0,
              hardSolved: hard ?? 0,
              contestRating: typeof data.rating === 'number' ? Math.round(data.rating) : null,
              contestsAttended: null,
              streak: null,
              badgesCount: null,
              badgeNote: null,
              lastUpdated: `Live (proxy) · ${dateStr}, ${timeStr}`,
              isLive: true,
              isStale: false,
            };
            break;
          } catch {
            // try next
          }
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
          lastUpdated:
            prev.isLive
              ? `${prev.lastUpdated} (cached)`
              : portfolio.leetcode.lastReported,
        }));
        if (isManual) {
          setError('Live sync temporarily unavailable · Showing last known data');
        }
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
    const handler = () => { if (!document.hidden) fetchStats(false); };
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
