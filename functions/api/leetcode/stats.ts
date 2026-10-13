/**
 * Cloudflare Pages Function: /api/leetcode/stats
 * Live LeetCode stats + submission calendar for heatmap.
 */

interface Env {}

const LEETCODE_USERNAME = "princeytyagi";

const FALLBACK_CALENDAR: Record<string, number> = {"1769817600":19,"1770076800":3,"1770163200":4,"1770249600":2,"1770336000":3,"1770422400":2,"1770508800":2,"1770595200":6,"1770681600":6,"1770768000":2,"1770854400":1,"1770940800":2,"1771027200":3,"1771113600":1,"1771200000":2,"1771286400":1,"1771372800":1,"1771459200":1,"1771545600":2,"1771632000":1,"1771718400":1,"1771804800":1,"1771891200":2,"1771977600":1,"1772064000":1,"1772236800":1,"1772323200":1,"1773187200":1,"1773446400":2,"1773792000":3,"1773878400":2,"1773964800":1,"1774224000":1,"1774310400":3,"1774569600":9,"1774742400":4,"1774915200":2,"1775088000":1,"1775174400":1,"1775520000":2,"1775692800":2,"1775779200":1,"1776038400":2,"1776211200":2,"1776297600":2,"1776470400":3,"1776556800":1,"1776643200":5,"1776729600":2,"1776902400":2,"1777075200":1,"1778889600":1,"1779062400":1,"1780012800":1,"1780358400":1,"1780704000":3,"1780790400":1,"1780876800":2,"1781222400":1,"1781308800":1,"1781481600":1,"1781568000":2,"1781654400":1,"1783641600":5,"1785283200":1,"1785542400":1,"1785801600":2,"1785888000":1,"1785974400":1,"1786406400":2,"1786492800":1,"1786579200":3,"1786665600":3,"1786752000":3,"1786838400":4,"1786924800":2,"1787011200":1,"1787097600":3,"1787184000":2,"1787270400":6,"1787356800":6,"1787443200":1,"1787529600":2,"1787702400":3,"1787788800":1,"1787875200":1,"1787961600":1,"1788048000":1,"1788134400":3,"1788220800":5,"1788307200":1,"1788393600":1,"1788480000":8,"1788566400":7,"1788652800":1,"1788739200":6,"1788825600":6,"1788912000":11,"1788998400":2,"1789084800":8,"1789171200":14,"1789257600":2,"1789344000":6,"1789430400":6,"1789516800":5,"1789603200":8,"1789689600":8,"1789776000":6,"1789862400":6,"1789948800":7,"1790035200":6,"1790121600":3,"1790208000":5,"1790294400":7,"1790380800":4,"1790467200":5,"1790553600":1,"1790640000":1,"1790726400":1,"1790812800":1,"1790899200":1,"1790985600":2,"1791072000":4,"1791158400":1,"1791244800":1,"1791331200":3,"1791417600":1,"1791504000":1,"1791590400":5,"1791676800":1,"1791763200":2};

const FALLBACK_DATA = {
  username: LEETCODE_USERNAME,
  totalSolved: 264,
  easySolved: 206,
  mediumSolved: 52,
  hardSolved: 6,
  contestRating: 1480,
  contestsAttended: 1,
  globalRanking: null,
  topPercentage: null,
  streak: 48,
  totalActiveDays: 131,
  submissionsPastYear: 383,
  submissionCalendar: FALLBACK_CALENDAR,
  badgesCount: 2,
  badgeNote: "100 Days Badge 2026, 50 Days Badge 2026",
  lastReported: "Verified snapshot (13 Oct 2026, 14:05 IST)",
  isLive: false,
  stale: true,
  verifiedAt: "2026-10-13T08:35:00.000Z",
};

function parseCalendar(raw: unknown): Record<string, number> {
  try {
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!obj || typeof obj !== "object") return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) out[String(k)] = n;
    }
    return out;
  } catch {
    return {};
  }
}

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
        }
        userCalendar {
          streak
          totalActiveDays
          submissionCalendar
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
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({ query, variables: { username } }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) throw new Error(`LeetCode GraphQL HTTP ${response.status}`);

    const result = (await response.json()) as any;
    if (result.errors || !result.data?.matchedUser) {
      throw new Error("Invalid GraphQL response or user not found");
    }

    const user = result.data.matchedUser;
    const acStats = user.submitStatsGlobal?.acSubmissionNum || [];
    const contest = result.data.userContestRanking;
    const cal = user.userCalendar || {};

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

    if (totalSolved === null) {
      totalSolved = (easySolved || 0) + (mediumSolved || 0) + (hardSolved || 0);
    }
    if (totalSolved === null) {
      throw new Error("Unable to parse solved counts");
    }

    const submissionCalendar = parseCalendar(cal.submissionCalendar);
    const submissionsPastYear = Object.values(submissionCalendar).reduce((a, b) => a + b, 0);
    const badges = user.badges || [];

    return {
      username,
      totalSolved,
      easySolved: easySolved ?? 0,
      mediumSolved: mediumSolved ?? 0,
      hardSolved: hardSolved ?? 0,
      contestRating: contest?.rating ? Math.round(contest.rating) : null,
      contestsAttended:
        typeof contest?.attendedContestsCount === "number" ? contest.attendedContestsCount : null,
      globalRanking: contest?.globalRanking || null,
      topPercentage: contest?.topPercentage || null,
      streak: typeof cal.streak === "number" ? cal.streak : null,
      totalActiveDays: typeof cal.totalActiveDays === "number" ? cal.totalActiveDays : Object.keys(submissionCalendar).length,
      submissionsPastYear,
      submissionCalendar,
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

export async function onRequestGet(): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  };

  try {
    let result: any = null;
    try {
      result = await fetchFromGraphQL(LEETCODE_USERNAME);
    } catch {
      result = null;
    }

    if (result) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Cache-Control": "public, max-age=60, s-maxage=180, stale-while-revalidate=600",
        },
      });
    }

    return new Response(
      JSON.stringify({
        ...FALLBACK_DATA,
        isLive: false,
        stale: true,
        error: "Upstream LeetCode temporarily unreachable; serving verified snapshot with calendar.",
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
        error: err?.message || "Internal error; serving verified snapshot.",
      }),
      { status: 200, headers: { ...corsHeaders, "Cache-Control": "no-cache" } }
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
