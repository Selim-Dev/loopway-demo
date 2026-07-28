import { Icon } from '@loopway/ui';
import { LINKS, type Dictionary } from '@/content';
import { HeroRoad } from './HeroRoad';
import { LiveTripRow, LiveWallet } from './product/LiveSurfaces';
import styles from './Hero.module.css';

/**
 * The hero.
 *
 * Four layers, back to front:
 *   1. the navy field
 *   2. the road (HeroRoad) — the logo's own construction at full scale
 *   3. the live product — real @loopway/ui components, not screenshots
 *   4. the type
 *
 * The reason layer 3 is real DOM rather than an image is the whole argument of
 * this page: the timer in the trip row is counting right now, and no landing
 * page template can produce that because it requires the product to exist.
 *
 * LAYOUT NOTE. The trip row spans the full shell rather than sitting in a
 * column beside the copy. It is designed at 1000px; squeezed into a half-width
 * column it scales to ~0.5 and its 13.5px labels land at 7px, which reads as a
 * blurry screenshot — the opposite of the point. Full width, it renders at
 * roughly true size and stays legible.
 */
export function Hero({ t, rtl }: { t: Dictionary; rtl: boolean }) {
  const [line1, line2, line3] = t.hero.titleLines;
  const stageShorts = t.how.stages.map((s) => s.short);

  return (
    <section className={styles.hero}>
      <div className={`mkShell ${styles.shell}`}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>{t.hero.eyebrow}</span>

          <h1 className={styles.title}>
            <span className={styles.line}>{line1}</span>
            {/* The middle line takes the brand green — the one place on the site
                where it is emphasis rather than an action. */}
            <span className={`${styles.line} ${styles.lineAccent}`}>{line2}</span>
            <span className={styles.lineTail}>{line3}</span>
          </h1>

          <p className={styles.lead}>{t.hero.lead}</p>

          <div className={styles.actions}>
            <a className={styles.ctaPrimary} href={LINKS.b2b} target="_blank" rel="noreferrer">
              {t.hero.ctaPrimary}
              <Icon name="arrowOut" size={17} />
            </a>
            <a className={styles.ctaSecondary} href="#how">
              {t.hero.ctaSecondary}
              <Icon name="chevronDown" size={17} />
            </a>
          </div>
        </div>

        <div className={styles.walletCol}>
          <div className={styles.walletLabel}>
            <span className={styles.shieldPip} aria-hidden="true" />
            {t.hero.walletLabel}
          </div>
          <LiveWallet />
        </div>
      </div>

      {/* The road gets a clear strip of its own. Laying it behind the cards was
          the obvious move and the wrong one: a road running under a white panel
          reads as a rendering fault, not as depth. */}
      <div className={styles.roadBand}>
        <HeroRoad stages={stageShorts} rtl={rtl} />
      </div>

      {/* The live band. Full width so the real component renders near true size. */}
      <div className={`mkShell ${styles.band}`}>
        <div className={styles.bandHead}>
          <span className={styles.livePip} aria-hidden="true" />
          {t.hero.tripLabel}
        </div>
        <div className={styles.tripSlot}>
          <LiveTripRow />
        </div>
        <p className={styles.liveCaption}>{t.hero.liveCaption}</p>
        {t.hero.productLanguageNote ? (
          <p className={styles.langNote} lang="en">
            {t.hero.productLanguageNote}
          </p>
        ) : null}
      </div>

      {/* The stage rail. On wide screens it echoes the road's waypoints; below
          900px it is the only place the stage names appear, since the road's
          own labels collide at that width. */}
      <div className={styles.rail} aria-label={t.how.title}>
        <div className={`mkShell ${styles.railInner}`}>
          {t.how.stages.map((s, i) => (
            <span key={s.short} className={i <= 3 ? `${styles.railItem} ${styles.railDone}` : styles.railItem}>
              <span className={styles.railIndex} lang="en">
                {String(i + 1).padStart(2, '0')}
              </span>
              {s.short}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
