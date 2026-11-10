// Accuracy study (SLA-1488): how much does the score move when nothing changes, and when one photo variable changes?
// All numbers come from src/data/experiments/accuracy-scans.json and accuracy-rescans.json (scripts/scan-faces.mjs, the same analyze() as the live scanner).
import scans from '../data/experiments/accuracy-scans.json';
import rescans from '../data/experiments/accuracy-rescans.json';
import log from '../data/experiments/generation-log.json';
import { METRICS, type MetricKey } from './experiments';

export const ACC_METRICS: MetricKey[] = ['overall', 'symmetry', 'proportions', 'jawline', 'jawAngle'];
type Scan = Record<MetricKey, number> & { file: string; yaw: number };
const byId = new Map<string, Scan>((scans.results as Scan[]).map((r) => [r.file.replace(/\.png$/, ''), r]));
const get = (id: string) => { const s = byId.get(id); if (!s) throw new Error(`No scan for ${id}`); return s; };
const round = (v: number, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

export const MODEL = (log as Record<string, { model: string }>).base.model;
export const TESTED_ON = scans.scannedAt.slice(0, 10);
export const SCANNER = { version: scans.scannerVersion, mediapipe: scans.mediapipe };

export interface Stat { mean: number; sd: number; min: number; max: number; range: number }
const stat = (v: number[]): Stat => {
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  const sd = Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / (v.length - 1));
  const min = Math.min(...v), max = Math.max(...v);
  return { mean, sd, min, max, range: max - min };
};

export const REPEAT_IDS = Array.from({ length: 20 }, (_, i) => `control-${i + 1}`);
export const REPEAT_N = REPEAT_IDS.length;
export const REPEATS = Object.fromEntries(ACC_METRICS.map((m) => [m, stat(REPEAT_IDS.map((id) => get(id)[m]))])) as Record<MetricKey, Stat>;
/** The same unchanged file scanned again and again: isolates the scanner from the image model. */
export const RESCAN_N = (rescans.results as Scan[]).length;
export const RESCANS = Object.fromEntries(ACC_METRICS.map((m) => [m, stat((rescans.results as Scan[]).map((r) => r[m]))])) as Record<MetricKey, Stat>;

export interface Setup { id: string; label: string; values: Record<MetricKey, number>; delta: Record<MetricKey, number>; z: Record<MetricKey, number>; outside: MetricKey[]; yaw: number }
export interface Group { key: 'angle' | 'light' | 'lens'; title: string; blurb: string; rows: Setup[] }
const SPEC: { key: Group['key']; title: string; blurb: string; rows: [string, string][] }[] = [
  { key: 'angle', title: 'Angle', blurb: 'Head turned or pitched, light and lens unchanged', rows: [['acc-yaw-15', 'Head turned 15°'], ['acc-yaw-30', 'Head turned 30°'], ['acc-pitch-down', 'Head tilted down 15°'], ['acc-pitch-up', 'Head tilted up 15°']] },
  { key: 'light', title: 'Light', blurb: 'Light source changed, head and lens unchanged', rows: [['acc-light-window', 'Window in front'], ['acc-light-overhead', 'Overhead room light'], ['acc-light-side', 'Window from the side'], ['acc-light-shade', 'Outdoor shade']] },
  { key: 'lens', title: 'Lens and distance', blurb: 'Camera distance and lens changed, head and light unchanged', rows: [['acc-lens-close', 'Phone at 25 cm'], ['acc-lens-arm', "Phone at arm's length"], ['acc-lens-far', '2 m, longer lens']] },
];
export const GROUPS: Group[] = SPEC.map((g) => ({
  key: g.key, title: g.title, blurb: g.blurb,
  rows: g.rows.map(([id, label]) => {
    const s = get(id);
    const values = Object.fromEntries(ACC_METRICS.map((m) => [m, round(s[m])])) as Record<MetricKey, number>;
    const delta = Object.fromEntries(ACC_METRICS.map((m) => [m, round(s[m] - REPEATS[m].mean)])) as Record<MetricKey, number>;
    const z = Object.fromEntries(ACC_METRICS.map((m) => [m, REPEATS[m].sd ? (s[m] - REPEATS[m].mean) / REPEATS[m].sd : 0])) as Record<MetricKey, number>;
    const outside = ACC_METRICS.filter((m) => s[m] < REPEATS[m].min - 1e-9 || s[m] > REPEATS[m].max + 1e-9);
    return { id, label, values, delta, z, outside, yaw: s.yaw };
  }),
}));
export const ALL_SETUPS = GROUPS.flatMap((g) => g.rows);

export function accuracyCsv(): string {
  const rows = [...(scans.results as Scan[]).map((r) => ['render', r.file, ...ACC_METRICS.map((c) => r[c])]), ...(rescans.results as Scan[]).map((r, i) => ['rescan', `base.png#${i + 1}`, ...ACC_METRICS.map((c) => r[c])])];
  return [['kind', 'image', ...ACC_METRICS].join(','), ...rows.map((r) => r.join(','))].join('\n') + '\n';
}
export { METRICS };
