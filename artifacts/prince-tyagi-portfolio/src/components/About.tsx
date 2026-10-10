import { portfolio } from '../data/portfolio';

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <div className="section-head">
          <div><span className="section-kicker">01 / About</span><h2 id="about-title" className="display">Learning by making<br />things work.</h2></div>
          <p>A student’s work in progress, grounded in real practice and honest about what is still being learned.</p>
        </div>
        <div className="about-grid">
          <aside className="about-aside">
            <span className="eyebrow">The person behind the code</span>
            <p className="about-aside-note">Curiosity, careful debugging, and the satisfaction of getting one more thing right.</p>
          </aside>
          <div className="about-copy">
            <h3 id="about-title-copy">A second-year student building a stronger software foundation.</h3>
            <p>{portfolio.person.bio}</p>
            <p>My approach is to learn by building, testing, debugging, and improving. I’m developing practical experience one project and one problem at a time.</p>
            <div className="interest-list" aria-label="Current areas of interest">
              {portfolio.interests.map((interest, index) => <div className="interest-item" key={interest}><span>FOCUS / 0{index + 1}</span>{interest}</div>)}
            </div>
            <p className="about-languages"><span className="mono">LANGUAGES</span> {portfolio.person.languages.join(' · ')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
