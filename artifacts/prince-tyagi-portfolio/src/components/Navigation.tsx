import { useEffect, useState } from 'react';
import { Menu, X, Sparkles, Sun, Moon } from 'lucide-react';
import { navigation } from '../data/portfolio';
import { useTheme } from '../hooks/useTheme';

interface NavigationProps {
  onReplayIntro?: () => void;
}

export function Navigation({ onReplayIntro }: NavigationProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const { toggle, isDark } = useTheme();

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

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const goTo = (href: string) => {
    setOpen(false);
    window.setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try {
          history.replaceState(null, '', href);
        } catch {
          // ignore
        }
      } else {
        window.location.hash = href;
      }
    }, 50);
  };

  return (
    <div className={`nav-wrap${open ? ' nav-wrap--open' : ''}`}>
      {open && (
        <button
          type="button"
          className="nav-scrim"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <nav className="nav" aria-label="Main navigation">
        <a
          href="#home"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            goTo('#home');
          }}
          aria-label="Prince Tyagi, home"
        >
          <span className="brand-mark relative overflow-hidden border border-slate-300">
            <img
              src="/prince-tyagi.jpg"
              alt="Prince Tyagi"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </span>
          <span>Prince Tyagi</span>
        </a>

        <div
          className={`nav-links${open ? ' open' : ''}`}
          id="primary-links"
          role="navigation"
          aria-hidden={!open}
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault();
                goTo(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
          {onReplayIntro && (
            <button
              type="button"
              className="nav-intro-btn"
              onClick={() => {
                setOpen(false);
                onReplayIntro();
              }}
              title="Play 3D intro animation"
            >
              <Sparkles size={14} /> Intro
            </button>
          )}
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>

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
        </div>
      </nav>
    </div>
  );
}
