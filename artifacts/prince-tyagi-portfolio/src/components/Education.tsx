import { GraduationCap } from 'lucide-react';
import { portfolio } from '../data/portfolio';

export function Education() {
  return (
    <section className="section" id="education" aria-labelledby="education-title">
      <div className="wrap">
        <div className="section-head">
          <div><span className="section-kicker">04 / Education</span><h2 id="education-title" className="display">The foundation<br />I’m building on.</h2></div>
          <p>Current university study, with secondary education included as supporting context.</p>
        </div>
        <div className="education-grid">
          <article className="edu-primary">
            <span className="eyebrow"><GraduationCap size={14} /> Undergraduate</span>
            <h3>{portfolio.education.degree}</h3>
            <p>{portfolio.education.university}</p>
            <div className="edu-facts"><span>{portfolio.education.duration}</span><span>{portfolio.education.cgpa}</span></div>
          </article>
          <div className="edu-secondary" aria-label="Secondary education">
            {portfolio.education.schools.map((school) => <article className="school-row" key={school.level}><div><strong>{school.level}</strong><small>{school.school}</small></div><b>{school.score}</b></article>)}
          </div>
        </div>
      </div>
    </section>
  );
}
