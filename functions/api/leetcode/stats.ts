/**
 * Cloudflare Pages Function: /api/leetcode/stats
 * Fetches and normalizes live public LeetCode statistics for 'princeytyagi'.
 * Strict isolation: Never mixes fallback data into live-marked responses.
 */

interface Env {
  // Cloudflare Pages environment variables if configured
}

const LEETCODE_USERNAME = "princeytyagi";

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

async function fetchFromGraphQL(username: string) {
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
  const timeout = setTimeout(() => controller.abort(), 4500);

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
      throw new Error(`LeetCode GraphQL HTTP status ${response.status}`);
    }

    const result = (await response.json()) as any;
    if (result.errors || !result.data?.matchedUser) {
      throw new Error("Invalid GraphQL response or user not found");
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

async function fetchFromPublicProxy(username: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(username)}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Public proxy HTTP status ${response.status}`);
    }

    const data = (await response.json()) as any;
    if (!data || typeof data.totalSolved !== "number") {
      throw new Error("Invalid proxy response format");
    }

    const easy = typeof data.easySolved === "number" ? data.easySolved : 0;
    const medium = typeof data.mediumSolved === "number" ? data.mediumSolved : 0;
    const hard = typeof data.hardSolved === "number" ? data.hardSolved : 0;
    const total = data.totalSolved || (easy + medium + hard);

    return {
      username,
      totalSolved: total,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      contestRating: data.rating ? Math.round(data.rating) : null,
      contestsAttended: null,
      globalRanking: data.ranking || null,
      topPercentage: null,
      streak: null,
      badgesCount: null,
      badgeNote: null,
      lastReported: "Live via Public LeetCode Proxy",
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

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  };

  try {
    // 1. Try GraphQL Direct
    let result: any = null;
    try {
      result = await fetchFromGraphQL(LEETCODE_USERNAME);
    } catch {
      // 2. Fallback to public proxy
      try {
        result = await fetchFromPublicProxy(LEETCODE_USERNAME);
      } catch {
        // Both upstreams failed
      }
    }

    if (result) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          ...corsHeaders,
          // Cache on Cloudflare Edge CDN for 5 minutes, client browser for 1 minute
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        },
      });
    }

    // Return verified historical fallback snapshot if both external APIs fail
    return new Response(
      JSON.stringify({
        ...FALLBACK_DATA,
        isLive: false,
        stale: true,
        error: "Upstream LeetCode endpoints temporarily unreachable; serving verified historical snapshot.",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Cache-Control": "public, max-age=30, s-maxage=60",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ...FALLBACK_DATA,
        isLive: false,
        stale: true,
        error: err?.message || "Internal server error; serving verified historical snapshot.",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export const onRequest = onRequestGet;
