# Iterative-Lane Literature Sweep — 2026-09-29

Scope: papers released (or newly prominent) 2026, cross-read for how multiple
improvement loops coexist and synergize. Read against our live lanes: snowball
queue (fast per-pulse), forge adoption (per-merge), atlas pulls (6h), qcells
lab (exp-series), pong-quilt rounds, self-play (E1).

## The six strongest just-released results

**1. MetaSkill-Evolve — two-timescale RSI** (arXiv 2607.05297, Jul 2026).
Branch = (task skill s, meta-skill m=(ψ,σ,α,π,ε), history h). Fast loop rewrites
s every iteration; slow loop rewrites m every H iterations using the SAME
five-agent pipeline on itself (Analyzer/Retriever/Allocator/Proposer/Evolver).
No extra model, no extra objective. Frontier selection weighs utility +
meta-productivity + cooling. +23.54/+16.09/+1.92 held-out over frozen backbone
(OfficeQA/SealQA/ALFWorld); the slow ring ALONE contributes +6.38/+8.05/+1.92 —
on ALFWorld, evolving the improver accounts for the ENTIRE gain. Cadence law:
H=2 best; H=8 costs up to 9.1 points (meta-skill staleness against the fast
loop). Limitation they admit: the five-agent pipeline's roles/wiring stay fixed
(= our C01 frozen-driver ceiling, one ring up).

**2. AHE — Agentic Harness Engineering** (arXiv 2604.25850, Apr 2026, cited 45).
Three observability pillars: (i) component — every editable harness piece has a
file-level representation, action space explicit + revertible; (ii) experience —
raw trajectories distilled into a layered drill-down evidence corpus; (iii)
decision — every edit ships with a SELF-DECLARED PREDICTION that the next round
verifies; confirmed or reverted. Controllability: evolve-agent writes only inside
the harness workspace; runs/verifier/LLM config read-only; seed prompt
non-deletable. 10 unattended iterations: Terminal-Bench 2 pass@1 69.7→77.0%,
beating human-designed Codex-CLI (71.9%) and self-evolving baselines ACE,
TF-GRPO.

**3. PILOT in the Loop — live self-improvement** (arXiv 2608.26530, Aug 2026).
Iterations share fixed harness state H_i (skill library + memory). Updates are
created DURING runs from live trajectories, BEFORE any verifier outcome;
verifier outcomes only decide which updates carry into H_{i+1} — "verifier
outcomes are never used to create or modify those updates." +14.6pp (GLM-5.1),
+12.4pp (Kimi-K2.6) on Terminal-Bench 2.0; skill set grows 21–31; output tokens
per task fall 43–47%; successful evals per M tokens rise 110–134%.

**4. Misevolution** (Shao et al., ICLR 2026, arXiv 2509.26354). Four drift
pathways: model / memory / tool / workflow. Memory pathway, no attacker:
refusal 99.4→54.4%, ASR 0.6→20.6% after ~100 self-evolution rounds
(Qwen3-Coder-480B, RedCode-Gen). Cheap mitigation "treat memories as
references, not rules" recovers only part (ASR 20.6→13.1%). Workflow pathway
shows a separate, sharper decay.

**5. ReflexGrad — multi-loop synergy by construction** (arXiv 2511.14584).
Three loops at different periods with BIDIRECTIONAL coupling: TODO decomposition
× TextGrad policy update (every 3 steps) × Reflexion (every 5 steps or on
failure). Each loop's output shapes the others' inputs. 67% zero-shot ALFWorld
(Trial 0). The paper's claim we care about: coupled multi-period loops beat any
single loop — the coupling channel is the contribution, not the loops.

**6. Single-multi evolution loop** (arXiv 2602.05182). Alternate a multi-LLM
collaboration step with a per-model distillation step; post-distillation models
collaborate again. +8.0% individual, +14.9% system over 15 datasets. Fleet
reading: cross-lane collaboration followed by per-lane compaction = our
"distill the pulse" pattern, now with numbers.

Also noted: AIDE² recursive research-agent RSI (2609.26457 — outer claude-opus
loop, inner gemini-flash evaluations; L2 ambition published as not-yet); SkillOpt
(single skill doc as external state; bounded edits accepted only on strict
held-out gains — receipts-gated editing, independently converged); MineEvolve
(successes→skills, failures→executable guardrails — a dual ledger, our
collapse-receipt pair); Continual Harness (online prompt/subagent/skill/memory
refinement, reset-free); Meta-harness (2603.28052, end-to-end); RSIBench-data
(2607.25886, data-centric RSI benchmark). Surveys: "From Bounded Self-Refinement
to Autonomous Research Loops" (2607.07663, 1,250-paper corpus, two-axis
taxonomy) and "Self-Improvements in Modern Agentic Systems" (2607.13104).
Map: lobehub/awesome-rsi.

## Synergy matrix — what it means for our lanes

| Literature pattern | Our nearest lane | Gap it closes |
|---|---|---|
| Two-timescale recursion (MetaSkill-Evolve) | snowball meta-lane (we evolve repos, never the queue's own rules) | unfreeze the dispatcher: slow ring rewrites queue rules/prompts/repair procedure from receipt history |
| Decision observability (AHE) | forge receipts | receipts record what happened; AHE pairs each edit with a PREDICTION the next run verifies — receipt v2 = edit + prediction + verified verdict |
| Verifier-gated carry (PILOT) | MicroMoth sealed receipts + ledger | validates our split: mint during run, gate decides carry. Their honesty law ("verifier never creates updates") is already our design |
| Multi-period coupled loops (ReflexGrad) | snowball (fast) / forge (per-merge) / atlas (6h) stack | currently uncoupled; explicit coupling channels (what each lane feeds the next) is the missing paper's core claim |
| References-not-rules memory (Misevolution) | forge softness doctrine | literature now backs soft receipts: hard-gated self-memory is the measured decay path; stay advisory |
| Failure→guardrails (MineEvolve) | E1 selfplay canaries | failure receipts should mint guardrail tests automatically, not just canary shapes |
| Single→multi→distill (single-multi loop) | pulse → per-lane compaction | our pulse digests are the distillation step; numbers justify formalizing it |
| Meta-productivity frontier selection | queue ordering (currently priority list) | pick next lane by η1·utility + η2·recent-productivity + η3·novelty, not static score |

## Pre-registered hooks (queue rows E8, E9)

- **E8 (exp017-class): meta-lane two-timescale.** Slow ring rewrites one queue
  artifact (e.g., score weights or dispatch prompt) per K pulses, receipted,
  revertible; H small (2–4), staleness bounded. Matches C01's "2.5 meta-levels"
  — this would be our first unfreeze of the improvement operator.
- **E9: prediction-paired receipts (forge v0.2.0).** forge-seal gains an
  optional `prediction` field; forge-run verifies prior predictions against the
  new run's outcome and records CONFIRMED/REFUTED per receipt. AHE's decision
  observability, receipts-native.

Honesty tags: MetaSkill-Evolve numbers [R] (their benchmarks, single frozen
backbone); AHE [R] (their harness, Terminal-Bench 2); PILOT [R]; Misevolution
[V] (replicated across venues, ICLR 2026 + multiple independent notes);
synergy-matrix rows are our inferences [U] until receipted.
