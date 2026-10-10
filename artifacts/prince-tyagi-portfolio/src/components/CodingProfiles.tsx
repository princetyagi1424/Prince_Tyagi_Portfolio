import { ArrowUpRight } from 'lucide-react';
import { portfolio } from '../data/portfolio';

export function CodingProfiles() {
  const stats = [
    ['202', 'Easy'], ['51', 'Medium'], ['6', 'Hard'], ['1,480', 'Rating'],
  ];
  return (
    <section className="section" id="profiles" aria-labelledby="profiles-title">
      <div className="wrap">
        <div className="section-head">
          <div><span className="section-kicker">06 / Coding profiles</span><h2 id="profiles-title" className="display">Practice, in public.</h2></div>
          <p>Profile links and a dated snapshot of LeetCode practice—not live statistics.</p>
        </div>
        <div className="profiles-layout">
          <div className="profile-intro">
            <span className="eyebrow">Find me online</span>
            <h3>Work, practice<br />and connections.</h3>
            <p>Java problem-solving is a continuing practice. These profiles link to the work and activity shared publicly.</p>
            <div className="profile-links">
              {portfolio.profiles.map((profile) => <a className="profile-link" key={profile.name} href={profile.url} target="_blank" rel="noreferrer"><span>{profile.name}</span><span><ArrowUpRight size={14} /></span></a>)}
            </div>
          </div>
          <article className="leetcode-panel" aria-label="LeetCode statistics snapshot">
            <div className="leetcode-head">
              <div><h3>LeetCode practice</h3><p>{portfolio.leetcode.lastReported}</p></div>
              <div className="leetcode-total">{portfolio.leetcode.solved}<small>problems solved</small></div>
            </div>
            <div className="stat-grid">
              {stats.map(([value, label]) => <div className="stat-cell" key={label}><b>{value}</b><span>{label}</span></div>)}
            </div>
            <div className="leetcode-foot">
              <span>{portfolio.leetcode.contests} contest attended</span>
              <span>{portfolio.leetcode.streak} maximum streak</span>
              <span>{portfolio.leetcode.badges} badges · {portfolio.leetcode.badgeNote}</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
