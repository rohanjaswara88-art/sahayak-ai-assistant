"""Records the voice clips listed in audio/manifest.json (run through build-audio.js).
Needs:  pip install edge-tts   and an internet connection. Clips that already exist are skipped."""
import asyncio
import json
import os
import sys

import edge_tts

VOICES = {"hi": "hi-IN-SwaraNeural", "en": "en-IN-NeerjaNeural"}
RATE = "-8%"  # slightly slow, easy to follow
HERE = os.path.dirname(os.path.abspath(__file__))


async def record(sem: asyncio.Semaphore, item: dict) -> bool:
    out = os.path.join(HERE, item["file"])
    if os.path.exists(out) and os.path.getsize(out) > 0:
        return True
    os.makedirs(os.path.dirname(out), exist_ok=True)
    async with sem:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(item["text"], VOICES[item["lang"]], rate=RATE).save(out)
                return True
            except Exception as e:  # network hiccup: try again
                print(f"retry {item['file']}: {e}", file=sys.stderr)
                await asyncio.sleep(1.5)
    return False


async def main() -> None:
    with open(os.path.join(HERE, "audio", "manifest.json"), encoding="utf-8") as f:
        items = json.load(f)
    sem = asyncio.Semaphore(4)
    results = await asyncio.gather(*(record(sem, i) for i in items))
    failed = results.count(False)
    print(f"recorded {len(items) - failed}/{len(items)} clips")
    sys.exit(1 if failed else 0)


asyncio.run(main())
