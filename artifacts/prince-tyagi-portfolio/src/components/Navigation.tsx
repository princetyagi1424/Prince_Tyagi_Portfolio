import { useEffect, useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { navigation } from '../data/portfolio';

interface NavigationProps {
  onReplayIntro?: () => void;
}

export function Navigation({ onReplayIntro }: NavigationProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.2, 0.5] }
    );
    navigation.forEach(({ href }) => {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <div className="nav-wrap">
      <nav className="nav" aria-label="Main navigation">
        <a href="#home" className="brand" onClick={() => setOpen(false)} aria-label="Prince Tyagi, home">
          <span className="brand-mark relative overflow-hidden border border-slate-300">
            <img
              src="/prince-tyagi.jpg"
              alt="Prince Tyagi"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // If image fails to load, show PT text fallback
                e.currentTarget.style.display = 'none';
              }}
            />
          </span>
          <span>Prince Tyagi</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="primary-links"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className={`nav-links ${open ? 'open' : ''}`} id="primary-links">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? 'location' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          {onReplayIntro && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-mono border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-500 transition-all cursor-pointer"
              onClick={() => {
                setOpen(false);
                onReplayIntro();
              }}
              title="Play 3D intro animation"
            >
              <Sparkles size={11} className="text-blue-700" /> Intro
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
