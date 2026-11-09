// Example results shown behind the scanner and in "What you get". Illustrative only, not a real person's scan.
import type { Focus } from './tools';
export type SampleBand = 'strong' | 'balanced' | 'room';
export interface Sample {
  score: number; ringLabel: string; caption: string;
  traits: { name: string; score: number; band: SampleBand; note: string }[];
  locked: string[]; mesh: 'overall' | 'symmetry' | 'face' | 'men';
  callouts: { k: string; v: string }[];
}
const base = [
  { name: 'Symmetry', score: 7.1, band: 'balanced' as const, note: 'Typical left-right differences. Head angle changes this the most.' },
  { name: 'Proportions', score: 6.4, band: 'balanced' as const, note: 'Middle and lower face are slightly uneven, which is common.' },
  { name: 'Jawline', score: 8.0, band: 'strong' as const, note: 'Defined jaw angle and good width relative to the cheekbones.' },
];
export const SAMPLES: Record<Focus, Sample> = {
  overall: { score: 7.2, ringLabel: 'Baseline', caption: 'Baseline score, out of 10', traits: base, locked: ['Skin', 'Hair', 'Posture', 'Smile'], mesh: 'overall', callouts: [{ k: 'Score and band', v: 'One number, plainly banded.' }, { k: 'Symmetry', v: 'Left-right landmark gap.' }, { k: 'Facial thirds', v: 'Middle and lower face balance.' }, { k: 'Jaw angle', v: 'Angle and width vs cheekbones.' }] },
  symmetry: { score: 7.1, ringLabel: 'Symmetry', caption: 'Symmetry score, out of 10', traits: [base[0], base[1], base[2]], locked: ['Eye line', 'Brow height', 'Mouth tilt', 'Posture'], mesh: 'symmetry', callouts: [{ k: 'Midline', v: 'Forehead to chin axis.' }, { k: 'Mirrored pairs', v: 'Blue is mirrored, cream is real.' }, { k: 'Pair error', v: 'Gap relative to face width.' }, { k: 'Head tilt', v: 'We warn when it skews the result.' }] },
  face: { score: 7.3, ringLabel: 'Face', caption: 'Face geometry score, out of 10', traits: base, locked: ['Cheekbones', 'Eyes', 'Jaw angle', 'Chin'], mesh: 'face', callouts: [{ k: 'Face only', v: 'Skin and hair are not scored here.' }, { k: 'Symmetry', v: 'Left-right landmark gap.' }, { k: 'Proportions', v: 'Thirds of the face.' }, { k: 'Jawline', v: 'Angle and width.' }] },
  men: { score: 7.0, ringLabel: 'Baseline', caption: 'Baseline score, out of 10', traits: [base[2], base[0], base[1]], locked: ['Top X% of men', 'Skin', 'Hair', 'Posture'], mesh: 'men', callouts: [{ k: 'Jawline first', v: 'The lever men work on most.' }, { k: 'Symmetry', v: 'Left-right landmark gap.' }, { k: 'Facial thirds', v: 'Middle and lower face balance.' }, { k: 'In the app', v: 'Your rank among men, with your plan.' }] },
  rating: { score: 7.2, ringLabel: 'Rating', caption: 'Face rating, out of 10', traits: base, locked: ['Skin', 'Hair', 'Jaw angle', 'Posture'], mesh: 'overall', callouts: [{ k: 'Rating', v: 'Out of 10, in plain bands.' }, { k: 'Traits behind it', v: 'Three, shown individually.' }, { k: 'Bands', v: 'Not percentiles. See How we score.' }, { k: 'Next step', v: 'What to improve, in the app.' }] },
};
