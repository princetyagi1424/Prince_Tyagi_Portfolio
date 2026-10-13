import { navigation, portfolio, resume } from '../data/portfolio';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div>
          <a href="#home" className="footer-brand flex items-center gap-2">
            <img
              src="/prince-tyagi.jpg"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 rounded-full object-cover border border-slate-300"
            />
            <span>Prince Tyagi</span>
          </a>
          <div className="footer-copy">© {year} · B.Tech CSE (AI &amp; Data Science) · GLA University</div>
          <div className="footer-social" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: 10 }}>
            {portfolio.profiles.map((profile) => (
              <a key={profile.name} href={profile.url} target="_blank" rel="noopener noreferrer">
                {profile.name}
              </a>
            ))}
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          {navigation
            .filter((item) => ['#about', '#projects', '#profiles', '#contact'].includes(item.href))
            .map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          <a href={resume.url} download={resume.filename}>
            {resume.label}
          </a>
          <a className="back-top" href="#home">
            Back to top ↑
          </a>
        </nav>
      </div>
    </footer>
  );
}
