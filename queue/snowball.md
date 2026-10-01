# Snowball Queue Handoff

How scored claims leave this repo and enter the account's working queue
(`memory/snowball-queue.md` in the operator workspace).

## Rules

1. Only experiments that pass the scoring gate (B ≥ 40, F ≥ 3, ≥1 VERIFIED
   citation) are queued — `tools/score.py` is the arbiter.
2. Queue entries are one-liners: `id | experiment | cards | B | owning repo |
   first build | pre-registration status`.
3. Order: B descending, but E1-class measurement deltas (catch rate, hacking
   rate, held-out gates) jump any queue — no claim is more credible than the
   instrumentation it stands on.
4. A claim leaves the queue when a lane owner picks it up; it returns if the
   lane aborts, with the failure mode appended.
5. Never queue two experiments that mutate the same loop in the same week —
   receipts must stay attributable.

## Current queue (seeded from the 2026-09-29 sweep)

| # | id | experiment | cards | B | owning repo | first build |
|---|---|---|---|---|---|---|
| 1 | E1 | bug-injection self-play loop + canary receipts | C05+C07 | 80 | MicroMoth-quilt | one evening |
| 2 | E6 | GEPA-class harness optimizer (M10 recipe folded) | C02+C09 | 64 | mothquantum | a day (RRSI proposal-side recipe receipted) |
| 3 | E3 | held-out gate battery (Casey-sealed) | C04 | 60 | MicroMoth-quilt | one day |
| 4 | E5 | spiral self-edit loop (frozen-driver reach) | C01 | 50 | MicroMoth-quilt | gated behind 1–2 |
| 5 | E2 | lineage fields + bandit allocation | C03 | 48 | MicroMoth-quilt | instrumentation evening |
| 6 | E7 | forge substrate + atlas telemetry (C13) | C13 | 60 | quilt-forge/quilt-atlas | adoption PRs, 5 min each |
| 7 | E8 | meta-lane two-timescale self-edit | C01+C13 | 48 | prospector queue | one evening (first receipted rule edit) |
| 8 | E9 | prediction-paired receipts (forge v0.2.0) | C13 | 40 | quilt-forge | one evening (forge-seal field + forge-run verifier) |
| 9 | E4 | tools/dream.py ledger miner | C06 | 36 | MicroMoth-quilt | parser evening |

Note: E8 and E5 both touch C01 but mutate different loops (dispatcher rules vs
repo self-edit) — rule 5 satisfied. E9 stacks on E7's shipped substrate; it is
the AHE decision-observability pattern from the 2026-09-29 literature sweep
(research/iterative-lanes-2026-09-29.md).

(E4 sits below the gate — queued as infrastructure because its material already
exists and it feeds E2's lineage work. E7 sits above the gate: VERIFIED citations
are the atlas numbers themselves; it unblocks D15/D16 and is the floor the other
cards stand on, so it jumps the queue per rule 3.)

## Queue movement log

- 2026-09-29 ~05:05Z: M10 EXTERNAL REPLICATION folded (lode↔prospector CROSSLINK, fleet-seeds/lode/CROSSLINK.md): google-research/rrsi (arXiv:2609.24972) resolved PASS both legs in lode — cost rule + 30% fewer policy tokens (ID 14.1 vs OOD 4.7). E6 re-scored by tools/score.py (the arbiter): F 3→4 (proposal-side recipe receipted at paper strength: annealed bundled-edit budget, history-conditioned proposer, noise-adjusted floor), VERIFIED citations 1→2 → B 48→64, queue re-ordered E6 to #2. No other row touched.
- 2026-09-29 ~08:20: E7 pilots opened (qthe-verify#1, exoj#2); D15 wave next.
- 2026-09-29 ~08:40: D15 wave 1 complete — five adoption PRs open: qthe-verify#1,
  exoj#2, jev-garden#1, fleet-seeds#1 (probe-only, honest no-command), pong-quilt#77
  (257/262 local; 3 fails = receipt-completeness class refusing shallow clones by design).
- Lab pulse 07:56: exp015 ELITISM-ARTIFACT (partial) VERIFIED — fed registry C11 as
  an in-fleet VERIFIED instance; SRIP diagnostic (selection-regime-invariance probe)
  proposed as the reusable tile it implies.
- Lab pulse 08:21: exp015 **sealed as MicroMoth-quilt PR #21** (branch
  exp015-illumination-receipt, d499a93): 11 pins, suite 155/155 green. Crossing
  stays skeleton-only 3/3 (r7 0.4355 named), transplant 0/3. Next: exp016 hybrid
  or hard-root autopsy. Lab flags possible trivial manifest conflict with PR #19.
