// Exports the mascot artwork as transparent SVG and PNG files into src/assets/mascot.
// Usage: npm run mascot:export
//
// The SVGs come straight from the React components (via Vite, so the source of truth stays the
// rig and pose files). PNGs are rendered by headless Chrome with a transparent background; set
// CHROME_PATH if Chrome is installed somewhere unusual, or pass --svg-only to skip them.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createServer } from 'vite';

interface ExportFile {
  file: string;
  svg: string;
  width: number;
  height: number;
}

const root = resolve(import.meta.dirname, '..');
const outDir = join(root, 'src/assets/mascot');
const svgOnly = process.argv.includes('--svg-only');
/** `--only=poses` limits the PNGs to one folder, for quick checks while drawing. */
const only = process.argv.find((arg) => arg.startsWith('--only='))?.slice('--only='.length);

/** PNG heights per folder: one everyday size, and a large one for the turnaround. */
const PNG_HEIGHTS: Record<string, readonly number[]> = {
  views: [512, 1024],
  poses: [512],
  expressions: [256],
};

const server = await createServer({
  root,
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
});

let files: ExportFile[];
try {
  const module = (await server.ssrLoadModule('/src/components/mascot/exportArt.tsx')) as {
    renderMascotExports: () => ExportFile[];
  };
  files = module.renderMascotExports();
} finally {
  await server.close();
}

rmSync(join(outDir, 'svg'), { recursive: true, force: true });
for (const { file, svg } of files) {
  const target = join(outDir, 'svg', file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, svg);
}
console.log(`Wrote ${files.length} SVG files to src/assets/mascot/svg.`);

if (!svgOnly) {
  const chrome =
    process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!existsSync(chrome)) {
    console.error('Chrome was not found, so no PNGs were made. Set CHROME_PATH or use --svg-only.');
    process.exit(1);
  }
  rmSync(join(outDir, 'png', only ?? ''), { recursive: true, force: true });
  const work = mkdtempSync(join(tmpdir(), 'mascot-png-'));
  let count = 0;
  try {
    for (const { file, svg, width, height } of files) {
      const folder = file.split('/')[0] ?? '';
      if (only && folder !== only) continue;
      for (const targetHeight of PNG_HEIGHTS[folder] ?? []) {
        const targetWidth = Math.round((width / height) * targetHeight);
        const page = join(work, 'page.html');
        const sized = svg.replace(
          /width="[\d.]+" height="[\d.]+"/,
          `width="${targetWidth}" height="${targetHeight}"`,
        );
        writeFileSync(
          page,
          `<!doctype html><html><body style="margin:0;background:transparent">${sized}</body></html>`,
        );
        const name = file.replace(/\.svg$/, `@${targetHeight}.png`);
        const target = join(outDir, 'png', name);
        mkdirSync(dirname(target), { recursive: true });
        execFileSync(
          chrome,
          [
            '--headless=new',
            '--disable-gpu',
            '--hide-scrollbars',
            '--default-background-color=00000000',
            `--window-size=${targetWidth},${targetHeight}`,
            `--screenshot=${target}`,
            `file://${page}`,
          ],
          { stdio: 'ignore' },
        );
        count += 1;
      }
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
  console.log(`Wrote ${count} PNG files to src/assets/mascot/png.`);
}
