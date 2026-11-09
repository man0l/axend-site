// AI-generated example portraits in /public/faces. Not real people or real scans: always shown with the "AI example" tag.
export const FACES = ['f1', 'f2', 'f3', 'm1', 'm2', 'm3'] as const;
export type FaceId = (typeof FACES)[number];

/** Stable face for a page, so a guide keeps the same portrait between builds. */
export function faceFor(seed: string, offset = 0): FaceId {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return FACES[(h + offset) % FACES.length];
}
