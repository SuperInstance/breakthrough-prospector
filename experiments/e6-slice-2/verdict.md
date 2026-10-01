# E6 Second Vertical Slice — VERDICT

Slice: `e6-slice-2` · Registration: `registration.json` + `registration.md`
(sealed pre-draw at commit `e3f003f`, pushed BEFORE any external call) ·
Runner: `e6_slice2.mjs` (of record after repair #2: sha256
`037e7a7d41936044d131697198313cba5ab6886b0960d5b9b04a154cb43e618d`) ·
Lane: 63-d-r (resume of 63-d, which died mid-setup, pre-commit/pre-push/pre-draw)

## Verdict of record

**FAIL — `mutation_space_inert: true`, cost rule NOT_PAID.**
Sealed → drew (channel RECOVERED, first attempt) → measured the full B=3
bundle → **no bundle arm meets the registered gate** (M ≥ 1.05 × baseline
= 7.427777777777777 AND totalF ≥ 15). No threshold surgery, no post-hoc
metric revision; the 5 frozen-unmeasured arms stay frozen and never peeked.
An honest negative is a finding, not a gain.

Verbatim numbers (deterministic local replay, decide --check byte-identical
modulo timestamp, determinism receipt TRUE):

| arm | role | substitution | M | totalF | ΔM rel. | gate |
|-----|------|--------------|---|--------|---------|------|
| baseline (pin) | — | — | **7.0740740740740735** | **15** | 0 | — |
| A3 | noul-fill | `reward-hacking` → `self-play` | 7.0740740740740735 | 15 | +0.0000% | ✗ |
| A4 | noul-fill | `reward-hacking` → `self-taught` | 7.111111111111112 | 15 | +0.5236% | ✗ |
| A5 | **qrng-lead** | `reward hacking` → `prompt` | **7.148148148148148** | 15 | +1.0471% | ✗ |

Gate threshold of record: M ≥ **7.427777777777777** (= 1.05 × 7.0740740740740735)
AND totalF ≥ **15**. Every measured arm kept totalF exactly 15 (per-corpus
fresh counts 3/3/9, identical to baseline) — precision was not traded for
recall anywhere; nothing passed on the margin condition either. Best arm is
the certified QRNG lead itself (A5): the gain is real but tiny and
corpus-localized (awesome-rsi-catalog μ 2.2222222222222223 → 2.4444444444444446,
pool 33 → 37; both scout corpora byte-unmoved at μ=2, f=3).

## What was sealed (pre-draw, commit e3f003f — the seal of record)

- SAME frozen arms as slice-1: `arms.json` byte-identical copy, canon sha
  recomputed `23eec18d31cd6b8f258fb060732c6e88d7fdbac890879632787e03318ee748b4`
  = slice-1's registered pin. No re-freeze, no new arms.
- SAME pinned baseline: **M = 7.0740740740740735, totalF = 15** (slice-1
  receipt `52c9f8fb…` carried as pin of record; re-derived bit-exact in every
  stage, including under the M12-appended live ledger).
- SAME metric/margins: PASS iff arm M ≥ 1.05 × baseline AND totalF ≥ 15;
  0.05 relative margin chosen a priori in slice-1, unchanged.
- Bundle B = max(1, ceil(3 · 0.7^1)) = **3** (honest anneal accounting: t=1).
- Cap law registered in **JOBS, not seals** (wave-62 lesson): `moth_jobs_max`
  = 3, pre-registered ladder direct → prf → prf, first certified seal binds.
- Priors: REUSE of slice-1's sealed reflective battery (`priors.json`
  `9969fa3f…`, jev-1.13.0, 2808 in / 235 out), binding-asserted on the arms
  sha — **0 typesafe calls this slice** (registered choice, reasoning
  receipted in `registration.json → priors_source`).
- Channel-health precondition: the wave-63 keeper probe receipt
  (`06884e96-1960-44f5-a7a4-3c59f24ad003`, HEALTHY, CHSH S=2.8193359375 > 2,
  Toeplitz, 1136 bits) re-verified fail-closed by the draw stage before any
  job submission — the exact fields whose absence killed slice-1's job #2.
