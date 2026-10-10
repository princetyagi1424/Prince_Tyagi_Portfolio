import { portfolio } from '../data/portfolio';

export function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="wrap">
        <div className="section-head">
          <div><span className="section-kicker">02 / Technical toolkit</span><h2 id="skills-title" className="display">Tools I’m learning<br />and using.</h2></div>
          <p>Grouped by where they fit in my current learning and project work. No proficiency scores—just a clear view of the toolkit.</p>
        </div>
        <div className="skills-grid">
          {portfolio.skills.map((group, index) => (
            <article className="skill-card" key={group.title}>
              <span className="skill-number">0{index + 1}</span>
              <h3>{group.title}</h3><p>{group.note}</p>
              <div className="skill-tags">{group.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
