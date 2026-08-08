#!/usr/bin/env python3
"""
extract_svg_layers.py
=====================
Uses Playwright (headless Chromium) to visit publicly accessible pages,
extract inline SVG airport diagram elements, and save them to:
  map-data/raw/extracted_svg/

Also attempts coordinate calibration by comparing known landmark lon/lat
to SVG viewBox dimensions.
"""

import asyncio, json, os, re
from pathlib import Path
from playwright.async_api import async_playwright

BASE_DIR = Path(__file__).parent
OUT_DIR  = BASE_DIR / "map-data" / "raw" / "extracted_svg"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Known Heathrow landmark for SVG coordinate calibration
# (Terminal 5 centre approximately)
KNOWN_LON = -0.4883
KNOWN_LAT =  51.4725

TARGETS = [
    {
        "name": "heathrow_maps",
        "url":  "https://www.heathrow.com/airport-guide/maps-and-directions",
        "wait": 10000,
        "selectors": ["svg", "[class*='map']", "[class*='floor']", "canvas"],
    },
    {
        "name": "wikipedia_lhr_diagram",
        "url":  "https://en.wikipedia.org/wiki/Heathrow_Airport",
        "wait": 4000,
        "selectors": ["svg", "img[src*='Heathrow']", "img[alt*='terminal']"],
    },
    {
        "name": "skyvector_lhr",
        "url":  "https://skyvector.com/airport/EGLL/London-Heathrow-Airport",
        "wait": 6000,
        "selectors": ["svg", "canvas", "[class*='chart']"],
    },
    {
        "name": "ourairports_lhr",
        "url":  "https://ourairports.com/airports/EGLL/",
        "wait": 5000,
        "selectors": ["svg", "img", "[class*='map']"],
    },
]

SVG_METADATA = []

async def extract_svgs(page, target: dict) -> list[dict]:
    name      = target["name"]
    selectors = target.get("selectors", ["svg"])
    results   = []

    for sel in selectors:
        try:
            els = await page.query_selector_all(sel)
            for idx, el in enumerate(els):
                tag = await el.evaluate("e => e.tagName.toLowerCase()")
                if tag == "svg":
                    svg_html  = await el.evaluate("e => e.outerHTML")
                    view_box  = await el.evaluate("e => e.getAttribute('viewBox') || ''")
                    width     = await el.evaluate("e => e.getAttribute('width') || e.getBoundingClientRect().width")
                    height    = await el.evaluate("e => e.getAttribute('height') || e.getBoundingClientRect().height")

                    if len(svg_html) < 200:
                        continue  # Skip tiny/empty SVGs

                    fname = f"{name}_svg_{idx}.svg"
                    fpath = OUT_DIR / fname
                    fpath.write_text(svg_html, encoding="utf-8")

                    meta = {
                        "source":   name,
                        "file":     fname,
                        "viewBox":  view_box,
                        "width":    width,
                        "height":   height,
                        "size_kb":  len(svg_html) // 1024,
                        "note":     "Raw SVG — coordinate calibration required",
                    }
                    results.append(meta)
                    print(f"  SVG saved: {fname} ({meta['size_kb']} KB, viewBox={view_box})", flush=True)

                elif tag in ("img", "canvas"):
                    src = await el.evaluate("e => e.src || e.getAttribute('src') || ''")
                    alt = await el.evaluate("e => e.alt || ''")
                    if src and ("airport" in src.lower() or "terminal" in src.lower() or "lhr" in src.lower() or "heathrow" in alt.lower()):
                        print(f"  IMG found: {src[:80]} [{alt}]", flush=True)
                        results.append({"source": name, "type": "img", "src": src, "alt": alt})
        except Exception as e:
            print(f"  Selector '{sel}' error: {e}", flush=True)

    return results


async def scrape_target(page, target: dict):
    name = target["name"]
    url  = target["url"]
    print(f"\n[{name.upper()}] {url}", flush=True)

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(target["wait"])

        results = await extract_svgs(page, target)
        SVG_METADATA.extend(results)
        print(f"  → {len(results)} elements captured", flush=True)

    except Exception as e:
        print(f"  ERROR loading page: {e}", flush=True)


async def main():
    print("\n" + "="*60)
    print("  Heathrow SVG Layer Extractor")
    print("  Output:", OUT_DIR)
    print("="*60)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1920, "height": 1080},
        )
        page = await context.new_page()

        for target in TARGETS:
            await scrape_target(page, target)

        await browser.close()

    manifest_path = OUT_DIR / "svg_manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(SVG_METADATA, f, indent=2)

    print(f"\nSVG manifest: {manifest_path} ({len(SVG_METADATA)} entries)")
    print("="*60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
