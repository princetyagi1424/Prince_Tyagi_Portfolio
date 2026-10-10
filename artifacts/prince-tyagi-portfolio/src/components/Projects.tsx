import { ArrowUpRight, LockKeyhole, Github } from 'lucide-react';
import { portfolio } from '../data/portfolio';

function ProjectArtwork({ kind }: { kind: string }) {
  return <div className={`project-art ${kind}`} aria-hidden="true">
    {kind === 'chess' ? <span className="art-chess">♞</span> : kind === 'dsa' ? <div className="art-code"><span /><span /><span /><span /></div> : <div className="art-orbit" />}
  </div>;
}

export function Projects() {
  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="section-head">
          <div><span className="section-kicker">03 / Selected projects</span><h2 id="projects-title" className="display">Built to learn.<br />Made to work.</h2></div>
          <p>Personal projects and a continuing practice collection. Each one is described as it exists today.</p>
        </div>
        <div className="project-list">
          {portfolio.projects.map((project) => (
            <article className="project-card" key={project.id}>
              <ProjectArtwork kind={project.kind} />
              <div className="project-main">
                <div className="project-topline"><span className="project-id">PROJECT / {project.id}</span><span className="project-state">{project.kind === 'dsa' ? 'Ongoing practice' : 'Prototype / personal project'}</span></div>
                <h3>{project.title}</h3><p>{project.summary}</p>
                <div className="project-details">{project.features.map((feature) => <span key={feature}>{feature}</span>)}</div>
                <div className="tags-row">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
                {project.repositories ? (
                  <div className="project-links">{project.repositories.map((repo) => <a key={repo.url} href={repo.url} target="_blank" rel="noreferrer"><Github size={13} /> {repo.label} <ArrowUpRight size={12} /></a>)}</div>
                ) : (
                  <div className="project-links"><span className="local-label"><LockKeyhole size={12} /> {project.status}</span></div>
                )}
                {project.caveat && <p className="project-caveat">{project.caveat}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
