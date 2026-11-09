---
title: "How AI Attractiveness Tests Work: Landmarks, Ratios and Limits"
description: "How AI attractiveness tests work: face landmarks, symmetry and proportion ratios, what on-device scans measure, and what no photo scan can capture."
slug: "how-ai-attractiveness-tests-work"
cluster: "trust"
module: "general"
targetKeyword: "how ai attractiveness tests work"
tool: "/"
publishDate: 2026-11-26
updatedDate: 2026-11-26
faq:
  - q: "How does an AI face rating work?"
    a: "A vision model finds hundreds of landmark points on your face. The tool then computes ratios such as symmetry, facial thirds and jaw angle from those points and maps them to a score."
  - q: "Is my photo uploaded?"
    a: "It depends on the tool. Axend's web scan runs on-device in the browser, so the photo is not uploaded. Always check a tool's privacy statement before using it."
  - q: "What can an AI attractiveness test not measure?"
    a: "Skin quality, hair, expression, grooming, lighting effects, charisma and personality. It reads geometry from one photo only."
---

Searching for an AI attractiveness test turns up many tools that look similar and promise different things. Under the surface, the better ones share a fairly simple pipeline. Understanding it helps you judge what a score means and, just as importantly, what it does not.

## Step 1: Finding the face

The tool first locates a face in the image. A vision model, trained on a large number of labelled faces, draws a box around it and checks that it is roughly frontal and unobstructed. If the face is turned, covered by hair, sunglasses or a hand, or too small in the frame, results become unreliable.

## Step 2: Mapping landmarks

Next, a landmark model places a dense set of points on the face. A common type of model finds roughly 478 points, covering the eyes, eyebrows, nose, lips, jawline, and face outline. Each point is a coordinate in the image.

These landmarks are the raw material. The model does not understand you as a person, it just finds where the geometry of a face sits in the picture.

## Step 3: Computing ratios

From the points, the tool calculates measurements. Common examples:

- **Symmetry:** compares the left and right halves of the face around a midline, such as distances from the eye corners or mouth corners to the centre.
- **Facial thirds:** compares the heights of the forehead, mid-face and lower face.
- **Eye spacing:** the distance between the eyes relative to eye width or face width.
- **Jaw angle and width:** the angle of the jaw line and how wide it is relative to the cheekbones.
- **Face width-to-height ratio:** an overall shape descriptor.

These are the same kinds of ratios found in classic proportion guides. The tool compares them with reference ranges, which are chosen by the developers, and combines them into a score or a set of sub-scores.

## Step 4: Producing a score

The final step maps measurements to a number. This is where design choices matter. Some tools use a fixed formula. Others train a model on human ratings of faces. In both cases, the result reflects whichever assumptions the developers made, and tastes vary across people, cultures and time.

That is why scores from different tools on the same photo may differ.

## Where the processing happens

Some tools upload your photo to a server and process it there. Others run the model locally. Axend's web scan runs on-device in the browser, so the photo never leaves your device. That is a significant privacy difference, and it is worth checking for any tool you use: look for a clear statement on whether photos are uploaded, stored or used for training.

## What these tests cannot measure

A landmark scan sees geometry in a single photo. It cannot capture:

- **Skin:** texture, tone, clarity and health.
- **Hair:** style, density and condition.
- **Expression:** a real, warm smile versus a stiff one.
- **Grooming:** beard shaping, brows, clothing.
- **Lighting and lens effects:** these distort the geometry it does measure.
- **Charisma, voice, humour, kindness:** all the things that matter in person.

It also cannot say how any particular person will react to you. Attractiveness is partly personal and cultural, and a number cannot represent that.

## How to read a score sensibly

1. Treat it as approximate and cosmetic.
2. Use the same photo setup each time if you want to compare over time.
3. Look at the sub-measurements, not only the headline number.
4. Focus on things you can change, such as haircut, grooming, posture and fitness, rather than fixed bone structure.
5. Do not tie your self-worth to a number.

If you want to understand error sources in more detail, read [are AI attractiveness tests accurate](/guides/are-ai-attractiveness-tests-accurate).

## A transparent approach

Good tools explain what they measure, show their sub-scores, and state their limits plainly. If a tool hides its method or promises a definitive verdict on your looks, be sceptical.

Axend's web scan finds the landmarks, computes proportions such as symmetry, thirds and jaw angle, and gives a free baseline in the browser. A fuller plan across skin, hair, jawline, posture and smile lives in the app. You can try it on the [Axend home page](/), treating the output as a reference point for tracking change, not a verdict. It is for adults aged 18 and over.
