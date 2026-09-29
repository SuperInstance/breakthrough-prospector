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
| 2 | E3 | held-out gate battery (Casey-sealed) | C04 | 60 | MicroMoth-quilt | one day |
| 3 | E5 | spiral self-edit loop (frozen-driver reach) | C01 | 50 | MicroMoth-quilt | gated behind 1–2 |
| 4 | E2 | lineage fields + bandit allocation | C03 | 48 | MicroMoth-quilt | instrumentation evening |
| 5 | E6 | GEPA-class harness optimizer | C02+C09 | 48 | mothquantum | week, checkpointed |
| 6 | E4 | tools/dream.py ledger miner | C06 | 36 | MicroMoth-quilt | parser evening |
| 7 | E7 | forge substrate + atlas telemetry (C13) | C13 | 60 | quilt-forge/quilt-atlas | adoption PRs, 5 min each |
| 8 | E8 | meta-lane two-timescale self-edit | C01+C13 | 48 | prospector queue | one evening (first receipted rule edit) |
| 9 | E9 | prediction-paired receipts (forge v0.2.0) | C13 | 40 | quilt-forge | one evening (forge-seal field + forge-run verifier) |

Note: E8 and E5 both touch C01 but mutate different loops (dispatcher rules vs
repo self-edit) — rule 5 satisfied. E9 stacks on E7's shipped substrate; it is
the AHE decision-observability pattern from the 2026-09-29 literature sweep
(research/iterative-lanes-2026-09-29.md).

(E4 sits below the gate — queued as infrastructure because its material already
exists and it feeds E2's lineage work. E7 sits above the gate: VERIFIED citations
are the atlas numbers themselves; it unblocks D15/D16 and is the floor the other
cards stand on, so it jumps the queue per rule 3.)

## Queue movement log

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