- LEDGER-EVENT AMENDMENT (registered): fleet-seeds `2bc52a5` appended M12
  (gauge before game) to `mines.jsonl` after slice-1 sealed; the run-6 gate
  now proves the committed M1-M11 marker sequence is an append-only PREFIX of
  the live M1-M12 ledger (appended ids receipted) plus byte-exact replay
  fidelity — strictly stronger than the superseded count-equality.

## The draw (channel RECOVERED — first attempt landed)

- Attempt 1 of ≤3, stream **direct** (no prf extension needed): comet-qrng-v1
  job **`d5a55554-311e-4607-a5b1-79aedf8e8cb9`**, completed, 4 polls, mode
  emu/12 qubits/4096 shots/512 output bytes requested.
- Certified: **150 bytes / 1200 bits delivered**, hBit 0.907002318721403,
  effectiveEntropyBits **112** = consumedBits = requiredBits
  (`streamKind: certified-direct`; the exact bit-budget that fail-closed
  slice-1's job #1 at 40 < 112).
- Drew **index 4 → arm A5** — the BINDING LEAD. Fisher-Yates over the frozen
  8-arm list; the priors never chose what got measured (anti-cherry-pick
  held; the lead also happened to be a top-noul arm, which is receipted in
  the descriptive annex only).
- Cap accounting of record: **1 moth job consumed, 1 certified seal issued**
  (cap 3) — 1 attempt, no retries, no re-draw. Append-only ledger:
  `receipts/qrng-attempts.jsonl` (+ `usage.jsonl`); certified receipt:
  `receipts/qrng-seal.json` (+ redacted raw `qrng-seal-raw.json`,
  rawResultSha256 `a9e8326d…`); witness: `receipts/witness.json`.

## THE GATE DEFECT — post-draw repair #2 (receipted; measurement unchanged)

The first `decide` run returned **PASS** — and that PASS was **FALSE**. The
pass-gate line inherited verbatim from slice-1's runner computed
`m.M >= reg.pass_margin_relative * reg.baseline_M` — a **0.05× threshold**
(missing the "1 + "), i.e. M ≥ 0.3537 instead of the registered M ≥ 1.05 ×
baseline = 7.427777777777777. Any arm at ≈baseline trivially "passed". It
fired on this very run: verdict PASS, promotion of A5
(`reward hacking` → `prompt`), cost rule PAID.

Handling (no threshold surgery — the repair restores EXACTLY the registered
threshold):

- The defective receipt is preserved verbatim:
  `receipts/decide.buggy-gate-draft.json`
  (sha256 `c224c6e41b06e2bc1c5d83431db20a8d9dc5b381c1e21bb8061f1a94346930a9`)
  — never deleted, marked VOID of record in the repaired receipt's
  `repair_receipt` field.
- The runner was repaired to implement the sealed registration's gate exactly
  (`(1 + pass_margin_relative) × baseline_M`), plus the registered boring
  branch's `mutation_space_inert` flag, plus a printed gate line for
  auditability. Runner of record after repair:
  `037e7a7d41936044d131697198313cba5ab6886b0960d5b9b04a154cb43e618d`.
- **Measurement invariance proven**: per-arm M/totalF tables and the baseline
  block are IDENTICAL between the voided and repaired receipts (per-arm
  values are deterministic functions of corpus × KEYS × history). The repair
  changed only the verdict application — the registered gate applied to
  unchanged measurements.
- Cross-lane note: the same defective line exists in slice-1's
  `e6_slice1.mjs` (never exercised there — slice-1 fail-closed
  HONEST-PARTIAL before any measurement). Slice-1's seal is unaffected; any
  future slice copying that line must use this repair.
- Direction-of-error note for the record: the bug inflated the verdict
  (false PASS / false PAID); repairing it moved the verdict AGAINST
  promotion. The discipline binds to the sealed registration, not to the
  instrumentation's readout — same law as the wave-62 marker-channel catch.

## Cost rule (M10, explicit settlement)

Added spend this slice: **0 typesafe calls** (priors of record reused —
registered choice) + **1 mothquantum comet job** (certified, attempt 1 of the
registered ladder) + $0 other external. Settlement: **NOT_PAID** — the
verdict is FAIL (`mutation_space_inert`), so the added spend bought an honest
negative and a channel-recovery demonstration, not measured gain. Record:
`receipts/decide.json → cost_rule.paid = "NOT_PAID"`.

## Failure mode (named per the registered fail branch)

`failure_mode: mutation_space_inert` — single-keyword substitutions into the
lode engine's scout→extract KEYS lens move the composite M by at most
**+1.05% relative** (the certified lead, A5), against a pre-registered
**5% margin**, with **zero** fresh-count movement (totalF 15 = 15 everywhere;
per-corpus survivor counts 3/3/9 identical to baseline). The lens is
saturated with respect to the frozen single-keyword edit space: the dead
slots (`outer loop`, `reward hacking`, `reward-hacking`, `playbook` family)
are low-attestation but their replacements attest only marginally on the
committed corpora. Consistency note (non-binding, n=3, one slice): this is a
data point CONSISTENT with M12's falsifiable law ("first-campaign
self-improvement gains concentrate in measurement/transport repair, not
strategy" — its E6 consequence: decompose the campaign edit-by-edit,
REFUTED if majority strategy-class): the measured strategy-class vocabulary
edits are metric-inert here.

