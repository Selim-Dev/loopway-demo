'use client';

import * as React from 'react';
import styles from './HeroRoad.module.css';

/**
 * The road.
 *
 * PROVENANCE — this is not an invented hero graphic. The LoopWay mark is a
 * two-lane road folded into an infinity loop: dark asphalt with a dashed white
 * centre line on one half, a lit green road on the other. The hero unfolds that
 * same construction across the full width and hangs the real journey stages off
 * it, so the picture and the product describe each other.
 *
 * The trip-row map plate in @loopway/ui already establishes the pattern of a
 * hand-drawn abstract route rather than a map tile. This is that plate at hero
 * scale.
 *
 * CONSTRUCTION — four strokes on one shared path:
 *   1. asphalt    wide, --mk-road
 *   2. shoulder   wider and softer, under the asphalt
 *   3. lane       dashed white centre line
 *   4. travelled  the green "already happened" segment, drawn on load
 *
 * DIRECTION — the geometry never mirrors. Mirroring the SVG would also mirror
 * the truck's motion path and the gradient, and each needs its own correction;
 * the cure is worse than the disease. Instead the LABELS are assigned in
 * reading order — stage 1 on the right in Arabic, on the left in English — and
 * the travelled segment and the truck start from that same end.
 *
 * MOTION — the truck rides `<animateMotion>` inside the SVG rather than a CSS
 * `offset-path`. CSS would place it in the element's pixel box while the SVG
 * stretches a 1200-unit viewBox across it, so the truck would drive somewhere
 * near the road but never on it.
 */

/** A shallow S: reads as distance rather than as a decorative squiggle. */
const PATH = 'M -40 262 C 190 262, 220 150, 430 140 S 700 172, 860 116 S 1090 42, 1250 48';

/** Where the waypoints sit along the path, 0–1. Uneven on purpose: real trips are. */
const NODE_AT = [0.1, 0.24, 0.38, 0.52, 0.66, 0.8, 0.92];

/** How much of the journey has happened. Drives the green segment, the filled
 *  waypoints and where the truck rests under reduced motion — one number, so
 *  they cannot disagree. */
const PROGRESS = 0.52;

export function HeroRoad({ stages, rtl }: { stages: string[]; rtl: boolean }) {
  const pathRef = React.useRef<SVGPathElement>(null);
  const [nodes, setNodes] = React.useState<{ x: number; y: number }[]>([]);
  const [len, setLen] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);

  // Measure the path once it is in the DOM instead of hard-coding coordinates —
  // the waypoints then stay glued to the curve if the path is ever retuned, and
  // the dash lengths below are real user units rather than a `pathLength`
  // normalisation, which interacts badly with `non-scaling-stroke` under a
  // non-uniform `preserveAspectRatio`.
  React.useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    setLen(total);
    setNodes(
      NODE_AT.map((t) => {
        const p = path.getPointAtLength(total * t);
        return { x: p.x, y: p.y };
      }),
    );
  }, []);

  // SMIL does not read prefers-reduced-motion, so the check is explicit and the
  // truck is simply parked instead of animated.
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const labels = stages.slice(0, NODE_AT.length);
  // Derived from the same PROGRESS the green segment uses, so a filled waypoint
  // can never sit on a stretch of road that has not been drawn green yet.
  const doneCount = NODE_AT.filter((t) => t < PROGRESS).length;

  /** Index into `labels` for a given node, so stage 1 lands at the reading start. */
  const labelFor = (i: number) => (rtl ? labels[NODE_AT.length - 1 - i] : labels[i]);
  /** A node is "already travelled" when it is behind the truck in reading order. */
  const isDone = (i: number) => (rtl ? i >= NODE_AT.length - doneCount : i < doneCount);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 1200 300" preserveAspectRatio="none" role="presentation">
        {/* 2 — shoulder */}
        <path d={PATH} className={styles.shoulder} />
        {/* 1 — asphalt */}
        <path ref={pathRef} d={PATH} className={styles.asphalt} />
        {/* 3 — lane marking */}
        <path d={PATH} className={styles.lane} />
        {/* 4 — travelled. The dash is one solid run covering PROGRESS of the
             curve; `--mk-dash-from` is where that run starts hidden, and the
             keyframe walks it to `--mk-dash-to`. Both ends are explicit, so the
             segment grows from the reading start in either direction. */}
        {len > 0 ? (
          <path
            d={PATH}
            className={styles.travelled}
            style={
              {
                strokeDasharray: `${len * PROGRESS} ${len}`,
                '--mk-dash-from': rtl ? `${-len}` : `${len * PROGRESS}`,
                '--mk-dash-to': rtl ? `${-len * (1 - PROGRESS)}` : '0',
              } as React.CSSProperties
            }
          />
        ) : null}

        {nodes.map((n, i) => (
          <g key={i} className={styles.node} style={{ animationDelay: `${850 + i * 90}ms` }}>
            <circle cx={n.x} cy={n.y} r="12" className={styles.nodeHalo} />
            <circle cx={n.x} cy={n.y} r="5" className={isDone(i) ? styles.nodeDotDone : styles.nodeDot} />
          </g>
        ))}

        {/* The truck. The site's one decorative infinite animation, granted on
            the same reasoning the product granted the waybill glow: the loop IS
            the mark, so a vehicle travelling it is the logo explaining itself.
            Nothing else on this site loops. */}
        <g className={styles.truck}>
          <circle r="15" className={styles.truckDisc} />
          <g transform="translate(-9,-9) scale(0.75)">
            <path
              d="M3 16V7a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v9M14 10h3.5a1 1 0 0 1 .8.4l2.5 3.3a1 1 0 0 1 .2.6V16"
              className={styles.truckGlyph}
            />
            <circle cx="7.5" cy="17.5" r="1.9" className={styles.truckGlyph} />
            <circle cx="17" cy="17.5" r="1.9" className={styles.truckGlyph} />
          </g>
          {reduced ? (
            <animateMotion
              path={PATH}
              dur="1s"
              fill="freeze"
              keyPoints={rtl ? `${1 - PROGRESS};${1 - PROGRESS}` : `${PROGRESS};${PROGRESS}`}
              keyTimes="0;1"
              calcMode="linear"
              repeatCount="1"
            />
          ) : (
            <animateMotion
              path={PATH}
              dur="16s"
              begin="0.9s"
              repeatCount="indefinite"
              keyPoints={rtl ? '1;0' : '0;1'}
              keyTimes="0;1"
              calcMode="linear"
            />
          )}
        </g>
      </svg>

      {/* Labels are HTML, not SVG <text>: Arabic shaping and bidi are the
          browser's job and SVG text gives up both. Positioned from the same
          measured points as percentages, so they track the stretched viewBox. */}
      <div className={styles.labels}>
        {nodes.map((n, i) => (
          <span
            key={i}
            className={isDone(i) ? `${styles.label} ${styles.labelDone}` : styles.label}
            // `left`, not `inset-inline-start`: these are physical positions
            // measured off the SVG, which never mirrors.
            style={{
              left: `${(n.x / 1200) * 100}%`,
              top: `${(n.y / 300) * 100}%`,
              animationDelay: `${950 + i * 90}ms`,
            }}
          >
            {labelFor(i)}
          </span>
        ))}
      </div>
    </div>
  );
}
