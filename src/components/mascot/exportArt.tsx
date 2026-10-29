import { renderToStaticMarkup } from 'react-dom/server';
import { expressionNames, type ExpressionName } from './expressions';
import { FRAMES } from './layout';
import { MascotFigure } from './MascotFigure';
import { mascotViews, poseNames, poses, type MascotView, type PoseDef } from './poses';

/**
 * Renders the still artwork to standalone SVG files for `npm run mascot:export`. Not used by the
 * site. The output keeps named groups (data-part) so designers can edit it in Figma or
 * Illustrator, and turns the CSS pose transforms into plain SVG transforms.
 */

export interface ExportFile {
  /** Relative to src/assets/mascot/svg. */
  file: string;
  svg: string;
  /** Height in pixels at 1×; PNGs are made at larger sizes from this. */
  height: number;
  width: number;
}

const HEAD_CROP = { x: 34, y: -4, width: 140, height: 128 };

/** CSS transform functions → SVG transform attribute syntax. */
function cssToSvgTransform(css: string): string {
  return css
    .replace(/rotate\((-?[\d.]+)deg\)/g, 'rotate($1)')
    .replace(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/g, 'translate($1 $2)')
    .replace(/translateY\((-?[\d.]+)px\)/g, 'translate(0 $1)')
    .replace(/translateX\((-?[\d.]+)px\)/g, 'translate($1 0)')
    .replace(/scale\((-?[\d.]+),\s*(-?[\d.]+)\)/g, 'scale($1 $2)')
    .replace(/\s+/g, ' ')
    .trim();
}

function clean(markup: string, viewBox: string, width: number, height: number): string {
  let svg = markup
    .replace(/ class="[^"]*"/g, '')
    .replace(/ (aria-hidden|focusable|role|aria-label|data-view)="[^"]*"/g, '')
    .replace(/ data-p="/g, ' data-part="')
    .replace(/ style="([^"]*)"/g, (_match, style: string) => {
      const transform = /transform:([^;]+)/.exec(style)?.[1];
      if (!transform || transform.trim() === 'rotate(0deg)') return '';
      return ` transform="${cssToSvgTransform(transform)}"`;
    });
  svg = svg.replace(
    /^<svg[^>]*>/,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}">`,
  );
  return `${svg}\n`;
}

function render(pose: PoseDef, view?: MascotView, crop?: typeof HEAD_CROP): ExportFile['svg'] {
  const frame = crop ?? FRAMES[pose.frame ?? 'standard'];
  const viewBox = `${frame.x} ${frame.y} ${frame.width} ${frame.height}`;
  return clean(
    renderToStaticMarkup(<MascotFigure pose={pose} view={view} />),
    viewBox,
    frame.width * 2,
    frame.height * 2,
  );
}

export function renderMascotExports(): ExportFile[] {
  const files: ExportFile[] = [];
  const size = (frame: { width: number; height: number }) => ({
    width: frame.width * 2,
    height: frame.height * 2,
  });

  for (const view of mascotViews) {
    files.push({
      file: `views/${view}.svg`,
      svg: render(poses.standing, view),
      ...size(FRAMES.standard),
    });
  }
  for (const name of poseNames) {
    const pose: PoseDef = poses[name];
    files.push({
      file: `poses/${name}.svg`,
      svg: render(pose),
      ...size(FRAMES[pose.frame ?? 'standard']),
    });
  }
  for (const name of expressionNames) {
    const pose: PoseDef = { ...poses.standing, expression: name satisfies ExpressionName };
    files.push({
      file: `expressions/${name}.svg`,
      svg: render(pose, undefined, HEAD_CROP),
      ...size(HEAD_CROP),
    });
  }
  return files;
}
