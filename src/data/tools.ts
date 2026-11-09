export type Focus = 'overall' | 'symmetry' | 'face' | 'men' | 'rating';
export interface Tool {
  path: string; // '/' or '/slug'
  ct: string;
  nav: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: [string, string];
  pill: string;
  intro: string;
  focus: Focus;
  body: { h: string; p: string }[];
  faq: { q: string; a: string }[];
}

const commonFaq = [
  { q: 'Does my photo get uploaded?', a: 'No. The scan runs entirely in your browser on your device. Your photo is never sent to our servers, never stored, and there is no account.' },
  { q: 'Is the score a judgment of my worth?', a: 'No. It is a cosmetic, approximate measurement of face geometry from one photo. It is not medical advice and not a verdict on you or your attractiveness.' },
  { q: 'Who is it for?', a: 'Adults 18 and over only. You confirm this before you can choose a photo.' },
];

export const TOOLS: Tool[] = [
  {
    path: '/', ct: 'home', nav: 'AI Attractiveness Test',
    title: 'AI Attractiveness Test: Free, Private, On-Device | Axend',
    description: 'Free AI attractiveness test that runs on your device. Your photo never leaves your phone. Get a baseline score and what to work on.',
    eyebrow: 'The honest face rating', h1: ['AI attractiveness test.', 'Private by design.'],
    pill: 'Runs on your device. No upload.',
    intro: 'Upload a front-facing photo and get a baseline score plus the traits that move it most. The scan runs in your browser, so your photo never leaves your device.',
    focus: 'overall',
    body: [
      { h: 'What this attractiveness test measures', p: 'It finds 478 landmarks on your face and computes symmetry, facial proportions and jaw geometry from them. It does not look at skin, hair, expression, style or charisma, which matter a lot more in real life.' },
      { h: 'Why on-device matters', p: 'Most online tests upload your face to a server. This one does not. The model runs inside your browser tab, the photo stays in memory, and it is gone when you close the page.' },
      { h: 'A baseline, not a verdict', p: 'Treat the result as a starting point you can track over time. The score moves with angle, lighting and expression, so use the same kind of photo when you compare.' },
    ],
    faq: [{ q: 'How does an AI attractiveness test work?', a: 'A vision model finds landmarks on your face. Ratios between those points, such as left-right symmetry, facial thirds and jaw angle, are turned into scores. See How we score for the exact method.' }, ...commonFaq],
  },
  {
    path: '/how-attractive-am-i', ct: 'how-attractive-am-i', nav: 'How Attractive Am I?',
    title: 'How Attractive Am I? Free Photo Test, Private | Axend',
    description: 'Wondering how attractive you are? Get a free baseline score from one photo. Runs on your device, nothing is uploaded.',
    eyebrow: 'How attractive am I', h1: ['How attractive am I?', 'Get an honest baseline.'],
    pill: 'Real measurements. No flattery.',
    intro: 'One front-facing photo gives you a baseline score and the 2 or 3 traits that matter most. Nothing is uploaded, because the scan runs on your device.',
    focus: 'overall',
    body: [
      { h: 'What "how attractive am I" really asks', p: 'Attractiveness is subjective and depends on far more than geometry. What a photo scan can do is measure a few objective things, like symmetry and proportions, and show you where you stand on them.' },
      { h: 'Take a fair photo', p: 'Face the camera straight on, keep a neutral expression, use soft even light, and remove glasses and hats. A tilted head or wide-angle selfie distorts the numbers.' },
      { h: 'What to do with the result', p: 'Use it to pick one thing to work on, such as grooming, hair or posture, and re-test with a similar photo in a few weeks.' },
    ],
    faq: [{ q: 'How attractive am I based on a picture?', a: 'A picture only shows geometry and presentation under that lighting and angle. The result is a rough baseline for a few measurable traits, not an overall verdict.' }, ...commonFaq],
  },
  {
    path: '/facial-symmetry-test', ct: 'facial-symmetry-test', nav: 'Facial Symmetry Test',
    title: 'Facial Symmetry Test Online: Free and Private | Axend',
    description: 'Free facial symmetry test with a midline overlay. Measured on your device from 478 landmarks. Your photo is never uploaded.',
    eyebrow: 'Facial symmetry test', h1: ['Facial symmetry test.', 'See your midline.'],
    pill: 'Symmetry overlay. On-device.',
    intro: 'We mirror your landmarks across your facial midline and measure how far each pair is from matching. You see the overlay on your own photo, and nothing leaves your device.',
    focus: 'symmetry',
    body: [
      { h: 'How the symmetry score works', p: 'We pair up left and right landmarks, such as the outer eye corners, mouth corners and jaw points, mirror one side across your midline and measure the gap, relative to your face width.' },
      { h: 'Everyone is asymmetric', p: 'Perfect symmetry is essentially non-existent. Small differences are normal, and head tilt or turn in the photo can exaggerate them, so face the camera squarely.' },
      { h: 'What you can change', p: 'Parting your hair on the other side, brow grooming, posture and photo angle all change how symmetric you look. Your bone structure does not change.' },
    ],
    faq: [{ q: 'What is a good facial symmetry score?', a: 'Most faces score in a middle range. A higher number means smaller left-right differences in the measured landmarks. It is not a judgment of how good you look.' }, { q: 'Why does my symmetry change between photos?', a: 'Head rotation, tilt, expression and lens distortion all change the measured landmarks. Use a straight-on neutral photo each time.' }, ...commonFaq],
  },
  {
    path: '/face-attractiveness-test', ct: 'face-attractiveness-test', nav: 'Face Attractiveness Test',
    title: 'Face Attractiveness Test: Free, On-Device Photo Scan | Axend',
    description: 'Free face attractiveness test from a photo. Symmetry, proportions and jawline measured on your device. No upload.',
    eyebrow: 'Face attractiveness test', h1: ['Face attractiveness test.', 'Your face, measured.'],
    pill: 'Photo stays on your device.',
    intro: 'This test looks only at your face: symmetry, proportions and jaw geometry. Upload one photo and the scan runs locally in your browser.',
    focus: 'face',
    body: [
      { h: 'Face only, by design', p: 'We deliberately ignore everything that is not face geometry. Skin, hair, clothes and expression are not scored here, so you see what the structure alone looks like.' },
      { h: 'Measured traits', p: 'Symmetry compares left and right landmark pairs. Proportions compares the middle and lower thirds of your face. Jawline looks at jaw angle and width relative to the cheekbones.' },
      { h: 'Photo tips', p: 'Straight-on, eye level, neutral expression, even light. Photos taken close up with a wide lens widen the nose and shrink the jaw in the numbers.' },
    ],
    faq: [{ q: 'What does a face attractiveness test measure?', a: 'Here it measures three geometric traits from facial landmarks: symmetry, proportions and jawline definition. It cannot measure appeal, skin, hair or personality.' }, ...commonFaq],
  },
  {
    path: '/male-attractiveness-test', ct: 'male-attractiveness-test', nav: 'Male Attractiveness Test',
    title: 'Male Attractiveness Test: Private AI Face Scan | Axend',
    description: 'Attractiveness test built for men. Get a baseline and what to improve, with the scan running privately on your device.',
    eyebrow: 'Male attractiveness test', h1: ['Male attractiveness test.', 'Know your baseline.'],
    pill: 'For men 18+. No upload.',
    intro: 'A private face scan with a men-focused read on jawline and proportions, plus what to work on. Your photo is processed on your device and never uploaded.',
    focus: 'men',
    body: [
      { h: 'Built around what men can change', p: 'Jawline definition, hair, skin and posture are the levers men most often work on. The result points you at the one most worth your time.' },
      { h: 'Honest about limits', p: 'A scan sees geometry, not charisma, style or fitness. Use it as a starting point and re-test after a few weeks of change.' },
      { h: 'Next step', p: 'The full breakdown and a module-by-module plan live in the Axend app.' },
    ],
    faq: [{ q: 'Is this test different for men?', a: 'The measurements are the same landmark ratios. The framing emphasizes jawline and the grooming levers men commonly work on.' }, ...commonFaq],
  },
  {
    path: '/face-rating', ct: 'face-rating', nav: 'Face Rating',
    title: 'Face Rating: Free AI Face Rating on Your Device | Axend',
    description: 'Free AI face rating from one photo. Real measurements, no flattery, and your photo never leaves your device.',
    eyebrow: 'The honest face rating', h1: ['AI face rating.', 'No flattery.'],
    pill: 'Real percentiles. No flattery.',
    intro: 'Get a face rating from one photo. We measure symmetry, proportions and jawline with an on-device model, so nothing is uploaded.',
    focus: 'rating',
    body: [
      { h: 'What a face rating is', p: 'A face rating compresses a few geometric measurements into a score. It is a rough, cosmetic number, useful for tracking change and not for judging yourself.' },
      { h: 'How ours differs', p: 'It runs on your device, shows the individual traits behind the score, and tells you what to improve instead of just handing you a number.' },
      { h: 'Reading your rating', p: 'The score is out of 10 and is described in plain bands. See How we score for how each trait is calculated and what it cannot capture.' },
    ],
    faq: [{ q: 'How accurate is an AI face rating?', a: 'It is accurate at measuring landmark geometry in the photo you give it. It is not accurate at measuring attractiveness, because that depends on much more than geometry.' }, ...commonFaq],
  },
];
