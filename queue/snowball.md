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

(E4 sits below the gate — queued as infrastructure because its material already
exists and it feeds E2's lineage work.)
