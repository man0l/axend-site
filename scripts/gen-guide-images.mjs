// Generates the guide illustration set (SLA-1486) via OpenRouter /images.
// Usage: OPEN_ROUTER_API_KEY=... node scripts/gen-guide-images.mjs [id ...] [--force]
// Outputs raw PNGs to public/guides-img/ unchanged so the C2PA/IPTC AI-generated metadata stays intact.
import fs from 'node:fs';
import path from 'node:path';

const MODEL = 'openai/gpt-image-2.6-sunburst';
const OUT = 'public/guides-img';
const STYLE = 'Flat vector editorial illustration, soft warm cream background, thin clean outlines, muted palette, friendly instructional look. Not photorealistic. No watermark.';
const MAN = 'the same young adult man: short brown hair, clean-shaven, grey crew-neck t-shirt, neutral expression';

const CUTS = {
  'cut-textured-quiff': 'a textured quiff: longer, tousled top swept up and back, short tapered sides',
  'cut-pompadour': 'a modern pompadour: voluminous swept-back top, short faded sides',
  'cut-side-part': 'a classic side part with a clear parting line, short tapered sides',
  'cut-side-part-fade': 'a side part on top with a mid skin fade on the sides',
  'cut-textured-crop': 'a short textured crop: cropped top with a slightly choppy fringe, short sides',
  'cut-slick-back': 'a slick back: hair combed straight back, neat, short tapered sides',
  'cut-medium-flow': 'medium length hair with natural movement, reaching the ears, soft and loose',
  'cut-faux-hawk': 'a faux hawk: textured top lifted slightly at the centre, short faded sides',
  'cut-swept-back': 'a longer top swept back from the forehead, short sides',
};

const SAMPLE = 'scripts/sample-posture.png';
const EX = {
  'posture-chin-tuck': ['Side view of a young man standing doing a chin tuck: gently drawing his chin straight back, head level. A dotted white vertical alignment line from ear to shoulder, small white dots at ear and shoulder, and a short arrow showing the head moving straight back.', 'Chin tuck: ear lines up over the shoulder'],
  'posture-wall-angels': ['Front view of a young man standing with his back and head against a wall, arms raised in a "goal post" shape with elbows bent at 90 degrees and the backs of his hands touching the wall, arrows showing arms sliding up and down. Show two hands with five fingers each, correct anatomy.', 'Wall angel: back flat against the wall, arms sliding up and down'],
  'posture-row': ['Side view of a young man doing a bent-over dumbbell row: hinged forward at the hips, flat back, one hand on a bench, the other arm pulling a dumbbell up toward his ribs. A dotted white alignment line along the straight back from head to hips.', 'Dumbbell row: flat back, pull the elbow toward the hip'],
  'posture-band-pull-apart': ['Front view of a young man standing holding a resistance band at chest height with straight arms, pulling the band apart sideways, shoulder blades squeezing together; arrows pointing outward along the band. Correct hands with five fingers each.', 'Band pull-apart: arms straight, pull the band apart to chest width'],
  'posture-glute-bridge': ['Side view of a young man lying on his back on a mat with knees bent and feet flat, hips lifted so his body forms a straight diagonal line from shoulders to knees. A dotted white alignment line from shoulder to knee, and an upward arrow at the hips.', 'Glute bridge: lift the hips until shoulders, hips and knees line up'],
  'posture-hip-flexor-stretch': ['Side view of a young man in a kneeling lunge stretch: back knee on a folded mat, front knee bent at 90 degrees, torso upright, back hip pushed gently forward. A dotted white vertical alignment line from shoulder down to the back hip, and a small arrow at the hip.', 'Kneeling hip flexor stretch: tall torso, hip pushed gently forward'],
  'posture-thoracic-extension': ['Side view of a young man lying on his back with a foam roller under his upper back, knees bent, hands supporting the back of his head, upper back gently arching over the roller; a curved arrow showing the extension.', 'Thoracic extension over a foam roller'],
};

