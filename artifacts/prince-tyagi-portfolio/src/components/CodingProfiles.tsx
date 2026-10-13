import { ArrowUpRight, RotateCw, Clock } from 'lucide-react';
import { portfolio } from '../data/portfolio';
import { useLeetCodeStats } from '../hooks/useLeetCodeStats';
import { LeetCodeHeatmap } from './LeetCodeHeatmap';

function fmt(v: number | string | null | undefined): string {
  if (v === null || v === undefined) return '—';
  return v.toString();
}

export function CodingProfiles() {
  const { stats, isLoading, error, refresh } = useLeetCodeStats();

  const isHistorical = !stats.isLive && stats.isStale;

  const statItems: [string, string][] = [
    [fmt(stats.easySolved), 'Easy'],
    [fmt(stats.mediumSolved), 'Medium'],
    [fmt(stats.hardSolved), 'Hard'],
    [fmt(stats.contestRating), 'Rating'],
  ];

  return (
    <section className="section" id="profiles" aria-labelledby="profiles-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="section-kicker">06 / Coding profiles</span>
            <h2 id="profiles-title" className="display">Practice, in public.</h2>
          </div>
          <p>
            Public coding profiles, verified problem-solving track records, and live-synced LeetCode statistics with activity heatmap.
          </p>
        </div>
        <div className="profiles-layout">
          <div className="profile-intro">
            <span className="eyebrow">Find me online</span>
            <h3>Work, practice<br />and connections.</h3>
            <p>
              Java problem-solving is a daily pursuit. These profiles track continuous algorithms practice, open-source repositories, and verified credentials.
            </p>
            <div className="profile-links">
              {portfolio.profiles.map((profile) => (
                <a
                  className="profile-link"
                  key={profile.name}
                  href={profile.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{profile.name}</span>
                  <span><ArrowUpRight size={14} /></span>
                </a>
              ))}
            </div>
          </div>
          <article className="leetcode-panel" aria-label="LeetCode statistics panel">
            <div className="leetcode-head">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3>LeetCode Practice</h3>

                  {stats.isLive ? (
                    <span
                      className="pill"
                      title="Statistics fetched live from LeetCode"
                      style={{ padding: '2px 8px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span className="status-dot" style={{ width: '5px', height: '5px' }} />
                      Live
                    </span>
                  ) : (
                    <span
                      style={{
                        padding: '2px 8px',
                        fontSize: '12.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(234, 179, 8, 0.12)',
                        border: '1px solid rgba(234, 179, 8, 0.35)',
                        borderRadius: '999px',
                        color: '#a16207',
                      }}
                      title={isHistorical ? 'Showing verified historical snapshot — live sync unavailable' : 'Cached'}
                    >
                      <Clock size={9} />
                      {isHistorical ? 'Historical' : 'Cached'}
                    </span>
                  )}
                </div>

                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#475569' }}>{stats.lastUpdated}</span>
                  <button
                    onClick={() => refresh()}
                    disabled={isLoading}
                    title="Refresh LeetCode stats"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isLoading ? '#1d4ed8' : '#475569',
                      cursor: isLoading ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '12.5px',
                      transition: 'color 0.2s',
                    }}
                    aria-label="Refresh LeetCode statistics"
                  >
                    <RotateCw size={11} className={isLoading ? 'animate-spin' : ''} />
                    <span>{isLoading ? 'Syncing…' : 'Refresh'}</span>
                  </button>
                </p>

                {error && (
                  <p style={{ color: '#a16207', fontSize: '12.5px', marginTop: '2px' }}>
                    {error}
                  </p>
                )}

                {isHistorical && !error && (
                  <p style={{ color: '#475569', fontSize: '12.5px', marginTop: '2px' }}>
                    Showing verified snapshot with calendar. Live sync updates automatically.
                  </p>
                )}
              </div>
              <div className="leetcode-total">
                {stats.totalSolved}
                <small>problems solved</small>
              </div>
            </div>

            <div className="stat-grid">
              {statItems.map(([value, label]) => (
                <div className="stat-cell" key={label}>
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="leetcode-foot">
              <span>
                {stats.contestsAttended !== null ? stats.contestsAttended : '—'} contest{stats.contestsAttended !== 1 ? 's' : ''} attended
              </span>
              <span>{fmt(stats.streak)} {stats.streak !== null ? 'streak' : '(streak unavailable)'}</span>
              <span>
                {stats.badgesCount !== null ? `${stats.badgesCount} badge${stats.badgesCount !== 1 ? 's' : ''}` : '— badges'}
                {stats.badgeNote ? ` · ${stats.badgeNote}` : ''}
              </span>
            </div>

            <LeetCodeHeatmap
              calendar={stats.submissionCalendar}
              totalActiveDays={stats.totalActiveDays}
              maxStreak={stats.streak}
              submissionsPastYear={stats.submissionsPastYear}
              isLive={stats.isLive}
            />
          </article>
        </div>
      </div>
    </section>
  );
}
