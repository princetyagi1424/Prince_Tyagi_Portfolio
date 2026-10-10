import { navigation, portfolio } from '../data/portfolio';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div><a href="#home" className="footer-brand">Prince Tyagi</a><div className="footer-copy">© {new Date().getFullYear()} · A student portfolio</div></div>
        <nav className="footer-links" aria-label="Footer navigation">
          {navigation.filter((item) => ['#about', '#projects', '#profiles', '#contact'].includes(item.href)).map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
          {portfolio.profiles.slice(0, 2).map((profile) => <a key={profile.name} href={profile.url} target="_blank" rel="noreferrer">{profile.name}</a>)}
          <a className="back-top" href="#home">Back to top ↑</a>
        </nav>
      </div>
    </footer>
  );
}
