// Generates the synthetic test face and its single-variable edits (SLA-1487) via OpenRouter /images.
// Usage: OPEN_ROUTER_API_KEY=... node scripts/gen-experiments.mjs [id ...] [--force]
// Raw PNGs go to public/guides-exp/ unchanged (C2PA/IPTC AI metadata intact). Every call is logged to src/data/experiments/generation-log.json.
import fs from 'node:fs';
import path from 'node:path';

export const MODEL = 'openai/gpt-image-2.6-sunburst';
const OUT = 'public/guides-exp';
const LOG = 'src/data/experiments/generation-log.json';
const KEEP = 'Keep everything else identical: same person, same face, same hair, same clothing, same expression, same framing and background.';
const BASE_PROMPT = 'Photorealistic head-and-shoulders portrait of a fictional adult man, about 30, shot straight on, looking directly into the camera, neutral relaxed expression with mouth closed, short dark brown hair, clean-shaven, grey crew-neck t-shirt, plain light-grey background, soft even neutral studio light, head level and centred. An AI-generated synthetic person, not a real individual.';

const EDITS = {};
for (let i = 1; i <= 5; i++) EDITS[`control-${i}`] = `Re-render this exact image with no change at all. ${KEEP}`;
EDITS['jaw-chin-down'] = `Change only the head pitch: the chin is tucked down slightly toward the chest, still looking at the camera. ${KEEP}`;
EDITS['jaw-chin-forward'] = `Change only the head pitch: the chin is pushed slightly forward and up, still looking at the camera. ${KEEP}`;
EDITS['jaw-stubble'] = `Change only the facial hair: add short, even, dark stubble (about 3 days of growth) on the cheeks, jaw and chin. ${KEEP}`;
const LIGHTS = {
  window: 'soft daylight from a large window in front of the subject, even and gentle',
  overhead: 'a single harsh ceiling light directly above, with shadows under the brows, nose and chin',
  ring: 'a ring light directly in front of the camera, flat even light with a ring-shaped catchlight in the eyes',
  golden: 'low warm golden-hour sunlight from the side, warm tone, soft long shadows',
};
const DIST = {
  arm: "photographed at arm's length (about 50 cm) with a phone front camera: the face fills most of the frame and shows slight wide-angle perspective",
  far: 'photographed from about 2 metres away with a longer lens and then cropped: the face is smaller in the frame, with flat natural perspective and no wide-angle distortion',
};
for (const [l, ld] of Object.entries(LIGHTS)) for (const [d, dd] of Object.entries(DIST)) EDITS[`photo-${l}-${d}`] = `Change only the lighting and camera distance: lit by ${ld}; ${dd}. ${KEEP.replace(' same framing and background', ' same plain background')}`;

const dataUrl = (f) => `data:image/png;base64,${fs.readFileSync(f).toString('base64')}`;
const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));
fs.mkdirSync(OUT, { recursive: true });
const log = fs.existsSync(LOG) ? JSON.parse(fs.readFileSync(LOG)) : {};
const jobs = [['base', BASE_PROMPT, null], ...Object.entries(EDITS).map(([id, p]) => [id, p, `${OUT}/base.png`])];
for (const [id, prompt, ref] of jobs) {
  if (only.length && !only.includes(id)) continue;
  const file = path.join(OUT, `${id}.png`);
  if (fs.existsSync(file) && !force) continue;
  const body = { model: MODEL, prompt, size: '1024x1024' };
  if (ref) body.input_references = [{ type: 'image_url', image_url: { url: dataUrl(ref) } }];
  const r = await fetch('https://openrouter.ai/api/v1/images', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json();
  if (!d.data) { console.log('FAIL', id, JSON.stringify(d).slice(0, 200)); continue; }
  fs.writeFileSync(file, Buffer.from(d.data[0].b64_json, 'base64'));
  log[id] = { model: MODEL, mode: ref ? 'edit' : 'generate', reference: ref ? 'base' : null, prompt, generatedAt: new Date().toISOString(), costUsd: d.usage?.cost ?? null };
  fs.writeFileSync(LOG, JSON.stringify(log, null, 1));
  console.log('ok', id, d.usage?.cost);
}
