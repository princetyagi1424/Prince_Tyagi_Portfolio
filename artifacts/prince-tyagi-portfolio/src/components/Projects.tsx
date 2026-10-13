import React from 'react';
import { ArrowUpRight, Hand, MapPinned } from 'lucide-react';
import { portfolio } from '../data/portfolio';

function ProjectArtwork({ kind }: { kind: string }) {
  return (
    <div className={`project-art ${kind}`} aria-hidden="true">
      {kind === 'gesture' ? <Hand size={64} strokeWidth={1.4} /> : <MapPinned size={64} strokeWidth={1.4} />}
    </div>
  );
}

export function Projects() {
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--card-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
  };

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
          <p>Click any project to open the live version in a new tab.</p>
        </div>

        <div className="project-list">
          {portfolio.projects.map((project) => (
            <a
              className="project-card group"
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} (opens in a new tab)`}
              onMouseMove={handleCardMouseMove}
            >
              <ProjectArtwork kind={project.kind} />
              <div className="project-main">
                <div className="project-topline">
                  <span className="project-id font-mono">PROJECT / {project.id}</span>
                  <span className="project-state">{project.date}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="project-role">{project.role}</p>
                <p>{project.summary}</p>
                <div className="project-details">
                  {project.features.map((feature) => (
                    <span key={feature}>{feature}</span>
                  ))}
                </div>
                <div className="tags-row">
                  {project.technologies.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <span className="project-open">
                    Open project <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