const SCENES = {
  'light-window': ['Top-down diagram illustration: a person (simple stylized head and shoulders seen from above) facing a large window; soft light rays coming through the window onto the face; a small phone held in front. Label the window "Window" and the lit side "Soft light". Minimal text, neat sans-serif labels.', 'Window light: face the window, soft light on both sides of the face'],
  'light-overhead': ['Side-view diagram illustration: a person standing under a ceiling lamp with harsh light rays straight down, dark shadows drawn under the eyes and nose and chin. Label the lamp "Overhead light" and the shadow area "Harsh shadows". Minimal text, neat sans-serif labels.', 'Overhead light: harsh shadows under the eyes and chin'],
  'light-ring-light': ['Diagram illustration: a person (head and shoulders) facing a phone mounted in a ring light on a small stand; even soft light drawn as gentle rays on the face. Label "Ring light" and "Even light". Minimal text, neat sans-serif labels.', 'Ring light: even light, but check for flat looks and eye reflections'],
  'light-golden-hour': ['Outdoor diagram illustration: a person (head and shoulders, side view) standing outside with a low warm setting sun behind and to one side, warm light rays at a low angle, long soft shadow. Label "Golden hour" and "Low warm sun". Minimal text, neat sans-serif labels.', 'Golden hour: low warm sun to the side of the face'],
  'distance-arms-vs-2m': ['Two-panel side-by-side diagram illustration. Left panel: a man holding a phone at arm length close to his face, with a wide-angle distortion hint of a larger nose, labelled "Arm\'s length". Right panel: the phone on a tripod about two metres away, labelled "2 m", with natural proportions. Neat sans-serif labels, minimal text.', 'Distance: a phone at arm\'s length versus two metres away'],
};

const STEPS = {
  'faceshape-measure': ['Infographic illustration of a front-view illustrated man\'s face with four straight measurement lines drawn on it: forehead width, cheekbone width, jaw width (horizontal lines) and face length (vertical line from hairline to chin). Number the lines 1, 2, 3, 4. Neat sans-serif labels "Forehead", "Cheekbones", "Jaw", "Length". Clean, minimal.', 'How to measure face shape: forehead, cheekbones, jaw and face length'],
  'faceshape-chart': ['Chart illustration with five simple outline icons of male face shapes in a row, each with a clear label below: "Oval", "Round", "Square", "Oblong", "Heart". Each icon is a plain outline face shape (no features), same size, evenly spaced, on a cream background. Neat sans-serif labels only.', 'Five face shapes: oval, round, square, oblong and heart'],
  'routine-am-pm': ['Two-column routine infographic. Left column titled "AM" with a sun icon and three numbered step icons: "1 Cleanse" (face wash), "2 Moisturise" (cream jar), "3 Sunscreen" (tube). Right column titled "PM" with a moon icon and two step icons: "1 Cleanse", "2 Moisturise". Neat sans-serif labels, minimal.', 'AM and PM skincare routine: cleanse, moisturise, sunscreen in the morning; cleanse and moisturise at night'],
};

const dataUrl = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const jobs = [];
jobs.push({ id: 'base-man', prompt: `${STYLE} Front-facing head-and-shoulders portrait of ${MAN}. Face centered, symmetrical, ears visible, plain background. No text.`, size: '1024x1024' });
for (const [id, d] of Object.entries(CUTS)) jobs.push({ id, ref: `${OUT}/base-man.png`, prompt: `Edit this illustration: keep ${MAN} exactly the same (same face, same shape, same style, same background, same t-shirt, same framing). Change ONLY his hairstyle to ${d}. No text.`, size: '1024x1024' });
for (const [id, [d]] of Object.entries(EX)) jobs.push({ id, ref: SAMPLE, prompt: `${STYLE} Match the art style, palette, background colour and dotted alignment-line style of the reference image. ${d} Same brunette young man in a grey t-shirt as the reference. Correct human anatomy, no extra limbs or fingers. No text.`, size: '1536x1024' });
for (const [id, [d]] of Object.entries(SCENES)) jobs.push({ id, prompt: `${STYLE} ${d}`, size: '1536x1024' });
for (const [id, [d]] of Object.entries(STEPS)) jobs.push({ id, prompt: `${STYLE} ${d}`, size: '1536x1024' });

export const ALT = { ...Object.fromEntries(Object.entries(EX).map(([k, v]) => [k, v[1]])), ...Object.fromEntries(Object.entries(SCENES).map(([k, v]) => [k, v[1]])), ...Object.fromEntries(Object.entries(STEPS).map(([k, v]) => [k, v[1]])) };

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));
fs.mkdirSync(OUT, { recursive: true });
let spend = 0;
for (const j of jobs) {
  if (only.length && !only.includes(j.id)) continue;
  const file = path.join(OUT, j.id + '.png');
  if (fs.existsSync(file) && !force) continue;
  if (j.ref && !fs.existsSync(j.ref)) { console.log('skip (missing ref)', j.id); continue; }
  const body = { model: MODEL, prompt: j.prompt, size: j.size };
  if (j.ref) body.input_references = [{ type: 'image_url', image_url: { url: dataUrl(j.ref) } }];
  const r = await fetch('https://openrouter.ai/api/v1/images', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json();
  if (!d.data) { console.log('FAIL', j.id, JSON.stringify(d).slice(0, 200)); continue; }
  fs.writeFileSync(file, Buffer.from(d.data[0].b64_json, 'base64'));
  spend += d.usage?.cost ?? 0;
  console.log('ok', j.id, d.usage?.cost);
}
console.log('spend this run', spend.toFixed(3));
