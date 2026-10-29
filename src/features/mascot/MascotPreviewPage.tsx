import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { Mascot } from '@/components/mascot/Mascot';
import {
  animationNames,
  mascotAnimations,
  type AnimationGroup,
  type AnimationName,
} from '@/components/mascot/animations';
import { expressionNames, expressions } from '@/components/mascot/expressions';
import { mascotViews, poseNames, poses } from '@/components/mascot/poses';
import { useMascotController } from '@/components/mascot/useMascotController';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { cx } from '@/lib/cx';
import styles from './MascotPreviewPage.module.css';

const VIEW_LABELS: Record<(typeof mascotViews)[number], string> = {
  front: 'Front',
  'front-right': 'Front-right ¾',
  right: 'Right side',
  'back-right': 'Back-right ¾',
  back: 'Back',
  'back-left': 'Back-left ¾',
  left: 'Left side',
  'front-left': 'Front-left ¾',
};

const GROUPS: { id: AnimationGroup; title: string }[] = [
  { id: 'movement', title: 'Movement' },
  { id: 'learning', title: 'Learning' },
  { id: 'feedback', title: 'Feedback and rewards' },
];

/** Website events the controller demo can fire, and the reaction each one plays. */
const EVENTS: { label: string; reaction: AnimationName }[] = [
  { label: 'Correct answer', reaction: 'correct' },
  { label: 'Incorrect answer', reaction: 'incorrect' },
  { label: 'Hint requested', reaction: 'idea' },
  { label: 'Lesson completed', reaction: 'lessonComplete' },
  { label: 'Perfect score', reaction: 'levelUp' },
  { label: 'Student arrives', reaction: 'wave' },
];

function AnimationCard({ name, reduce }: { name: AnimationName; reduce: boolean }) {
  const def = mascotAnimations[name];
  const [replay, setReplay] = useState(0);
  const [playing, setPlaying] = useState(true);

  return (
    <li className={styles.card}>
      <div className={styles.stage}>
        <Mascot
          animation={playing ? name : undefined}
          pose={playing ? undefined : def.pose}
          size="large"
          replayKey={replay}
          motion={reduce ? 'reduce' : 'auto'}
        />
      </div>
      <div className={styles.cardText}>
        <h4>{def.label}</h4>
        <p>{def.description}</p>
        <p className={styles.meta}>
          {def.loop ? 'Loops' : 'One-shot reaction'} · {(def.cycleMs / 1000).toFixed(1)} s ·{' '}
          <code>{name}</code>
        </p>
      </div>
      <div className={styles.cardActions}>
        <Button
          variant="secondary"
          onClick={() => {
            setPlaying(true);
            setReplay((value) => value + 1);
          }}
        >
          <RotateCcw aria-hidden="true" /> Replay <VisuallyHidden>{def.label}</VisuallyHidden>
        </Button>
        <Button
          variant="secondary"
          aria-pressed={!playing}
          onClick={() => {
            setPlaying((value) => !value);
          }}
        >
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {playing ? 'Pause' : 'Play'} <VisuallyHidden>{def.label}</VisuallyHidden>
        </Button>
      </div>
    </li>
  );
}

/** Steps through a list on a timer, unless reduced motion is on. */
function useCycle(length: number, everyMs: number, paused: boolean): number {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((value) => (value + 1) % length);
    }, everyMs);
    return () => {
      clearInterval(timer);
    };
  }, [length, everyMs, paused]);
  return index;
}

/** Turns all the way round, and glides from face to face, to show both transitions. */
function MotionDemos({ reduce }: { reduce: boolean }) {
  const view = mascotViews[useCycle(mascotViews.length, 700, reduce)] ?? 'front';
  const face = expressionNames[useCycle(expressionNames.length, 1100, reduce)] ?? 'neutral';
  return (
    <section className={styles.section} aria-labelledby="transitions-heading">
      <h2 id="transitions-heading">Transitions</h2>
      <p className={styles.lead}>
        Changing direction plays a quick turn, and changing expression moves the eyelids and brows
        instead of swapping drawings.
      </p>
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.stage}>
            <Mascot pose="standing" view={view} size="large" motion={reduce ? 'reduce' : 'auto'} />
          </div>
          <p className={styles.meta}>Turnaround: {VIEW_LABELS[view]}</p>
        </div>
        <div className={styles.card}>
          <div className={styles.stage}>
            <Mascot
              pose="standing"
              view="front"
              expression={face}
              size="large"
              motion={reduce ? 'reduce' : 'auto'}
            />
          </div>
          <p className={styles.meta}>Expression: {expressions[face].label}</p>
        </div>
      </div>
    </section>
  );
}

