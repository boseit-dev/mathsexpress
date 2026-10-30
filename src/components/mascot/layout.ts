import type { BaseView } from '@/assets/mascot/rig';
import type { MascotView } from './poses';

const MIRRORED: Partial<Record<MascotView, BaseView>> = {
  left: 'right',
  'front-left': 'front-right',
  'back-left': 'back-right',
};

/** Standard framing leaves room above the head for effects; wide framing adds a whiteboard. */
export const FRAMES = {
  standard: { x: -20, y: -26, width: 240, height: 246 },
  wide: { x: -20, y: -26, width: 330, height: 246 },
} as const;

/** The three left-facing views are mirror images of the right-facing ones. */
export function resolveView(view: MascotView): { base: BaseView; mirrored: boolean } {
  const mirroredBase = MIRRORED[view];
  if (mirroredBase) return { base: mirroredBase, mirrored: true };
  return { base: view as BaseView, mirrored: false };
}
