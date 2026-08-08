#!/usr/bin/env python3
"""
extract_vector_tiles.py
=======================
Uses Playwright (headless Chromium) to visit publicly accessible airport map
portals and intercept all tile/vector asset network requests.

Saves captured assets to:  map-data/raw/extracted_tiles/

Legally captures only assets served without authentication.
Does NOT bypass any login or authentication gate.
"""

import asyncio, json, os, re, urllib.request
from pathlib import Path
from playwright.async_api import async_playwright, Request

BASE_DIR   = Path(__file__).parent
OUT_DIR    = BASE_DIR / "map-data" / "raw" / "extracted_tiles"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Public pages that may expose tile/vector assets
TARGETS = [
    {
        "name": "heathrow_guide",
        "url":  "https://www.heathrow.com/airport-guide/maps-and-directions",
        "wait": 8000,
    },
    {
        "name": "openstreetmap_heathrow",
        "url":  "https://www.openstreetmap.org/#map=15/51.4775/-0.4614",
        "wait": 5000,
    },
    {
        "name": "overpass_turbo_heathrow",
        "url":  "https://overpass-turbo.eu/?Q=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3Bway%5Baeorway%3Dterminal%5D(51.46%2C-0.505%2C51.49%2C-0.43)%3Bout+geom%3B&R=",
        "wait": 5000,
    },
]

# Patterns to capture
CAPTURE_PATTERNS = re.compile(
    r"\.(pbf|geojson|json|mvt|svg|png|jpg|gif|woff|woff2)(\?.*)?$",
    re.IGNORECASE,
)

TILE_MANIFEST = []

async def intercept(request: Request, target_name: str):
    url = request.url
    if not CAPTURE_PATTERNS.search(url):
        return

    resource_type = request.resource_type
    ext_match = CAPTURE_PATTERNS.search(url)
    ext = ext_match.group(1).lower() if ext_match else "bin"

    print(f"  CAPTURED [{ext}] {url[:100]}…", flush=True)

    # Record in manifest
    TILE_MANIFEST.append({
        "target":        target_name,
        "url":           url,
        "resource_type": resource_type,
        "extension":     ext,
    })

    # Try to download the asset
    try:
        safe_name = re.sub(r"[^a-zA-Z0-9._-]", "_", url.split("/")[-1].split("?")[0])[:80]
        out_path  = OUT_DIR / f"{target_name}_{safe_name}.{ext}"
        if not out_path.exists():
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "HeathrowTileFetcher/1.0 (research prototype)"},
            )
            with urllib.request.urlopen(req, timeout=15) as r:
                out_path.write_bytes(r.read())
            print(f"    → Saved: {out_path.name}", flush=True)
    except Exception as e:
        print(f"    → Could not download: {e}", flush=True)


async def scrape_target(page, target: dict):
    name = target["name"]
    url  = target["url"]
    print(f"\n[{name.upper()}] {url}", flush=True)

    captured = []

    async def handle_request(request: Request):
        await intercept(request, name)

    page.on("request", handle_request)

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(target["wait"])

        # Also capture any tile URLs injected into <script> tags
        scripts = await page.eval_on_selector_all("script", "els => els.map(e => e.textContent)")
        tile_urls = re.findall(r'https?://[^\s\'"]+\.(?:pbf|geojson|json|mvt|svg)', "\n".join(scripts))
        for t in set(tile_urls):
            print(f"  SCRIPT-FOUND: {t[:100]}", flush=True)
            TILE_MANIFEST.append({"target": name, "url": t, "resource_type": "script-embedded", "extension": "?"})

    except Exception as e:
        print(f"  ERROR: {e}", flush=True)
    finally:
        page.remove_listener("request", handle_request)


async def main():
    print("\n" + "="*60)
    print("  Heathrow Vector Tile Extractor")
    print("  Output:", OUT_DIR)
    print("="*60)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
        )
        page = await context.new_page()

        for target in TARGETS:
            await scrape_target(page, target)

        await browser.close()

    # Save manifest
    manifest_path = OUT_DIR / "tile_manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(TILE_MANIFEST, f, indent=2)
    print(f"\nManifest saved: {manifest_path} ({len(TILE_MANIFEST)} entries)")
    print("="*60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
