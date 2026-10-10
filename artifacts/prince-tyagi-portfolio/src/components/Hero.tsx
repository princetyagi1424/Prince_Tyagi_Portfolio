import { ArrowDownRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { portfolio } from '../data/portfolio';
import { Scene3D } from './Scene3D';

interface HeroProps {
  onReplayIntro?: () => void;
}

export function Hero({ onReplayIntro }: HeroProps) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="wrap hero-inner">
        <div className="hero-copy reveal">
          <div className="hero-status flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-slate-900/60 backdrop-blur-md">
            <img
              src="/prince-tyagi.jpg"
              alt="Prince Tyagi"
              className="w-6 h-6 rounded-full object-cover border border-cyan-400/60 shadow-sm shadow-cyan-500/30"
            />
            <span className="status-dot" />
            <span className="text-slate-200 text-xs font-mono">{portfolio.person.title}</span>
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
            <a className="button button-primary" href="#projects">
              Explore projects <ArrowDownRight size={15} />
            </a>
            <a className="button button-ghost" href="#contact">
              Contact me <ArrowUpRight size={14} />
            </a>
            {onReplayIntro && (
              <button
                type="button"
                className="button button-ghost text-cyan-300 border-cyan-500/30 hover:border-cyan-400 cursor-pointer"
                onClick={onReplayIntro}
                title="Play cinematic 3D particle intro"
              >
                <Sparkles size={14} className="text-cyan-400" /> Replay Intro
              </button>
            )}
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
