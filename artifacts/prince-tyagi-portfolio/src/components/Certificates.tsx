import { useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import { portfolio } from '../data/portfolio';

export function Certificates() {
  const [showAll, setShowAll] = useState(false);
  const visibleCertificates = showAll
    ? portfolio.certificates
    : portfolio.certificates.slice(0, 2);
  const hasMoreCertificates = portfolio.certificates.length > 2;

  return (
    <section className="section" id="certificates" aria-labelledby="certificates-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="section-kicker">05 / Certificates</span>
            <h2 id="certificates-title" className="display">
              Learning beyond<br />the classroom.
            </h2>
          </div>
          <p>
            Participation, job simulation, and skills certification—each credential named for what it represents.
          </p>
        </div>

        <div className="credential-grid">
          {visibleCertificates.map((certificate) => (
            <article className="credential-card" key={certificate.title}>
              {certificate.image ? (
                <img
                  className="credential-image"
                  src={certificate.image}
                  alt={certificate.alt}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="credential-text">
                  <span className="credential-type">{certificate.type}</span>
                  <strong className="big-mark">
                    {certificate.title}
                  </strong>
                  <span className="mono muted">CERTIFICATE OF APPRECIATION</span>
                </div>
              )}

              <div className="credential-body">
                <span className="credential-type">{certificate.type}</span>
                <h3>{certificate.title}</h3>
                <p>{certificate.description}</p>

                {certificate.profile && (
                  <a
                    className="credential-link"
                    href={certificate.profile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    HackerRank profile <ArrowUpRight size={14} />
                  </a>
                )}

                <time className="credential-date" dateTime={certificate.date}>
                  {certificate.date}
                </time>
              </div>
            </article>
          ))}
        </div>

        {hasMoreCertificates && (
          <div className="certificate-more-wrap">
            <button
              type="button"
              className="certificate-more"
              onClick={() => setShowAll((current) => !current)}
              aria-expanded={showAll}
              aria-controls="certificates"
            >
              {showAll ? (
                <>Show less <ChevronUp size={16} /></>
              ) : (
                <>Show more certificates <ChevronDown size={16} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
