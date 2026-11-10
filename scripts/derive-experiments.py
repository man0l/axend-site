"""Deterministic derivatives of the synthetic base face for the symmetry experiment (SLA-1487).
Mirrored composites and tilts are made by plain image operations, not by the model, so they add no model drift.
Usage: python3 scripts/derive-experiments.py   (reads public/guides-exp/base.png, writes sym-*.png and tilt-*.png)
The base's C2PA manifest cannot be copied by Pillow, so derivatives carry a PNG text note naming the AI source instead."""
import json
from PIL import Image
from PIL.PngImagePlugin import PngInfo

D = 'public/guides-exp'
MID = 520  # face midline in pixels, from landmarks 10/152/1/9/2 of the base scan
HALF = 504
base = Image.open(f'{D}/base.png').convert('RGB')
h = base.height
info = PngInfo()
info.add_text('Source', 'Derived from an AI-generated synthetic face (openai/gpt-image-2.6-sunburst). Not a real person.')

left = base.crop((MID - HALF, 0, MID, h))
right = base.crop((MID, 0, MID + HALF, h))
for name, half in (('left', left), ('right', right)):
    mirror = half.transpose(Image.FLIP_LEFT_RIGHT)
    out = Image.new('RGB', (HALF * 2, h))
    if name == 'left':  # image-left half + its mirror
        out.paste(half, (0, 0)); out.paste(mirror, (HALF, 0))
    else:  # mirror of image-right half + image-right half
        out.paste(mirror, (0, 0)); out.paste(half, (HALF, 0))
    out.save(f'{D}/sym-{name}-{name}.png', pnginfo=info)

bg = base.getpixel((8, 8))
for deg in (5, 10):
    base.rotate(-deg, resample=Image.BICUBIC, center=(MID, 480), fillcolor=bg).save(f'{D}/tilt-{deg}.png', pnginfo=info)  # clockwise
print(json.dumps({'mid': MID, 'bg': bg}))

# Display thumbnails (the full-size PNGs keep the C2PA manifest and are linked from each figure).
import glob, os
os.makedirs(f'{D}/thumb', exist_ok=True)
exif = Image.Exif()
exif[0x010E] = 'Synthetic test face (AI-generated, openai/gpt-image-2.6-sunburst). Not a real person.'
for f in sorted(glob.glob(f'{D}/*.png')):
    im = Image.open(f).convert('RGB')
    im.thumbnail((560, 560))
    im.save(f"{D}/thumb/{os.path.basename(f)[:-4]}.webp", quality=82, exif=exif)
