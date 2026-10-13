import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react';
import { portfolio, resume } from '../data/portfolio';
import { Scene3D } from './Scene3D';

interface HeroProps {
  onReplayIntro?: () => void;
}

export function Hero(_props: HeroProps) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="wrap hero-inner">
        <div className="hero-copy reveal">
          <div className="hero-status flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-300 bg-white">
            <img
              src="/prince-tyagi.jpg"
              alt="Prince Tyagi"
              className="w-6 h-6 rounded-full object-cover border border-slate-300"
            />
            <span className="status-dot" />
            <span className="text-slate-700 text-sm font-mono">{portfolio.person.title}</span>
          </div>

          <h1 id="hero-title" className="display">
            Prince <span>Tyagi.</span>
          </h1>

          <p className="hero-tagline">
            Building my path in software engineering, one problem and project at a time.
          </p>

          <p className="hero-support">
            B.Tech CSE (AI &amp; Data Science) student at GLA University, expected to graduate in 2029. Currently focused on Java, DSA, and practical software projects.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href={resume.url} download={resume.filename}>
              <Download size={16} /> {resume.label}
            </a>
            <a className="button button-ghost" href="#projects">
              Explore projects <ArrowDownRight size={15} />
            </a>
            <a className="button button-ghost" href="#contact">
              Contact me <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="hero-meta">
            <span>GLA University</span>
            <span>Mathura, India</span>
            <span>Class of 2029</span>
          </div>
        </div>

        <div className="hero-visual">
          <Scene3D />
        </div>
      </div>

      <span className="hero-index font-mono">PORTFOLIO / 2026</span>
      <a className="scroll-cue" href="#about" aria-label="Scroll to About section">
        Scroll to explore
      </a>
    </section>
  );
}
