import type { ReactNode } from 'react';
import { ArrowUpRight, Github, Hand, MapPinned } from 'lucide-react';
import { portfolio } from '../data/portfolio';

const icons: Record<string, ReactNode> = {
  gesture: <Hand size={56} strokeWidth={1.4} />,
  map: <MapPinned size={56} strokeWidth={1.4} />,
};

export function Projects() {
  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="section-kicker">03 / Selected projects</span>
            <h2 id="projects-title" className="display">
              Built to learn.<br />Made to work.
            </h2>
          </div>
          <p>Real projects with their actual stack and status. Live demos open in a new tab.</p>
        </div>

        <div className="project-list">
          {portfolio.projects.map((project) => (
            <article
              className={`project-card${project.url ? ' has-link' : ''}`}
              key={project.id}
              aria-labelledby={`project-${project.id}-title`}
            >
              {project.screenshot ? (
                <img className="project-shot" src={project.screenshot} alt={`Screenshot of ${project.title}`} loading="lazy" />
              ) : (
                <div className={`project-art ${project.kind}`} aria-hidden="true">{icons[project.kind]}</div>
              )}
              <div className="project-main">
                <div className="project-topline">
                  <span className="project-id font-mono">PROJECT / {project.id}</span>
                  <span className="project-state">{project.status}</span>
                </div>
                <h3 id={`project-${project.id}-title`}>{project.title}</h3>
                <p className="project-role">{project.role}</p>

                <div className="project-cols">
                  <div><h4>Problem</h4><p>{project.problem}</p></div>
                  <div><h4>Solution</h4><p>{project.solution}</p></div>
                </div>

                <h4 className="project-sub">Key features</h4>
                <ul className="project-details">
                  {project.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>

                <h4 className="project-sub">Tech stack</h4>
                <div className="tags-row">
                  {project.technologies.map((tech) => <span key={tech}>{tech}</span>)}
                </div>

                {project.note && <p className="project-note">{project.note}</p>}

                <div className="project-links">
                  {project.url && (
                    <a className="project-demo" href={project.url} target="_blank" rel="noopener noreferrer"
                       aria-label={`Live demo of ${project.title} (opens in a new tab)`}>
                      Live Demo <ArrowUpRight size={16} />
                    </a>
                  )}
                  {project.repo && (
                    <a className="project-repo" href={project.repo} target="_blank" rel="noopener noreferrer"
                       aria-label={`${project.title} source code on GitHub (opens in a new tab)`}>
                      <Github size={16} /> GitHub
                    </a>
                  )}
                  {!project.url && !project.repo && (
                    <span className="local-label">Public demo / repository not published yet</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
