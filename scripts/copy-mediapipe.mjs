// Copies the MediaPipe WASM runtime into public/ so the scan never loads code from a third-party CDN.
import { cpSync, mkdirSync } from 'node:fs';
const src = 'node_modules/@mediapipe/tasks-vision/wasm';
mkdirSync('public/mediapipe', { recursive: true });
for (const f of ['vision_wasm_internal.js', 'vision_wasm_internal.wasm']) cpSync(`${src}/${f}`, `public/mediapipe/${f}`);
