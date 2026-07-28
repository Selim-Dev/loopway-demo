import { Icon } from '@loopway/ui';
import { LINKS, type Dictionary } from '@/content';
import { LiveCrossBorder, LiveOffers, LiveWaybill, LiveWallet } from './product/LiveSurfaces';
import styles from './Sections.module.css';

/* ==========================================================================
   Proof strip

   Four factual claims and no logos. A "trusted by" row of invented customer
   marks is the single most common lie on a landing page; docs 01-identity.md
   forbids fabricated sample data and this is the same rule applied outward.
   ========================================================================== */
export function Proof({ t }: { t: Dictionary }) {
  return (
    <section className={styles.proof}>
      <div className={`mkShell ${styles.proofInner}`}>
        {t.proof.items.map((item) => (
          <div key={item.value} className={styles.proofItem}>
            <span className={styles.proofValue}>{item.value}</span>
            <span className={styles.proofLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   How it works — the ten stages of SRS §5
   ========================================================================== */
export function HowItWorks({ t }: { t: Dictionary }) {
  return (
    <section id="how" className={styles.section}>
      <div className="mkShell">
        <header className={styles.head} data-reveal>
          <span className="mkEyebrow">{t.how.eyebrow}</span>
          <h2 className="mkSectionTitle">{t.how.title}</h2>
          <p className="mkLead">{t.how.lead}</p>
        </header>

        <ol className={styles.stages}>
          {t.how.stages.map((s, i) => (
            <li key={s.short} className={styles.stage} data-reveal style={{ animationDelay: `${i * 45}ms` }}>
              <span className={styles.stageNum} lang="en">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.stageTitle}>{s.title}</h3>
              <p className={styles.stageBody}>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ==========================================================================
   Features — four rows, each anchored on a real product surface
   ========================================================================== */
const SURFACES = [LiveOffers, LiveWallet, LiveWaybill, LiveCrossBorder] as const;

export function Features({ t }: { t: Dictionary }) {
  return (
    <section id="features" className={`${styles.section} ${styles.sectionTint}`}>
      <div className="mkShell">
        <header className={styles.head} data-reveal>
          <span className="mkEyebrow">{t.features.eyebrow}</span>
          <h2 className="mkSectionTitle">{t.features.title}</h2>
          <p className="mkLead">{t.features.lead}</p>
        </header>

        <div className={styles.rows}>
          {t.features.rows.map((row, i) => {
            const Surface = SURFACES[i];
            return (
              <article key={row.rule} className={i % 2 === 1 ? `${styles.row} ${styles.rowFlip}` : styles.row} data-reveal>
                <div className={styles.rowCopy}>
                  <span className={styles.ruleCode} lang="en">
                    {row.rule}
                  </span>
                  <span className={styles.rowEyebrow}>{row.eyebrow}</span>
                  <h3 className={styles.rowTitle}>{row.title}</h3>
                  <p className={styles.rowBody}>{row.body}</p>
                  <ul className={styles.points}>
                    {row.points.map((p) => (
                      <li key={p}>
                        <Icon name="check" size={15} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.rowSurface}>
                  <Surface />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Platforms
   ========================================================================== */
export function Platforms({ t }: { t: Dictionary }) {
  return (
    <section id="platforms" className={styles.section}>
      <div className="mkShell">
        <header className={styles.head} data-reveal>
          <span className="mkEyebrow">{t.platforms.eyebrow}</span>
          <h2 className="mkSectionTitle">{t.platforms.title}</h2>
          <p className="mkLead">{t.platforms.lead}</p>
        </header>

        <div className={styles.platforms}>
          {t.platforms.cards.map((c, i) => {
            const body = (
              <>
                <div className={styles.platformTop}>
                  <span className={c.href ? styles.platformBadge : `${styles.platformBadge} ${styles.platformBadgeSoon}`}>
                    {c.status}
                  </span>
                  {c.href ? <Icon name="arrowOut" size={16} /> : null}
                </div>
                <h3 className={styles.platformName}>{c.name}</h3>
                <p className={styles.platformRole}>{c.role}</p>
                {c.href ? <span className={styles.platformOpen}>{t.platforms.open}</span> : null}
              </>
            );

            const className = [
              styles.platform,
              c.primary ? styles.platformPrimary : '',
              c.href ? '' : styles.platformSoon,
            ]
              .filter(Boolean)
              .join(' ');

            return c.href ? (
              <a key={c.name} href={c.href} target="_blank" rel="noreferrer" className={className} data-reveal style={{ animationDelay: `${i * 60}ms` }}>
                {body}
              </a>
            ) : (
              <div key={c.name} className={className} data-reveal style={{ animationDelay: `${i * 60}ms` }}>
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Rules

   The most credible section on the page, and the least conventional: four
   business rules quoted by their SRS codes. A claim with a reference number is
   a claim someone can check.
   ========================================================================== */
export function Rules({ t }: { t: Dictionary }) {
  return (
    <section id="rules" className={`${styles.section} ${styles.sectionDark}`}>
      <div className="mkShell">
        <header className={styles.head} data-reveal>
          <span className={styles.eyebrowOnField}>{t.rules.eyebrow}</span>
          <h2 className={styles.titleOnField}>{t.rules.title}</h2>
          <p className={styles.leadOnField}>{t.rules.lead}</p>
        </header>

        <div className={styles.rules}>
          {t.rules.cards.map((c, i) => (
            <article key={c.code} className={styles.rule} data-reveal style={{ animationDelay: `${i * 60}ms` }}>
              <span className={styles.ruleTag} lang="en">
                {c.code}
              </span>
              <h3 className={styles.ruleTitle}>{c.title}</h3>
              <p className={styles.ruleBody}>{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Closing CTA + footer
   ========================================================================== */
export function CtaBand({ t }: { t: Dictionary }) {
  return (
    <section className={styles.ctaBand}>
      <div className={`mkShell ${styles.ctaInner}`} data-reveal>
        <div>
          <h2 className={styles.ctaTitle}>{t.cta.title}</h2>
          <p className={styles.ctaBody}>{t.cta.body}</p>
        </div>
        <div className={styles.ctaActions}>
          <a className={styles.ctaPrimary} href={LINKS.b2b} target="_blank" rel="noreferrer">
            {t.cta.primary}
            <Icon name="arrowOut" size={17} />
          </a>
          <a className={styles.ctaSecondary} href={LINKS.admin} target="_blank" rel="noreferrer">
            {t.cta.secondary}
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className={styles.footer}>
      <div className={`mkShell ${styles.footerInner}`}>
        <div className={styles.footerBrand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/loopway-logo.png" alt="" className={styles.footerMark} width={52} height={28} />
          <p className={styles.footerTagline}>{t.footer.tagline}</p>
        </div>

        {t.footer.columns.map((col) => (
          <nav key={col.title} className={styles.footerCol} aria-label={col.title}>
            <h3 className={styles.footerColTitle}>{col.title}</h3>
            {col.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={styles.footerLink}
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {l.label}
              </a>
            ))}
          </nav>
        ))}
      </div>

      <div className={`mkShell ${styles.footerBottom}`}>
        <span className={styles.footerLegal} lang="en">
          {t.footer.legal}
        </span>
        <span className={styles.footerNote}>{t.footer.note}</span>
      </div>
    </footer>
  );
}
