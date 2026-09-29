# Protocol Amendment 002: New-Asset Indexing Latency

- Recorded: 2026-09-29
- Status: prospective; no new post-launch asset has been published
- Relationship to primary study: secondary longitudinal measurement

## Question

After the domain has established crawl and indexing history, are newly published sound-effect pages discovered, indexed, and retrieved faster than the original launch cohort?

## Separation from A/B/E screen

Do not publish new assets during a frozen A, B, or E window. Changing the corpus would confound metadata-condition comparisons. Run the new-asset latency study after the primary A/B/E screen, or in a separately registered post-screen phase.

## Cohorts

- **Launch cohort:** the 30 assets present when Condition A indexing was enabled.
- **New-asset cohort:** a fixed holdout set of at least six legitimate, distinct effects generated and hashed before publication, then released together at a registered UTC timestamp after the primary screen.

Record domain age at publication. Comparisons are observational: launch and new-asset cohorts differ in calendar time and domain maturity.

## Lifecycle events

For every new asset, record evidence-backed UTC events:

1. `generated` — immutable files and metadata created; include SHA-256 hashes.
2. `published` — canonical page first returns 200 publicly.
3. `sitemap_included` — URL first appears in the public sitemap.
4. `crawler_requested` — first verified crawler request, when logs expose one.
5. `indexed` — first provider-specific indexed appearance.
6. `exact_title_visible` — first exact quoted-title result.
7. `semantic_query_visible` — first frozen semantic-query result.
8. `agent_retrieved` — first independent coding-agent retrieval.
9. `agent_selected` — first independent coding-agent selection.

A missing event remains null; do not substitute the observation time or infer crawler identity.

## Measurements

Calculate from `published`:

- Sitemap latency
- Crawler discovery latency
- Indexing latency by provider
- Exact-title visibility latency
- Semantic-query visibility latency
- Agent retrieval latency by agent/tool
- Agent selection latency by agent/tool

Report right-censored assets at the end of the observation window. Use medians and ranges only when sample size permits; retain per-asset values.

## Observation schedule

Check at publication, 1 hour, 6 hours, 24 hours, 72 hours, and 7 days. Use the same exact-title and frozen semantic queries for every check. Record actual tools/providers exactly as in Protocol Amendment 001.

## Interpretation

Faster new-asset indexing would support a domain-history effect, not prove that metadata caused the improvement. Failure to improve remains informative. This secondary study must not retroactively alter the primary A/B/E outcome.
