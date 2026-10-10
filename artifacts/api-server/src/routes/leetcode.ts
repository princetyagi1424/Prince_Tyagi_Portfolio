import { Router, type IRouter } from "express";

const router: IRouter = Router();

const LEETCODE_USERNAME = "princeytyagi";

interface CachedData {
  data: any;
  timestamp: number;
}

let cache: CachedData | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minute memory cache

const FALLBACK_DATA = {
  username: LEETCODE_USERNAME,
  totalSolved: 261,
  easySolved: 203,
  mediumSolved: 52,
  hardSolved: 6,
  contestRating: 1480,
  contestsAttended: 1,
  globalRanking: null,
  topPercentage: null,
  streak: 46,
  badgesCount: 2,
  badgeNote: "100 Days Badge 2026, 50 Days Badge 2026",
  lastReported: "Historical verified snapshot (11 Oct 2026)",
  isLive: false,
  stale: true,
  verifiedAt: "2026-10-11T00:00:00.000Z",
};

async function fetchLeetCodeStats(username: string) {
  const query = `
    query getUserStats($username: String!) {
      matchedUser(username: $username) {
        username
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        badges {
          id
          displayName
          icon
        }
        userCalendar {
          streak
          totalActiveDays
        }
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        topPercentage
      }
    }
  `;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`LeetCode API returned status ${response.status}`);
    }

    const result = (await response.json()) as any;
    if (result.errors || !result.data?.matchedUser) {
      throw new Error("Invalid response or user not found");
    }

    const user = result.data.matchedUser;
    const acStats = user.submitStatsGlobal?.acSubmissionNum || [];
    const contest = result.data.userContestRanking;

    let totalSolved: number | null = null;
    let easySolved: number | null = null;
    let mediumSolved: number | null = null;
    let hardSolved: number | null = null;

    for (const item of acStats) {
      if (item.difficulty === "All") totalSolved = item.count;
      else if (item.difficulty === "Easy") easySolved = item.count;
      else if (item.difficulty === "Medium") mediumSolved = item.count;
      else if (item.difficulty === "Hard") hardSolved = item.count;
    }

    if (totalSolved === null && (easySolved !== null || mediumSolved !== null || hardSolved !== null)) {
      totalSolved = (easySolved || 0) + (mediumSolved || 0) + (hardSolved || 0);
    }

    if (totalSolved === null) {
      throw new Error("Unable to parse solved question counts from response");
    }

    const badges = user.badges || [];
    const streak = typeof user.userCalendar?.streak === "number" ? user.userCalendar.streak : null;
    const rating = contest?.rating ? Math.round(contest.rating) : null;
    const contests = typeof contest?.attendedContestsCount === "number" ? contest.attendedContestsCount : null;

    return {
      username,
      totalSolved,
      easySolved: easySolved ?? 0,
      mediumSolved: mediumSolved ?? 0,
      hardSolved: hardSolved ?? 0,
      contestRating: rating,
      contestsAttended: contests,
      globalRanking: contest?.globalRanking || null,
      topPercentage: contest?.topPercentage || null,
      streak,
      badgesCount: badges.length,
      badgeNote: badges.length > 0 ? badges.map((b: any) => b.displayName).slice(0, 2).join(", ") : null,
      lastReported: "Live via LeetCode GraphQL",
      isLive: true,
      stale: false,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

const handleStats = async (_req: any, res: any) => {
  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_TTL_MS) {
    return res.json({
      ...cache.data,
      cached: true,
      cachedAt: new Date(cache.timestamp).toISOString(),
    });
  }

  try {
    const data = await fetchLeetCodeStats(LEETCODE_USERNAME);
    cache = { data, timestamp: now };
    return res.json({
      ...data,
      cached: false,
    });
  } catch (err: any) {
    // If we have existing cache, serve with stale note
    if (cache) {
      return res.json({
        ...cache.data,
        cached: true,
        stale: true,
        error: "Serving cached data due to upstream error",
      });
    }

    // Otherwise return verified historical fallback data
    return res.json({
      ...FALLBACK_DATA,
      cached: false,
      stale: true,
      error: "Serving verified historical base data",
    });
  }
};

router.get("/leetcode", handleStats);
router.get("/leetcode/stats", handleStats);

export default router;