## What this verdict does NOT claim

- No claim about the 5 frozen-unmeasured arms (A1, A2, A6, A7, A8) — never
  measured, never peeked; they stay frozen.
- No claim that the KEYS lens cannot be improved — only that THIS frozen
  8-arm single-keyword space is inert at the 5% margin on the committed
  corpora.
- No promotion: no KEYS variant is proposed to the lode keeper
  (`promoted: null`); the voided A5 promotion in the preserved defective
  receipt is VOID, not withdrawn-after-adoption (nothing was ever adopted).
- No claim about the certified channel's long-term health beyond this
  attempt (one clean job; the channel was HEALTHY at probe time and at draw
  time).
- No claim about priors' predictive validity (noul values were tied at the
  top; the descriptive annex is n=3 and non-binding).

## Spend (all receipted)

- mothquantum: **1 job / 1 certified seal** (of ≤3 registered JOBS; ladder
  attempt 1, stream direct) — `qrng-attempts.jsonl`, `usage.jsonl`.
- typesafe: **0 calls** (priors reused from slice-1's sealed battery —
  registered choice, binding-asserted).
- Other external: **$0**. Foreground stages all ≪ 5 min; the measurement is
  deterministic local replay.

## Files of record (this slice)

`registration.json` + `registration.md` (sealed pre-draw, e3f003f) ·
`arms.json` (byte-identical to slice-1, canon sha 23eec18d…) ·
`e6_slice2.mjs` (runner of record post-repair-#2, 037e7a7d…) ·
`receipts/`: `baseline.json` (validity OK, pin match),
`baseline.pre-amendment-draft.json` (preserved stale draft, receipted),
`channel-health-probe-w63.json` + `.provenance.md`, `health-gate.json`,
`qrng-seal.json` + `qrng-seal-raw.json`, `witness.json`,
`qrng-attempts.jsonl`, `usage.jsonl`, `decide.json` (verdict of record),
`decide.buggy-gate-draft.json` (VOID false PASS, preserved verbatim),
`decide-check.json`, `determinism.json` (TRUE, modulo ts).

## Next probe (named per the receipt rules)

The registered single-keyword space is exhausted (inert at the registered
margin, two slices of honest negatives). E6 stays OPEN only if its edit space
changes class — the honest next registration is a **richer mutation space**
(multi-term edits, deletions/insertions, phrase-level rewrites of the lens)
or a different measurable target, with the anneal clock honestly advanced
(t = 2 → B = max(1, ceil(3 · 0.7²)) = ceil(1.47) = **2**), the moth cap again
registered in JOBS, the gate line copied from THIS runner's repaired form
(never from slice-1's), and the priors-reuse question re-registered afresh
(a richer space is NOT bit-identical to slice-1's domain, so the zero-marginal-
information argument for REUSE no longer holds — a fresh battery would be the
default there, receipted either way). Whether E6 keeps queue position #2,
retires, or reshapes is the keeper's call; this lane recommends the reshape.
Register the channel-health probe as a precondition again (it worked: the
recovered channel landed first-try).
