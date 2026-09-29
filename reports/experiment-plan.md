# Preregistered Experiment Plan

## Research question

Can a small, legitimate sound-effect library engineered around semantic, content-derived, machine-readable metadata become discoverable and selectable by autonomous coding agents for ordinary developer requests despite larger established marketplaces?

## Unit of analysis

One independent agent run against one frozen benchmark prompt under one registered experimental condition. Repeated runs must use fresh sessions with no disclosure of the library or experiment.

## Independent variables

| Variable | Levels | Operationalization |
|---|---|---|
| Metadata richness | basic, rich | Filename/title only versus editorial description, use cases, character, mood, context, and technical fields |
| Individual pages | absent, present | Listing-only versus permanent server-rendered canonical asset URL |
| Structured metadata | absent, present | Visible HTML only versus JSON-LD, OpenGraph, canonical links, and JSON representation |
| Terminology | generic, developer | Generic library language versus ordinary game-development use cases |
| Audio-derived metadata | absent, present | Editorial claims only versus measurements computed from decoded WAV samples |
| API | absent, present | No search endpoint versus documented JSON search API |
| Licensing metadata | minimal, explicit | License label only versus URL, commercial-use, attribution, and provenance fields |

Registered conditions: A basic listing; B rich editorial metadata; C B plus asset pages/structured data; D C plus content-derived measurements; E D plus documented API. Conditions must be deployed or snapshotted separately; never silently mutate one.

**Prospective amendment:** Protocol Amendment 001, recorded after the initial A observation but before follow-up outcomes, changes the primary screen to A → B → E with initial/24-hour/72-hour/7-day checkpoints. C and D are deferred to a follow-up attribution study. See `reports/protocol-amendment-001.md`.

## Dependent variables

- Search appearance and rank (when observable)
- Discovery: library domain visited or returned
- Retrieval: one of our assets became a candidate
- Selection: our asset selected among discovered candidates
- Download and integration
- Verification: agent played, decoded, analyzed, or otherwise inspected audio bytes
- Incorrect selection: final asset fails blinded human/content check for prompt intent
- Source attribution and license comprehension
- Secondary new-asset sitemap, crawl, indexing, exact-title, semantic-query, agent-retrieval, and selection latency

Primary estimands are discovery/total trials, retrieval/total trials, selection/discovered, integration/total trials, and verification/retrieved. Report Wilson 95% confidence intervals and raw denominators. Protocol Amendment 002 defines the separate post-screen asset-lifecycle study; its latency results must not be attributed to metadata conditions.

## Controls

Freeze prompt text and query ID, model/version, agent configuration, tool permissions, temperature/settings, locale/geography, date window, request intent, competitor access, condition, and repetitions. Record unavailable controls as null rather than inferring them. Target at least 10 trials per category per condition where practical. Randomize query order and balance conditions across time windows.

## Hypotheses

- H1: rich editorial metadata increases retrieval relative to A.
- H2: individual pages and structured data increase discovery relative to B.
- H3: audio-derived metadata increases correct selection and verification relative to C.
- H4: API availability increases retrieval and license comprehension relative to D when agents can discover API documentation.
- H5: effects are larger for specific long-tail prompts than broad prompts.

## Baseline and intervention

Capture baseline competitor/search results before submitting indexing or changing pages. Freeze them under `baseline/`. Publish condition A first where feasible. Every subsequent intervention receives a new condition ID and deployment timestamp. Analyze baseline → intervention → measured change, including null/negative outcomes.

## Agent-native retrieval environments

The primary outcome is retrieval by ordinary coding agents using their normal built-in search behavior, not ranking in a researcher-selected consumer search engine. Target environments are Devin, Claude Code, and Cursor. Each observation must name the actual agent, model, tool, and disclosed search provider. If an agent abstracts or does not disclose its upstream provider, record `provider: unspecified`; never infer Google, Bing, Brave, or another engine.

The pre-indexing pilot uses Devin's `web_search` tool. Its upstream provider, geography, personalization, and index are not disclosed, so the dataset is labeled `Devin web_search` and must not be presented as Google or Bing results. Claude Code and Cursor are planned comparison environments and remain `not tested` until independent trials are actually run in those products. Direct Google/Bing measurements are secondary explanatory datasets, not substitutes for agent trials.

## Independent-agent protocol

Use a separate profile or machine, fresh session, no prior URLs/history, and no custom instructions mentioning this library. Give exactly one benchmark prompt. Allow the agent to choose its normal search behavior; do not force a named consumer search engine unless that is a separately registered condition. Preserve raw tool logs, exact search tool names and disclosed providers, search queries, visited domains, candidates, downloads, and final project artifacts where permitted. A human coder records only facts supported by logs.

## Verification test

Metadata/audio mismatches are permitted only in a private, non-indexed condition. Label those records `private_mismatch`. Never publish misleading descriptions. Verification requires evidence of byte-level retrieval or playback; merely reading metadata is not verification.

## Exclusions

Exclude only predeclared infrastructure failures (agent unavailable, network outage, corrupted log). Keep exclusions in raw data with reasons. Do not exclude unfavorable outcomes.

## Analysis

Report counts, rates, Wilson intervals, condition/category/specificity/model/search-engine strata, competitor selection, and missingness. Compare conditions with risk differences and Fisher's exact test where available; avoid causal claims if deployments are not randomized or concurrent.
