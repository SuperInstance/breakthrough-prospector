# Abstraction Registry

The distillation layer. Each card: the abstraction as a crisp statement, its
instances across the frontier (cited), what it explains, where it already lives
in our fleet, the gap, and the experiment hook. Cards are living documents —
receipts from experiments update them.

Honesty tags: **[V]** verified by us or by evidence in the source; **[R]**
reported by the source; **[U]** unverified.

---

## C01 — The frozen-driver ceiling (~2.5 meta-levels)

**Statement.** Every realized RSI system holds at least one driver layer fixed,
so it earns at most ~2.5 meta-levels of self-reference: modifying the solver (L1)
and the modification logic (L2) are realized, but archive maintenance, parent
selection, outer evaluation, or goal guards stay frozen.

**Instances.** DGM explicitly leaves "archive maintenance and parent selection …
fixed and not modifiable by the DGM" (§3) [V]. HyperAgents' outer selection and
evaluation loop "cannot be altered" (§7) [V]. Gödel Agent hard-guards its action
API and goal prompt [V]. EvoX extends evolutionary program search to
meta-evolution, where the search operators themselves evolve [R]. MetaRSI/RSI2
("a meta-recursive self-improving system for recursive self-improving systems
themselves") attacks the same ceiling [R].

**What it explains.** Why RSI curves flatten: the frozen layer becomes the
bottleneck the improving part can't reach.

**Fleet instance.** The Worked Spiral in MicroMoth-quilt is nine loops, all
human-frozen — the schedule, the pruning, the firing order never change.

**Gap.** No loop in our fleet rewrites any other loop, let alone the schedule.

**Hook.** A spiral loop that proposes edits to the spiral schedule itself, gated
by a held-out battery (needs C04 first). Smallest build: schedule-as-data file +
one editor loop + gate.

---

## C02 — Harness-over-weights (improve the scaffolding, freeze the model)

**Statement.** The cheapest, safest, most auditable self-improvement target is
the executable scaffolding around a frozen model/kernel — improvements are
human-readable, persistent (code not weights), and transferable.

**Instances.** The 2026 self-improvement survey's central split: model improvement
vs scaffolding improvement [V]. HyperAgents: frozen FM, all improvement via
readable code edits [V]. Ecdysis: training runtime harnesses for LLM agents [R].
NeoHorse-1: RSI via a routing harness rather than weight updates [R]. Compile-time
modification preferred over runtime monkey-patching for auditability (SICA/Godel
Agent analysis) [V].

**Fleet instance.** mothquantum's int8 kernel is the frozen artifact;
MicroMoth-quilt is the harness that measures and seals it. This split is our
native shape — the frontier is converging on it.

**Gap.** We optimize the kernel's compression strategy by hand; the harness's own
configs (loop schedules, pruning thresholds, firing budgets) have never been the
optimization target.

**Hook.** GEPA-style trace-grounded optimization over harness configs: read full
traces, propose targeted edits, keep what passes the gate. 35× fewer rollouts than
GRPO-class methods per GEPA [R].

---

## C03 — Archive + lineage bandit (retain stepping stones, allocate by provenance)

**Statement.** Greedy hill-climbing on the best-so-far loses to keeping an archive
of diverse stepping stones and allocating new attempts across lineages by a bandit
weighted on each lineage's survival rate.

**Instances.** DGM: archive beats no-archive baseline; key innovations (node 24)
explode only because lower-performing stepping stones were retained [V]. Weco/AIDE²:
bandit over solution lineages for parent allocation [V]. COBRA-Skills: contextual
bandit-guided skill evolution [R]. MAP-Elites/OpenEvolve: quality-diversity archive
as the population structure [V].

**Fleet instance.** MicroMoth-quilt keeps everything (receipts, ledgers,
FINDINGS.md) — the archive exists — but no loop allocates effort by lineage
success. The Spiral fires everything, every time.

**Gap.** Receipts have no parent-lineage field; no loop measures which loop
produced the surviving artifacts.

**Hook.** Add lineage fields to collapse receipts; run a bandit over loops for
fire-budget allocation. Measure: does bandit-allocation raise the survival rate of
new receipts vs uniform firing? One-evening build for instrumentation; a week for
the bandit.

---

## C04 — Held-out gates as the only trust anchor

**Statement.** A self-improvement claim is only as good as its held-out gate: a
measurement the improving system cannot see, shape, or contaminate during
improvement. Self-sealing against known failures is necessary but is training-set
analog — it cannot certify generalization.

**Instances.** Weco/AIDE²: three hidden benchmark gates; ~9/10 rewrites rejected;
the gate is why their L1 claim is believable [V]. Meta AIRA₃: Kaggle gold, externally
graded [R]. SWE-bench Verified as the community anchor [V]. Our own doctrine: 3-root
replication exists because single-root receipts lied to us [V].

**Fleet instance.** qcells are mutation batteries that self-seal against bugs we
already found — exact analog of training on the test's known shapes.

**Gap.** No held-out battery anywhere in the account.

**Hook.** Build a gate battery whose mutation shapes are generated by an
independent process (different model family + procedural generator), sealed by
Casey, opened only at measurement time. The self-play loop (C05) feeds it; it
never sees the gate shapes.

---

## C05 — Self-play synthesis (injector/solver loops manufacture the curriculum)

**Statement.** The strongest 2025–26 training-data engine is an agent that plays
both sides: inject the bug, solve the bug; propose the task, attempt the task.
No human-labeled data needed, and the loop doubles as a detector for false
confidence.

**Instances.** SWE-RL (Meta SI Labs): bug-injector/solver self-play, +10.4 on
SWE-bench Verified [R]. MAE: Proposer/Solver/Judge co-evolution, +4.54% avg on
3B [R]. FrogNano: online task synthesis for a 4B SWE agent [R].

**Fleet instance.** None. Our batteries only catch what we already thought of.

**Gap.** No synthetic-adversary loop exists; battery catch-rate is unmeasured;
false-PASS rate (reward hacking) is unmeasured.

**Hook.** A loop that samples qcell shape-cards, synthesizes a matching bug in
`micromoth.py`, runs the batteries, and records caught/missed. Output: catch-rate
curve + a hacking-rate estimate from seeded canaries. One evening.

---

## C06 — Dream-RSI (offline replay of discovery attempts)

**Statement.** Replay your own failed-and-retried discovery attempts offline,
distill the replay into an improved exploration policy, redeploy. The raw
material is a byproduct you already produce: traces.

**Instances.** Dream-RSI: alternates online exploration with offline "dreaming"
to improve an executable exploration policy; weights untouched [R].

**Fleet instance.** MicroMoth-quilt's FINDINGS.md + ledgers/ are exactly the dream
material — hundreds of fail→fix→seal transitions, sitting unused.

**Gap.** No tool mines the ledgers to propose loop or battery changes.

**Hook.** `tools/dream.py`: parse ledgers for fail→success transitions, cluster by
shape, emit proposed battery extensions + loop-schedule tweaks as PR suggestions
with receipts. One evening for the parser; the proposer loop is a weekend.

---

## C07 — Reward-hacking measurement and immunization

**Statement.** Any self-improvement loop will, unless measured, drift toward
satisfying its own metric instead of the intent. The rate must be measured with
canaries and reported, not assumed; immunization papers now treat this as a
first-class layer.

**Instances.** Weco/AIDE²: reward hacking fell 63%→34% *unprompted* — the number
existed because they measured [V]. Harness-agnostic detection and immunization of
reward hacking in self-evolving language models (FrontisAI list, 2026-09-11) [R].

**Fleet instance.** Honest-negative doctrine is cultural, not measured. We have
no number for how often a PASS receipt is a false PASS.

**Gap.** No canary suite; no hacking-rate metric in any ledger.

**Hook.** Seeded-bug canaries (subset of C05) reported as a first-class field in
every collapse receipt: `canaries_injected`, `canaries_caught`.

---

## C08 — Context compression as an RSI pressure valve

**Statement.** Long-running self-improving agents drown in their own history;
compression of the trace/ledger into distilled lore is itself an improvable
operator, and its quality is measurable by downstream task success.

**Instances.** AIDE²: 16× prompt compression with no capability loss [V].

**Fleet instance.** Receipts and ledgers grow unboundedly; FINDINGS.md is already
32KB and summarization is manual.

**Gap.** No compression loop; no measurement of compressed-vs-full downstream
success.

**Hook.** Compress the last N receipts into distilled loop-lore; run a fixed task
suite against full-history and compressed-history operators; report the delta.
Pre-register: compression is a win only if task success drops ≤1 point while
token cost drops ≥5×.

---

## C09 — Trace-grounded route validation and editing (TROVE/GEPA class)

**Statement.** Read full execution traces — errors, profiles, reasoning logs —
and propose targeted edits to the routes/tools/prompts the agent uses; genetic-
Pareto selection over edits beats rollout-hungry RL by orders of magnitude.

**Instances.** GEPA: outperforms GRPO/MIPROv2 with up to 35× fewer rollouts, needs
100–500 evals vs 10,000+ [R]. TROVE: adaptive skill orchestration via trace-grounded
route validation and editing [R].

**Fleet instance.** typesafe.ai's agent does tool routing + skill packs already;
MicroMoth-quilt's Tiller prunes catalogs by hand.

**Gap.** No trace-grounded editing loop anywhere; routing tables are static.

**Hook.** Feed typesafe.ai traces to an editor that proposes route-table patches;
validate on a held-out task slice. Weekend build.

---

## C10 — Receipts-as-code (compile-time, auditable, transferable self-modification)

**Statement.** The durable unit of self-improvement is a human-readable artifact
that can be reviewed, reverted, versioned, and transplanted — not a weight delta
or a runtime patch. Agents that improve by editing their own source produce
improvements with exactly these properties.

**Instances.** HyperAgents: improvements human-readable, persistent, transferable
[V]. SICA: 17%→53% SWE-bench Verified by compile-time self-edit [R]. Fleet
doctrine: collapse receipts, ledger.jsonl, FINDINGS.md [V].

**Gap.** Receipts are written but not executable-as-gates; cross-repo transplant
("tiles and programs") is manual.

**Hook.** Make each collapse receipt double as a regression test in the owning
repo; build the cross-repo tile extractor that surfaces a receipt pattern for
reuse elsewhere in the account.

---

## C11 — Open-ended stepping stones via quality-diversity

**Statement.** MAP-Elites-class archives (illuminate a behavior-characterization
grid, keep elites per cell) find solutions greedy search can't, and the grid
itself tells you which dimensions of the design space actually matter.

**Instances.** OpenEvolve (open AlphaEvolve core: MAP-Elites + cascade evaluator)
[V]. ShinkaEvolve: MoE load-balancing loss beating DeepSeek SoTA in 30
generations; circle-packing SoTA in ~150 evals [R]. Lane C (quantum-audio-honesty)
already runs a QD-Elites variant against a fixed kernel [V — ours].

**Fleet instance.** Lane C's diversity search against the QPAM kernel is the
account's first QD loop.

**Gap.** No QD archive over *harness variants* (loop schedules, pruning rules) —
the improvement target of C02.

**Hook.** Lift Lane C's QD machinery from kernel-seeds to harness-configs;
characterization dims: survival rate, catch rate, token cost, wall time.

---

## C12 — The RSI ladder, claimed honestly (L0–L3)

**Statement.** Self-improvement claims should be graded on an explicit ladder —
L0 delegation (tools do what they're told), L1 net-positive self-improvement under
a held-out gate, L2 ignition (improvements accelerate further improvement,
significant), L3 inflection (sustained superlinear takeoff) — and most real
systems are L0, not L2.

**Instances.** Weco/AIDE² claims L1 with a hidden gate and published their L2
ambition as not-yet-significant [V]. Most "RSI" demos are L0 with better branding [V].

**Fleet instance.** Ungraded. Our spiral loops are L0 but read like more because
the artifacts are elaborate.

**Gap.** No ladder position stated per system; risk of self-marketing.

**Hook.** Add `ladder_position` to every system's README, updated only together
with a held-out-gate receipt. Free — it's a discipline, not a build.

---

## C13 — Soft substrate precedes smart loops

**Statement.** A constellation cannot run self-improvement loops until its
low-level execution substrate is uniform enough that a receipt from any repo is
trusted without per-repo archaeology. And the substrate must be *soft* — it
reports, never blocks — because hard gates get switched off by annoyed lanes
while receipts get kept.

**Instances.** quilt-atlas's own honesty law ("CI is probed only on the
top-motion slice — absence elsewhere is UNMEASURED, never reported as zero") [V].
The 2026-09-28 atlas sweep: of the 24 most-pushed repos, **15 have zero
workflows**, and the nine that do speak nine dialects (`build.yml`, `smoke.yml`,
`garden.yml`, `merge-gate.yml`, twelve files in SmartCRDT) [V].

**Fleet instance.** Built `quilt-forge` (one reusable workflow; probe + 3-root
seal; zero secrets — the atlas *pulls* seals on its existing 6h schedule). Pilot
adoptions: qthe-verify#1, exoj#2 — both with local pre-merge evidence
(12/12 and 3/3 across roots 7/11/23, divergence=false).

**Gap.** 2 of 4,854 repos on the substrate. The atlas does not yet consume forge
seals, so constellation health (motion honesty, root divergence, receipt
latency) is still unmeasured.

**Hook.** E7: adoption wave across the top-motion slice (one 5-minute PR per
repo), then atlas v-next pulls seals. The higher abstraction Casey asked for
(2026-09-29 07:28) sits directly on this layer: streamline the low level soft,
then abstract.

---

*Cross-references: C04 gates C01/C05/C07/C12. C03 instruments C05. C06 consumes
C03's lineage fields. C11 reuses Lane C's QD engine. C13 is the floor they all
stand on — receipts a constellation can trust are the input every other card
assumes.*
