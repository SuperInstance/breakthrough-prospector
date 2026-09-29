# E6 First Vertical Slice — GEPA-class harness optimizer (answer-wire abstraction)

Slice: `e6-slice-1` · Claims: **C02** (harness-over-weights) + **C09** (GEPA-class
reflective editing) · Queue row E6 (#2, B 64, F 4, M10 recipe folded) ·
Machine pin: `registration.json` · Runner: `e6_slice1.mjs` · Arms: `arms.json`

This is NOT a full E6 build. It is one honest, sealed, end-to-end vertical
slice: pre-registration → executed measurement → verdict, over a REAL target,
with the fleet's wire constraint respected (the LLM channel is an ANSWER wire:
noul estimates + one choice, never freeform generation).

## PIN (written 2026-09-29T17:24:44Z, before run)

- **Claim under test**: C02+C09 — a deterministic machine-proposed mutation
  space over a real harness artifact, ranked by receipted reflective LLM
  priors (answer wire), drawn by certified QRNG (anti-cherry-pick), gated by
  MEASURED survival, with the M10 cost rule (added priors/selection spend must
  be paid for by measured gain) as selection pressure.
- **Target (fixed)**: the lode engine's scout→extract KEYS keyword lens
  (`fleet-seeds/lode/engine/engine_run.mjs`, 14 entries, sha
  `098fe0f3…`). Chosen by measurability: its output is deterministically
  re-measurable OFFLINE against the engine's own committed receipt corpora.
- **Mutation space (frozen)**: 8 single-keyword substitutions
  (`arms.json`, sha `23eec18d…`) — 4 lowest-attestation slots × 8 catalog
  heading terms (awesome-rsi leaf headings, cited per term). No previously
  refuted mutations exist (first slice) — the M10 mutation-history ledger
  starts empty, receipted.
- **Confirming result**: at least one MEASURED bundle arm beats the pinned
  baseline on the pre-registered metric with the pre-registered margin and no
  fresh-count collapse → PASS, one arm's KEYS promoted as a PROPOSAL artifact.
- **Refuting result**: no measured bundle arm meets the gate → FAIL sealed
  verbatim, no threshold surgery; cost rule settles NOT_PAID.
- **Boring result**: instrumentation fails its validity gate →
  INVALID-INSTRUMENTATION honest partial (nothing measured, nothing promoted);
  or all arms metric-inert → FAIL with `mutation_space_inert: true`.
- **Metric + gate**: `M(K) = (1/3) Σ_c [μ_c(K) + f_c(K)]` over the three
  committed corpora (run-5 scout, run-6 scout, awesome-rsi catalog), where
  μ_c = mean key_score of candidates surviving the engine's extract pipeline
  + history conditioning (0 if none) and f_c = surviving (fresh) count.
  Baseline pinned: **M = 7.0740740740740735, totalF = 15** (receipted in
  `receipts/baseline.json`, committed pre-registration). PASS iff a measured
  bundle arm has M ≥ 1.05 × baseline (= 7.427777777777777) AND
  totalF ≥ 15.
- **Budget**: 1 typesafe battery call (≤ 4 cap), 1 certified mothquantum seal
  (≤ 2 cap), $0 other external, every call usage-receipted. Each foreground
  stage < 5 min. Abort line: external channel failure → fail-closed honest
  partial, receipted.

## Instrumentation validity gate (runs before any arm is trusted)

The offline replay must reproduce the engine's own COMMITTED receipts:
run-6 candidates byte-exact; run-5 candidates minus exactly the two receipted
post-fixer consequences (M3 collision arXiv 2609.26457; M11 URL-form match
arXiv 2609.34924); derived history states equal to the committed
`history.json` lists. The gate PASSED pre-registration
(`receipts/baseline.json`, `validity.ok = true`) — the replay is proven
faithful to the engine before anything else runs.

## Decision procedure (pre-registered order)

1. `baseline` stage (done, pre-registration): validity gates + baseline pin +
   per-key attestation. No arms defined yet. No external spend.
2. Registration commit PUSHED (this file + registration.json + arms.json +
   runner). **This push is the seal** (repo `tools/` has no seal tool — only
   `score.py`).
3. `priors` stage: ONE typesafe systemone battery — 8 × noul `p_gain_Ai` +
   1 choice `first_measure` over the frozen arms. Receipted (tokens in/out).
4. `draw` stage: ONE certified comet-qrng-v1 Fisher-Yates draw over the 8
   frozen arms → the BINDING LEAD. The priors never choose what gets measured.
5. `decide` stage: bundle = lead + top-2 noul fills (B = max(1,
   ceil(3·0.7^0)) = 3 — the M4/M10 budget cap IS the selection pressure: the
   other 5 arms are never measured, never peeked). Baseline + bundle arms
   measured deterministically over the 3 corpora. Verdict per the gate.
6. `determinism` receipt: decide re-derived, compared modulo timestamp.

The promoted KEYS (if PASS) is a PROPOSAL artifact in this repo — this slice
never edits fleet-seeds (compose-don't-clobber); adoption is the lode keeper's
act with its own receipt chain.

## Cost rule (M10, explicit settlement)

Added spend = the 1 battery call + 1 QRNG seal. It is **PAID** iff the verdict
is PASS; on FAIL/honest-partial the receipt records **NOT_PAID** — an honest
negative is a finding, not a gain.
