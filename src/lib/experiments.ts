// Synthetic-face experiments (SLA-1487). Every number on the experiment boxes comes from src/data/experiments/scans.json,
// produced by scripts/scan-faces.mjs (the same analyze() as the live scanner). Nothing here is typed by hand except labels.
import scans from '../data/experiments/scans.json';
import log from '../data/experiments/generation-log.json';

export type ExperimentId = 'jawline' | 'photos' | 'symmetry' | 'pipeline';
export type MetricKey = 'overall' | 'symmetry' | 'proportions' | 'jawline' | 'jawAngle';
export const METRICS: Record<MetricKey, { label: string; unit: string; digits: number }> = {
  overall: { label: 'Overall score', unit: '/10', digits: 1 },
  symmetry: { label: 'Symmetry', unit: '/10', digits: 1 },
  proportions: { label: 'Proportions', unit: '/10', digits: 1 },
  jawline: { label: 'Jawline score', unit: '/10', digits: 1 },
  jawAngle: { label: 'Jaw angle', unit: '°', digits: 1 },
};

type Scan = Record<MetricKey, number> & { file: string };
const byId = new Map<string, Scan>((scans.results as Scan[]).map((r) => [r.file.replace(/\.png$/, ''), r]));
const get = (id: string) => { const s = byId.get(id); if (!s) throw new Error(`No scan for ${id}`); return s; };

export const BASE = Object.fromEntries((Object.keys(METRICS) as MetricKey[]).map((m) => [m, Math.round(get('base')[m] * 10) / 10])) as Record<MetricKey, number>;
export const MODEL = (log as Record<string, { model: string }>).base.model;
export const FACE_CAPTION = 'Synthetic test face (AI-generated)';
export const TESTED_ON = scans.scannedAt.slice(0, 10);
export const SCANNER = { version: scans.scannerVersion, mediapipe: scans.mediapipe };

const CONTROLS = [1, 2, 3, 4, 5].map((i) => `control-${i}`);
/** Drift = the largest gap between the unchanged face and any of its 5 no-change re-renders, per metric. A change only counts if it is bigger than this. */
export const DRIFT = Object.fromEntries((Object.keys(METRICS) as MetricKey[]).map((m) => {
  const base = get('base')[m];
  return [m, Math.max(...CONTROLS.map((c) => Math.abs(get(c)[m] - base)))];
})) as Record<MetricKey, number>;
export const CONTROL_RANGE = Object.fromEntries((Object.keys(METRICS) as MetricKey[]).map((m) => {
  const v = CONTROLS.map((c) => get(c)[m]);
  return [m, Math.max(...v) - Math.min(...v)];
})) as Record<MetricKey, number>;

const round = (v: number, d = 1) => Math.round(v * 10 ** d) / 10 ** d;
export interface Row { id: string; label: string; caption: string; thumb: string; full: string; values: Record<MetricKey, number>; delta: Record<MetricKey, number>; counts: MetricKey[]; effect: string }
export interface Spec { title: string; metrics: MetricKey[]; /** metrics that decide the "effect" verdict */ judged: MetricKey[]; rows: [id: string, label: string, caption: string][] }

export const SPECS: Record<Exclude<ExperimentId, 'pipeline'>, Spec> = {
  jawline: {
    title: 'Jawline: head position and stubble',
    metrics: ['jawAngle', 'jawline', 'overall'], judged: ['jawAngle', 'overall'],
    rows: [
      ['base', 'Neutral head, clean-shaven (reference)', 'Reference render: head level, clean-shaven'],
      ['jaw-chin-down', 'Chin down', 'Chin tucked slightly toward the chest'],
      ['jaw-chin-forward', 'Chin forward', 'Chin pushed slightly forward and up'],
      ['jaw-stubble', 'Stubble (about 3 days)', 'Short even stubble added, head level'],
    ],
  },
  photos: {
    title: 'Photos: 4 lighting setups at 2 distances',
    metrics: ['overall', 'jawAngle', 'proportions'], judged: ['overall', 'jawAngle', 'proportions'],
    rows: [
      ['photo-window-arm', "Window light, arm's length", "Soft window light, phone at arm's length"], ['photo-window-far', 'Window light, 2 m', 'Soft window light, 2 m away'],
      ['photo-overhead-arm', "Overhead light, arm's length", "Harsh overhead light, phone at arm's length"], ['photo-overhead-far', 'Overhead light, 2 m', 'Harsh overhead light, 2 m away'],
      ['photo-ring-arm', "Ring light, arm's length", "Ring light, phone at arm's length"], ['photo-ring-far', 'Ring light, 2 m', 'Ring light, 2 m away'],
      ['photo-golden-arm', "Golden-hour side light, arm's length", "Low warm side light, phone at arm's length"], ['photo-golden-far', 'Golden-hour side light, 2 m', 'Low warm side light, 2 m away'],
    ],
  },
  symmetry: {
    title: 'Symmetry: mirrored composites and head tilt',
    metrics: ['symmetry', 'overall'], judged: ['symmetry', 'overall'],
    rows: [
      ['base', 'Original face (reference)', 'Original render, no change'],
      ['sym-left-left', 'Left-left composite', 'Image-left half of the face mirrored onto the right'],
      ['sym-right-right', 'Right-right composite', 'Image-right half of the face mirrored onto the left'],
      ['tilt-5', 'Head tilt 5°', 'Whole image rotated 5° clockwise'],
      ['tilt-10', 'Head tilt 10°', 'Whole image rotated 10° clockwise'],
    ],
  },
};

export function experimentRows(id: keyof typeof SPECS): Row[] {
  const spec = SPECS[id];
  const base = get('base');
  return spec.rows.map(([rid, label, caption]) => {
    const s = get(rid);
    const values = Object.fromEntries((Object.keys(METRICS) as MetricKey[]).map((m) => [m, round(s[m])])) as Record<MetricKey, number>;
    const delta = Object.fromEntries((Object.keys(METRICS) as MetricKey[]).map((m) => [m, round(s[m] - base[m])])) as Record<MetricKey, number>;
    const counts = rid === 'base' ? [] : spec.judged.filter((m) => Math.abs(s[m] - base[m]) > DRIFT[m] + 1e-9);
    const effect = rid === 'base' ? 'Reference' : counts.length ? `Beyond drift: ${counts.map((m) => METRICS[m].label.toLowerCase()).join(', ')}` : 'No measurable effect';
    return { id: rid, label, caption, thumb: `/guides-exp/thumb/${rid}.webp`, full: `/guides-exp/${rid}.png`, values, delta, counts, effect };
  });
}

export function baseTraits() {
  const b = get('base');
  return (['symmetry', 'proportions', 'jawline', 'overall'] as MetricKey[]).map((m) => ({ key: m, label: METRICS[m].label, value: round(b[m]) }));
}

/** Plain CSV of every scan, for the download link under each methodology box. */
export function scansCsv(): string {
  const cols: MetricKey[] = ['overall', 'symmetry', 'proportions', 'jawline', 'jawAngle'];
  const rows = (scans.results as Scan[]).map((r) => [r.file, ...cols.map((c) => r[c])].join(','));
  return [['image', ...cols].join(','), ...rows].join('\n') + '\n';
}
