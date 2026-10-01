#!/usr/bin/env node
// experiments/e6-slice-2/e6_slice2.mjs — E6 SECOND VERTICAL SLICE: the
// RE-REGISTRATION of slice-1 on the RECOVERED comet-qrng-v1 channel.
//
// Slice-1 (experiments/e6-slice-1/, verdict HONEST-PARTIAL qrng-channel-degraded)
// sealed everything EXCEPT the draw: same target, same frozen arms (arms.json,
// sha 23eec18d…), same pinned baseline (M=7.0740740740740735 / totalF=15), same
// metric/margins — but the certified anti-cherry-pick lead never landed (job #1
// direct fail-closed 40<112 bits; job #2 prf fail-closed CertError on an
// incomplete certification payload; <=2-job cap consumed, 0 seals). Its verdict
// registered this next probe: fresh registration on a RECOVERED channel — same
// frozen arms, same pinned baseline, same metric/margins; re-seal, draw the
// lead, measure the B=3 bundle, settle the cost rule.
//
// SLICE-2 DELTAS (each a REGISTERED choice, documented in registration.json):
//   ARMS      : arms.json is a byte-identical copy of slice-1's (canon sha
//               23eec18d… recomputed and re-pinned — no re-freeze).
//   PRIORS    : the slice-1 sealed reflective priors of record are REUSED
//               (pinned by sha; binding check: their arms_sha256 must equal
//               this slice's arms sha). ZERO fresh typesafe calls — registered
//               choice with receipted reasoning (identical arms/baseline/metric
//               => zero marginal information from a re-spend; M10 cost rule).
//   CAP LAW   : the mothquantum cap is registered in JOBS (<=3), not seals —
//               wave-62 proved seals-issued accounting under-counts channel
//               degradation (2 jobs consumed, 0 seals issued).
//   HEALTH    : registered channel-health precondition = the wave-63 probe
//               receipt (receipts/channel-health-probe-w63.json); the draw
//               stage re-verifies it fail-closed before submitting any job.
//   LADDER    : registered draw ladder — attempt 1 stream=direct; on any
//               fail-closed, attempt 2 stream=prf; then attempt 3 stream=prf;
//               stop at the FIRST CERTIFIED SEAL (it binds) or when the <=3-job
//               cap is consumed. Every attempt append-only ledgered in
//               receipts/qrng-attempts.jsonl (+ usage.jsonl). No re-draw after
//               a seal for any reason (singleUse seed law).
//   MEASURE   : identical to slice-1 — deterministic offline replay of the
//               engine's extract pipeline over the THREE COMMITTED corpora;
//               validity gates must reproduce the committed engine receipts
//               (run-6 byte-exact; run-5 minus the two receipted post-fixer
//               cards) before any arm is trusted.
//   METRIC    : M(K) = (1/3) Σ_c [ μ_c(K) + f_c(K) ]; PASS iff a measured
//               bundle arm has M >= 1.05 x baseline AND totalF >= 15.
//   B         : bundle = certified QRNG lead + (B-1) top-noul fills;
//               B = max(1, ceil(3 * 0.7^t)), t = prior_e6_slices = 1 →
//               ceil(2.1) = 3. Only bundle arms are measured; the other 5 stay
//               frozen-unmeasured, never peeked.
//
// Stages:
//   node e6_slice2.mjs baseline            — validity gates + baseline metric
//                                            pin re-derivation (NO arms, $0)
//   node e6_slice2.mjs draw                — health gate + registered ladder →
//                                            ONE certified QRNG seal (lead arm)
//   node e6_slice2.mjs decide [--check]    — measure bundle + verdict;
//                                            --check re-derives and compares
//                                            (determinism receipt, ts excluded)
//   node e6_slice2.mjs determinism         — compare decide vs decide-check
//
// Spend caps (registered): typesafe 0 calls (priors reused); mothquantum <=3
// JOBS total for the draw ladder; $0 other. Abort line: external channel
// failure -> fail-closed honest partial, receipted (slice-1 precedent: a
// first-class result).

