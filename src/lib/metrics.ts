// Pure geometry on MediaPipe Face Landmarker output (478 normalized landmarks).
// v1 heuristics: constants below are uncalibrated against a population sample. See /how-we-score.
export interface Pt { x: number; y: number }
export type Band = 'strong' | 'balanced' | 'room';

export interface Trait { key: 'symmetry' | 'proportions' | 'jawline'; label: string; score: number; band: Band; note: string }
export interface Analysis { overall: number; traits: Trait[]; symmetry: { mid: Pt; u: Pt; pairs: [Pt, Pt][] }; pose: { yaw: number; tooTurned: boolean } }

export const PAIRS: [number, number][] = [[33, 263], [133, 362], [61, 291], [234, 454], [70, 300], [105, 334], [129, 358], [172, 397], [136, 365], [150, 379]];
export const WEIGHTS = { symmetry: 0.4, proportions: 0.3, jawline: 0.3 };
export const SYMMETRY_ERR_TO_SCORE = 100; // normalized mean pair error 0.03 -> 7.0
export const YAW_LIMIT = 0.18;

const clamp = (v: number, lo = 0, hi = 10) => Math.min(hi, Math.max(lo, v));
const d = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
const round1 = (v: number) => Math.round(v * 10) / 10;

export function band(score: number): Band {
  return score >= 7.5 ? 'strong' : score >= 5.5 ? 'balanced' : 'room';
}

function angleAt(v: Pt, a: Pt, b: Pt): number {
  const ax = a.x - v.x, ay = a.y - v.y, bx = b.x - v.x, by = b.y - v.y;
  const cos = (ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by));
  return (Math.acos(clamp(cos, -1, 1)) * 180) / Math.PI;
}

export function reflect(p: Pt, m: Pt, u: Pt): Pt {
  const t = (p.x - m.x) * u.x + (p.y - m.y) * u.y;
  return { x: 2 * (m.x + u.x * t) - p.x, y: 2 * (m.y + u.y * t) - p.y };
}

const NOTES: Record<Trait['key'], Record<Band, string>> = {
  symmetry: {
    strong: 'Left and right sides line up closely in this photo.',
    balanced: 'Typical left-right differences. Head angle and hair parting change this the most.',
    room: 'Noticeable left-right difference. Check the photo is straight-on before reading much into it.',
  },
  proportions: {
    strong: 'Middle and lower face are close to even thirds.',
    balanced: 'Middle and lower face are slightly uneven, which is common.',
    room: 'Middle and lower face differ noticeably. Hair and facial hair can rebalance how this reads.',
  },
  jawline: {
    strong: 'Defined jaw angle and good width relative to the cheekbones.',
    balanced: 'Moderate jaw definition. Body fat, posture and grooming all change how it shows.',
    room: 'Softer jaw definition in this photo. Lighting, posture and body fat have the biggest effect.',
  },
};

/** Mean gonial-style jaw angle in degrees (landmarks 172/132/152 left, 397/361/152 right). Exported so experiments report the same number the score uses. */
export function jawAngle(p: Pt[]): number {
  return (angleAt(p[172], p[132], p[152]) + angleAt(p[397], p[361], p[152])) / 2;
}

/** lm: normalized landmarks; w/h: image pixel size (needed so x and y distances are comparable). */
export function analyze(lm: Pt[], w: number, h: number): Analysis {
  if (lm.length < 455) throw new Error('not enough landmarks');
  const p = lm.map((q) => ({ x: q.x * w, y: q.y * h }));
  const width = d(p[234], p[454]);

  // Midline: direction from forehead to chin, passing through the mean of the pair midpoints.
  const top = p[10], bottom = p[152];
  const len = d(top, bottom);
  const u = { x: (bottom.x - top.x) / len, y: (bottom.y - top.y) / len };
  const mid = PAIRS.reduce((a, [l, r]) => ({ x: a.x + (p[l].x + p[r].x) / 2, y: a.y + (p[l].y + p[r].y) / 2 }), { x: 0, y: 0 });
  mid.x /= PAIRS.length; mid.y /= PAIRS.length;

  const mirrored = PAIRS.map(([l, r]) => [reflect(p[l], mid, u), p[r]] as [Pt, Pt]);
  const err = mirrored.reduce((s, [a, b]) => s + d(a, b), 0) / mirrored.length / width;
  const symmetry = clamp(10 - err * SYMMETRY_ERR_TO_SCORE);

  const middle = d(p[9], p[2]), lower = d(p[2], p[152]);
  const proportions = clamp(10 - Math.abs(middle / lower - 1) * 14);

  const angle = jawAngle(p);
  const angleScore = clamp(10 - (angle - 100) * 0.18);
  const widthScore = clamp(((d(p[172], p[397]) / width - 0.65) / 0.3) * 10);
  const jawline = 0.6 * angleScore + 0.4 * widthScore;

  const yaw = Math.abs(d(p[1], p[234]) - d(p[1], p[454])) / width;
  const mk = (key: Trait['key'], label: string, score: number): Trait => {
    const s = round1(score);
    return { key, label, score: s, band: band(s), note: NOTES[key][band(s)] };
  };
  const traits = [mk('symmetry', 'Symmetry', symmetry), mk('proportions', 'Proportions', proportions), mk('jawline', 'Jawline definition', jawline)];
  const overall = round1(symmetry * WEIGHTS.symmetry + proportions * WEIGHTS.proportions + jawline * WEIGHTS.jawline);
  return { overall, traits, symmetry: { mid, u, pairs: mirrored }, pose: { yaw, tooTurned: yaw > YAW_LIMIT } };
}
