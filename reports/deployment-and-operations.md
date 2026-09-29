# Deployment and experiment operations

## Public deployment

Build with `docker build -t agent-native-sfx .` or deploy as a Node 22 service. Set `PUBLIC_ORIGIN` to the final HTTPS origin before indexing; canonical URLs, API URLs, robots.txt, and sitemap derive from it. Persist the exact source commit, condition ID, image digest, deploy time, and origin in a new append-only `metadata/conditions.json` entry.

Before public launch, replace the placeholder JSON Schema `$id` with the real origin as a versioned condition change. Verify `/robots.txt`, `/sitemap.xml`, `/openapi.json`, representative asset HTML without JavaScript, byte-range media delivery at the hosting layer, and direct OGG/WAV downloads.

## Baseline

Capture baseline observations before search-engine submission and before modifying pages from measured feedback. Store JSONL records and evidence hashes under `baseline/`. Search-console metrics explain results but are not the primary outcome.

## Run manifests

Create randomized assignments without invoking or priming an agent:

```bash
node scripts/create-run-manifest.js --condition=A-public-1.0.0 --agent=agent-name --model=model-version --repetitions=10 --seed=published-seed
```

Execute each row in a fresh environment using the exact prompt. The script deliberately does not automate undisclosed third-party agent sessions because model authentication, UI behavior, and independent-session guarantees are platform-specific. Record outcomes against `trials/trial.schema.json` and retain raw evidence.

## Indexing and ablation

Use separate immutable deployments or dated snapshots for A–E. Do not expose multiple near-duplicate public variants solely for indexing; this risks confounding and duplicate-page behavior. Prefer sequential, preregistered conditions with fixed observation windows, or distinct robots-restricted research hosts when search discoverability is not the outcome.

## Private mismatch condition

Host mismatch fixtures only on an access-controlled, non-indexed endpoint. Mark records `private_mismatch`; never include those URLs in sitemap, public API, catalog, or search-engine submissions.

## External work not reproducible locally

Domain/DNS, hosting credentials, search-console ownership, indexing delays, geographic profiles, and fresh independent agent accounts require operator-controlled infrastructure. They must be measured rather than simulated. A local successful test is not evidence of organic discoverability.
