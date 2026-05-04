#!/usr/bin/env python3
"""
Glue module for e-card background generation.

Independent prompts live in ecard_prompt_catalog.py — exactly five full image briefs
per occasion (225 jobs total); GUARDRAILS below prepend each brief.

Prompt design notes:
- Elder-friendly Indian family audience: warm dignity, readable motifs.
- Sacred figures when fitting: stylized / traditional — never photorealistic sacred imagery.
- Anti-"AI slop": forbid neon cyber-HDR, random unrelated props, watermark text.
"""

from __future__ import annotations

from ecard_prompt_catalog import PROMPTS_BY_CATEGORY

# Must match app/ecard/_data/types.ts CardCategoryId union (45 ids).
ORDERED_CATEGORY_IDS: tuple[str, ...] = (
    "akshaya-tritiya",
    "anniversary",
    "baisakhi",
    "bhai-dooj",
    "birthday",
    "chhath-puja",
    "christmas",
    "congrats",
    "dhanteras",
    "diwali",
    "dussehra",
    "easter",
    "fathers-day",
    "ganesh-chaturthi",
    "get-well",
    "good-luck",
    "gudi-padwa",
    "gujarati-new-year",
    "guru-nanak-jayanti",
    "hanuman-jayanti",
    "halloween",
    "holi",
    "independence-day",
    "janmashtami",
    "just-because",
    "karva-chauth",
    "lohri",
    "mahashivratri",
    "makar-sankranti",
    "miss-you",
    "mothers-day",
    "navratri",
    "new-year",
    "onam",
    "pongal",
    "raksha-bandhan",
    "ram-navami",
    "rath-yatra",
    "sympathy",
    "thank-you",
    "thanksgiving",
    "thinking-of-you",
    "valentines",
    "vasant-panchami",
    "welcome",
)


GUARDRAILS = """\
Hard constraints (follow all):
- Hindu deities and avatars, prophets, Gurus, and other holy figures MAY appear when appropriate for the occasion — always dignified and reverent, never mocking or cartoonishly irreverent.
- Sacred figures must NEVER look photorealistic or hyperreal: no glossy skin pores, no HDR statue photography, no cinematic celebrity-style portrait lighting. Render them in clearly stylized idioms — e.g. Indian miniature painting, soft devotional calendar-art / lithograph warmth, elegant watercolor, or gentle rounded illustration — calm jewelry and halos optional if traditional.
- Ordinary people (if shown): keep small or distant, stylized silhouettes or simplified forms — not documentary-style realistic faces as the focus.
- Temples, chariots, and murtis are fine as stylized architecture or traditional idol illustration; avoid tacky neon rims or nightclub glow around deities.
- Suitable for Indian elders and family WhatsApp: warm, sincere, respectful — never ironic, sexualized, violent gore, or nightclub-neon.
- Leave a calm, fairly open middle area (about 40–50% of frame) with softer detail so greeting text can be placed later.
- No text, logos, watermarks, or UI in the image.
- Avoid glossy AI clichés: no random floating unrelated objects, no cyberpunk gradients, no exaggerated HDR sheen, no harsh synthetic bloom.
"""


# Stable slot ids for filenames / progress (five distinct prompts per category).
PROMPT_SLOT_KEYS: tuple[str, ...] = ("01", "02", "03", "04", "05")


def build_prompt(category_id: str, slot_key: str) -> str:
    if category_id not in PROMPTS_BY_CATEGORY:
        raise KeyError(f"Missing prompts for category_id={category_id!r}")
    if slot_key not in PROMPT_SLOT_KEYS:
        raise KeyError(f"Unknown slot_key={slot_key!r} (expected one of {PROMPT_SLOT_KEYS})")
    idx = PROMPT_SLOT_KEYS.index(slot_key)
    body = PROMPTS_BY_CATEGORY[category_id][idx]
    return f"{GUARDRAILS}\n\nImage brief:\n{body}"


def iter_jobs(
    *,
    only_categories: frozenset[str] | None = None,
) -> list[tuple[str, str]]:
    """Flat list of (category_id, slot_key) in stable order — 225 jobs when unfiltered."""
    jobs: list[tuple[str, str]] = []
    for cid in ORDERED_CATEGORY_IDS:
        if only_categories is not None and cid not in only_categories:
            continue
        for sk in PROMPT_SLOT_KEYS:
            jobs.append((cid, sk))
    return jobs


def validate_catalog() -> None:
    missing = [c for c in ORDERED_CATEGORY_IDS if c not in PROMPTS_BY_CATEGORY]
    extra = [c for c in PROMPTS_BY_CATEGORY if c not in ORDERED_CATEGORY_IDS]
    if missing:
        raise RuntimeError(f"PROMPTS_BY_CATEGORY missing keys: {missing}")
    if extra:
        raise RuntimeError(f"PROMPTS_BY_CATEGORY unknown keys vs ORDERED_CATEGORY_IDS: {extra}")
    for cid in ORDERED_CATEGORY_IDS:
        tup = PROMPTS_BY_CATEGORY[cid]
        if len(tup) != len(PROMPT_SLOT_KEYS):
            raise RuntimeError(f"{cid!r}: expected {len(PROMPT_SLOT_KEYS)} prompts, got {len(tup)}")


validate_catalog()
