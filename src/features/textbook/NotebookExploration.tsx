import { useState } from 'react';
import styles from './NotebookExploration.module.css';

interface Props {
  bookId: string;
  chapterId: string;
}

function DotCounter() {
  const [count, setCount] = useState(4);
  return (
    <section className={styles.activity} aria-label="Interactive counting model">
      <div className={styles.heading}>
        <strong>Move the dots</strong>
        <span>COUNTING LAB</span>
      </div>
      <p>Choose how many objects are in your collection. Touch each dot once as you count.</p>
      <label htmlFor="notebook-dot-count">
        Number of objects: <strong>{count}</strong>
      </label>
      <input
        id="notebook-dot-count"
        type="range"
        min="1"
        max="10"
        step="1"
        value={count}
        onChange={(event) => {
          setCount(Number(event.target.value));
        }}
      />
      <div className={styles.dots} aria-label={String(count) + ' objects'}>
        {Array.from({ length: count }, (_, i) => (
          <span className={styles.dot} key={i} aria-hidden="true" />
        ))}
      </div>
      <p className={styles.result}>
        The last counting word is <strong>{count}</strong>.
      </p>
    </section>
  );
}

function TenthsModel() {
  const [tenths, setTenths] = useState(4);
  return (
    <section className={styles.activity} aria-label="Interactive decimal tenths model">
      <div className={styles.heading}>
        <strong>Build a decimal</strong>
        <span>PLACE VALUE LAB</span>
      </div>
      <p>One whole is split into ten equal pieces. Shade more pieces to see how tenths work.</p>
      <label htmlFor="notebook-tenths">
        Tenths shaded: <strong>{tenths} out of 10</strong>
      </label>
      <input
        id="notebook-tenths"
        type="range"
        min="0"
        max="10"
        step="1"
        value={tenths}
        onChange={(event) => {
          setTenths(Number(event.target.value));
        }}
      />
      <div
        className={styles.tenFrame}
        role="img"
        aria-label={String(tenths) + ' of ten equal pieces shaded'}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={i < tenths ? styles.filled : styles.empty} />
        ))}
      </div>
      <p className={styles.result}>
        <strong>
          {tenths}/10 = {(tenths / 10).toFixed(1)}
        </strong>
      </p>
    </section>
  );
}

function PercentModel() {
  const [percent, setPercent] = useState(20);
  return (
    <section className={styles.activity} aria-label="Interactive percentage model">
      <div className={styles.heading}>
        <strong>See a percentage</strong>
        <span>PERCENTAGE LAB</span>
      </div>
      <p>Imagine $50. Change the percentage and see what fraction of the amount it represents.</p>
      <label htmlFor="notebook-percent">
        Percentage: <strong>{percent}%</strong>
      </label>
      <input
        id="notebook-percent"
        type="range"
        min="0"
        max="100"
        step="10"
        value={percent}
        onChange={(event) => {
          setPercent(Number(event.target.value));
        }}
      />
      <div className={styles.track} role="img" aria-label={String(percent) + ' percent shaded'}>
        <div className={styles.trackFill} style={{ width: String(percent) + '%' }} />
      </div>
      <p className={styles.result}>
        {percent}% of $50 ={' '}
        <strong>
          {'$'}
          {((percent / 100) * 50).toFixed(2)}
        </strong>
      </p>
      <p>
        To check: {percent} ÷ 100 × 50 = {((percent / 100) * 50).toFixed(2)}.
      </p>
    </section>
  );
}

function GrowthModel() {
  const [years, setYears] = useState(2);
  const value = 100 * 1.1 ** years;
  return (
    <section className={styles.activity} aria-label="Interactive compound growth model">
      <div className={styles.heading}>
        <strong>Watch compound growth</strong>
        <span>GROWTH LAB</span>
      </div>
      <p>
        Start with $100. Each year, add 10% of the <em>new</em> balance—not 10% of the first
        balance.
      </p>
      <label htmlFor="notebook-growth-years">
        Number of years: <strong>{years}</strong>
      </label>
      <input
        id="notebook-growth-years"
        type="range"
        min="0"
        max="4"
        step="1"
        value={years}
        onChange={(event) => {
          setYears(Number(event.target.value));
        }}
      />
      <div
        className={styles.growthBars}
        role="img"
        aria-label={'Investment is $' + value.toFixed(2) + ' after ' + String(years) + ' years'}
      >
        {Array.from({ length: years + 1 }, (_, year) => {
          const amount = 100 * 1.1 ** year;
          return (
            <div className={styles.growthColumn} key={year}>
              <span className={styles.bar} style={{ height: String((amount / 146.41) * 100) + '%' }} />
              <span>{year === 0 ? 'Start' : 'Y' + String(year)}</span>
            </div>
          );
        })}
      </div>
      <p className={styles.result}>
        After {years} {years === 1 ? 'year' : 'years'}:{' '}
        <strong>
          {'$'}
          {value.toFixed(2)}
        </strong>
      </p>
    </section>
  );
}

