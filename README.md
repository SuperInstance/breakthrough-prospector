# breakthrough-prospector

A system for finding breakthroughs. Not a pile of links — a pipeline that turns
frontier scouting into **pre-registered, receipt-backed experiments** on the
SuperInstance fleet.

> Doctrine (inherited): honest negatives, collapse receipts, 3-root replication,
> pre-run interpretation pins (anti-laundering), never overclaim the ladder.

## Why this repo exists

Breakthroughs are rarely found by staring harder at what we're building. They come
from **crossing abstractions**: noticing that system A's mechanism, transplanted into
repo B's harness, does something nobody in A or B anticipated. That crossing has to
be systematic or it happens by luck at 3am.

So: scouts mine papers/repos/trending systems → distill **abstraction cards** →
score → the top claims become pre-registered experiments → experiments produce
receipts → receipts update the abstraction cards. The loop runs continuously.

## Pipeline

```
SCOUT ──► CARD ──► SCORE ──► PRE-REGISTER ──► RUN ──► RECEIPT ──► LADDER-CLAIM
  │           │         │            │            │           │            │
sources/  abstractions/ scoring.md  protocols/  (fleet      ledgers/    honest L0–L3
scout-log registry     tools/score  experiment-  repos)      per fleet   position per
.md       .md          .py          protocol.md              convention  system
```

1. **SCOUT** — per `protocols/scout-protocol.md`. Claims carry citations + honesty
   tags (VERIFIED = we reproduced or the source shows evidence; REPORTED = claimed
   by source; UNVERIFIED = hearsay).
2. **CARD** — every claim that survives dedup becomes an abstraction card in
   `abstractions/registry.md`: statement, instances (cited), what it explains,
   our-fleet instance, the gap, the experiment hook.
3. **SCORE** — `B = V × F × S` (value × feasibility × surprise, each 1–5; see
   `scoring.md`). Candidate gate: `B ≥ 40 AND F ≥ 3 AND ≥1 VERIFIED citation`.
4. **PRE-REGISTER** — the interpretation is written down *before* the run: what
   result would confirm, what would refute, what would be boring. No pin, no run.
5. **RUN** — in the owning fleet repo, on a lane branch. One-evening builds preferred;
   a week is the cap before a checkpoint receipt.
6. **RECEIPT** — collapse receipt with roots, seed, and the pre-registration hash.
   Honest negative? File it in the owning repo's FINDINGS.md and say so.
7. **LADDER-CLAIM** — state the RSI position honestly (see card C12): most of our
   systems are L0; anything claiming L1 needs a held-out gate saying so.

## What lives where

| Path | Contents |
|---|---|
| `abstractions/registry.md` | The distillation: numbered abstraction cards |
| `sources/scout-log.md` | Raw scout claims with citations + honesty tags |
| `DELTAS.md` | Account-wide self-improvement deltas (Weco lessons applied per repo) |
| `protocols/scout-protocol.md` | How a scout files claims |
| `protocols/experiment-protocol.md` | Pre-registration + receipt rules |
| `scoring.md` | The B = V × F × S rubric |
| `tools/score.py` | Computes scores from the registry's experiment table |
| `queue/snowball.md` | How scored claims enter the account snowball queue |

## The one rule

A card without a cited instance is speculation. An experiment without a
pre-registered interpretation is laundering. A ladder claim without a held-out
gate is marketing.
