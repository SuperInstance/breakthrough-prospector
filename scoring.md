# Scoring: B = V × F × S

Breakthrough-likelihood score. Multiplicative because a zero in any factor
zeroes the product — a valuable infeasible idea and a feasible worthless idea
are both worth zero experiments.

## Factors (1–5 each)

**V — Value.** Size of the prize if the experiment hits.
1. Curiosity only. 2. Improves one repo's metric. 3. Improves a fleet-wide
mechanism. 4. Creates a new repo class or changes how every lane runs. 5.
Changes what the account is capable of (a real L2-class mechanism).

**F — Feasibility.** Cheapest credible path from here to receipt.
5. One evening, stdlib/stdlib-adjacent, one agent. 4. A day. 3. A week with
checkpoint receipts. 2. Needs new infra or external resources. 1. Needs
something that doesn't exist yet.

**S — Surprise.** Novelty vs (a) our current fleet and (b) current frontier
attention. 1. Both know it. 2. Fleet-new, frontier-known. 3. Frontier-adjacent.
4. Nobody's buzzword yet, but the instances rhyme. 5. Would make people ask
"why didn't anyone do this before" — the gem grade.

## Gate

Run it when: **B ≥ 40 AND F ≥ 3 AND ≥1 VERIFIED citation** behind the claim.

Interpretation:
- B ≥ 60: priority — enters the snowball queue top, deserves a lane.
- 40–59: queued — runs when a lane frees.
- < 40: stays in the scout log; re-score when new instances land.

## Anti-gaming notes

- S is capped at 3 for any claim whose only instances are from a single lab or
  a single week of arxiv — clustering is not consensus.
- V is discounted ×0.5 if the metric it improves has no current measurement
  (you can't improve what you don't measure — go measure it first, that's D1).
- F is capped at 2 if the experiment needs Casey to do something before it can
  start (external dependency).
- Scores live in `abstractions/registry.md` experiment tables and are recomputed
  by `tools/score.py`; hand-edited scores must carry a `why` line.
