#!/usr/bin/env python3
"""
Look up a Gemini Batch API job by resource name (no polling loop unless --watch).

  export GEMINI_API_KEY=...
  python3 scripts/check_gemini_batch.py batches/t8lptcy617qoo8xgc70svi06hxqvtqio4boy

You can omit the batches/ prefix; bare IDs are normalized automatically.

Watch until finished (same cadence as generate_ecard_backgrounds.py default):

  python3 scripts/check_gemini_batch.py batches/t8lptcy617qoo8xgc70svi06hxqvtqio4boy --watch

Requires: pip install google-genai
"""

from __future__ import annotations

import argparse
import os
import sys
import time
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from fetch_gemini_batch_outputs import batches_get_with_retry  # noqa: E402


def normalize_job_name(raw: str) -> str:
    s = raw.strip()
    if not s:
        return s
    if s.startswith("batches/"):
        return s
    return f"batches/{s}"


def terminal_states():
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


def describe_job(job) -> None:
    """Print useful fields; tolerate SDK shape drift."""
    print(f"name:     {getattr(job, 'name', '')}")
    print(f"state:    {getattr(job, 'state', '')}")

    for attr in ("display_name", "model", "create_time", "update_time", "expire_time"):
        if hasattr(job, attr):
            v = getattr(job, attr)
            if v is not None:
                print(f"{attr}: {v}")

    err = getattr(job, "error", None)
    if err is not None:
        print(f"error:    {err}")

    dest = getattr(job, "dest", None)
    if dest is None:
        print("dest:     (none yet)")
        return

    inlined = getattr(dest, "inlined_responses", None)
    if inlined is None:
        print("dest:     present (no inlined_responses field)")
        return

    n = len(inlined)
    print(f"dest.inlined_responses: {n} responses")

    err_count = sum(1 for x in inlined if getattr(x, "error", None))
    empty_resp = sum(1 for x in inlined if getattr(x, "response", None) is None)
    if n:
        print(f"  with inline.error set: {err_count}")
        print(f"  with empty response:   {empty_resp}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Check Gemini batch job status.")
    parser.add_argument(
        "job",
        nargs="?",
        default=os.environ.get("GEMINI_BATCH_JOB", ""),
        help="Job resource id, e.g. batches/abc123 (default: $GEMINI_BATCH_JOB)",
    )
    parser.add_argument(
        "-w",
        "--watch",
        action="store_true",
        help="Poll until job reaches a terminal state",
    )
    parser.add_argument(
        "--interval",
        type=float,
        default=float(os.environ.get("BATCH_POLL_SECONDS", "30")),
        help="Seconds between polls when --watch (default: BATCH_POLL_SECONDS or 30)",
    )
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Set GEMINI_API_KEY in the environment.", file=sys.stderr)
        sys.exit(1)

    name = normalize_job_name(args.job)
    if not name:
        parser.error("Pass job id as argument or set GEMINI_BATCH_JOB")

    from google import genai

    client = genai.Client(api_key=api_key)
    terminal = terminal_states()

    while True:
        job = batches_get_with_retry(client, name, context="check_gemini_batch")

        describe_job(job)
        st = getattr(job, "state", None)

        if not args.watch:
            break
        if st is not None and st in terminal:
            print("Terminal state reached.")
            break

        print(f"---\nNot finished yet. Sleeping {args.interval:.0f}s…\n")
        time.sleep(args.interval)


if __name__ == "__main__":
    main()
