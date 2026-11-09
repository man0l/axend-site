---
title: "How we score"
description: "The exact method behind the Axend face scan: landmarks, ratios, and what it cannot measure."
updated: 2026-11-09
---
The Axend web scan is a geometry tool. It measures a few things that can be measured from one photo, and it says plainly what it cannot see.

## What happens when you scan

1. A face-landmark model (MediaPipe Face Landmarker) runs **inside your browser** and finds 478 points on your face.
2. We compute three traits from those points, using plain geometry.
3. We combine them into a baseline score out of 10 and describe each trait in a band: Strong, Balanced or Room to improve.

Your photo is never uploaded. The model and its code are served from this site, and the page's security policy blocks it from sending data to other servers.

## The three traits

- **Symmetry (40% of the baseline).** We pair left and right landmarks (outer eye corners, mouth corners, brow, nose wings, jaw points), mirror one side across your facial midline and measure the gap, relative to face width. Smaller gaps score higher.
- **Proportions (30%).** We compare the middle third of your face (between the brows and the base of the nose) with the lower third (base of the nose to the chin). Closer to even scores higher.
- **Jawline definition (30%).** We measure the jaw angle on both sides and the jaw width relative to the cheekbone width. A sharper angle and a wider jaw score higher.

## What it cannot measure

Skin, hair, grooming, style, expression, height, body, voice, charisma and personality. These matter more than geometry in how people are perceived. The scan also cannot correct for a tilted head, a wide-angle lens, harsh lighting or a smile, all of which move the numbers.

## Limits you should know about

- **Version 1 thresholds are heuristic.** The score ranges and weights are our first-pass choices and have not yet been calibrated against a large population sample. We therefore show scores out of 10 and plain-language bands, not population percentiles.
- **One photo is a noisy sample.** Expect the score to move by a point or more between photos. Use the same kind of photo to compare over time.
- **Attractiveness is subjective.** A geometry score is not a measure of how attractive anyone is, and it is not a judgment of your worth.

## Not medical advice

Axend is cosmetic and self-care only. Nothing here diagnoses or treats a condition. See a doctor or dermatologist for medical concerns.
