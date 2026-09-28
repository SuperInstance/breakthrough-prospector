# Scout Log — 2026-09-29 RSI frontier sweep

First full sweep under the prospector mandate (Casey, 2026-09-29 ~07:26 GMT+8).
All claims below fed registry cards; this log is the raw record.

## Weco / AIDE² (the anchor — deep-read)

- **Source**: https://www.weco.ai/blog/first-evidence-of-recursive-self-improvement (2026-07-14) + https://arxiv.org/html/2609.26457v1 + ODS interview (2026-09-08)
- **Claim**: An outer-loop agent rewriting an inner-loop agent-researcher's code achieves net-positive RSI under hidden held-out gates; reward hacking and prompt compression improved unprompted.
- **Evidence**: 8 days unattended, 100 outer steps, ~9/10 rewrites rejected; 7 self-improvements survived; beat AIDEhuman (2y hand-tuned) on MLE-bench Lite / ALE-Bench Lite / WeatherBench 2 at fixed $; hacking 63%→34%; 16× prompt compression; bandit over solution lineages; RSI ladder L0–L3 with L1 claimed, L2 explicitly not-yet.
- **Tag**: VERIFIED (numbers shown inline in both sources)
- **Feeds**: C02, C03, C04, C07, C08, C12
- **Fleet resonance**: MicroMoth-quilt's spiral ≈ their inner loop minus the gates/bandit; our receipts ≈ their surviving-rewrite ledger.
- **Smallest experiment**: D1 bug-injection loop (evening) — manufactures the catch-rate/hacking measurements their setup had by default.

## Dream-RSI

- **Source**: https://arxiv.org/html/2609.14858v1 (2026-09-14)
- **Claim**: Offline "dreaming" over replays of own discovery attempts improves an executable exploration policy; model weights untouched.
- **Tag**: REPORTED
- **Feeds**: C06
- **Smallest experiment**: tools/dream.py parser over existing ledgers (evening — material already exists).

## NeoHorse-1

- **Source**: https://github.com/TokenRhythm/NeoHorse
- **Claim**: RSI via agentic post-training with a *routing harness* (Apache 2.0; Qwen3.5-4B/9B bases; includes NeoHorse-Jev-4B with Kev-adapted inference).
- **Tag**: REPORTED (repo README)
- **Feeds**: C02 (harness-over-weights), C09 (routing as the editable surface)
- **Smallest experiment**: static route-table edit from a small trace batch on typesafe.ai; measure held-out task delta (weekend).

## Ornith-1.5

- **Source**: benchmark reporting vs Qwen3.6 (2026-08-20)
- **Claim**: Open-weight model trained by a closed self-improvement loop (task generation + scaffold generation + RL rollouts); model card credits the expanded self-improvement loop for results.
- **Tag**: REPORTED
- **Feeds**: C02, C05
- **Fleet resonance**: closed loop → open artifact is exactly our kernel/harness split with the loop on the harness side.

## Darwin Gödel Machine

- **Source**: https://arxiv.org/html/2505.22954v3
- **Claim**: Self-referential FM-powered evolution: SWE-bench 20.0%→50.0%, Polyglot 14.2%→30.7% over 80 iterations; archive + open-ended exploration both essential (ablations regress); improvements transfer across FMs (o3-mini 23→33, Claude-3.7 19→59.5).
- **Evidence**: figures 2–4 inline; baselines beat both no-self-improve and no-archive variants.
- **Tag**: VERIFIED (evidence inline)
- **Feeds**: C01 (frozen archive/selection), C03 (archive+lineage), C11 (stepping stones)
- **Caveat**: 2 weeks + significant API cost per run — F is low for full DGM; the *mechanisms* are what we adopt.

## FrogNano

- **Source**: https://arxiv.org/html/2609.07925v2 (2026-09-09)
- **Claim**: Competitive 4B coding agent post-trained exclusively on synthetic tasks via online task synthesis — no distillation, no human data.
- **Tag**: REPORTED
- **Feeds**: C05

## Self-evolving optimization survey

- **Source**: https://arxiv.org/html/2603.25681v2 (2026-08-18)
- **Claim**: The improvement target is moving from model parameters to the optimization process itself — update rules, learning algorithms, surrounding scaffolding.
- **Tag**: REPORTED (survey)
- **Feeds**: C01, C02

## Awesome-Self-Improving-Agents (FrontisAI)

- **Source**: https://github.com/FrontisAI/Awesome-Self-Improving-Agents (updated 2026-09-11)
- **Claim**: The curated frontier is organized around skill evolution, harness evolution, memory graphs, and reward-hacking immunization as first-class layers.
- **Key instances**: TROVE (trace-grounded route validation/editing), SkillAdam, SE-GoS (graph-of-skills), RobustSGPO (search-space control for harness evolution), MetaRSI/RSI2 (meta-RSI), harness-agnostic reward-hacking immunization, Ecdysis (runtime harness training), COBRA-Skills (contextual bandit skill evolution), Experience Funnel (state-policy alternation).
- **Tag**: VERIFIED (list + links inline); individual papers REPORTED until read.
- **Feeds**: C02, C03, C07, C09

## o-mega 2026 guide + DGM/HyperAgents/SWE-RL cluster

- **Source**: https://o-mega.ai/articles/self-improving-ai-agents-the-2026-guide (2026-03-26)
- **Claims adopted**: HyperAgents — single editable codebase with solve_task() + self-editing modify_self(), frozen FM, improvements human-readable/persistent/transferable. SWE-RL — bug-injector/solver self-play, +10.4 SWE-bench Verified. GEPA — genetic-Pareto trace-grounded optimization, up to 35× fewer rollouts than GRPO. ShinkaEvolve — MoE loss beating DeepSeek SoTA in 30 generations. SICA 17→53% by compile-time self-edit. OpenEvolve — open AlphaEvolve core (MAP-Elites + cascade evaluator). ICLR 2026 dedicated RSI workshop (2026-04, Rio).
- **Tag**: REPORTED (secondary source) except DGM (VERIFIED above) and OpenEvolve existence (VERIFIED).
- **Feeds**: C02, C05, C09, C10, C11

## Frozen-driver ceiling (~2.5 meta-levels)

- **Source**: https://arxiv.org/pdf/2608.24735 (related-work analysis)
- **Claim**: All empirical self-referential agents realize at most ~2.5 meta-levels because at least one driver layer is held fixed (DGM archive maintenance/parent selection; HyperAgents outer loop; Gödel Agent guards). EvoX evolves the operators themselves; MetaRSI/RSI2 targets meta-RSI.
- **Tag**: VERIFIED for the frozen-layer quotes (inline § refs); REPORTED for the 2.5-levels framing.
- **Feeds**: C01 — **this is the strongest "gem" candidate of the sweep**: the ceiling is named, quantified, and barely attacked.
