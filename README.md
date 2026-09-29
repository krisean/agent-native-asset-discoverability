# Agent-Native Asset Discoverability Experiment

A reproducible research project for testing whether a small, legitimate sound-effect library with rich semantic and content-derived metadata is organically discovered, selected, verified, and integrated by autonomous coding agents.

## Status

Condition A is publicly deployed at **https://assets.playnow.social** with 30 CC0 effects and indexing enabled. The source, corpus generator, crawlable website, later-condition API, frozen benchmark, raw observation formats, analysis pipeline, and report templates are published here for reproducibility.

The initial and unscheduled diagnostic observations are recorded, but independent-agent trials have not yet been run. They require fresh uninformed Devin, Claude Code, or Cursor environments and will not be fabricated from this repository or the informed research session.

- Live library: https://assets.playnow.social
- Public projects directory: https://www.playnow.social
- Condition history: [`metadata/conditions.json`](metadata/conditions.json)
- Current protocol: [`reports/protocol-amendment-001.md`](reports/protocol-amendment-001.md)

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
