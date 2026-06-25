#!/usr/bin/env python3
"""
Generate e-card background images with Gemini native image (batch or sync).

Mirrors the workflow of UpKeepr's generate_exercise_images.py:
  pip install google-genai
  export GEMINI_API_KEY=...

Defaults:
  Model: gemini-3.1-flash-image-preview (override GEMINI_IMAGE_MODEL)
  Aspect: 4:3 landscape (ECARD_BG_ASPECT=4:3) — matches wizard preview ratio
  Batch API on (GEMINI_USE_BATCH=1) for lower cost vs sync
  Output: ./public/ecard-bg/<category>/<category>__<slot>.png  (slots 01–05; five independent prompts each)

Filter:
  ECARD_BG_ONLY="diwali,holi,birthday"  → only those categories (still 5 prompts each → 225 jobs total unfiltered)

Smoke / subset batch (good when testing API health — use a fresh ECARD_BG_OUT so progress.json does not clash):
  ECARD_BG_JOB_LIMIT=10 ECARD_BG_START_INDEX=0 ECARD_BG_OUT=/tmp/ecard-bg-smoke \\
    GEMINI_USE_BATCH=1 python3 scripts/generate_ecard_backgrounds.py

last_batch_meta.json records job_limit when set so fetch_gemini_batch_outputs.py --from-meta stays aligned.

  python3 scripts/fetch_gemini_batch_outputs.py --wait --update-progress

Uses ./public/ecard-bg/last_batch_meta.json when you pass --from-meta.

See scripts/ecard_background_data.py for occasion prompts + design critique notes.
"""

from __future__ import annotations

import base64
import json
import os
import sys
import time
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
_REPO_ROOT = _SCRIPT_DIR.parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from ecard_background_data import build_prompt, iter_jobs  # noqa: E402


def _aspect_from_env() -> str:
    raw = os.environ.get("ECARD_BG_ASPECT", "4:3").strip()
    return raw if raw else "4:3"


def _image_size_from_env() -> str:
    raw = os.environ.get("GEMINI_IMAGE_SIZE", "2K").strip().upper()
    if raw in ("1K", "2K", "4K"):
        return raw
    return "2K"


def _inline_data_to_bytes(blob) -> bytes | None:
    if blob is None or not blob.data:
        return None
    raw = blob.data
    if isinstance(raw, str):
        return base64.b64decode(raw)
    return raw


def extract_image_bytes_from_content_response(response) -> bytes | None:
    if not response.candidates:
        return None
    for cand in response.candidates:
        if not cand.content or not cand.content.parts:
            continue
        for part in cand.content.parts:
            if part.inline_data:
                b = _inline_data_to_bytes(part.inline_data)
                if b:
                    return b
            if part.as_image() is not None:
                from io import BytesIO

                buf = BytesIO()
                part.as_image().save(buf, format="PNG")
                return buf.getvalue()
    return None


def generate_image_native(client, model: str, prompt: str, *, image_size: str, aspect_ratio: str) -> bytes:
    from google.genai import types

    cfg = types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"],
        image_config=types.ImageConfig(aspect_ratio=aspect_ratio, image_size=image_size),
    )
    r = client.models.generate_content(
        model=model,
        contents=[prompt],
        config=cfg,
    )
    raw = extract_image_bytes_from_content_response(r)
    if not raw:
        raise RuntimeError("No image in response (blocked or no image modality).")
    return raw


def _terminal_batch_states():
    from google.genai import types

    return frozenset(
        {
            types.JobState.JOB_STATE_SUCCEEDED,
            types.JobState.JOB_STATE_FAILED,
            types.JobState.JOB_STATE_CANCELLED,
            types.JobState.JOB_STATE_EXPIRED,
            types.JobState.JOB_STATE_PARTIALLY_SUCCEEDED,
        }
    )


