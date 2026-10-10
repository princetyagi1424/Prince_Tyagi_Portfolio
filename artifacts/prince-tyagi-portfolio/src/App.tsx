import { About } from './components/About';
import { Certificates } from './components/Certificates';
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
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollEffects />
      <Navigation />
      <main id="main-content">
        <Hero />
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
