import { useState, useEffect } from 'react';
import { About } from './components/About';
import { Certificates } from './components/Certificates';
import { CinematicIntro } from './components/CinematicIntro';
import { CodingProfiles } from './components/CodingProfiles';
import { Contact } from './components/Contact';
import { Education } from './components/Education';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { Projects } from './components/Projects';
import { ScrollEffects } from './components/ScrollEffects';
import { Skills } from './components/Skills';

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('pt_seen_intro');
    } catch {
      return true;
    }
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('pt_seen_intro', 'true');
    } catch {
      // ignore
    }
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="site-shell">
      {/* 3D Cinematic Opening Sequence inspired by GPT-6 Astra visual reference */}
      <CinematicIntro isOpen={showIntro} onComplete={handleIntroComplete} />

      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollEffects />
      <Navigation onReplayIntro={handleReplayIntro} />
      <main id="main-content">
        <Hero onReplayIntro={handleReplayIntro} />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Certificates />
        <CodingProfiles />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