def save_batch_inlined_to_disk(
    dest,
    jobs_slice: list[tuple[str, str]],
    start_index: int,
    out_root: Path,
    state: dict | None,
    state_path: Path | None,
    *,
    model: str,
    image_size: str,
    aspect_ratio: str,
) -> tuple[int, int]:
    """
    Write PNGs from batch dest.inlined_responses aligned with jobs_slice[j].
    Returns (saved_count, failure_count).
    """
    if not dest or not getattr(dest, "inlined_responses", None):
        raise ValueError("dest has no inlined_responses")

    inlined = dest.inlined_responses
    n = min(len(inlined), len(jobs_slice))
    if len(inlined) != len(jobs_slice):
        print(
            f"Warning: {len(inlined)} responses but jobs_slice has {len(jobs_slice)} rows — pairing first {n}.",
            file=sys.stderr,
        )

    saved = 0
    failures = 0
    for j in range(n):
        inline = inlined[j]
        i = start_index + j
        category_id, slot_key = jobs_slice[j]
        subdir = out_root / category_id
        subdir.mkdir(parents=True, exist_ok=True)
        fname = f"{category_id}__{slot_key}.png"
        fpath = subdir / fname
        if inline.error:
            print(f"[{i + 1}] {category_id} — {slot_key}: error {inline.error}", file=sys.stderr)
            failures += 1
            continue
        resp = inline.response
        if not resp:
            print(f"[{i + 1}] {category_id} — {slot_key}: empty response", file=sys.stderr)
            failures += 1
            continue
        raw = extract_image_bytes_from_content_response(resp)
        if not raw:
            print(f"[{i + 1}] {category_id} — {slot_key}: no image in response", file=sys.stderr)
            failures += 1
            continue
        fpath.write_bytes(raw)
        print(f"  Saved {fpath}")
        saved += 1

        if state is not None and state_path is not None:
            state["next_index"] = i + 1
            state["model"] = model
            state["mode"] = "batch"
            state["image_size"] = image_size
            state["aspect_ratio"] = aspect_ratio
            state_path.write_text(json.dumps(state, indent=2), encoding="utf-8")

    return saved, failures


def run_batch(
    client,
    model: str,
    jobs_slice: list[tuple[str, str]],
    start_index: int,
    out_root: Path,
    state: dict,
    state_path: Path,
    poll_seconds: float,
    *,
    image_size: str,
    aspect_ratio: str,
    only_categories: list[str] | None = None,
    catalog_job_limit: int | None = None,
) -> None:
    from google.genai import types

    if not jobs_slice:
        print("Nothing to generate (already complete).")
        return

    inlined: list[types.InlinedRequest] = []
    for category_id, slot_key in jobs_slice:
        prompt = build_prompt(category_id, slot_key)
        inlined.append(
            types.InlinedRequest(
                contents=types.Content(role="user", parts=[types.Part(text=prompt)]),
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE", "TEXT"],
                    image_config=types.ImageConfig(aspect_ratio=aspect_ratio, image_size=image_size),
                ),
            )
        )

    print(f"Submitting batch: {len(inlined)} requests (model={model}, {aspect_ratio}, image_size={image_size})…")
    job = client.batches.create(
        model=model,
        src=inlined,
        config=types.CreateBatchJobConfig(display_name="portfolio-ecard-backgrounds"),
    )
    job_name = job.name
    print(f"Batch job: {job_name}")

    meta_path = out_root / "last_batch_meta.json"
    payload = {
        "job_name": job_name,
        "start_index": start_index,
        "request_count": len(jobs_slice),
        "only_categories": only_categories,
    }
    if catalog_job_limit is not None:
        payload["job_limit"] = catalog_job_limit
    meta_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {meta_path} (fetch outputs: scripts/fetch_gemini_batch_outputs.py)")

    terminal = _terminal_batch_states()
    while True:
        job = client.batches.get(name=job_name)
        st = job.state
        if st is not None and st in terminal:
            break
        print(f"  Batch state: {st}. Waiting {poll_seconds:.0f}s…")
        time.sleep(poll_seconds)

    print(f"Batch finished: {job.state}")

    if job.state == types.JobState.JOB_STATE_FAILED:
        print(f"Batch failed: {job.error}", file=sys.stderr)
        sys.exit(2)

    dest = job.dest
    if not dest or not dest.inlined_responses:
        print("No batch output (dest.inlined_responses empty).", file=sys.stderr)
        sys.exit(3)

    saved, failures = save_batch_inlined_to_disk(
        dest,
        jobs_slice,
        start_index,
        out_root,
        state,
        state_path,
        model=model,
        image_size=image_size,
        aspect_ratio=aspect_ratio,
    )
    print(f"Done — batch processed ({saved} saved, {failures} failures).")


