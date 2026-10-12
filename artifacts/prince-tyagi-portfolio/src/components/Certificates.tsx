
import { ArrowUpRight } from 'lucide-react';
import { portfolio } from '../data/portfolio';

export function Certificates() {
  return (
    <section
      className="section"
      id="certificates"
      aria-labelledby="certificates-title"
    >
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="section-kicker">05 / Development</span>
            <h2 id="certificates-title" className="display">
              Learning beyond<br />the classroom.
            </h2>
          </div>
          <p>
            Participation, job simulation, and skills certification—each
            credential named for what it represents.
          </p>
        </div>

        <div className="credential-grid">
          {portfolio.certificates.map((certificate) => (
            <article className="credential-card" key={certificate.title}>
              {certificate.image ? (
                <img
                  className="credential-image"
                  src={certificate.image}
                  alt={certificate.alt}
                  loading="lazy"
                />
              ) : (
                <div className="credential-text">
                  <span className="credential-type">
                    HackerRank · Skill certification
                  </span>
                  <strong className="big-mark">
                    Java<br />(Basic)
                  </strong>
                  <span className="mono muted">
                    CERTIFICATE OF ACCOMPLISHMENT
                  </span>
                </div>
              )}

              <div className="credential-body">
                <span className="credential-type">{certificate.type}</span>
                <h3>{certificate.title}</h3>
                <p>{certificate.description}</p>

                {certificate.profile && (
                  <a
                    className="project-links"
                    href={certificate.profile}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 11, color: '#8ce1e9' }}
                  >
                    HackerRank profile <ArrowUpRight size={12} />
                  </a>
                )}

                <time className="credential-date">
                  {certificate.date}
                </time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
