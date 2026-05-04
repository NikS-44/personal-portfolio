#!/usr/bin/env python3
"""
Download PNGs from a finished (or partially finished) Gemini Batch image job.

Pairs API response order with the same job list as generate_ecard_backgrounds.py:
  global_index = start_index + j  ->  jobs[global_index] -> category__slot.png

Examples:

  # Default job id (repo-specific batch you submitted):
  export GEMINI_API_KEY=...
  python3 scripts/fetch_gemini_batch_outputs.py --wait

  # Explicit job + assume full catalog from index 0:
  python3 scripts/fetch_gemini_batch_outputs.py \\
    --job batches/t8lptcy617qoo8xgc70svi06hxqvtqio4boy --start-index 0 --wait

  # Use last_batch_meta.json written when the batch was submitted:
  python3 scripts/fetch_gemini_batch_outputs.py --from-meta --wait

Progress:
  --update-progress writes public/ecard-bg/progress.json like the generator
  (same GEMINI_IMAGE_MODEL / ECARD_BG_ASPECT metadata defaults).

Transient 503 / rate limits:
  batches.get is retried with backoff (see GEMINI_BATCH_RETRY_* env vars below).

Requires: pip install google-genai

Env (optional):
  GEMINI_BATCH_GET_MAX_ATTEMPTS — default 0 = retry until success
  GEMINI_BATCH_RETRY_MIN_SECONDS — default 15
  GEMINI_BATCH_RETRY_MAX_SECONDS — default 180
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
_REPO_ROOT = _SCRIPT_DIR.parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from ecard_background_data import iter_jobs  # noqa: E402
from generate_ecard_backgrounds import (  # noqa: E402
    _aspect_from_env,
    _image_size_from_env,
    _terminal_batch_states,
    save_batch_inlined_to_disk,
)

# Replace when you submit a new batch; avoids typing the full resource name each time.
DEFAULT_BATCH_JOB = "batches/t8lptcy617qoo8xgc70svi06hxqvtqio4boy"


from google.genai import errors as genai_errors


def _should_retry_batches_get(exc: BaseException) -> bool:
    code = getattr(exc, "status_code", None)
    if code in (429, 500, 502, 503, 504):
        return True
    msg = str(exc).lower()
    if "503" in msg and ("unavailable" in msg or "unavailable." in msg):
        return True
    if "429" in msg or ("rate" in msg and "limit" in msg):
        return True
    if "500" in msg or "502" in msg or "504" in msg:
        return True
    return False


def batches_get_with_retry(client, job_name: str, *, context: str = "batches.get") -> object:
    """
    Retry transient Google API failures (503 UNAVAILABLE, 429, etc.).
    Env:
      GEMINI_BATCH_GET_MAX_ATTEMPTS — default 0 = unlimited retries
      GEMINI_BATCH_RETRY_MIN_SECONDS — first backoff (default 15)
      GEMINI_BATCH_RETRY_MAX_SECONDS — cap backoff (default 180)
    """
    min_wait = float(os.environ.get("GEMINI_BATCH_RETRY_MIN_SECONDS", "15"))
    max_wait = float(os.environ.get("GEMINI_BATCH_RETRY_MAX_SECONDS", "180"))
    max_attempts = int(os.environ.get("GEMINI_BATCH_GET_MAX_ATTEMPTS", "0"))

    delay = min_wait
    attempt = 0
    last_exc: BaseException | None = None
    while True:
        attempt += 1
        try:
            return client.batches.get(name=job_name)
        except genai_errors.ClientError as e:
            last_exc = e
            if not _should_retry_batches_get(e):
                raise
            if max_attempts and attempt >= max_attempts:
                print(f"{context}: gave up after {max_attempts} attempts ({e})", file=sys.stderr)
                raise
        except Exception as e:
            last_exc = e
            if not _should_retry_batches_get(e):
                raise
            if max_attempts and attempt >= max_attempts:
                print(f"{context}: gave up after {max_attempts} attempts ({e})", file=sys.stderr)
                raise

        wait = min(max_wait, delay)
        print(
            f"{context}: transient error, retry in {wait:.0f}s (attempt {attempt})…\n  {last_exc}",
            file=sys.stderr,
        )
        time.sleep(wait)
        delay = min(max_wait, delay * 1.35)


def normalize_job_name(raw: str) -> str:
    s = raw.strip()
    if not s:
        return s
    return s if s.startswith("batches/") else f"batches/{s}"


def main() -> None:
    parser = argparse.ArgumentParser(description="Download e-card batch images from Gemini Batch API.")
    parser.add_argument(
        "--job",
        default=os.environ.get("GEMINI_BATCH_JOB", DEFAULT_BATCH_JOB),
        help=f"Batch resource name (default: $GEMINI_BATCH_JOB or {DEFAULT_BATCH_JOB})",
    )
    parser.add_argument(
        "--from-meta",
        action="store_true",
        help="Read job_name, start_index, only_categories from ECARD_BG_OUT/last_batch_meta.json",
    )
    parser.add_argument(
        "--start-index",
        type=int,
        default=None,
        help="First global index in iter_jobs() this batch corresponds to (default: meta or 0)",
    )
    parser.add_argument(
        "--wait",
        "-w",
        action="store_true",
        help="Poll until the batch reaches a terminal state",
    )
    parser.add_argument(
        "--interval",
        type=float,
        default=float(os.environ.get("BATCH_POLL_SECONDS", "30")),
        help="Poll interval when --wait",
    )
    parser.add_argument(
        "--update-progress",
        action="store_true",
        help="Update public/ecard-bg/progress.json when saving (like generate_ecard_backgrounds.py)",
    )
    parser.add_argument(
        "--allow-nonterminal",
        action="store_true",
        help="Try to download even if job state is not succeeded/partial (if responses exist)",
    )
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Set GEMINI_API_KEY.", file=sys.stderr)
        sys.exit(1)

    out_root = Path(os.environ.get("ECARD_BG_OUT", str(_REPO_ROOT / "public" / "ecard-bg")))
    out_root.mkdir(parents=True, exist_ok=True)
    meta_path = out_root / "last_batch_meta.json"

    only_set: frozenset[str] | None = None
    raw_only = os.environ.get("ECARD_BG_ONLY", "").strip()
    if raw_only:
        only_set = frozenset(x.strip() for x in raw_only.split(",") if x.strip())

    job_name = normalize_job_name(args.job)
    start_index = args.start_index

    if args.from_meta:
        if not meta_path.is_file():
            print(f"--from-meta requires {meta_path}", file=sys.stderr)
            sys.exit(1)
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        job_name = normalize_job_name(meta["job_name"])
        start_index = int(meta["start_index"]) if args.start_index is None else args.start_index
        oc = meta.get("only_categories")
        if oc:
            only_set = frozenset(oc)

    if start_index is None:
        start_index = 0

    jobs = iter_jobs(only_categories=only_set)
    if not jobs:
        print("No jobs from catalog (check ECARD_BG_ONLY / meta only_categories).", file=sys.stderr)
        sys.exit(1)

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    terminal = _terminal_batch_states()

    while True:
        job = batches_get_with_retry(client, job_name)

        st = job.state
        print(f"state: {st}")
        if not args.wait or st is None or st in terminal:
            break
        print(f"Waiting {args.interval:.0f}s…")
        time.sleep(args.interval)

    ok_download_states = {
        types.JobState.JOB_STATE_SUCCEEDED,
        types.JobState.JOB_STATE_PARTIALLY_SUCCEEDED,
    }
    dest = getattr(job, "dest", None)
    inlined = getattr(dest, "inlined_responses", None) if dest else None

    if st not in ok_download_states and not args.allow_nonterminal:
        if not inlined:
            print(f"Job not ready or failed ({st}). Use --wait or --allow-nonterminal if responses exist.", file=sys.stderr)
            sys.exit(3)

    if not inlined:
        print("dest.inlined_responses missing or empty.", file=sys.stderr)
        sys.exit(4)

    n = len(inlined)
    if start_index + n > len(jobs):
        print(
            f"start_index={start_index} + {n} responses exceeds catalog ({len(jobs)} jobs). "
            "Fix --start-index or ECARD_BG_ONLY.",
            file=sys.stderr,
        )
        sys.exit(5)

    jobs_slice = jobs[start_index : start_index + n]

    model = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3.1-flash-image-preview")
    image_size = _image_size_from_env()
    aspect_ratio = _aspect_from_env()

    state_path = out_root / "progress.json"
    state: dict | None = None
    if args.update_progress:
        if state_path.exists():
            state = json.loads(state_path.read_text(encoding="utf-8"))
        else:
            state = {"next_index": 0, "model": model, "mode": "batch"}

    saved, failures = save_batch_inlined_to_disk(
        dest,
        jobs_slice,
        start_index,
        out_root,
        state,
        state_path if args.update_progress else None,
        model=model,
        image_size=image_size,
        aspect_ratio=aspect_ratio,
    )
    print(f"Finished: {saved} saved, {failures} failures → {out_root}")


if __name__ == "__main__":
    main()