def main() -> None:
    raw_only = os.environ.get("ECARD_BG_ONLY", "").strip()
    only_set: frozenset[str] | None = None
    if raw_only:
        only_set = frozenset(x.strip() for x in raw_only.split(",") if x.strip())

    jobs = iter_jobs(only_categories=only_set)
    if not jobs:
        print("No jobs after ECARD_BG_ONLY filter.", file=sys.stderr)
        sys.exit(1)

    catalog_job_limit: int | None = None
    lim_raw = os.environ.get("ECARD_BG_JOB_LIMIT", "").strip()
    if lim_raw:
        catalog_job_limit = int(lim_raw)
        if catalog_job_limit <= 0:
            print("ECARD_BG_JOB_LIMIT must be a positive integer.", file=sys.stderr)
            sys.exit(1)
        jobs = jobs[:catalog_job_limit]
        print(f"ECARD_BG_JOB_LIMIT → using first {len(jobs)} job(s) of filtered catalog.")

    if os.environ.get("ECARD_BG_PRINT", "").strip().lower() in ("1", "true", "yes"):
        for i, (cid, vk) in enumerate(jobs[: min(3, len(jobs))]):
            print(f"\n--- Sample job {i + 1}: {cid} / {vk} ---\n")
            print(build_prompt(cid, vk))
        print(f"\n(Total jobs would be {len(jobs)}; printed first 3 samples.)")
        return

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Set GEMINI_API_KEY in the environment.", file=sys.stderr)
        sys.exit(1)

    out_root = Path(os.environ.get("ECARD_BG_OUT", str(_REPO_ROOT / "public" / "ecard-bg")))
    out_root.mkdir(parents=True, exist_ok=True)
    state_path = out_root / "progress.json"

    if state_path.exists():
        state = json.loads(state_path.read_text(encoding="utf-8"))
        start_index = int(state.get("next_index", 0))
    else:
        state = {"next_index": 0, "model": "gemini-3.1-flash-image-preview", "mode": "batch"}
        start_index = 0

    si_env = os.environ.get("ECARD_BG_START_INDEX", "").strip()
    if si_env:
        start_index = int(si_env)
        print(f"ECARD_BG_START_INDEX → resume/start offset set to {start_index}")
    model = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3.1-flash-image-preview")
    use_batch = os.environ.get("GEMINI_USE_BATCH", "1").strip().lower() not in ("0", "false", "no", "off")
    poll_seconds = float(os.environ.get("BATCH_POLL_SECONDS", "30"))
    interval_sec = float(os.environ.get("IMAGE_INTERVAL_SECONDS", "60"))
    image_size = _image_size_from_env()
    aspect_ratio = _aspect_from_env()

    from google import genai

    client = genai.Client(api_key=api_key)

    if start_index >= len(jobs):
        print("All jobs already generated (per progress.json).")
        return

    print(f"Total jobs: {len(jobs)} — resuming from index {start_index} ({len(jobs) - start_index} remaining).")

    if use_batch:
        run_batch(
            client,
            model,
            jobs[start_index:],
            start_index,
            out_root,
            state,
            state_path,
            poll_seconds,
            image_size=image_size,
            aspect_ratio=aspect_ratio,
            only_categories=sorted(only_set) if only_set else None,
            catalog_job_limit=catalog_job_limit,
        )
        return

    from google.genai import errors as genai_errors

    def call_with_quota_retry(fn, max_attempts: int | None = None):
        if max_attempts is None:
            max_attempts = int(os.environ.get("GEMINI_MAX_429_ATTEMPTS", "80"))
        delay_floor = float(os.environ.get("GEMINI_429_MIN_WAIT_SECONDS", "45"))
        delay = delay_floor
        last: BaseException | None = None
        for attempt in range(max_attempts):
            try:
                return fn()
            except genai_errors.ClientError as e:
                last = e
                code = getattr(e, "status_code", None) or 0
                if code == 429 and attempt + 1 < max_attempts:
                    wait = max(delay_floor, delay)
                    print(
                        f"  Rate limited (429), waiting {wait:.0f}s ({attempt + 1}/{max_attempts})…",
                        file=sys.stderr,
                    )
                    time.sleep(wait)
                    delay = min(delay * 1.25, 600.0)
                    continue
                raise
        assert last is not None
        raise last

    for i in range(start_index, len(jobs)):
        category_id, slot_key = jobs[i]
        prompt = build_prompt(category_id, slot_key)
        print(f"[{i + 1}/{len(jobs)}] {category_id} — {slot_key}")

        try:
            raw = call_with_quota_retry(
                lambda: generate_image_native(client, model, prompt, image_size=image_size, aspect_ratio=aspect_ratio)
            )
        except Exception as e:
            print(f"  API error: {e}", file=sys.stderr)
            sys.exit(2)

        subdir = out_root / category_id
        subdir.mkdir(parents=True, exist_ok=True)
        fname = f"{category_id}__{slot_key}.png"
        fpath = subdir / fname
        fpath.write_bytes(raw)
        print(f"  Saved {fpath}")

        state["next_index"] = i + 1
        state["model"] = model
        state["mode"] = "sync"
        state["image_size"] = image_size
        state["aspect_ratio"] = aspect_ratio
        state_path.write_text(json.dumps(state, indent=2), encoding="utf-8")

        if i + 1 < len(jobs):
            print(f"  Sleeping {interval_sec:.0f}s until next image…")
            time.sleep(interval_sec)

    print("Done — all backgrounds generated.")


if __name__ == "__main__":
    main()
