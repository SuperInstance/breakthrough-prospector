#!/usr/bin/env node
// experiments/e6-slice-1/e6_slice1.mjs — E6 FIRST VERTICAL SLICE (GEPA-class
// harness optimizer, M10 recipe folded) — the answer-wire abstraction for this
// fleet, applied to a REAL target:
//
//   TARGET   : the lode engine's scout→extract KEYS keyword lens
//              (fleet-seeds/lode/engine/engine_run.mjs, `const KEYS`, 14 entries).
//   MUTATION : single-keyword substitutions from a fixed candidate pool mined
//              from the awesome-rsi catalog's own section-heading taxonomy
//              (committed receipt: run-6 review-c1-awesome-rsi-raw.md).
//   MEASURE  : DETERMINISTIC OFFLINE REPLAY of the engine's extract pipeline
//              (score ≥2 → stable sort → title-dedup → top-9 → history
//              conditioning) over THREE COMMITTED corpora: run-5 scout raw,
//              run-6 scout raw, awesome-rsi catalog. No network. No engine
//              modification (this slice never edits fleet-seeds — the promoted
//              KEYS, if any, is a proposal artifact; adoption is the next
//              lane's act, compose-don't-clobber).
//   METRIC   : M(K) = (1/3) Σ_c [ μ_c(K) + f_c(K) ] where μ_c = mean key_score
//              of the candidates SURVIVING history conditioning in corpus c
//              (0 if none) and f_c = |survivors| (the fresh-candidate count:
//              candidates that would reach the priors stage as new cards).
//   LAWS     : machine proposes (frozen arm space, sha'd) → LLM supplies
//              RECEIPTED REFLECTIVE PRIORS over the answer wire (noul per arm
//              + one choice; ONE typesafe call) → certified comet-qrng-v1 draw
//              picks the BINDING LEAD arm (anti-cherry-pick; priors never pick
//              what gets measured) → M4/M10 budget cap B=3 (lead + top-2 noul
//              fills are the ONLY arms measured; unmeasured arms stay frozen)
//              → pre-registered measured gate decides PASS/FAIL → M10 cost
//              rule: the priors+seal spend is PAID iff the verdict is PASS.
//
// VALIDITY GATE (pre-registered, instrumentation must prove itself before any
// arm is trusted): the replay must reproduce the COMMITTED run-6 candidates.json
// byte-exactly (run-6 ran the post-fix both-channel matcher), and the COMMITTED
// run-5 candidates.json minus exactly the two receipted post-fix consequences
// (the M3 collision card arxiv 2609.26457, receipted in run-5
// review-c3-assessment.md, and the M11 URL-form marker match, receipted as
// run-6's c17→M11 exclusion). Failure here = INVALID-INSTRUMENTATION honest
// partial; nothing is measured, nothing is promoted.
//
// Stages:
//   node e6_slice1.mjs baseline            — validity gates + baseline metric
//                                            pin + per-key attestation (NO arms)
//   node e6_slice1.mjs priors              — ONE typesafe battery (answer wire)
//   node e6_slice1.mjs draw                — ONE certified QRNG seal (lead arm)
//   node e6_slice1.mjs decide [--check]    — measure bundle + verdict;
//                                            --check re-derives and compares
//                                            (determinism receipt, ts excluded)
//
// Spend caps (pre-registered): typesafe priors ≤ 4 calls (uses 1);
// mothquantum certified seals ≤ 2 (uses 1). Everything else local+$0.
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const FLEET = process.env.FLEET_SEEDS || '/home/z/my-project/fleet-seeds';
const OUT = join(HERE, 'receipts');
mkdirSync(OUT, { recursive: true });

const sha256 = (s) => createHash('sha256').update(s).digest('hex');
const shaFile = (p) => sha256(readFileSync(p));
const log = (...a) => console.log(...a);
const ts = () => new Date().toISOString();
const ENGINE = join(FLEET, 'lode', 'engine');
const RECEIPTS = join(ENGINE, 'receipts');

const WITNESS_RUNS = ['2026-09-29-engine-run-1', '2026-09-29-engine-run-2', '2026-09-29-engine-run-3', '2026-09-29-engine-run-4', '2026-09-29-engine-run-5', '2026-09-29-engine-run-6'];

