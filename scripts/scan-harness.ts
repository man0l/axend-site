// Browser-side entry bundled by scripts/scan-faces.mjs. Same detector options and same analyze() as src/components/Scanner.astro.
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { analyze, jawAngle } from '../src/lib/metrics';

let lmk: any;
async function init() {
  const fileset = await FilesetResolver.forVisionTasks('/mediapipe');
  lmk = await FaceLandmarker.createFromOptions(fileset, { baseOptions: { modelAssetPath: '/models/face_landmarker.task', delegate: 'CPU' }, runningMode: 'IMAGE', numFaces: 2 });
}

// Mirrors Scanner.astro load(): downscale so the longest side is at most 1280px, then detect on the canvas.
async function scan(dataUrl: string) {
  if (!lmk) await init();
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const scale = Math.min(1, 1280 / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas');
  c.width = Math.round(img.naturalWidth * scale); c.height = Math.round(img.naturalHeight * scale);
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
  const out = lmk.detect(c);
  if (out.faceLandmarks?.length !== 1) return { faces: out.faceLandmarks?.length ?? 0 };
  const lm = out.faceLandmarks[0];
  const a = analyze(lm, c.width, c.height);
  const px = lm.map((q: any) => ({ x: q.x * c.width, y: q.y * c.height }));
  const t = Object.fromEntries(a.traits.map((x) => [x.key, x.score]));
  return { faces: 1, width: c.width, height: c.height, overall: a.overall, symmetry: t.symmetry, proportions: t.proportions, jawline: t.jawline, jawAngle: Math.round(jawAngle(px) * 10) / 10, yaw: Math.round(a.pose.yaw * 1000) / 1000, sym: { mid: a.symmetry.mid, u: a.symmetry.u, pairs: a.symmetry.pairs }, landmarks: lm.map((q: any) => [q.x, q.y]) };
}
(window as any).scan = scan;
