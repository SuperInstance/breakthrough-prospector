# Experiment Protocol

Claim → experiment → receipt. The anti-laundering rules live here.

## Pre-registration (mandatory)

Before running, write the interpretation pin into the owning repo's experiment
file (mirroring fleet convention):

```markdown
## PIN (written <timestamp>, before run)
- Claim under test: <card id + one line>
- Confirming result: <what we'd need to see>
- Refuting result: <what would kill it>
- Boring result: <what would make it a don't-care>
- Metric + gate: <the number and its threshold>
- Budget: <wall time, tokens, and the abort line>
```

No pin → no run → no receipt. A result without a pin is a story, not evidence.

## Receipt requirements

Every experiment produces a collapse receipt containing:

- `claim_ids` (registry cards), `pre_registration_hash`
- `seeds`, `roots` (3-root replication per fleet doctrine), timestamps
- measured numbers with units — not adjectives
- honest-negative field: if it failed, `failure_mode` + `next_probe`
- `canaries_injected` / `canaries_caught` once D1 lands (see DELTAS.md)
- `ladder_position` touched only via a held-out gate receipt

## Scoring gate recap

From `scoring.md`: an experiment is worth running when B = V×F×S ≥ 40, F ≥ 3,
and at least one VERIFIED citation backs the underlying claim. Below the gate,
the claim waits in the scout log — patience is cheaper than a polluted ledger.

## Sequencing with the fleet

- Lane owner branches, never main (MicroMoth-quilt branch rules apply
  account-wide): lane owner sequences PRs, Casey merges.
- Experiments touching the gate (D2) or the self-play loop (D1) get priority in
  the snowball queue — see `queue/snowball.md`.
- One experiment per lane at a time; a lane with an unpinned running experiment
  doesn't open a second.

## After the run

1. File the receipt in the owning repo's `experiments/`.
2. Update the card: instance promoted/demoted, score revised, new hook named.
3. If honest-negative: owning repo's FINDINGS.md first, then the card. A dead
   end marked is worth more than a success unmarked — it stops the next scout
   from re-walking it.
4. Ladder claims (C12) may move only together with the gate receipt that justifies
   the move, in the same commit.
