# Scout Protocol

How a scout (human or subagent) files claims. Scouts are the senses; the
registry is the memory. Keep them separate and both stay clean.

## Claim format

Each claim is one block in `sources/scout-log.md`:

```markdown
### YYYY-MM-DD <short-name>
- **Source**: URL or `owner/repo` + path/commit
- **Claim**: one sentence, falsifiable
- **Evidence**: what the source actually shows (quote or number)
- **Honesty tag**: VERIFIED | REPORTED | UNVERIFIED
- **Abstraction fit**: which registry card(s) it feeds or proposes
- **Fleet resonance**: which repo/lane it touches, and why
- **Suggested experiment**: smallest build that would settle it
```

## Rules

1. **Cite or it didn't happen.** No URL/commit, no claim.
2. **Tag the honesty.** VERIFIED only if we reproduced it or the source shows
   the evidence inline. REPORTED for strong-source claims we haven't touched.
   UNVERIFIED for anything a blog chain says.
3. **One claim per block.** A survey link is a pointer, not a claim; the claims
   are the papers inside it, filed individually or as a labeled bundle.
4. **Feed cards, don't duplicate them.** Before filing, check whether an
   existing card already covers the mechanism; add the instance to the card
   instead of opening a parallel claim.
5. **Smallest-build bias.** Every claim ends with the cheapest experiment that
   would settle it. If you can't name one, the claim isn't ready.
6. **Time budget.** A scout reports what it verified by minute 25 even if
   incomplete — a verified finding beats a complete audit.
7. **No pushing.** Scouts never commit to fleet repos. Their entire output is
   this log + card updates, landed via PR like everything else.

## Standing scout missions

| Mission | Cadence | Target |
|---|---|---|
| Frontier papers | weekly | arxiv cs.AI/cs.LG new + ICLR/NeurPS RSI workshops |
| Trending repos | weekly | github topics: self-improving, agentic, qd, map-elites |
| Cross-pollination | biweekly | non-AI fields with isomorphic mechanisms (evolutionary computing, immune systems, metrology) |
| Fleet-internal | continuous | receipts/ledgers mined by tools/dream.py (C06) |
