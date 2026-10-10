import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { portfolio } from '../data/portfolio';
import { Scene3D } from './Scene3D';

export function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="wrap hero-inner">
        <div className="hero-copy reveal">
          <div className="hero-status"><span className="status-dot" /> {portfolio.person.title}</div>
          <h1 id="hero-title" className="display">Prince <span>Tyagi.</span></h1>
          <p className="hero-tagline">Building my path in software engineering, one problem and project at a time.</p>
          <p className="hero-support">B.Tech CSE (AI &amp; Data Science) student at GLA University, expected to graduate in 2029. Currently focused on Java, DSA, and practical software projects.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">Explore projects <ArrowDownRight size={15} /></a>
            <a className="button button-ghost" href="#contact">Contact me <ArrowUpRight size={14} /></a>
          </div>
          <div className="hero-meta"><span>GLA University</span><span>Mathura, India</span><span>Class of 2029</span></div>
        </div>
        <div className="hero-visual"><Scene3D /></div>
      </div>
      <span className="hero-index">PORTFOLIO / 2026</span>
      <a className="scroll-cue" href="#about" aria-label="Scroll to About section">Scroll to explore</a>
    </section>
  );
}