// ---------- pinned inputs (paths; sha pins live in registration.json) ----------
const P = {
  engine_run: join(ENGINE, 'engine_run.mjs'),
  mines: join(FLEET, 'lode', 'mines.jsonl'),
  run5_raw: join(RECEIPTS, '2026-09-29-engine-run-5', 'scout', 'raw.json'),
  run6_raw: join(RECEIPTS, '2026-09-29-engine-run-6', 'scout', 'raw.json'),
  catalog: join(RECEIPTS, '2026-09-29-engine-run-6', 'review-c1-awesome-rsi-raw.md'),
  run5_cands: join(RECEIPTS, '2026-09-29-engine-run-5', 'candidates.json'),
  run6_cands: join(RECEIPTS, '2026-09-29-engine-run-6', 'candidates.json'),
  run5_hist: join(RECEIPTS, '2026-09-29-engine-run-5', 'history.json'),
  run6_hist: join(RECEIPTS, '2026-09-29-engine-run-6', 'history.json'),
  ...Object.fromEntries(WITNESS_RUNS.map((d, i) => [`witness_run${i + 1}`, join(RECEIPTS, d, 'witness.json')])),
};

// ---------- corpora (deterministic adapters over COMMITTED receipts) ----------
// JSON corpora: items exactly as the engine sees them (s.hits || s.entries ||
// s.repos), each tagged with its source. Catalog: one pseudo-source; items are
// the markdown bullets `- [Title](url) - desc` in file order, shaped as
// {title,url,desc} so the extract pipeline port is verbatim-identical.
function loadCorpora() {
  const corpora = [];
  for (const [name, p] of [['run5-scout', P.run5_raw], ['run6-scout', P.run6_raw]]) {
    const scouts = JSON.parse(readFileSync(p, 'utf8'));
    const items = [];
    for (const s of scouts) {
      for (const it of (s.hits || s.entries || s.repos || [])) items.push({ src: s.source, it });
    }
    corpora.push({ name, kind: 'engine-scout-raw', file: p, items });
  }
  const md = readFileSync(P.catalog, 'utf8');
  const items = [];
  for (const line of md.split('\n')) {
    const m = line.match(/^\s*-\s\[([^\]]+)\]\(([^)\s]+)\)(?:\s*-\s*(.+))?\s*$/);
    if (!m) continue;
    items.push({ src: 'awesome-rsi-catalog', it: { title: m[1], url: m[2], desc: m[3] || '' } });
  }
  corpora.push({ name: 'awesome-rsi-catalog', kind: 'committed-review-corpus', file: P.catalog, items });
  return corpora;
}

// ---------- history state (M10 proposal side: falsified/mined/drawn are not
// re-proposed). Verbatim port of engine_run.mjs history code (post-fix, both
// arxiv marker channels, bare-id compare). mode filters which engine-run
// witnesses count as "previously drawn": run5/run6 = the state that run had;
// current = all six committed witnesses.
const normTitle = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
function minedMarkers() {
  const markers = [];
  for (const line of readFileSync(P.mines, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    const m = JSON.parse(line);
    const blob = `${m.source || ''} ${m.claim || ''}`.toLowerCase();
    const slugs = [...blob.matchAll(/github\.com\/([a-z0-9_.-]+\/[a-z0-9_.-]+)/g)].map((x) => x[1]);
    const arxivs = [...new Set([
      ...[...blob.matchAll(/arxiv[:\s]*([0-9]{4}\.[0-9]{4,5})/g)].map((x) => x[1]),
      ...[...blob.matchAll(/arxiv\.org\/(?:abs|pdf)\/([0-9]{4}\.[0-9]{4,5})/g)].map((x) => x[1]),
    ])];
    markers.push({ id: m.id, slugs, arxivs });
  }
  return markers;
}
function previouslyDrawn(maxRun) {
  const drawn = [];
  for (const d of WITNESS_RUNS) {
    const n = Number(d.slice(-1));
    if (Number.isFinite(maxRun) && n >= maxRun) continue;
    try {
      const w = JSON.parse(readFileSync(join(RECEIPTS, d, 'witness.json'), 'utf8'));
      if (w.ok && w.drawn_candidate) {
        const cands = JSON.parse(readFileSync(join(RECEIPTS, d, 'candidates.json'), 'utf8'));
        const hit = cands.find((c) => c.id === w.drawn_candidate);
        if (hit) drawn.push({ run: d, id: hit.id, title: hit.title, ref: hit.ref });
      }
    } catch { /* a receipt dir without witness/candidates is not history */ }
  }
  return drawn;
}
function historyState(mode) {
  return {
    mode,
    markers: minedMarkers(),
    previously_drawn: previouslyDrawn(mode === 'run5' ? 5 : mode === 'run6' ? 6 : Infinity),
  };
}
const cardArxivs = (blob) => new Set([
  ...[...blob.matchAll(/arxiv[:\s]*([0-9]{4}\.[0-9]{4,5})/g)].map((x) => x[1]),
  ...[...blob.matchAll(/arxiv\.org\/(?:abs|pdf)\/([0-9]{4}\.[0-9]{4,5})(?:v[0-9]+)?/g)].map((x) => x[1]),
]);
function minedMatch(c, hist) {
  const blob = `${c.title} ${c.ref}`.toLowerCase();
  const arxivs = cardArxivs(blob);
  for (const mk of hist.markers) {
    if (mk.slugs.some((s) => blob.includes(s))) return mk.id;
    if (mk.arxivs.some((a) => arxivs.has(a))) return mk.id;
  }
  for (const pd of hist.previously_drawn) if (normTitle(pd.title) === normTitle(c.title)) return `drawn@${pd.run}`;
  return null;
}

// ---------- extract pipeline port (engine_run.mjs lines 162-198, verbatim) ----------
function extract(corpus, KEYS, hist) {
  const cands = [];
  for (const { src, it } of corpus.items) {
    const blob = JSON.stringify(it).toLowerCase();
    const score = KEYS.reduce((a, k) => a + (blob.includes(k) ? 1 : 0), 0);
    if (score >= 2) {
      cands.push({
        id: `c${cands.length + 1}`,
        source: src,
        title: (it.title || it.full_name || '').slice(0, 140),
        ref: it.url || it.id || `https://github.com/${it.full_name}`,
        stars: it.stars ?? it.points ?? null,
        date: it.created || it.published || it.created_at || null,
        key_score: score,
        gist: (it.desc || it.summary || '').slice(0, 240),
      });
    }
  }
  const sorted = [...cands].sort((a, b) => b.key_score - a.key_score); // stable
  const seen = new Map();
  for (const c of sorted) {
    const k = c.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60);
    if (k && !seen.has(k)) seen.set(k, c);
  }
  const pre = [...seen.values()].slice(0, 9);
  const excluded = [];
  const survivors = [];
  for (const c of pre) {
    const m = minedMatch(c, hist);
    if (m) { excluded.push({ id: c.id, title: c.title, source: c.source, ref: c.ref, matched: m }); continue; }
    survivors.push({ ...c, id: `c${survivors.length + 1}` });
  }
  return { pool: cands.length, pre: pre.length, excluded, survivors };
}

