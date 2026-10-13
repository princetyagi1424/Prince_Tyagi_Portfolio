import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react';
import { portfolio, resume } from '../data/portfolio';
import { ParticleName } from './ParticleName';

interface HeroProps {
  onReplayIntro?: () => void;
}

export function Hero(_props: HeroProps) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="wrap hero-inner">
        <div className="hero-copy reveal">
          <div className="hero-status flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-300 bg-white max-w-full">
            <img
              src="/prince-tyagi.jpg"
              alt="Portrait of Prince Tyagi"
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover border border-slate-300 shrink-0"
            />
            <span className="status-dot shrink-0" />
            <span className="text-slate-700 text-sm font-mono leading-snug">
              <span className="hidden sm:inline">{portfolio.person.title}</span>
              <span className="sm:hidden">CSE Student · Software Developer</span>
            </span>
          </div>

          <h1 id="hero-title" className="display">
            Prince <span>Tyagi.</span>
          </h1>

          <p className="hero-tagline">
            Building my path in software engineering, one problem and project at a time.
          </p>

          <p className="hero-support">
            B.Tech CSE (AI & Data Science) student at GLA University, expected to graduate in 2029. Currently focused on Java, DSA, and practical software projects.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#projects">
              View Projects <ArrowDownRight size={16} />
            </a>
            <a className="button button-ghost" href={resume.url} download={resume.filename}>
              <Download size={16} /> {resume.label}
            </a>
            <a className="button button-ghost" href="#contact">
              Contact Me <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="hero-meta">
            <span>GLA University</span>
            <span>Mathura, India</span>
            <span>Class of 2029</span>
          </div>
        </div>

        <div className="hero-visual">
          <ParticleName text="PRINCE" />
        </div>
      </div>

      <span className="hero-index font-mono">PORTFOLIO / 2026</span>
    </section>
  );
}