function ParabolaModel() {
  const [h, setH] = useState(2);
  const [k, setK] = useState(1);
  const xPos = (x: number) => 160 + x * 18;
  const yPos = (y: number) => 160 - y * 18;
  const path = Array.from({ length: 121 }, (_, index) => {
    const x = (index - 60) / 10;
    const y = (x - h) ** 2 + k;
    return (index === 0 ? 'M' : 'L') + xPos(x).toFixed(2) + ',' + yPos(y).toFixed(2);
  }).join(' ');
  return (
    <section className={styles.activity} aria-label="Interactive parabola transformations">
      <div className={styles.heading}>
        <strong>Move the parabola</strong>
        <span>GRAPH LAB</span>
      </div>
      <p>Move the turning point and notice how the whole graph shifts. The shape stays the same.</p>
      <div className={styles.rangeGrid}>
        <label htmlFor="notebook-vertex-x">
          Horizontal position: <strong>{h}</strong>
          <input
            id="notebook-vertex-x"
            type="range"
            min="-4"
            max="4"
            step="1"
            value={h}
            onChange={(event) => {
              setH(Number(event.target.value));
            }}
          />
        </label>
        <label htmlFor="notebook-vertex-y">
          Vertical position: <strong>{k}</strong>
          <input
            id="notebook-vertex-y"
            type="range"
            min="-4"
            max="4"
            step="1"
            value={k}
            onChange={(event) => {
              setK(Number(event.target.value));
            }}
          />
        </label>
      </div>
      <svg
        className={styles.graph}
        viewBox="0 0 320 240"
        role="img"
        aria-label={
          'Parabola y equals (x minus ' +
          String(h) +
          ') squared plus ' +
          String(k) +
          ' with turning point (' +
          String(h) +
          ', ' +
          String(k) +
          ')'
        }
      >
        <title>
          Parabola with turning point ({h}, {k})
        </title>
        <defs>
          <clipPath id="notebook-parabola-clip">
            <rect x="8" y="8" width="304" height="224" rx="8" />
          </clipPath>
        </defs>
        <g className={styles.grid}>
          {Array.from({ length: 13 }, (_, i) => (
            <line key={'x' + String(i)} x1={xPos(i - 6)} y1="8" x2={xPos(i - 6)} y2="232" />
          ))}
          {Array.from({ length: 13 }, (_, i) => (
            <line key={'y' + String(i)} x1="8" y1={yPos(i - 4)} x2="312" y2={yPos(i - 4)} />
          ))}
        </g>
        <g className={styles.axes}>
          <line x1="8" x2="312" y1="160" y2="160" />
          <line x1="160" x2="160" y1="8" y2="232" />
        </g>
        <g clipPath="url(#notebook-parabola-clip)">
          <path className={styles.curve} d={path} />
          <circle className={styles.vertex} cx={xPos(h)} cy={yPos(k)} r="6" />
        </g>
      </svg>
      <p className={styles.result}>
        Turning point:{' '}
        <strong>
          ({h}, {k})
        </strong>{' '}
        · y = (x {h >= 0 ? '−' : '+'} {Math.abs(h)})² {k >= 0 ? '+' : '−'} {Math.abs(k)}
      </p>
    </section>
  );
}

/** Small, mathematically exact manipulatives for authored focus-area introductions. */
export function NotebookExploration({ bookId, chapterId }: Props) {
  if (bookId === 'kindergarten' && chapterId === 'focus-1') return <DotCounter />;
  if ((bookId === 'year-5' || bookId === 'year-6') && chapterId === 'focus-1')
    return <TenthsModel />;
  if (bookId === 'year-7' && chapterId === 'core-1') return <PercentModel />;
  if (bookId === 'year-10' && chapterId === 'core-1') return <GrowthModel />;
  if (bookId === 'year-12-advanced' && chapterId === 'focus-1') return <ParabolaModel />;
  return null;
}