// ---------- metric ----------
// per corpus: mu = mean key_score of survivors (0 if none); f = |survivors|.
// M = mean over the three corpora of (mu + f). totalF = Σ f_c.
function metric(corpora, KEYS, hist) {
  let sum = 0, totalF = 0;
  const per = [];
  for (const c of corpora) {
    const r = extract(c, KEYS, hist);
    const mu = r.survivors.length ? r.survivors.reduce((a, s) => a + s.key_score, 0) / r.survivors.length : 0;
    const f = r.survivors.length;
    sum += mu + f; totalF += f;
    per.push({ corpus: c.name, mu, f, pool: r.pool, pre: r.pre, excluded: r.excluded.length, survivors: r.survivors.map((s) => ({ id: s.id, key_score: s.key_score, title: s.title, ref: s.ref })) });
  }
  return { M: sum / corpora.length, totalF, per_corpus: per };
}

// ---------- baseline KEYS (the pin; verbatim from engine_run.mjs) ----------
const KEYS_BASELINE = ['self-improv', 'self-evolv', 'recursive', 'meta-learn', 'harness', 'outer loop', 'reward hacking', 'reward-hacking', 'verifier', 'playbook', 'skill librar', 'curriculum', 'map-elites', 'archive'];

// ---------- validity gates ----------
function canonCandidates(list) { return JSON.stringify(list, null, 1) + '\n'; }
function validityGate(corpora) {
  const byName = Object.fromEntries(corpora.map((c) => [c.name, c]));
  const out = { ok: false, run6: null, run5: null, notes: [] };
  // GATE 1 — run-6 corpus under run-6-time state must reproduce the committed
  // candidates.json BYTE-EXACT (run-6 ran the post-fix matcher).
  {
    const hist = historyState('run6');
    const r = extract(byName['run6-scout'], KEYS_BASELINE, hist);
    const committed = readFileSync(P.run6_cands, 'utf8');
    const derivedHist = { markers_n: hist.markers.length, previously_drawn: hist.previously_drawn.map((p) => `${p.run}:${p.id}`) };
    const committedHist = JSON.parse(readFileSync(P.run6_hist, 'utf8'));
    const histEqual =
      derivedHist.markers_n === committedHist.mined_markers.length &&
      JSON.stringify(derivedHist.previously_drawn) === JSON.stringify(committedHist.previously_drawn.map((p) => `${p.run}:${p.id}`));
    const exclEqual = JSON.stringify(r.excluded.map((e) => [e.title, e.ref, e.matched])) ===
      JSON.stringify(committedHist.excluded.map((e) => [e.title, e.ref, e.matched]));
    const bytesEqual = canonCandidates(r.survivors) === committed;
    out.run6 = { history_state_matches_committed: histEqual, exclusions_match_committed: exclEqual, survivors_byte_equal_committed: bytesEqual, derived: derivedHist };
    if (!histEqual || !exclEqual || !bytesEqual) out.notes.push('run-6 replay != committed run-6 receipt');
  }
  // GATE 2 — run-5 corpus under run-5-time state must reproduce the committed
  // candidates.json minus EXACTLY the two receipted post-fix consequences:
  // the M3 collision card (arxiv 2609.26457) and the M11 URL-form match
  // (arxiv 2609.34924) — then renumbered.
  {
    const hist = historyState('run5');
    const r = extract(byName['run5-scout'], KEYS_BASELINE, hist);
    const committedHist = JSON.parse(readFileSync(P.run5_hist, 'utf8'));
    const derivedHist = { markers_n: hist.markers.length, previously_drawn: hist.previously_drawn.map((p) => `${p.run}:${p.id}`) };
    const histEqual =
      derivedHist.previously_drawn.join('|') === committedHist.previously_drawn.map((p) => `${p.run}:${p.id}`).join('|');
    const committedCands = JSON.parse(readFileSync(P.run5_cands, 'utf8'));
    const expectedDeltaRefs = ['2609.26457', '2609.34924'];
    const extra = r.excluded.filter((e) => !committedHist.excluded.some((ce) => ce.title === e.title && ce.matched === e.matched));
    const deltaOk = extra.length === 2 &&
      extra.every((e) => expectedDeltaRefs.some((ref) => (e.ref || '').includes(ref))) &&
      new Set(extra.map((e) => e.matched)).size === 2 &&
      extra.some((e) => e.matched === 'M3') && extra.some((e) => e.matched === 'M11');
    const expectedSurvivors = committedCands.filter((c) => !expectedDeltaRefs.some((ref) => (c.ref || '').includes(ref)))
      .map((c, i) => ({ ...c, id: `c${i + 1}` }));
    const bytesEqual = canonCandidates(r.survivors) === canonCandidates(expectedSurvivors);
    out.run5 = { history_prevdrawn_matches_committed: histEqual, exclusion_delta_is_exactly_receipted_fix: deltaOk, survivors_equal_committed_minus_receipted_delta: bytesEqual, extra_exclusions: extra };
    if (!histEqual || !deltaOk || !bytesEqual) out.notes.push('run-5 replay != committed run-5 receipt modulo the receipted fix');
  }
  out.ok = out.notes.length === 0;
  return out;
}

