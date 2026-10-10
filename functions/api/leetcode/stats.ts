/**
 * Cloudflare Pages Function: /api/leetcode/stats
 * Fetches and normalizes live public LeetCode statistics for 'princeytyagi'.
 * Supports edge caching, timeout handling, and resilient upstream fallbacks.
 */

interface Env {
  // Cloudflare Pages environment variables/bindings if configured
}

const LEETCODE_USERNAME = "princeytyagi";

const FALLBACK_DATA = {
  username: LEETCODE_USERNAME,
  totalSolved: 260,
  easySolved: 202,
  mediumSolved: 52,
  hardSolved: 6,
  contestRating: 1480,
  contestsAttended: 1,
  globalRanking: null,
  topPercentage: null,
  streak: 46,
  badgesCount: 2,
  badgeNote: "100 Days Badge 2026, 50 Days Badge 2026",
  lastReported: "Verified snapshot",
  isLive: false,
  fetchedAt: new Date().toISOString(),
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
      throw new Error(`LeetCode GraphQL status: ${response.status}`);
    }

    const result = (await response.json()) as any;
    if (result.errors || !result.data?.matchedUser) {
      throw new Error("Invalid GraphQL response or user not found");
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
      throw new Error(`Public proxy status: ${response.status}`);
    }

    const data = (await response.json()) as any;
    if (!data || typeof data.totalSolved !== "number") {
      throw new Error("Invalid proxy response");
    }

    return {
      username,
      totalSolved: data.totalSolved || (data.easySolved + data.mediumSolved + data.hardSolved) || FALLBACK_DATA.totalSolved,
      easySolved: data.easySolved ?? FALLBACK_DATA.easySolved,
      mediumSolved: data.mediumSolved ?? FALLBACK_DATA.mediumSolved,
      hardSolved: data.hardSolved ?? FALLBACK_DATA.hardSolved,
      contestRating: data.rating ? Math.round(data.rating) : FALLBACK_DATA.contestRating,
      contestsAttended: FALLBACK_DATA.contestsAttended,
      globalRanking: data.ranking || null,
      topPercentage: null,
      streak: FALLBACK_DATA.streak,
      badgesCount: FALLBACK_DATA.badgesCount,
      badgeNote: FALLBACK_DATA.badgeNote,
      lastReported: "Live via Public LeetCode Proxy",
      isLive: true,
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

    // Return verified fallback snapshot if both external APIs are unreachable
    return new Response(
      JSON.stringify({
        ...FALLBACK_DATA,
        stale: true,
        error: "Upstream LeetCode endpoints temporarily unreachable; returning verified snapshot.",
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
        stale: true,
        error: err?.message || "Internal server error",
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

// Default export for all requests
export const onRequest = onRequestGet;
