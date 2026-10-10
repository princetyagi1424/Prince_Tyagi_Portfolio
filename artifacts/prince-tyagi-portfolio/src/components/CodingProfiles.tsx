import { ArrowUpRight, RotateCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { portfolio } from '../data/portfolio';
import { useLeetCodeStats } from '../hooks/useLeetCodeStats';

export function CodingProfiles() {
  const { stats, isLoading, error, refresh } = useLeetCodeStats();

  const statItems = [
    [stats.easySolved.toString(), 'Easy'],
    [stats.mediumSolved.toString(), 'Medium'],
    [stats.hardSolved.toString(), 'Hard'],
    [stats.contestRating.toString(), 'Rating'],
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
            Public coding profiles, verified problem-solving track records, and live-synced LeetCode statistics.
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
          <article className="leetcode-panel" aria-label="LeetCode statistics live panel">
            <div className="leetcode-head">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3>LeetCode Practice</h3>
                  {stats.isLive && (
                    <span className="pill" style={{ padding: '2px 8px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span className="status-dot" style={{ width: '5px', height: '5px' }} /> Live
                    </span>
                  )}
                </div>
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span>{stats.lastUpdated}</span>
                  <button
                    onClick={() => refresh()}
                    disabled={isLoading}
                    title="Refresh live LeetCode stats"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isLoading ? '#61d8e7' : '#8898aa',
                      cursor: isLoading ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      transition: 'color 0.2s',
                    }}
                    className="hover:text-cyan-400"
                    aria-label="Refresh LeetCode statistics"
                  >
                    <RotateCw size={11} className={isLoading ? 'animate-spin' : ''} />
                    <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
                  </button>
                </p>
                {error && (
                  <p style={{ color: '#eab308', fontSize: '10px', marginTop: '2px' }}>
                    {error}
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
              <span>{stats.contestsAttended} contest attended</span>
              <span>{stats.streak} maximum streak</span>
              <span>{stats.badgesCount} badges · {stats.badgeNote}</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