// ---------- attestation (baseline diagnostics; used ONLY for the registered
// dead-slot rule that fixes the substitution slots pre-run) ----------
function attestation(corpora, KEYS) {
  const rows = {};
  for (const k of KEYS) rows[k] = {};
  for (const c of corpora) {
    const blobs = c.items.map(({ it }) => JSON.stringify(it).toLowerCase());
    for (const k of KEYS) rows[k][c.name] = blobs.reduce((a, b) => a + (b.includes(k) ? 1 : 0), 0);
  }
  return rows;
}

// ---------- stages ----------
const stage = process.argv[2] || '';

function loadRegistration() {
  const p = join(HERE, 'registration.json');
  if (!existsSync(p)) throw new Error('registration.json missing — no pin, no run (fail-closed)');
  return JSON.parse(readFileSync(p, 'utf8'));
}
function assertPins(reg) {
  const bad = [];
  for (const [k, want] of Object.entries(reg.input_sha256)) {
    const got = shaFile(P[k]);
    if (got !== want) bad.push(`${k}: ${got.slice(0, 12)} != pinned ${want.slice(0, 12)}`);
  }
  if (bad.length) throw new Error('PIN MISMATCH (inputs drifted from registration):\n' + bad.join('\n'));
}

if (stage === 'baseline') {
  const corpora = loadCorpora();
  const reg = { inputs: Object.fromEntries(corpora.map((c) => [c.name, { file: c.file, sha256: shaFile(c.file), items: c.items.length }])) };
  const validity = validityGate(corpora);
  const hist = historyState('current');
  const base = metric(corpora, KEYS_BASELINE, hist);
  const att = attestation(corpora, KEYS_BASELINE);
  const receipt = {
    kind: 'e6-slice-1-baseline', ts_utc: ts(),
    stage_note: 'pre-registration diagnostics ONLY: validity gates + baseline pin + per-key attestation. No arms defined, none measured, no external spend.',
    corpora: reg.inputs,
    validity, baseline: base, baseline_M: base.M, baseline_totalF: base.totalF, attestation: att,
  };
  writeFileSync(join(OUT, 'baseline.json'), JSON.stringify(receipt, null, 1) + '\n');
  log(`validity: ${validity.ok ? 'OK' : 'FAILED — ' + validity.notes.join('; ')}`);
  for (const pc of base.per_corpus) log(`baseline ${pc.corpus}: pool=${pc.pool} pre=${pc.pre} survivors=${pc.f} mu=${pc.mu}`);
  log(`baseline M=${base.M} totalF=${base.totalF}`);
  log(`corpus items: ${corpora.map((c) => `${c.name}=${c.items.length}`).join(' ')}`);
  for (const [k, v] of Object.entries(att)) log(`attest ${k}: ${JSON.stringify(v)}`);
  process.exit(0);
}