import { mkdirSync, writeFileSync, readFileSync, existsSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const FLEET = process.env.FLEET_SEEDS || '/home/z/my-project/fleet-seeds';
const SLICE1 = process.env.E6_SLICE1_DIR || join(HERE, '..', 'e6-slice-1');
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
  priors_slice1: join(SLICE1, 'receipts', 'priors.json'),
  health_probe: join(OUT, 'channel-health-probe-w63.json'),
  ...Object.fromEntries(WITNESS_RUNS.map((d, i) => [`witness_run${i + 1}`, join(RECEIPTS, d, 'witness.json')])),
};

// ---------- corpora (deterministic adapters over COMMITTED receipts) ----------
// VERBATIM from slice-1 (the proven instrumentation is reused, not reinvented).
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

// ---------- history state (M10 proposal side) — VERBATIM from slice-1 ----------
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

// ---------- extract pipeline port — VERBATIM from slice-1 ----------
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

// ---------- metric — VERBATIM from slice-1 ----------
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

// ---------- validity gates — VERBATIM from slice-1 ----------
function canonCandidates(list) { return JSON.stringify(list, null, 1) + '\n'; }
function validityGate(corpora) {
  const byName = Object.fromEntries(corpora.map((c) => [c.name, c]));
  const out = { ok: false, run6: null, run5: null, notes: [] };
  {
    const hist = historyState('run6');
    const r = extract(byName['run6-scout'], KEYS_BASELINE, hist);
    const committed = readFileSync(P.run6_cands, 'utf8');
    const derivedHist = { markers_n: hist.markers.length, previously_drawn: hist.previously_drawn.map((p) => `${p.run}:${p.id}`) };
    const committedHist = JSON.parse(readFileSync(P.run6_hist, 'utf8'));
    // LEDGER-EVENT AMENDMENT (pre-draw repair #1, receipted in registration.json):
    // slice-1's gate assumed the LIVE mines ledger still equals the run-6-time
    // ledger (11 rows, M1-M11). Mid-session, fleet-seeds engine run-7 (commit
    // 2bc52a5) appended M12 — a legitimate append-only ledger event that
    // slice-1's markers_n==11 equality could never survive. The amended check
    // proves MORE than the original: (a) the committed run-6 marker-id
    // sequence is a PREFIX of the live sequence (append-only, nothing
    // rewritten), (b) exactly the appended ids are recorded, and the
    // substantive replay-fidelity checks are unchanged: exclusions equal +
    // survivors BYTE-EQUAL committed run-6 under the live state.
    const committedIds = committedHist.mined_markers.map((m) => m.id);
    const derivedIds = hist.markers.map((m) => m.id);
    const ledgerPrefixOk = derivedIds.length >= committedIds.length && committedIds.every((id, i) => derivedIds[i] === id);
    const appendedIds = derivedIds.slice(committedIds.length);
    const histEqual =
      ledgerPrefixOk &&
      JSON.stringify(derivedHist.previously_drawn) === JSON.stringify(committedHist.previously_drawn.map((p) => `${p.run}:${p.id}`));
    const exclEqual = JSON.stringify(r.excluded.map((e) => [e.title, e.ref, e.matched])) ===
      JSON.stringify(committedHist.excluded.map((e) => [e.title, e.ref, e.matched]));
    const bytesEqual = canonCandidates(r.survivors) === committed;
    out.run6 = {
      history_state_matches_committed: histEqual,
      history_ledger_append_only_prefix: ledgerPrefixOk,
      history_ledger_committed_rows: committedIds.length,
      history_ledger_live_rows: derivedIds.length,
      history_ledger_appended_marker_ids: appendedIds,
      exclusions_match_committed: exclEqual,
      survivors_byte_equal_committed: bytesEqual,
      derived: derivedHist,
    };
    if (!histEqual || !exclEqual || !bytesEqual) out.notes.push('run-6 replay != committed run-6 receipt');
  }
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

// ---------- channel-health precondition (registered; fail-closed) ----------
// Re-verifies the wave-63 probe receipt BEFORE submitting any new job. The
// checked fields are exactly the certification fields whose absence killed
// slice-1's job #2 (CertError: entropy_report.budget_bits>0; random.hex).
function healthGate() {
  const o = JSON.parse(readFileSync(P.health_probe, 'utf8')).result.output;
  const er = o.entropy_report || {};
  const bw = o.bell_witness || {};
  const rnd = o.random || {};
  const checks = {
    health_passed_true: er.health_passed === true,
    budget_bits_positive: typeof er.budget_bits === 'number' && er.budget_bits > 0,
    h_bit_positive: typeof er.h_bit === 'number' && er.h_bit > 0,
    bell_witness_violates_classical: typeof bw.S === 'number' && typeof bw.classical_bound === 'number' && bw.S > bw.classical_bound,
    extractor_toeplitz: o.extractor && o.extractor.kind === 'toeplitz',
    random_hex_present: typeof rnd.hex === 'string' && rnd.hex.length >= 2 && rnd.hex.length % 2 === 0 && /^[0-9a-f]+$/.test(rnd.hex),
    random_bits_positive: Number(rnd.bits) > 0,
  };
  const ok = Object.values(checks).every(Boolean);
  return {
    ok,
    checks,
    receipt: 'receipts/channel-health-probe-w63.json',
    receipt_sha256: shaFile(P.health_probe),
    summary: {
      health_passed: er.health_passed ?? null,
      budget_bits: er.budget_bits ?? null,
      h_bit: er.h_bit ?? null,
      bell_S: bw.S ?? null,
      classical_bound: bw.classical_bound ?? null,
      delivered_bytes: rnd.bytes ?? null,
      delivered_bits: rnd.bits ?? null,
      requested_bytes: rnd.requested_bytes ?? null,
    },
    note: 'wave-63 keeper-lane channel-health probe, job 06884e96-1960-44f5-a7a4-3c59f24ad003 (provenance: channel-health-probe-w63.provenance.md); the probe drew no arm and selected nothing.',
  };
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
function loadArms(reg) {
  const arms = JSON.parse(readFileSync(join(HERE, 'arms.json'), 'utf8'));
  if (sha256(canonCandidates(arms.arms)) !== reg.arms_sha256) throw new Error('arms.json != registered arms_sha256 (fail-closed)');
  return arms;
}

if (stage === 'baseline') {
  const corpora = loadCorpora();
  const validity = validityGate(corpora);
  const hist = historyState('current');
  const base = metric(corpora, KEYS_BASELINE, hist);
  const reg = loadRegistration();
  const receipt = {
    kind: 'e6-slice-2-baseline', ts_utc: ts(),
    stage_note: 'pre-registration diagnostics ONLY: validity gates + baseline pin re-derivation against the slice-1 pin. No arms measured, no external spend. The arms space of record is slice-1\'s frozen arms.json (byte-identical copy in this lane; canon sha pinned in registration.json).',
    corpora: Object.fromEntries(corpora.map((c) => [c.name, { file: c.file, sha256: shaFile(c.file), items: c.items.length }])),
    validity, baseline: base, baseline_M: base.M, baseline_totalF: base.totalF,
    slice1_baseline_pin: { M: reg.baseline_M, totalF: reg.baseline_totalF, pin_match: base.M === reg.baseline_M && base.totalF === reg.baseline_totalF },
  };
  writeFileSync(join(OUT, 'baseline.json'), JSON.stringify(receipt, null, 1) + '\n');
  log(`validity: ${validity.ok ? 'OK' : 'FAILED — ' + validity.notes.join('; ')}`);
  for (const pc of base.per_corpus) log(`baseline ${pc.corpus}: pool=${pc.pool} pre=${pc.pre} survivors=${pc.f} mu=${pc.mu}`);
  log(`baseline M=${base.M} totalF=${base.totalF} (slice-1 pin ${receipt.slice1_baseline_pin.pin_match ? 'MATCH' : 'MISMATCH'})`);
  process.exit(base.ok !== false && validity.ok ? 0 : 1);
}

if (stage === 'draw') {
  const reg = loadRegistration();
  assertPins(reg);
  const arms = loadArms(reg);
  const at0 = ts();

  // (1) REGISTERED CHANNEL-HEALTH PRECONDITION — fail-closed before any job.
  const health = healthGate();
  if (!health.ok) {
    const w = { kind: 'e6-slice-2-qrng-witness', ts_utc: at0, ok: false, stage: 'health-precondition', health, error: 'channel-health precondition FAILED on the wave-63 probe receipt (fail-closed; no job submitted, no spend)' };
    writeFileSync(join(OUT, 'witness.json'), JSON.stringify(w, null, 1) + '\n');
    log('draw: HEALTH PRECONDITION FAILED (fail-closed, no job submitted, no spend)');
    process.exit(1);
  }
  log(`health precondition OK (probe: health_passed=${health.summary.health_passed} budget=${health.summary.budget_bits} bits, delivered ${health.summary.delivered_bits} bits)`);
  writeFileSync(join(OUT, 'health-gate.json'), JSON.stringify({ kind: 'e6-slice-2-health-gate', ts_utc: at0, ...health }, null, 1) + '\n');

  // (2) REGISTERED DRAW LADDER — <=3 jobs; direct -> prf -> prf; first
  // certified seal BINDS; every attempt ledgered. No re-draw after a seal.
  const LADDER = ['direct', 'prf', 'prf'];
  const attemptsPath = join(OUT, 'qrng-attempts.jsonl');
  const usagePath = join(OUT, 'usage.jsonl');
  const priorAttempts = existsSync(attemptsPath) ? readFileSync(attemptsPath, 'utf8').split('\n').filter((l) => l.trim()) : [];
  const jobsConsumedPrior = priorAttempts.map((l) => JSON.parse(l)).filter((a) => a.ok === false && a.job_consumed === true).length;
  const sealedPrior = priorAttempts.map((l) => JSON.parse(l)).some((a) => a.ok === true);
  if (sealedPrior) { log('draw: a certified seal already exists in this slice (first seal binds) — refusing to re-draw'); process.exit(1); }
  let sealed = null;
  for (let i = 0; i < LADDER.length; i++) {
    const attemptNo = jobsConsumedPrior + i + 1;
    if (attemptNo > reg.cost_rule.caps.moth_jobs_max) { log(`draw: <=${reg.cost_rule.caps.moth_jobs_max}-JOB cap consumed — stopping fail-closed before attempt ${attemptNo}`); break; }
    const stream = LADDER[i];
    const at = ts();
    try {
      const sealPath = join(OUT, 'qrng-seal.json');
      execFileSync('node', [
        join(FLEET, 'tools', 'moth-seal.mjs'),
        '--n=1', `--pool=${arms.arms.length}`, '--label=e6-slice-2-arm-draw',
        ...(stream === 'prf' ? ['--stream=prf'] : []),
        `--out=${sealPath}`, `--save-raw=${join(OUT, 'qrng-seal-raw.json')}`, '--quiet',
      ], { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, MOTH_KEY: process.env.MOTHQUANTUM_TOKEN || process.env.MOTH_KEY }, timeout: 180000 });
      const seal = JSON.parse(readFileSync(sealPath, 'utf8'));
      const sel = seal.chosen?.selected?.[0];
      const w = {
        kind: 'e6-slice-2-qrng-witness', ts_utc: at, ok: true, stage: 'seal',
        arms_sha256: reg.arms_sha256, seal_label: seal.label,
        drawn_index: sel, drawn_arm: arms.arms[sel]?.id ?? null,
        stream, ladder: LADDER, attempt_no: attemptNo,
        stream_note: stream === 'prf'
          ? 'certified bytes seed the registered SHA-256 counter stream (mothbits STEP 3 semantics); extension declared explicitly, effectiveEntropyBits in the certified receipt'
          : 'direct certified stream',
        certifiedBits: seal.certifiedBits ? {
          deliveredBytes: seal.certifiedBits.deliveredBytes, bits: seal.certifiedBits.bits, hBit: seal.certifiedBits.hBit,
          effectiveEntropyBits: seal.certifiedBits.effectiveEntropyBits, streamKind: seal.certifiedBits.stream,
          consumedBits: seal.certifiedBits.consumedBits, requiredBits: seal.certifiedBits.requiredBits,
        } : null,
        raw_result_sha256: seal.rawResultSha256 ?? null, job: seal.job ?? null,
        health_precondition: { ok: health.ok, receipt: health.receipt },
        note: 'certified comet-qrng-v1 Fisher-Yates over the frozen arm list; the drawn arm is the BINDING LEAD of the measured bundle (anti-cherry-pick: priors never choose what gets measured; THE FIRST CERTIFIED SEAL BINDS — no re-draw). Full certified receipt: qrng-seal.json; redacted raw: qrng-seal-raw.json; attempt history: qrng-attempts.jsonl.',
      };
      writeFileSync(join(OUT, 'witness.json'), JSON.stringify(w, null, 1) + '\n');
      appendFileSync(attemptsPath, JSON.stringify({ kind: 'qrng-attempt', at_utc: at, ok: true, attempt_no: attemptNo, stream, job_consumed: true, seal_issued: true, drawn_index: sel, drawn_arm: w.drawn_arm, jobId: seal.job?.jobId ?? null }) + '\n');
      appendFileSync(usagePath, JSON.stringify({ kind: 'usage-receipt', at_utc: at, service: 'mothquantum/api/v1/engines/comet-qrng-v1', unit: 'job', jobId: seal.job?.jobId ?? null, outcome: 'completed -> certified seal issued (e6-slice-2-arm-draw, attempt ' + attemptNo + ', stream ' + stream + ')' }) + '\n');
      log(`QRNG drew arm #${sel} (${w.drawn_arm}) on attempt ${attemptNo} (stream=${stream}) — SEALED, lead BINDS`);
      sealed = w;
      break;
    } catch (e) {
      const errText = String(e.message || e).replace(/moth_[A-Za-z0-9]+/g, 'REDACTED').slice(0, 400);
      // job_consumed: any fail-closed AFTER submit consumed a job (bit-budget
      // fail, CertError on a completed job, poll timeout). Local pre-submit
      // failures (keyless, usage) consumed nothing — keyed on the error text.
      const job_consumed = !/no MOTH_KEY/.test(errText);
      appendFileSync(attemptsPath, JSON.stringify({ kind: 'qrng-attempt', at_utc: at, ok: false, attempt_no: attemptNo, stream, job_consumed, seal_issued: false, error: errText }) + '\n');
      if (job_consumed) appendFileSync(usagePath, JSON.stringify({ kind: 'usage-receipt', at_utc: at, service: 'mothquantum/api/v1/engines/comet-qrng-v1', unit: 'job', jobId: null, outcome: 'fail-closed after submit, job CONSUMED, no seal issued (e6-slice-2-arm-draw attempt ' + attemptNo + ', stream ' + stream + '): ' + errText.slice(0, 160) }) + '\n');
      log(`draw attempt ${attemptNo} (stream=${stream}) FAILED fail-closed: ${errText.slice(0, 140)}`);
      if (!job_consumed) break; // keyless/local — retrying cannot help
    }
  }
  if (!sealed) {
    const w = { kind: 'e6-slice-2-qrng-witness', ts_utc: at0, ok: false, stage: 'ladder', ladder: LADDER, health: { ok: health.ok }, error: 'registered draw ladder exhausted (or cap consumed) with zero certified seals — fail-closed per the registered abort line; attempts ledgered in qrng-attempts.jsonl' };
    writeFileSync(join(OUT, 'witness.json'), JSON.stringify(w, null, 1) + '\n');
    process.exit(1);
  }
  process.exit(0);
}

if (stage === 'decide') {
  const check = process.argv.includes('--check');
  const reg = loadRegistration();
  assertPins(reg);
  const arms = loadArms(reg);
  const corpora = loadCorpora();

  const validity = validityGate(corpora);
  const hist = historyState('current');
  const base = metric(corpora, KEYS_BASELINE, hist);
  const basePinOk = base.M === reg.baseline_M && base.totalF === reg.baseline_totalF;

  // Priors of record: slice-1's sealed reflective battery, REUSED by
  // registration (pinned by sha via assertPins; binding re-asserted here).
  const priors = JSON.parse(readFileSync(P.priors_slice1, 'utf8'));
  const priorsBindingOk = priors.ok === true && priors.arms_sha256 === reg.arms_sha256;

  const witness = JSON.parse(readFileSync(join(OUT, 'witness.json'), 'utf8'));
  const health = healthGate();
  const attempts = existsSync(join(OUT, 'qrng-attempts.jsonl'))
    ? readFileSync(join(OUT, 'qrng-attempts.jsonl'), 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l)) : [];
  const jobsConsumed = attempts.filter((a) => a.job_consumed === true).length;
  const sealsIssued = attempts.filter((a) => a.seal_issued === true).length;

  // Registered abort line: external channel failure -> fail-closed honest
  // partial receipted (slice-1 precedent: a first-class result).
  if (!witness.ok || !priorsBindingOk) {
    const receipt = {
      kind: 'e6-slice-2-decide', ts_utc: ts(), check,
      verdict: 'HONEST-PARTIAL',
      partial_reason: !witness.ok
        ? 'qrng-draw-did-not-land on the recovered channel — per the registered abort line the decision procedure is fail-closed: no bundle, no arms measured, no promotion, NO PASS/FAIL claim on the mutation space. The 8 arms stay frozen-unmeasured. Cap accounting: ' + jobsConsumed + ' of <=3 registered JOBS consumed, ' + sealsIssued + ' certified seals issued (JOBS-based cap law — wave-62 lesson).'
        : 'priors-of-record binding failed (slice-1 priors sha ok but arms_sha256 mismatch or ok=false) — decision procedure fail-closed per registered abort line',
      validity, baseline_pin_ok: basePinOk, health_precondition: { ok: health.ok, receipt: health.receipt },
      baseline: { M: base.M, totalF: base.totalF, per_corpus: base.per_corpus.map(({ corpus, mu, f }) => ({ corpus, mu, f })) },
      priors: priorsBindingOk ? { source: 'slice-1 sealed priors.json (reused by registration)', arms_sha256: priors.arms_sha256 } : { source: 'slice-1 sealed priors.json', binding_ok: priorsBindingOk, error: 'binding failed' },
      seal: { ok: witness.ok, stream: witness.stream ?? null, stage: witness.stage ?? null, error: witness.error ?? null, attempts_ledger: 'receipts/qrng-attempts.jsonl' },
      cap_accounting: { law: 'moth cap registered in JOBS (wave-62 lesson: seals-issued accounting under-counts channel degradation)', jobs_consumed: jobsConsumed, jobs_max: reg.cost_rule.caps.moth_jobs_max, seals_issued: sealsIssued },
      arms_frozen_unmeasured: arms.arms.map((a) => a.id),
      cost_rule: { law: 'M10 (arXiv:2609.24972): added inference cost must be paid for by measured gain', spend: ['0 typesafe calls (priors of record reused from slice-1 — registered choice)', jobsConsumed + ' mothquantum comet jobs consumed, ' + sealsIssued + ' certified seals issued (ledgered)'], paid: 'NOT_PAID', settlement_note: 'the added spend bought: a receipted channel-recovery probe trail and a sealed fail-closed abort — not measured gain' },
    };
    writeFileSync(join(OUT, check ? 'decide-check.json' : 'decide.json'), JSON.stringify(receipt, null, 1) + '\n');
    log('decide: HONEST-PARTIAL — nothing measured, nothing promoted, fail-closed per registration');
    process.exit(1);
  }
  if (!validity.ok || !basePinOk) {
    const receipt = { kind: 'e6-slice-2-decide', ts_utc: ts(), check, verdict: 'INVALID-INSTRUMENTATION', validity, baseline_pin_ok: basePinOk, baseline_M: base.M };
    writeFileSync(join(OUT, check ? 'decide-check.json' : 'decide.json'), JSON.stringify(receipt, null, 1) + '\n');
    log('decide: INVALID-INSTRUMENTATION (fail-closed, nothing measured, nothing promoted)');
    process.exit(1);
  }

  // M4/M10 budget cap: bundle = QRNG lead + (B-1) top-noul fills. B = max(1,
  // ceil(B0*ANNEAL^t)), B0=3, ANNEAL=0.7, t = prior_e6_slices = 1 → B=3.
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
    kind: 'e6-slice-2-decide', ts_utc: ts(), check,
    verdict: pass ? 'PASS' : 'FAIL',
    lineage: 'slice-2 re-registration of slice-1 (HONEST-PARTIAL qrng-channel-degraded) on the recovered channel — same frozen arms (23eec18d…), same pinned baseline, same metric/margins',
    validity, baseline: { M: base.M, totalF: base.totalF, pin_ok: basePinOk, per_corpus: base.per_corpus },
    health_precondition: { ok: health.ok, receipt: health.receipt, summary: health.summary },
    priors: { source: 'slice-1 sealed priors.json (reused by registration, sha-pinned)', binding_ok: priorsBindingOk, model: priors.model, usage: priors.usage, fresh_calls_this_slice: 0, answers_note: 'reflective priors only — the certified QRNG lead picks what gets measured' },
    budget: { B0, ANNEAL, t, B, law: 'M4/M10: budget cap as selection pressure — only bundle arms measured; unmeasured arms stay frozen (receipted, never peeked)' },
    bundle: { lead, lead_rule: 'certified comet-qrng-v1 draw (anti-cherry-pick; FIRST CERTIFIED SEAL BINDS)', fills, fill_rule: 'deterministic descending noul prior (slice-1 sealed priors), index tie-break', measured_arm_ids: bundle, frozen_unmeasured_arm_ids: arms.arms.map((a) => a.id).filter((id) => !bundle.includes(id)) },
    seal: { jobId: witness.job?.jobId ?? null, stream: witness.stream, attempt_no: witness.attempt_no, certifiedBits: witness.certifiedBits, raw_result_sha256: witness.raw_result_sha256 },
    measured, pass_rule: reg.pass_rule, pass_margin_relative: reg.pass_margin_relative,
    promoted: promoted ? { id: promoted.id, old_key: promoted.old_key, new_key: promoted.new_key, M: promoted.M, totalF: promoted.totalF, proposed_KEYS: KEYS_BASELINE.map((k) => (k === promoted.old_key ? promoted.new_key : k)) } : null,
    cap_accounting: { law: 'moth cap registered in JOBS (wave-62 lesson)', jobs_consumed: jobsConsumed, jobs_max: reg.cost_rule.caps.moth_jobs_max, seals_issued: sealsIssued },
    cost_rule: { law: 'M10 (arXiv:2609.24972): added inference cost must be paid by measured gain', spend: ['0 typesafe calls (priors of record reused — registered choice)', jobsConsumed + ' mothquantum comet job(s) consumed, ' + sealsIssued + ' certified seal(s) issued'], paid: pass ? 'PAID' : 'NOT_PAID' },
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
  const rec = { kind: 'e6-slice-2-determinism', ts_utc: ts(), decide_sha256: sa, decide_check_sha256: sb, byte_identical_modulo_ts: sa === sb };
  writeFileSync(join(OUT, 'determinism.json'), JSON.stringify(rec, null, 1) + '\n');
  log(`determinism: ${rec.byte_identical_modulo_ts ? 'BYTE-IDENTICAL (modulo ts)' : 'DIVERGED — ' + sa.slice(0, 12) + ' vs ' + sb.slice(0, 12)}`);
  process.exit(rec.byte_identical_modulo_ts ? 0 : 1);
}

console.error('usage: e6_slice2.mjs baseline|draw|decide [--check]|determinism');
process.exit(2);
