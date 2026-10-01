# E6 Second Vertical Slice — re-registration on the RECOVERED channel

Slice: `e6-slice-2` · Claims: **C02** (harness-over-weights) + **C09** (GEPA-class
reflective editing) · Queue row E6 (#2, B 64, F 4, M10 recipe folded) ·
Machine pin: `registration.json` · Runner: `e6_slice2.mjs` · Arms: `arms.json`
(byte-identical copy of slice-1's)

Slice-1 sealed HONEST-PARTIAL (qrng-channel-degraded): everything was sealed
except the draw — 2 comet jobs consumed, 0 certified seals, 8 arms
frozen-unmeasured, cost rule NOT_PAID, no claims. Its verdict registered this
next probe. This slice executes exactly that probe: **same frozen arms, same
pinned baseline, same metric/margins — re-seal, draw the lead, measure the
B=3 bundle, settle the cost rule.**

## PIN (written before the draw)

- **Claim under test**: unchanged from slice-1 — C02+C09: a deterministic
  machine-proposed mutation space over a real harness artifact, ranked by
  receipted reflective LLM priors (answer wire), drawn by certified QRNG
  (anti-cherry-pick), gated by MEASURED survival, with the M10 cost rule as
  selection pressure.
- **Target (fixed)**: the lode engine's scout→extract KEYS keyword lens
  (`fleet-seeds/lode/engine/engine_run.mjs`, 14 entries, sha `098fe0f3…`).
- **Mutation space (frozen, carried)**: the same 8 single-keyword substitutions
  (`arms.json`, canon sha `23eec18d…` — recomputed at registration time and
  EQUAL to slice-1's pin; no re-freeze, no new arms).
- **Channel-health precondition (registered)**: the wave-63 probe receipt
  (`receipts/channel-health-probe-w63.json`, probe job
  `06884e96-1960-44f5-a7a4-3c59f24ad003`, provenance note alongside): the draw
  stage re-verifies health_passed / budget_bits / h_bit / CHSH S > classical
  bound / toeplitz extractor / random.hex — the exact fields whose absence
  killed slice-1's job #2 — fail-closed before submitting any job.
- **Cap law (registered in JOBS)**: `moth_jobs_max = 3` — the wave-62 lesson
  (slice-1 consumed 2 jobs and issued ZERO seals; seals-issued accounting
  under-counts degradation). Draw ladder registered pre-draw: direct → prf →
  prf; stop at the FIRST CERTIFIED SEAL (it binds; no re-draw) or when 3 jobs
  are consumed. Every attempt ledgered.
- **Priors (registered choice: REUSE)**: slice-1's sealed reflective priors of
  record (`priors.json`, sha `9969fa3f…`, binding asserted:
  priors.arms_sha256 === 23eec18d…) are reused; ZERO fresh typesafe calls
  (cap 0 this slice). Reasoning receipted in `registration.json`
  (`priors_source.reasoning`): identical domain → zero marginal information;
  M10 frugality; the priors never select anything (the QRNG lead binds).
- **Confirming result**: at least one MEASURED bundle arm beats the pinned
  baseline on the pre-registered metric with the pre-registered margin and no
  fresh-count collapse → PASS, one arm's KEYS promoted as a PROPOSAL artifact.
- **Refuting result**: no measured bundle arm meets the gate → FAIL sealed
  verbatim, no threshold surgery; cost rule settles NOT_PAID.
- **Boring result**: instrumentation fails its validity gate →
  INVALID-INSTRUMENTATION honest partial; or all arms metric-inert → FAIL with
  `mutation_space_inert: true`; or the draw ladder exhausts the 3-job cap with
  zero seals → HONEST-PARTIAL (fail-closed, the slice-1 precedent).
- **Metric + gate** (identical to slice-1, with one registered amendment):
  `M(K) = (1/3) Σ_c [μ_c(K) + f_c(K)]`
  over the three committed corpora. Baseline pinned (carried):
  **M = 7.0740740740740735, totalF = 15**. PASS iff a measured bundle arm has
  M ≥ 1.05 × baseline (= 7.427777777777777) AND totalF ≥ 15.
  Amendment: slice-1's run-6 `markers_n == 11` history-equality check could
  never survive a legitimate append-only ledger event — fleet-seeds `2bc52a5`
  sealed M12 (gauge before game) after slice-1 closed. The **LEDGER-EVENT
  AMENDMENT** replaces count-equality with an append-only PREFIX proof
  (committed M1-M11 marker sequence must be a prefix of the live M1-M12
  ledger; appended ids receipted) while keeping every substantive replay check
  (exclusions equal, survivors byte-equal committed run-6). Receipted in
  `registration.json` → `validity_gate` + `draft_reconciliation`.
- **Bundle**: B = max(1, ceil(3 · 0.7^t)), t = prior_e6_slices = **1** (honest
  anneal accounting: one prior slice exists) → B = ceil(2.1) = **3** —
  unchanged. Bundle = certified QRNG lead + top-2 noul fills; the other 5 arms
  are never measured, never peeked.
- **Budget**: 0 typesafe calls; ≤ 3 mothquantum JOBS total; $0 other external;
  every attempt usage-receipted. Each foreground stage < 5 min. Abort line:
  channel failure within the ladder → fail-closed honest partial, receipted.

## Decision procedure (pre-registered order)

1. `baseline` stage (pre-registration diagnostics, $0): validity gates +
   baseline pin re-derived and asserted equal to the carried pin. No arms
   measured.
2. Registration commit PUSHED (this file + registration.json + arms.json +
   runner + health-probe receipt). **This push is the seal** (repo `tools/`
   has no seal tool — only `score.py`).
3. `draw` stage: health precondition → registered ladder → ONE certified
   comet-qrng-v1 Fisher-Yates draw over the 8 frozen arms → the BINDING LEAD.
   The priors never choose what gets measured.
4. `decide` stage: bundle = lead + top-2 noul fills (slice-1 sealed priors);
   baseline + bundle arms measured deterministically over the 3 corpora.
   Verdict per the gate. Cost rule settled (PAID iff PASS).
5. `determinism` receipt: decide re-derived via `--check`, compared modulo
   timestamp.

The promoted KEYS (if PASS) is a PROPOSAL artifact in this repo — this slice
never edits fleet-seeds (compose-don't-clobber); adoption is the lode keeper's
act with its own receipt chain.

## Cost rule (M10, explicit settlement)

Added spend = the ≤3 moth jobs actually consumed (0 typesafe — priors reused).
It is **PAID** iff the verdict is PASS; on FAIL/honest-partial the receipt
records **NOT_PAID** — an honest negative is a finding, not a gain.

## Draft reconciliation (pre-commit, zero-measurement — lane 63-d-r)

The prior incarnation drafted this registration + runner but died before any
commit/push/draw. Lane 63-d-r audited everything independently (nothing
trusted) and reconciled the draft BEFORE the registration commit — the pushed
commit below is the seal of record, and no arm was ever measured or peeked at
any point. Five findings, all receipted in detail in
`registration.json` → `draft_reconciliation`:

1. **Stale runner pin**: the draft pinned an intermediate pre-amendment runner
   (`2d3facd0…`); the audited runner of record hashes `1d52ad77…` (ordering
   proven by the preserved stale receipt). Re-pinned after a line-by-line
   audit; `node --check` OK. Same defect class as slice-1's verdict.md stale
   citation, caught pre-commit this time.
2. **Stale mines pin** + **LEDGER-EVENT AMENDMENT**: fleet-seeds `2bc52a5`
   appended M12 to `mines.jsonl` (11→12 rows, append-only proven upstream).
   Re-pinned to the live ledger (`1ba9bdfa…`); the run-6 gate now proves the
   committed M1-M11 sequence is an append-only prefix of the live M1-M12
   sequence plus byte-exact replay fidelity (strictly stronger than the
   superseded count-equality).
3. **Stale engine_run pin**: upstream `2bc52a5` added a pool=1 draw guard —
   the TARGET KEYS lens was first verified byte-unchanged (14 entries), then
   the pin re-pointed to the live file (`25423c99…`).
4. **Stale baseline receipt**: the on-disk `baseline.json` was produced by the
   pre-amendment runner (validity false solely on the superseded check; the
   baseline re-derivation itself already matched the carried pin). Preserved
   verbatim as `receipts/baseline.pre-amendment-draft.json` (never delete
   data); the baseline of record is regenerated by the runner of record below.
5. **E6_SEAL_STREAM superseded**: slice-1 chose its stream via an env override
   at draw time; this slice pre-registers the direct→prf→prf ladder instead —
   the stricter design, accepted (not a defect).

Re-verified at reconciliation time: arms canon sha `23eec18d…` == slice-1's
pin (byte-identical `arms.json`, no re-freeze); slice-1 priors binding
(`ok===true`, `arms_sha256` match); channel-health probe receipt byte-identical
to the keeper's raw result (`5d2f94fc…`) with all certification fields
re-verified; every other input pin byte-exact. Zero moth/typesafe spend
attributable to this slice before the registration push.
