import React from 'react';
import { Terminal, Cpu, Globe, Database, GitBranch, Hand } from 'lucide-react';
import { portfolio } from '../data/portfolio';

const categoryIcons: Record<string, React.ReactNode> = {
  'Programming Languages': <Terminal size={18} className="text-blue-700" />,
  'DSA & Core CS': <Cpu size={18} className="text-indigo-700" />,
  'Web Development': <Globe size={18} className="text-sky-700" />,
  'Computer Vision & Interaction': <Hand size={18} className="text-violet-700" />,
  'Data Science': <Database size={18} className="text-teal-700" />,
  'Developer Tools': <GitBranch size={18} className="text-blue-700" />,
};

export function Skills() {
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.setProperty('--card-x', `${x}px`);
    card.style.setProperty('--card-y', `${y}px`);
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="section-kicker">02 / Technical toolkit</span>
            <h2 id="skills-title" className="display">
              Tools I'm learning<br />and using.
            </h2>
          </div>
          <p>
            Grouped by where they fit in my current learning, university curriculum, and project work. No fabricated scores—pure engineering focus.
          </p>
        </div>
        <div className="skills-grid">
          {portfolio.skills.map((group, index) => (
            <article
              className="skill-card group"
              key={group.title}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1), border-color 0.25s ease',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {categoryIcons[group.title] || <Terminal size={16} />}
                  <span className="skill-number font-mono">0{index + 1}</span>
                </div>
              </div>
              <h3 className="transition-colors">
                {group.title}
              </h3>
              <p>{group.note}</p>
              <div className="skill-tags">
                {group.tags.map((tag) => (
                  <span key={tag} className="transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
