from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
TARGET = (16, 20, 24)


def is_background_candidate(rgb: tuple[int, int, int]) -> bool:
    low = min(rgb)
    high = max(rgb)
    spread = high - low
    return high >= 72 and spread <= 38


def make_dark_variant(source: Path, destination: Path, *, mobile: bool = False) -> None:
    if mobile:
        transparent_copy = source.with_name("hero-mobile - Copy.png")
        if not transparent_copy.exists():
            raise FileNotFoundError(f"Missing transparent mobile hero source: {transparent_copy}")
        obj = Image.open(transparent_copy).convert("RGBA")
        canvas = Image.new("RGBA", obj.size, (*TARGET, 255))
        canvas.alpha_composite(obj)
        destination.parent.mkdir(parents=True, exist_ok=True)
        canvas.convert("RGB").save(destination, optimize=True)
        return

    image = Image.open(source).convert("RGB")
    width, height = image.size
    pixels = image.load()
    mask = Image.new("L", image.size, 0)
    mask_pixels = mask.load()
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        if mask_pixels[x, y] == 0 and is_background_candidate(pixels[x, y]):
            mask_pixels[x, y] = 255
            queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            enqueue(x - 1, y)
        if x + 1 < width:
            enqueue(x + 1, y)
        if y > 0:
            enqueue(x, y - 1)
        if y + 1 < height:
            enqueue(x, y + 1)

    mask = mask.filter(ImageFilter.GaussianBlur(radius=max(2, width // 900)))
    dark_background = Image.new("RGB", image.size, TARGET)
    result = Image.composite(dark_background, image, mask)
    destination.parent.mkdir(parents=True, exist_ok=True)
    result.save(destination, optimize=True)


def main() -> None:
    for language in ("RU", "EN"):
        for name in ("hero-wide", "hero-mobile"):
            source = ROOT / "img" / language / f"{name}.png"
            destination = ROOT / "img" / language / f"{name}-dark.png"
            make_dark_variant(source, destination, mobile=name == "hero-mobile")
            print(f"created {destination.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