if (stage === 'priors') {
  const reg = loadRegistration();
  assertPins(reg);
  const arms = JSON.parse(readFileSync(join(HERE, 'arms.json'), 'utf8'));
  const armsSha = sha256(canonCandidates(arms.arms));
  if (armsSha !== reg.arms_sha256) throw new Error('arms.json != registered arms_sha256 (fail-closed)');
  const { systemone } = await import(join(FLEET, 'lode', 'engine', 'systemone_client.mjs'));
  const q = {};
  for (const a of arms.arms) {
    q[`p_gain_${a.id}`] = {
      type: 'noul',
      instructions: `p = probability that this ONE-KEYWORD mutation of the lode engine's scout→extract keyword lens RAISES the pre-registered composite metric M to >= 1.05 x baseline (baseline M=${reg.baseline_M} pinned) WITHOUT reducing total fresh-candidate count. Metric: over 3 committed replay corpora (run-5 scout, run-6 scout, awesome-rsi catalog; deterministic offline replay, score>=2, top-9 cap, current mine-ledger history conditioning), M = mean over corpora of (mean key_score of surviving fresh candidates + surviving count). Mutation: replace key "${a.old_key}" with "${a.new_key}" (rationale: ${a.note}). Replacing an attested key can lower scores; a dead key slot gains only if the new term actually attests.`,
    };
  }
  q['first_measure'] = {
    type: 'choice',
    instructions: 'Which ONE arm would you measure FIRST if measurement were budgeted? (It is not: the certified QRNG draw picks the binding lead and the two top-prior arms fill the bundle; your choice is receipted as a reflective prior and does NOT override the draw.)',
    criteria: Object.fromEntries(arms.arms.map((a) => [a.id, `replace "${a.old_key}" with "${a.new_key}" — ${a.note}`])),
  };
  const at = ts();
  try {
    const r = await systemone({
      state: {
        battery: 'e6-slice-1-priors',
        target: 'lode engine scout→extract KEYS lens (fleet-seeds/lode/engine/engine_run.mjs)',
        arms_sha256: armsSha, arms_n: arms.arms.length, baseline_M: reg.baseline_M, baseline_totalF: reg.baseline_totalF,
        metric_spec: reg.metric_formula, pass_rule: reg.pass_rule,
      },
      questions: q,
    });
    const receipt = { kind: 'e6-slice-1-priors', ts_utc: at, ok: true, arms_sha256: armsSha, model: r.model, usage: r.usage, latency_ms: r.latency_ms, answers: r.answers };
    writeFileSync(join(OUT, 'priors.json'), JSON.stringify(receipt, null, 1) + '\n');
    appendFileSync(join(OUT, 'usage.jsonl'), JSON.stringify({
      kind: 'usage-receipt', at_utc: at, service: 'typesafe.ai/v1/systemone', model: r.model, usage: r.usage,
      latency_ms: r.latency_ms, purpose: 'e6-slice-1 reflective priors (8 noul + 1 choice, ONE call)', questions: Object.keys(q).length,
    }) + '\n');
    log(`priors OK model=${r.model} usage=${JSON.stringify(r.usage)} latency=${r.latency_ms}ms`);
  } catch (e) {
    const receipt = { kind: 'e6-slice-1-priors', ts_utc: at, ok: false, error: String(e.message || e).replace(/apikey_[A-Za-z0-9_]+/g, 'REDACTED').slice(0, 400) };
    writeFileSync(join(OUT, 'priors.json'), JSON.stringify(receipt, null, 1) + '\n');
    log('priors FAILED (honest, fail-closed):', receipt.error);
    process.exit(1);
  }
  process.exit(0);
}

