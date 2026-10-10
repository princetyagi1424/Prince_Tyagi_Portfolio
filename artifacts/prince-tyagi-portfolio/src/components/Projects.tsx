import React, { useState } from 'react';
import { ArrowUpRight, LockKeyhole, Github, Code2, Sparkles, X, Layers, ExternalLink } from 'lucide-react';
import { portfolio } from '../data/portfolio';

function ProjectArtwork({ kind }: { kind: string }) {
  return (
    <div className={`project-art ${kind}`} aria-hidden="true">
      {kind === 'chess' ? (
        <span className="art-chess">♞</span>
      ) : kind === 'dsa' ? (
        <div className="art-code">
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : (
        <div className="art-orbit" />
      )}
    </div>
  );
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    card.style.setProperty('--card-x', `${x}px`);
    card.style.setProperty('--card-y', `${y}px`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
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
          <p>
            Personal software projects, computer-vision prototypes, and DSA repository collections. Detailed as they exist today.
          </p>
        </div>

        <div className="project-list">
          {portfolio.projects.map((project) => (
            <article
              className="project-card group"
              key={project.id}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1), border-color 0.25s ease',
              }}
            >
              <ProjectArtwork kind={project.kind} />
              <div className="project-main">
                <div className="project-topline">
                  <span className="project-id font-mono">PROJECT / {project.id}</span>
                  <span className="project-state">
                    {project.kind === 'dsa' ? 'Active practice' : 'Personal prototype'}
                  </span>
                </div>
                <h3 className="group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>
                <p>{project.summary}</p>
                <div className="project-details">
                  {project.features.map((feature) => (
                    <span key={feature}>{feature}</span>
                  ))}
                </div>
                <div className="tags-row">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="hover:border-cyan-500/40 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
                {project.repositories ? (
                  <div className="project-links">
                    {project.repositories.map((repo) => (
                      <a
                        key={repo.url}
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-cyan-300"
                      >
                        <Github size={13} /> {repo.label} <ArrowUpRight size={12} />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="project-links">
                    <span className="local-label">
                      <LockKeyhole size={12} /> {project.status}
                    </span>
                  </div>
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
