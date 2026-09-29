# Agent-Native Asset Discoverability Experiment

A reproducible research project for testing whether a small, legitimate sound-effect library with rich semantic and content-derived metadata is organically discovered, selected, verified, and integrated by autonomous coding agents.

## Status

This repository supplies the corpus generator, crawlable website, JSON API, benchmark queries, trial schemas, analysis pipeline, and report templates. Publishing, search-engine indexing, and independent-agent trials require an external public deployment and fresh agent environments; they are intentionally not fabricated locally.

## Quick start

```bash
npm install
npm run generate
npm test
npm start
```

Open `http://localhost:3000`. Override the canonical public origin with `PUBLIC_ORIGIN=https://your-domain.example`.

Analyze recorded trials:

```bash
npm run analyze
```

## Layout

- `assets/` generated WAV masters and OGG distributions
- `metadata/` canonical asset records, JSON Schema, corpus manifest, and condition history
- `website/` server-rendered public site
- `api/` OpenAPI documentation and shared retrieval logic
- `queries/` fixed benchmark and query schema
- `baseline/` baseline observation records
- `trials/` raw independent-agent trial records
- `analysis/` statistical analysis and generated summaries
- `reports/` preregistration, protocol, and final report template
- `scripts/` deterministic corpus and benchmark generators
- `tests/` API, metadata, and experiment integrity tests

## Experimental integrity

`metadata/conditions.json` is an append-only condition registry. Never overwrite baseline observations or raw trials. Any change to names, assets, metadata, API, site structure, SEO, or query data must create a new condition ID and record the Git commit, timestamp, and rationale. Public deceptive metadata is out of scope; mismatch assets may only be used in isolated private verification tests.

## License

Generated audio and metadata are released under CC0-1.0 for this experiment. The software is MIT-licensed. See `LICENSE-ASSETS.txt` and `LICENSE`.
