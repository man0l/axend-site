---
title: "How AI Attractiveness Tests Work: Landmarks, Ratios and Limits"
description: "How AI attractiveness tests work: face landmarks, symmetry and proportion ratios, what on-device scans measure, and what no photo scan can capture."
slug: "how-ai-attractiveness-tests-work"
cluster: "trust"
module: "general"
targetKeyword: "how ai attractiveness tests work"
tool: "/"
publishDate: 2026-11-09
updatedDate: 2026-11-10
sources:
  - title: "Face Landmarker guide"
    url: "https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker"
    publisher: "Google AI Edge, MediaPipe"
  - title: "Maxims or myths of beauty? A meta-analytic and theoretical review (Langlois et al., 2000)"
    url: "https://doi.org/10.1037/0033-2909.126.3.390"
    publisher: "Psychological Bulletin"
  - title: "The Evolutionary Psychology of Facial Beauty (Rhodes, 2006)"
    url: "https://doi.org/10.1146/annurev.psych.57.102904.190208"
    publisher: "Annual Review of Psychology"
  - title: "Facial attractiveness (Thornhill and Gangestad, 1999)"
    url: "https://doi.org/10.1016/s1364-6613(99)01403-5"
    publisher: "Trends in Cognitive Sciences"
takeaways:
  - "Most tests follow four steps: find the face, map landmarks, compute ratios, produce a score."
  - "A landmark model places roughly 478 points on the face. It does not understand you as a person."
  - "The final score depends on the developers' formula or training data, so tools disagree."
  - "Where processing happens matters: some tools upload your photo, others run on your device."
  - "A scan cannot see skin, hair, expression, grooming or personality."
faq:
  - q: "How does an AI face rating work?"
    a: "A vision model finds hundreds of landmark points on your face. The tool then computes ratios such as symmetry, facial thirds and jaw angle from those points and maps them to a score."
  - q: "Is my photo uploaded?"
    a: "It depends on the tool. Axend's web scan runs on-device in the browser, so the photo is not uploaded. Always check a tool's privacy statement before using it."
  - q: "What can an AI attractiveness test not measure?"
    a: "Skin quality, hair, expression, grooming, lighting effects, charisma and personality. It reads geometry from one photo only."
---

Searching for an AI attractiveness test turns up many tools that look similar and promise different things. Under the surface, the better ones share a fairly simple pipeline. Understanding it helps you judge what a score means and, just as importantly, what it does not.

## How does an AI attractiveness test work, step by step?

Most tests follow four steps. They find the face, place landmark points on it, compute ratios from those points and map the ratios to a score. The steps are simple. The design choices in the last one decide what the number means. The table summarises each step.

| Step | What happens | What can go wrong |
| --- | --- | --- |
| 1. Find the face | A vision model locates the face and checks it is roughly frontal | Turned, covered or very small faces give unreliable results |
| 2. Map landmarks | A landmark model places a dense set of points, roughly 478 in a common model | Poor light or blur makes the points less precise |
| 3. Compute ratios | Symmetry, thirds, eye spacing, jaw angle and width, face ratio | Head tilt and lens distance distort the measurements |
| 4. Produce a score | A fixed formula or a model trained on human ratings | The result reflects the developers' assumptions, so tools disagree |

## Step 1: How does the tool find the face?

A vision model trained on labelled faces draws a box around the face and checks that it is roughly frontal and unobstructed. If the face is turned, covered by hair, sunglasses or a hand, or too small in the frame, the results become unreliable.

## Step 2: How are landmarks mapped?

A landmark model places a dense set of points on the face. A common type finds roughly 478 points covering the eyes, eyebrows, nose, lips, jawline and face outline. Each point is a coordinate in the image. The model does not understand you as a person. It only finds where the geometry of a face sits.

## Step 3: Which ratios does the tool compute?

From the points, the tool calculates measurements such as symmetry, facial thirds, eye spacing, jaw angle and width, and face width-to-height ratio. They match the ratios in classic proportion guides. The developers choose the reference ranges and combine the results into a score or a set of sub-scores.

Common examples:

- **Symmetry:** compares the left and right halves of the face around a midline, such as distances from the eye corners or mouth corners to the centre. See [does facial symmetry matter](/guides/does-facial-symmetry-matter).
- **Facial thirds:** compares the heights of the forehead, mid-face and lower face.
- **Eye spacing:** the distance between the eyes relative to eye width or face width.
- **Jaw angle and width:** the angle of the jaw line and how wide it is relative to the cheekbones.
- **Face width-to-height ratio:** an overall shape descriptor.

## Step 4: How is the score produced?

The final step maps your measurements to a number. Some tools use a fixed formula. Others train a model on human ratings of faces. Either way, the result reflects the developers' assumptions, and tastes vary across people, cultures and time. That is why scores from different tools on the same photo differ.

In our [hands-on test](/guides/best-ai-attractiveness-tests), one photo scored 7.6 out of 10 on one tool and 9.9 on another.

## Is my photo uploaded or processed on my device?

It depends on the tool. Some upload your photo to a server, and others run the model locally. Axend's web scan runs on-device in the browser, so the photo never leaves your device. Look for a clear statement on whether photos are uploaded, stored or used for training.

## What can't an AI attractiveness test measure?

A landmark scan sees geometry in a single photo. It cannot capture skin, hair, expression, grooming, charisma, voice or humour. Lighting and lens effects distort the geometry it does measure. It also cannot say how any particular person will react to you.

It cannot capture:

- **Skin:** texture, tone, clarity and health.
- **Hair:** style, density and condition.
- **Expression:** a real, warm smile versus a stiff one.
- **Grooming:** beard shaping, brows, clothing.
- **Lighting and lens effects:** these distort the geometry it does measure.
- **Charisma, voice, humour, kindness:** all the things that matter in person.

It also cannot say how any particular person will react to you. Attractiveness is partly personal and cultural, and a number cannot represent that.

## How should I read a score?

Treat it as approximate and cosmetic. Use the same photo setup each time if you want to compare over time, and look at the sub-measurements, not only the headline number. Focus on what you can change. Do not tie your self-worth to a number.

1. Treat it as approximate and cosmetic.
2. Use the same photo setup each time if you want to compare over time.
3. Look at the sub-measurements, not only the headline number.
4. Focus on things you can change, such as haircut, grooming, posture and fitness, rather than fixed bone structure.
5. Do not tie your self-worth to a number.

If you want to understand error sources in more detail, read [are AI attractiveness tests accurate](/guides/are-ai-attractiveness-tests-accurate).

## What does a transparent tool look like?

Good tools explain what they measure, show their sub-scores and state their limits plainly. If a tool hides its method or promises a definitive verdict on your looks, be sceptical. Axend publishes its [scoring method](/how-we-score), and our [comparison of named tools](/guides/best-ai-attractiveness-tests) applies the same test to others.

Axend's web scan finds the landmarks, computes proportions such as symmetry, thirds and jaw angle, and gives a free baseline in the browser. A fuller plan across skin, hair, jawline, posture and smile lives in the app. You can try it on the [Axend home page](/), treating the output as a reference point for tracking change, not a verdict. It is for adults aged 18 and over.
