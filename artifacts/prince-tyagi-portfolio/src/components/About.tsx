import { MapPin, GraduationCap, Code2, Sparkles } from 'lucide-react';
import { portfolio } from '../data/portfolio';

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="section-kicker">01 / About</span>
            <h2 id="about-title" className="display">
              Learning by making<br />things work.
            </h2>
          </div>
          <p>
            A dedicated Computer Science Engineering student grounded in continuous Java algorithms practice and practical software engineering.
          </p>
        </div>

        <div className="about-grid">
          <aside className="about-aside relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="eyebrow flex items-center gap-2">
                  <Sparkles size={12} className="text-blue-700" />
                  Engineering Profile
                </span>
              </div>

              {/* Portrait Container with Holographic Glass Border */}
              <div className="my-5 relative rounded-2xl overflow-hidden border border-slate-300 bg-white shadow-lg transition-all duration-500">
                <img
                  src="/prince-tyagi.png"
                  alt="Prince Tyagi - Computer Science Engineering Student"
                  className="w-full aspect-square object-cover object-center filter contrast-[1.02] group-hover:scale-[1.02] transition-transform duration-700"
                  loading="lazy"
                />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[13px] font-mono text-slate-800 bg-white/90 py-1.5 px-3 rounded-lg border border-slate-300">
                  <span className="flex items-center gap-1.5 font-sans font-medium text-slate-900">
                    <span className="status-dot w-2 h-2" />
                    Prince Tyagi
                  </span>
                  <span className="text-blue-700 text-[12px]">Mathura, IN</span>
                </div>
              </div>

              <div className="space-y-1.5 text-sm text-slate-600 font-mono">
                <div className="flex items-center gap-2 text-slate-800">
                  <GraduationCap size={13} className="text-blue-700" />
                  <span>GLA University (2025–2029)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-indigo-700" />
                  <span>Mathura, Uttar Pradesh, India</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="about-copy">
            <h3 id="about-title-copy">
              A second-year student building a stronger software foundation.
            </h3>
            <p>{portfolio.person.bio}</p>
            <p>
              My approach is to learn by building, testing, debugging, and improving. I’m developing practical experience one project and one problem at a time.
            </p>
            <div className="interest-list" aria-label="Current areas of interest">
              {portfolio.interests.map((interest, index) => (
                <div className="interest-item" key={interest}>
                  <span>FOCUS / 0{index + 1}</span>
                  {interest}
                </div>
              ))}
            </div>
            <p className="about-languages">
              <span className="mono">LANGUAGES</span> {portfolio.person.languages.join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