if (stage === 'draw') {
  const reg = loadRegistration();
  assertPins(reg);
  const arms = JSON.parse(readFileSync(join(HERE, 'arms.json'), 'utf8'));
  const at = ts();
  // E6_SEAL_STREAM: 'direct' (default) | 'prf' — moth-seal's own registered
  // receipted extension mode. First direct attempt fail-closed on the
  // min-entropy bit budget (job delivered 40 bits < 112 required for pool 8);
  // proceeding on prf is the tool's declared answer and is receipted by the
  // seal itself (effectiveEntropyBits declared, never silent).
  const stream = process.env.E6_SEAL_STREAM === 'prf' ? 'prf' : 'direct';
  try {
    const sealPath = join(OUT, 'qrng-seal.json');
    execFileSync('node', [
      join(FLEET, 'tools', 'moth-seal.mjs'),
      '--n=1', `--pool=${arms.arms.length}`, '--label=e6-slice-1-arm-draw',
      ...(stream === 'prf' ? ['--stream=prf'] : []),
      `--out=${sealPath}`, '--quiet',
    ], { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, MOTH_KEY: process.env.MOTHQUANTUM_TOKEN || process.env.MOTH_KEY }, timeout: 180000 });
    const seal = JSON.parse(readFileSync(sealPath, 'utf8'));
    const sel = seal.chosen?.selected?.[0];
    const w = {
      kind: 'e6-slice-1-qrng-witness', ts_utc: at, ok: true, arms_sha256: reg.arms_sha256,
      drawn_index: sel, drawn_arm: arms.arms[sel]?.id ?? null,
      stream, stream_note: stream === 'prf' ? 'certified bytes seed the registered SHA-256 counter stream (mothbits STEP 3 semantics); extension declared explicitly, effectiveEntropyBits in the certified receipt' : 'direct certified stream',
      certifiedBits: seal.certifiedBits ? { deliveredBytes: seal.certifiedBits.deliveredBytes, hBit: seal.certifiedBits.hBit, effectiveEntropyBits: seal.certifiedBits.effectiveEntropyBits, streamKind: seal.certifiedBits.stream } : null,
      raw_result_sha256: seal.rawResultSha256 ?? null, job: seal.job ?? null,
      note: 'certified comet-qrng-v1 Fisher-Yates over the frozen arm list; the drawn arm is the BINDING LEAD of the measured bundle (anti-cherry-pick: priors never choose what gets measured). Full certified receipt: qrng-seal.json. Attempt history: qrng-attempts.jsonl (append-only; first direct attempt fail-closed on the bit budget — job consumed, no receipt issued, receipted here).',
    };
    writeFileSync(join(OUT, 'witness.json'), JSON.stringify(w, null, 1) + '\n');
    appendFileSync(join(OUT, 'qrng-attempts.jsonl'), JSON.stringify({ kind: 'qrng-attempt', at_utc: at, ok: true, stream, drawn_index: sel, drawn_arm: w.drawn_arm, jobId: seal.job?.jobId ?? null }) + '\n');
    log(`QRNG drew arm #${sel} (${w.drawn_arm})`);
  } catch (e) {
    const w = { kind: 'e6-slice-1-qrng-witness', ts_utc: at, ok: false, stream, error: String(e.message || e).replace(/moth_[A-Za-z0-9]+/g, 'REDACTED').slice(0, 400) };
    writeFileSync(join(OUT, 'witness.json'), JSON.stringify(w, null, 1) + '\n');
    appendFileSync(join(OUT, 'qrng-attempts.jsonl'), JSON.stringify({ kind: 'qrng-attempt', at_utc: at, ok: false, stream, error: w.error }) + '\n');
    log('QRNG FAILED (honest, fail-closed):', w.error);
    process.exit(1);
  }
  process.exit(0);
}

