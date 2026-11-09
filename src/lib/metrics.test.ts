import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze, band, reflect, PAIRS } from './metrics.ts';

// Build a perfectly mirror-symmetric synthetic face on a 1000x1000 canvas.
function face(skew = 0) {
  const lm = Array.from({ length: 478 }, () => ({ x: 0.5, y: 0.5 }));
  lm[10] = { x: 0.5, y: 0.1 }; lm[152] = { x: 0.5, y: 0.9 }; lm[9] = { x: 0.5, y: 0.3 }; lm[2] = { x: 0.5, y: 0.6 }; lm[1] = { x: 0.5, y: 0.55 };
  PAIRS.forEach(([l, r], i) => {
    const dx = 0.1 + 0.03 * i, y = 0.3 + 0.05 * i;
    lm[l] = { x: 0.5 - dx, y }; lm[r] = { x: 0.5 + dx, y: y + skew };
  });
  lm[132] = { x: 0.3, y: 0.7 }; lm[361] = { x: 0.7, y: 0.7 };
  return lm;
}

test('reflect is an involution about the midline', () => {
  const p = { x: 3, y: 4 }, m = { x: 5, y: 0 }, u = { x: 0, y: 1 };
  assert.deepEqual(reflect(reflect(p, m, u), m, u), p);
});
test('perfectly symmetric face scores 10 on symmetry', () => {
  assert.equal(analyze(face(), 1000, 1000).traits[0].score, 10);
});
test('asymmetry lowers symmetry score monotonically', () => {
  const a = analyze(face(0.01), 1000, 1000).traits[0].score, b = analyze(face(0.04), 1000, 1000).traits[0].score;
  assert.ok(a > b);
});
test('scores stay within 0..10 and overall is finite', () => {
  const r = analyze(face(0.2), 1000, 1000);
  for (const t of r.traits) assert.ok(t.score >= 0 && t.score <= 10);
  assert.ok(Number.isFinite(r.overall));
});
test('bands', () => { assert.equal(band(8), 'strong'); assert.equal(band(6), 'balanced'); assert.equal(band(3), 'room'); });
test('rejects too few landmarks', () => { assert.throws(() => analyze([], 1, 1)); });
