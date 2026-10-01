# Channel-health probe receipt — provenance note (wave 63)

- **What**: certified-channel health probe of `comet-qrng-v1`, submitted by the
  wave-63 keeper lane BEFORE this slice-2 registration was written (the
  registered next-probe of slice-1's verdict required a recovered channel as a
  precondition, so the fleet probed the channel first and this registration
  adopts that probe as its channel-health precondition of record).
- **Probe job**: `06884e96-1960-44f5-a7a4-3c59f24ad003` (mothquantum comet-qrng-v1;
  jobId as reported by the wave-63 probe dispatch — the result payload itself
  does not echo the id, so the binding here is source-path + byte hash).
- **How it ran**: the keeper lane's probe script `scripts/probe63c.mjs`
  (typesafe leg + mothquantum `GET /engines` + the comet-qrng-v1 probe job
  whose result is receipted here). Payload timestamps of record: built
  `2026-10-01T22:59:55+00:00`, committed `2026-10-01T22:59:56+00:00`,
  formatted `2026-10-01T23:00:03+00:00` (from
  `result.output.provenance` / `result.output.pulse.timestamp`).
- **Lane 63-d-r verification**: the receipt was re-verified byte-identical to
  the source file at reconciliation time (sha256
  `5d2f94fc16fb0a04fca284584993eea4aa68b5c738369fa3e3852e6e23014498`
  recomputed on BOTH paths) and the certification fields were re-derived from
  the payload (health_passed / budget_bits / h_bit / CHSH S / toeplitz /
  random.hex+bits) — the same checks `e6_slice2.mjs draw` re-runs fail-closed
  before submitting any job.
- **Raw result**: saved by the keeper lane at
  `/home/z/my-project/scripts/probe63_moth_result.json`, then copied into this
  lane **byte-identical** as `receipts/channel-health-probe-w63.json`
  (sha256 `5d2f94fc16fb0a04fca284584993eea4aa68b5c738369fa3e3852e6e23014498` —
  recompute against the source path to verify).
- **Probe outcome** (from the payload): `entropy_report.health_passed = true`;
  `budget_bits = 1264.6849661751767`; CHSH bell witness
  `S = 2.8193359375 > classical_bound 2` (violates classical bound, 3σ);
  Toeplitz extractor receipt present; `random.hex` present — 142 bytes / 1136
  extracted bits delivered (requested 512, budget-limited). **A FULL
  certification payload** — exactly the fields whose absence fail-closed
  slice-1's job #2 (`CertError: entropy_report.budget_bits>0; random.hex`).
- **Role in this slice**: registered precondition for the draw stage —
  `e6_slice2.mjs draw` re-verifies these fields from THIS receipt (fail-closed)
  before submitting any new job. The probe job itself was keeper-lane spend
  (channel operations, not E6 arm-selection spend) and is receipted here for
  provenance; it drew no arm and selected nothing.