if (stage === 'decide') {
  const check = process.argv.includes('--check');
  const reg = loadRegistration();
  assertPins(reg);
  const arms = JSON.parse(readFileSync(join(HERE, 'arms.json'), 'utf8'));
  if (sha256(canonCandidates(arms.arms)) !== reg.arms_sha256) throw new Error('arms.json != registered arms_sha256');
  const corpora = loadCorpora();

  const validity = validityGate(corpora);
  const hist = historyState('current');
  const base = metric(corpora, KEYS_BASELINE, hist);
  const basePinOk = base.M === reg.baseline_M && base.totalF === reg.baseline_totalF;

  const priors = JSON.parse(readFileSync(join(OUT, 'priors.json'), 'utf8'));
  const witness = JSON.parse(readFileSync(join(OUT, 'witness.json'), 'utf8'));
  // Registered abort_line: "external channel failure (typesafe/mothquantum
  // non-2xx or timeout) -> fail-closed honest partial receipted". This branch
  // WRITES that receipt (repair #3, post-draw: the draw already happened and
  // failed fail-closed; decision values untouched — additions only here).
  if (!priors.ok || !witness.ok) {
    const receipt = {
      kind: 'e6-slice-1-decide', ts_utc: ts(), check,
      verdict: 'HONEST-PARTIAL',
      partial_reason: !witness.ok
        ? 'qrng-channel-degraded — the certified anti-cherry-pick lead was never drawn (mothquantum comet-qrng-v1: job #1 direct fail-closed on min-entropy bit budget 40<112 bits; job #2 prf fail-closed on incomplete certification payload; both jobs consumed, zero certified seals issued; the <=2-job cap set in the pushed pre-draw repair is CONSUMED). Per the registered abort_line the decision procedure is fail-closed: no bundle, no arms measured, no promotion, NO PASS/FAIL claim on the mutation space. The 8 arms stay frozen-unmeasured for a fresh registration on a recovered channel.'
        : 'priors channel failed — no reflective priors of record; decision procedure fail-closed per registered abort_line',
      validity, baseline_pin_ok: basePinOk,
      baseline: { M: base.M, totalF: base.totalF, per_corpus: base.per_corpus.map(({ corpus, mu, f }) => ({ corpus, mu, f })) },
      priors: priors.ok ? { ok: true, model: priors.model, usage: priors.usage, answers_note: 'receipted in priors.json; NOT used to select anything (the lead was never drawn)' } : { ok: false, error: priors.error },
      seal: { ok: witness.ok, attempts_ledger: 'receipts/qrng-attempts.jsonl', stream: witness.stream ?? null, error: witness.error ?? null },
      arms_frozen_unmeasured: arms.arms.map((a) => a.id),
      cost_rule: { law: 'M10 (arXiv:2609.24972): added inference cost must be paid for by measured gain', spend: ['1 typesafe systemone battery call (receipted 2808 in / 235 out)', '2 mothquantum comet jobs consumed, 0 certified seals issued (ledgered)'], paid: 'NOT_PAID', settlement_note: 'the added spend bought: a proven-faithful replay instrumentation (validity gates), a receipted reflective-priors battery, and a receipted channel-degradation finding — not measured gain' },
    };
    writeFileSync(join(OUT, check ? 'decide-check.json' : 'decide.json'), JSON.stringify(receipt, null, 1) + '\n');
    log('decide: HONEST-PARTIAL (' + receipt.partial_reason.slice(0, 90) + '…) — nothing measured, nothing promoted, fail-closed per registration');
    process.exit(1);
  }
  if (!validity.ok || !basePinOk) {
    const receipt = { kind: 'e6-slice-1-decide', ts_utc: ts(), check, verdict: 'INVALID-INSTRUMENTATION', validity, baseline_pin_ok: basePinOk, baseline_M: base.M };
    writeFileSync(join(OUT, check ? 'decide-check.json' : 'decide.json'), JSON.stringify(receipt, null, 1) + '\n');
    log('decide: INVALID-INSTRUMENTATION (fail-closed, nothing measured, nothing promoted)');
    process.exit(1);
  }

  // M4/M10 budget cap: bundle = QRNG lead + (B-1) top-noul fills. B = max(1,
  // ceil(B0*ANNEAL^t)), B0=3, ANNEAL=0.7, t=0 prior E6 slices → B=3.
  const B0 = 3, ANNEAL = 0.7, t = reg.prior_e6_slices;
  const B = Math.max(1, Math.ceil(B0 * Math.pow(ANNEAL, t)));
  const noul = (id) => Number(priors.answers?.[`p_gain_${id}`]?.noul) || 0;
  const lead = witness.drawn_arm;
  const fills = arms.arms.filter((a) => a.id !== lead).sort((a, b) => (noul(b.id) - noul(a.id)) || (a.index - b.index)).slice(0, B - 1).map((a) => a.id);
  const bundle = [lead, ...fills];

  const measured = [];
  for (const a of arms.arms) {
    if (!bundle.includes(a.id)) continue;
    const KEYS = KEYS_BASELINE.map((k) => (k === a.old_key ? a.new_key : k));
    const m = metric(corpora, KEYS, hist);
    measured.push({ id: a.id, old_key: a.old_key, new_key: a.new_key, lead: a.id === lead, role: a.id === lead ? 'qrng-lead' : 'noul-fill', noul: noul(a.id), M: m.M, totalF: m.totalF, per_corpus: m.per_corpus, KEYS });
  }
  const pass = measured.some((m) => m.M >= reg.pass_margin_relative * reg.baseline_M && m.totalF >= reg.baseline_totalF);
  const eligible = measured.filter((m) => m.M >= reg.pass_margin_relative * reg.baseline_M && m.totalF >= reg.baseline_totalF);
  const promoted = pass ? [...eligible].sort((a, b) => (b.M - a.M) || (a.id < b.id ? -1 : 1))[0] : null;
  // descriptive annex ONLY (n=3, non-binding): rank agreement between noul prior and M.
  const spearmanPairs = measured.map((m) => ({ id: m.id, noul: m.noul, M: m.M })).sort((a, b) => a.noul - b.noul);
  const receipt = {
    kind: 'e6-slice-1-decide', ts_utc: ts(), check,
    verdict: pass ? 'PASS' : 'FAIL',
    validity, baseline: { M: base.M, totalF: base.totalF, pin_ok: basePinOk, per_corpus: base.per_corpus },
    budget: { B0, ANNEAL, t, B, law: 'M4/M10: budget cap as selection pressure — only bundle arms measured; unmeasured arms stay frozen (receipted, never peeked)' },
    bundle: { lead, lead_rule: 'certified comet-qrng-v1 draw (anti-cherry-pick)', fills, fill_rule: 'deterministic descending noul prior, index tie-break', measured_arm_ids: bundle, frozen_unmeasured_arm_ids: arms.arms.map((a) => a.id).filter((id) => !bundle.includes(id)) },
    measured, pass_rule: reg.pass_rule, pass_margin_relative: reg.pass_margin_relative,
    promoted: promoted ? { id: promoted.id, old_key: promoted.old_key, new_key: promoted.new_key, M: promoted.M, totalF: promoted.totalF, proposed_KEYS: KEYS_BASELINE.map((k) => (k === promoted.old_key ? promoted.new_key : k)) } : null,
    cost_rule: { law: 'M10 (arXiv:2609.24972): added inference cost must be paid by measured gain', spend: ['1 typesafe systemone battery call', '1 certified comet-qrng-v1 seal'], paid: pass ? 'PAID' : 'NOT_PAID' },
    annex_descriptive: { note: 'n=3, non-binding, multiple-comparisons caveat: the full per-arm table over the measured bundle only', pairs: spearmanPairs },
  };
  const path = join(OUT, check ? 'decide-check.json' : 'decide.json');
  writeFileSync(path, JSON.stringify(receipt, null, 1) + '\n');
  log(`validity ${validity.ok ? 'OK' : 'FAIL'}; baseline M=${base.M} totalF=${base.totalF} (pin ${basePinOk ? 'MATCH' : 'MISMATCH'})`);
  for (const m of measured) log(`arm ${m.id} (${m.role}, noul=${m.noul}): M=${m.M} totalF=${m.totalF}`);
  log(`VERDICT: ${receipt.verdict}${promoted ? ` — promote ${promoted.id} (${promoted.old_key} → ${promoted.new_key})` : ''}; cost rule ${receipt.cost_rule.paid}`);
  process.exit(0);
}

if (stage === 'determinism') {
  const a = JSON.parse(readFileSync(join(OUT, 'decide.json'), 'utf8'));
  const b = JSON.parse(readFileSync(join(OUT, 'decide-check.json'), 'utf8'));
  const strip = (r) => { const { ts_utc, check, ...rest } = r; return rest; };
  const sa = sha256(JSON.stringify(strip(a)));
  const sb = sha256(JSON.stringify(strip(b)));
  const rec = { kind: 'e6-slice-1-determinism', ts_utc: ts(), decide_sha256: sa, decide_check_sha256: sb, byte_identical_modulo_ts: sa === sb };
  writeFileSync(join(OUT, 'determinism.json'), JSON.stringify(rec, null, 1) + '\n');
  log(`determinism: ${rec.byte_identical_modulo_ts ? 'BYTE-IDENTICAL (modulo ts)' : 'DIVERGED — ' + sa.slice(0, 12) + ' vs ' + sb.slice(0, 12)}`);
  process.exit(rec.byte_identical_modulo_ts ? 0 : 1);
}

console.error('usage: e6_slice1.mjs baseline|priors|draw|decide [--check]|determinism');
process.exit(2);
