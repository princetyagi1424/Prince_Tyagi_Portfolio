import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navigation } from '../data/portfolio';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(`#${visible.target.id}`);
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, .2, .5] });
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
          <span className="brand-mark">PT</span><span>Prince Tyagi</span>
        </a>
        <button className="menu-toggle" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="primary-links" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className={`nav-links ${open ? 'open' : ''}`} id="primary-links">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} aria-current={active === item.href ? 'location' : undefined} onClick={() => setOpen(false)}>{item.label}</a>
          ))}
        </div>
      </nav>
    </div>
  );
}
