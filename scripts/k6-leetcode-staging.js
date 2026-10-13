/**
 * Staging-only load test for /api/leetcode/stats
 * Usage:
 *   BASE_URL=https://YOUR-PREVIEW.pages.dev k6 run scripts/k6-leetcode-staging.js
 * Do NOT point BASE_URL at production without explicit approval and a low cap.
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 5 },
    { duration: '40s', target: 5 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1200', 'p(99)<2500'],
  },
};

const BASE = __ENV.BASE_URL;
if (!BASE) {
  throw new Error('Set BASE_URL to a staging/preview origin');
}

export default function () {
  const res = http.get(`${BASE}/api/leetcode/stats`, {
    headers: { Accept: 'application/json' },
  });
  check(res, {
    'status is 200': (r) => r.status === 200,
    'json body': (r) => String(r.body || '').includes('totalSolved'),
  });
  sleep(1);
}
