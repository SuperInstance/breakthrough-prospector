# E6 Slice-1 Verdict — HONEST-PARTIAL (qrng-channel-degraded)

Slice: `e6-slice-1` · Claims: C02 + C09 · Queue row E6 (#2, B 64)
Registration of record: `registration.json` sha256
`a2bade5dd1b242696f51f298a175e02c421a0e996774b4145ad7553253778ff7`
(sealed pre-run: commits `e756f09` → `f3ad79e` → `bdc8c04`, all pushed BEFORE
any arm measurement; lineage receipted below)

## Verdict

**HONEST-PARTIAL — the certified anti-cherry-pick lead was never drawn.**
Per the registered abort line ("external channel failure → fail-closed honest
partial receipted"), the decision procedure did not execute: **no bundle, no
arms measured, no promotion, NO PASS/FAIL claim on the mutation space.** All
8 arms stay frozen-unmeasured (`A1…A8`, sha `23eec18d…`). No threshold
surgery, no substitute selection rule invented post-hoc.

## What the slice DID establish (all receipted)

1. **The replay instrumentation is proven faithful** (`receipts/baseline.json`,
   `validity.ok = true`): the offline deterministic replay of the lode
   engine's scout→extract pipeline reproduces the engine's own COMMITTED
   receipts — run-6 `candidates.json` **byte-exact** (history state and
   exclusions included), and run-5 `candidates.json` **exactly minus the two
   receipted post-fixer consequences** (M3 collision card arXiv 2609.26457;
   M11 URL-form match arXiv 2609.34924), with derived previously-drawn lists
   equal to the committed `history.json` lists. The engine's discovery lens is
   now offline-replayable bit-exactly — reusable by any future E6/E8 lane
   without touching the engine.
2. **Baseline pinned** under the pre-registered metric:
   M = **7.0740740740740735**, totalF = **15**
   (per-corpus: run5-scout μ=2.0/f=3 · run6-scout μ=2.0/f=3 ·
   awesome-rsi-catalog μ=2.2222/f=9). The decide stage re-derived it
   bit-exactly (`baseline_pin_ok: true`).
3. **Reflective priors receipted** (answer wire, ONE typesafe call, model
   jev-1.13.0, **2808 in / 235 out**, latency 332 ms): noul p_gain per arm
   A1 0.14 · A2 0.11 · A3 0.18 · A4 0.18 · A5 0.18 · A6 0.17 · A7 0.16 ·
   A8 0.12; choice first_measure = **A1**. Receipted in `priors.json` +
   `usage.jsonl`. NOT used to select anything (the lead was never drawn) —
   the priors answered into a sealed ledger, exactly as the wire law requires.
4. **Channel degradation found and receipted** (`qrng-attempts.jsonl`,
   `witness.json`): comet-qrng-v1 completed job #1 (direct) with 40 certified
   bits — below the 112 required for a pool-8 Fisher-Yates (fail-closed, no
   receipt issued); completed job #2 (prf extension) with an INCOMPLETE
   certification payload (missing entropy_report.budget_bits / random.hex —
   fail-closed). Two jobs consumed, **zero certified seals issued**; the
   ≤2-job cap set in the pushed pre-draw repair (`bdc8c04`) is consumed —
   this lane stops here by its own pushed accounting.

## Cost rule settlement (M10, arXiv:2609.24972)

Added spend: 1 typesafe battery call + 2 mothquantum jobs (0 seals).
Settlement: **NOT_PAID** — no measured gain was produced. What the spend
bought instead (receipted): a proven-faithful replay instrumentation, a
sealed reflective-priors battery, and a channel-degradation finding. An
honest negative is a finding, not a gain.

## Repairs of record (all pre-decision except #3; zero measurement ever preceded a repair)

- `e756f09` registration sealed pre-run (no arms measured, no external spend).
- `f3ad79e` **schema repair** (pre-run): runner-facing pins moved to top level
  after the priors stage fail-closed on misplaced keys. All VALUES
  byte-identical (arms sha, baseline, margin, caps).
- `bdc8c04` **pre-draw repair**: runner gains `E6_SEAL_STREAM` passthrough +
  append-only attempts ledger after the direct draw fail-closed on the bit
  budget; draw proceeds on moth-seal's registered `--stream=prf` extension;
  `runner_sha256` updated. Values byte-identical.
- Post-draw, **repair #3** (this results commit): the decide stage WRITES the
  registered abort-line receipt (HONEST-PARTIAL) instead of throwing bare,
  and the determinism comparator strips the `check` mode flag alongside the
  timestamp (fleet convention: byte-identical modulo run-mode markers).
  Decision values untouched — the `d32f4f4e…` → `199a020d…` runner delta is
  additions in the fail-closed branch + the comparator line only
  (`git diff bdc8c04` receipted in the results commit). **Correction
  receipted:** an earlier draft of this verdict cited `c7768b8b…` — a stale
  hash of an intermediate runner draft; the runner of record (the file that
  produced `decide.json`/`decide-check.json`, re-executed byte-identical
  modulo ts/check by this lane's fresh `decide --check` + `determinism` runs)
  hashes `199a020d2f665d643ca43648853be7687b5d76f5fd997ef480e489a872457e68`.

## Determinism

`decide` and `decide --check` re-derived the full state independently:
**byte-identical modulo ts/check** (`receipts/determinism.json`, sha
`6a2074d0…` both sides).

## Next probe (named per the receipt rules)

Fresh registration on a RECOVERED comet-qrng-v1 channel (this slice's cap is
consumed): same frozen arms (`arms.json`, sha `23eec18d…`), same pinned
baseline (7.0740740740740735 / 15), same metric and margins — re-seal, draw
the lead, measure the B=3 bundle, settle the cost rule. The priors battery of
record stays sealed here; whether a fresh battery is re-spent is the next
registration's choice (receipted either way).
