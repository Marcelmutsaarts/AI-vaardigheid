"""Crop the 3 ChatGPT-generated 3x3 grids into 27 individual persona webp files."""
from PIL import Image
from pathlib import Path

DOWNLOADS = Path('C:/Users/Gebruiker/Downloads')
OUT_DIR = Path('C:/Users/Gebruiker/vibecoding/AI-fluency/public/personas')
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Each grid maps to one Leren-axis value.
# Within each grid: rows = Kwaliteit (pos, zero, neg), cols = Snelheid (pos, zero, neg).
GRIDS = [
    ('pos', DOWNLOADS / 'ChatGPT Image 4 mei 2026, 14_21_10 (1).png'),
    ('zero', DOWNLOADS / 'ChatGPT Image 4 mei 2026, 14_21_10 (2).png'),
    ('neg', DOWNLOADS / 'ChatGPT Image 4 mei 2026, 14_21_11 (3).png'),
]

ROWS = ['pos', 'zero', 'neg']  # Kwaliteit axis order top -> bottom
COLS = ['pos', 'zero', 'neg']  # Snelheid axis order left -> right

# Small inset in px to trim gutter/whitespace between cells
INSET = 6

for leren_label, src in GRIDS:
    img = Image.open(src).convert('RGBA')
    W, H = img.size
    cell_w = W / 3
    cell_h = H / 3

    for r, kwaliteit_label in enumerate(ROWS):
        for c, snelheid_label in enumerate(COLS):
            left = int(round(c * cell_w)) + INSET
            upper = int(round(r * cell_h)) + INSET
            right = int(round((c + 1) * cell_w)) - INSET
            lower = int(round((r + 1) * cell_h)) - INSET
            cell = img.crop((left, upper, right, lower))

            key = f'{leren_label}-{kwaliteit_label}-{snelheid_label}'
            out_path = OUT_DIR / f'persona-{key}.webp'
            cell.save(out_path, format='WEBP', quality=88, method=6)
            print(f'wrote {out_path.name} ({cell.size})')

print('done')
