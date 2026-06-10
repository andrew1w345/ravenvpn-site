from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "img" / "illustrations.png"
OUTPUT_DIR = ROOT / "img" / "spot"

SPOTS = [
    ("travel", 0, 0),
    ("public-wifi", 1, 0),
    ("devices", 2, 0),
    ("telegram-setup", 0, 1),
    ("stable-connection", 1, 1),
    ("support", 2, 1),
]


def main() -> None:
    image = Image.open(SOURCE).convert("RGB")
    cell_width = image.width // 3
    cell_height = image.height // 2
    crop_width = cell_width * 3
    crop_height = cell_height * 2
    left = (image.width - crop_width) // 2
    top = (image.height - crop_height) // 2

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, column, row in SPOTS:
        box = (
            left + column * cell_width,
            top + row * cell_height,
            left + (column + 1) * cell_width,
            top + (row + 1) * cell_height,
        )
        output = OUTPUT_DIR / f"{name}.png"
        image.crop(box).save(output, optimize=True)
        print(f"{output.relative_to(ROOT)} {cell_width}x{cell_height}")


if __name__ == "__main__":
    main()