- 2026-09-29 ~08:20: **E1 COMPLETE** — catch 43/60 = 0.72 (nine shapes 1.00,
  literal_rewrite 0.60, three shapes 0.00), canaries 9/12, PR MicroMoth-quilt#20.
  Honest negatives: baseline manifest-drift RED on pristine main (delta-based catch
  semantics); qcells/ doesn't exist (battery = tests/, 144 cases); the three 0.00
  shapes are named coverage holes (rz-phase pin, noise_model-vs-sampled-counts,
  r<=cumu measure-zero). These holes are the next delta candidates.
- 2026-09-29 ~09:25: literature sweep **iterative-lanes-2026-09-29.md** (research/) —
  six just-released results cross-read for multi-loop synergy: MetaSkill-Evolve
  two-timescale (slow ring = entire ALFWorld gain; H-staleness costs 9.1pt),
  AHE decision-observability (edit + prediction + next-round verify), PILOT
  verifier-gated carry, Misevolution (memory decay; references-not-rules backs
  forge softness doctrine), ReflexGrad coupled multi-period loops, single-multi
  distill loop. Queue gains E8 (meta-lane two-timescale, C01+C13, B48 RUN) and
  E9 (prediction-paired receipts, forge v0.2.0, C13, B40 RUN). Synergy matrix
  maps each external pattern to a live fleet lane.
- 2026-09-29 ~17:40Z: **E6 slice-1 executed → HONEST-PARTIAL
  (qrng-channel-degraded)**, experiments/e6-slice-1/ — the GEPA-class answer-wire
  abstraction over a REAL target (lode engine KEYS lens): registration sealed
  + pushed pre-run (e756f09 → f3ad79e → bdc8c04), replay instrumentation proven
  faithful (run-6 byte-exact; run-5 minus the two receipted post-fixer cards),
  baseline pinned M=7.0740740740740735/totalF=15, reflective priors receipted
  (ONE typesafe call, jev-1.13.0, 2808 in/235 out), but the certified
  anti-cherry-pick draw never landed: comet-qrng-v1 job #1 delivered 40 bits
  (<112 for pool 8, fail-closed), job #2 prf completed with an incomplete
  certification payload (fail-closed) — 2 jobs consumed, 0 seals, ≤2-job cap
  CONSUMED → fail-closed per the registered abort line: no bundle, 8 arms stay
  frozen-unmeasured, cost rule NOT_PAID, no PASS/FAIL claim. E6 stays OPEN at
  queue #2; next probe (receipted in verdict.md): fresh registration on a
  recovered channel — same frozen arms (23eec18d…), same pinned baseline, same
  metric/margins; priors battery of record stays sealed.
- 2026-10-01 ~23:48Z–23:59Z: **E6 slice-2 executed → FAIL (mutation_space_inert),
  cost rule NOT_PAID**, experiments/e6-slice-2/ — the registered next-probe of
  slice-1, executed end-to-end on the RECOVERED channel: registration sealed +
  pushed pre-draw (e3f003f; same frozen arms 23eec18d…, same pinned baseline
  M=7.0740740740740735/totalF=15, same metric/margins; moth cap in JOBS ≤3;
  priors REUSED from slice-1's sealed battery, 0 typesafe; channel-health
  precondition receipted from the wave-63 keeper probe) → certified QRNG draw
  LANDED FIRST TRY (direct stream, job d5a55554…, 1200 bits, hBit 0.907, 112/112
  bits consumed; lead A5 binds; 1 job / 1 seal of cap 3) → B=3 bundle measured
  (A5 7.148148148148148 / A4 7.111111111111112 / A3 7.0740740740740735, all
  totalF=15) → **no arm meets the registered gate (M ≥ 7.427777777777777 AND
  totalF ≥ 15)** → FAIL sealed verbatim, mutation_space_inert: true, nothing
  promoted, 5 arms stay frozen-unmeasured. ONE defect caught and repaired with
  measurement invariance proven: the slice-1-inherited pass-gate line computed
  M ≥ 0.05×baseline instead of the registered 1.05× and fired a FALSE PASS
  (voided receipt preserved verbatim, decide.buggy-gate-draft.json); the repair
  restores exactly the registered threshold. LEDGER-EVENT AMENDMENT receipted
  (fleet-seeds 2bc52a5 appended M12; run-6 gate now proves append-only prefix +
  byte-exact replay). E6 recommendation to keeper: the single-keyword space is
  exhausted (inert at 5% margin, ≤+1.05% relative observed) — reshape the edit
  space (multi-term/deletion/insertion, t=2 → B=2) or retire the row; a fresh
  priors battery would be default in a richer space.
