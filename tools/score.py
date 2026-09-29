#!/usr/bin/env python3
"""Score experiment proposals: B = V x F x S, with the prospector gate.

Reads the experiment table embedded in this file (keep it the single source of
truth for scores until the registry tables outgrow it). Anti-gaming rules from
scoring.md are enforced as warnings.

Usage: python3 tools/score.py [--json]
"""
from __future__ import annotations

import argparse
import json
import sys

# id, name, claim cards, V, F, S, verified_citations, needs_casey, metric_measured, why
EXPERIMENTS = [
    ("E1", "bug-injection self-play loop (MicroMoth-quilt D1)", "C05+C07",
     5, 4, 4, 2, False, True,
     "manufactures catch-rate + hacking-rate measurements every later delta depends on"),
    ("E2", "lineage fields + bandit allocation on Spiral (D3)", "C03",
     4, 4, 3, 2, False, False,
     "instrumentation is measured only after E1 exists; V discounted until then"),
    ("E3", "held-out gate battery, Casey-sealed (D2)", "C04",
     5, 3, 4, 2, True, True,
     "the trust anchor; F capped by Casey-seal dependency"),
    ("E4", "tools/dream.py ledger miner (D4)", "C06",
     3, 4, 3, 1, False, True,
     "cheap and useful; S modest because Dream-RSI exists upstream"),
    ("E5", "spiral self-edit loop (D6)", "C01",
     5, 2, 5, 1, False, False,
     "attacks the frozen-driver ceiling; gated behind E1-E3, F low until then"),
    ("E6", "GEPA-class harness optimizer for mothquantum (D8)", "C02+C09",
     4, 4, 4, 2, False, True,
     "harness-over-weights on our native split; M10 (fleet-seeds lode) EXTERNAL REPLICATION: google-research/rrsi (arXiv:2609.24972, abstract resolved PASS both legs) ships the proposal-side recipe — annealed bundled-edit budget, history-conditioned proposer, cost rule (tokens paid by measured gain), noise-adjusted floor — so F rises 3->4 (recipe exists at paper strength; needs a held-out circuit slice only); second VERIFIED citation via lode M10 resolution"),
    ("E7", "forge substrate + atlas telemetry (D15/D16)", "C13",
     4, 5, 3, 2, False, True,
     "the floor every other card stands on; atlas 2026-09-28 sweep is the verified citation"),
    ("E8", "meta-lane two-timescale self-edit (exp017-class)", "C01+C13",
     4, 4, 3, 1, False, True,
     "slow ring rewrites one queue artifact per K pulses, receipted; MetaSkill-Evolve H-staleness law bounds cadence; distinct loop from E5 (dispatcher rules vs repo self-edit)"),
    ("E9", "prediction-paired receipts (forge v0.2.0)", "C13",
     4, 5, 2, 1, False, True,
     "AHE decision-observability receipts-native: edit + self-declared prediction + next-run CONFIRMED/REFUTED; feasibility is forge E7 already shipped"),
]


def score_rows():
    rows = []
    for eid, name, cards, v, f, s, verified, needs_casey, metric_measured, why in EXPERIMENTS:
        b = v * f * s
        gate = b >= 40 and f >= 3 and verified >= 1
        warnings = []
        if not metric_measured:
            warnings.append("V x0.5: target metric has no current measurement (scoring.md)")
        if needs_casey:
            warnings.append("F cap: external dependency (Casey) before start")
        if verified < 1:
            warnings.append("no VERIFIED citation yet — REPORTED only")
        rows.append({
            "id": eid, "experiment": name, "cards": cards,
            "V": v, "F": f, "S": s, "B": b,
            "gate": "RUN" if gate else "wait",
            "why": why, "warnings": warnings,
        })
    return sorted(rows, key=lambda r: -r["B"])


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    rows = score_rows()
    if args.json:
        print(json.dumps(rows, indent=2))
        return 0
    print(f"{'id':<4} {'B':>3} {'gate':<5} {'V':>2} {'F':>2} {'S':>2}  experiment")
    for r in rows:
        print(f"{r['id']:<4} {r['B']:>3} {r['gate']:<5} {r['V']:>2} {r['F']:>2} {r['S']:>2}  {r['experiment']}")
        for w in r["warnings"]:
            print(f"       ! {w}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
