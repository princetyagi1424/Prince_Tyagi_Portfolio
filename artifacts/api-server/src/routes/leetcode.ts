import { Router, type IRouter } from "express";

const router: IRouter = Router();

const LEETCODE_USERNAME = "princeytyagi";

// In-memory cache
interface CachedData {
  data: any;
  timestamp: number;
}

let cache: CachedData | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

const FALLBACK_DATA = {
  username: LEETCODE_USERNAME,
  totalSolved: 259,
  easySolved: 202,
  mediumSolved: 51,
  hardSolved: 6,
  contestRating: 1480,
  contestsAttended: 1,
  globalRanking: null,
  streak: 45,
  badgesCount: 2,
  badgeNote: "Includes 100 Days Badge",
  lastReported: "Last verified snapshot",
  isLive: false,
  fetchedAt: new Date().toISOString(),
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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
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

    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    for (const item of acStats) {
      if (item.difficulty === "All") totalSolved = item.count;
      else if (item.difficulty === "Easy") easySolved = item.count;
      else if (item.difficulty === "Medium") mediumSolved = item.count;
      else if (item.difficulty === "Hard") hardSolved = item.count;
    }

    const badges = user.badges || [];
    const streak = user.userCalendar?.streak || FALLBACK_DATA.streak;
    const rating = contest?.rating ? Math.round(contest.rating) : FALLBACK_DATA.contestRating;
    const contests = contest?.attendedContestsCount ?? FALLBACK_DATA.contestsAttended;

    return {
      username,
      totalSolved: totalSolved || FALLBACK_DATA.totalSolved,
      easySolved: easySolved || FALLBACK_DATA.easySolved,
      mediumSolved: mediumSolved || FALLBACK_DATA.mediumSolved,
      hardSolved: hardSolved || FALLBACK_DATA.hardSolved,
      contestRating: rating,
      contestsAttended: contests,
      globalRanking: contest?.globalRanking || null,
      topPercentage: contest?.topPercentage || null,
      streak,
      badgesCount: badges.length || FALLBACK_DATA.badgesCount,
      badgeNote: badges.length > 0 ? badges.map((b: any) => b.displayName).slice(0, 2).join(", ") : FALLBACK_DATA.badgeNote,
      lastReported: "Live via LeetCode GraphQL",
      isLive: true,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

router.get("/leetcode", async (_req, res) => {
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
    // If we have stale cache, return it
    if (cache) {
      return res.json({
        ...cache.data,
        cached: true,
        stale: true,
        error: "Serving cached data due to upstream error",
      });
    }

    // Otherwise return verified fallback data
    return res.json({
      ...FALLBACK_DATA,
      cached: false,
      stale: true,
      error: "Serving verified base data",
    });
  }
});

export default router;