function ControllerDemo({ reduce }: { reduce: boolean }) {
  const mascot = useMascotController('idle');
  return (
    <section className={styles.section} aria-labelledby="controller-heading">
      <h2 id="controller-heading">Animation controller</h2>
      <p className={styles.lead}>
        The site uses one controller per mascot: a resting animation, and short reactions on top for
        real events. Each reaction plays once and eases back to rest.
      </p>
      <div className={styles.controller}>
        <div className={cx(styles.stage, styles.bigStage)}>
          <Mascot {...mascot.bind} size="hero" motion={reduce ? 'reduce' : 'auto'} />
        </div>
        <div className={styles.controls}>
          <p className={styles.now} aria-live="polite">
            Now playing: <strong>{mascotAnimations[mascot.current].label}</strong>
          </p>
          <div className={styles.buttonGroup} role="group" aria-label="Website events">
            {EVENTS.map((event) => (
              <Button
                key={event.label}
                variant="secondary"
                onClick={() => {
                  mascot.play(event.reaction);
                }}
              >
                {event.label}
              </Button>
            ))}
          </div>
          <div className={styles.buttonGroup} role="group" aria-label="Resting state">
            {(['idle', 'reading', 'thinking', 'sleep', 'walk'] as const).map((rest) => (
              <Button
                key={rest}
                variant="secondary"
                onClick={() => {
                  mascot.setRest(rest);
                }}
              >
                Rest: {mascotAnimations[rest].label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The mascot workshop: every view, expression, pose and animation on one page, for reviewing
 * the character and testing changes. Not linked from the student or teacher areas.
 */
export function MascotPreviewPage() {
  useDocumentTitle('Mascot preview');
  const [reduce, setReduce] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>MathsExpress mascot</p>
          <h1>The capybara</h1>
          <p className={styles.lead}>
            One character drawn once: every view, pose and animation reuses the same body parts,
            colours and proportions. It never has a mouth; eyes, brows and body language show how it
            feels.
          </p>
        </div>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={reduce}
            onChange={(event) => {
              setReduce(event.target.checked);
            }}
          />
          Preview reduced motion
        </label>
      </header>

      <section className={styles.section} aria-labelledby="views-heading">
        <h2 id="views-heading">Turnaround: eight views</h2>
        <ul className={styles.grid} role="list">
          {mascotViews.map((view) => (
            <li key={view} className={styles.tile}>
              <Mascot pose="standing" view={view} size={150} motion="reduce" />
              <span>{VIEW_LABELS[view]}</span>
            </li>
          ))}
        </ul>
      </section>

      <MotionDemos reduce={reduce} />

      <section className={styles.section} aria-labelledby="expressions-heading">
        <h2 id="expressions-heading">Expressions (no mouth)</h2>
        <ul className={styles.grid} role="list">
          {expressionNames.map((name) => (
            <li key={name} className={cx(styles.tile, styles.faceTile)}>
              <span className={styles.face}>
                <Mascot pose="standing" expression={name} size={220} motion="reduce" />
              </span>
              <span>{expressions[name].label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="poses-heading">
        <h2 id="poses-heading">Poses</h2>
        <ul className={styles.grid} role="list">
          {poseNames.map((name) => (
            <li key={name} className={styles.tile}>
              <Mascot pose={name} size={150} motion="reduce" />
              <span>{poses[name].label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="animations-heading">
        <h2 id="animations-heading">Animations</h2>
        {GROUPS.map((group) => (
          <div key={group.id} className={styles.group}>
            <h3>{group.title}</h3>
            <ul className={styles.cards} role="list">
              {animationNames
                .filter((name) => mascotAnimations[name].group === group.id)
                .map((name) => (
                  <AnimationCard key={name} name={name} reduce={reduce} />
                ))}
            </ul>
          </div>
        ))}
      </section>

      <ControllerDemo reduce={reduce} />
    </div>
  );
}
