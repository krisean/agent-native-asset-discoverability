# Indexing observation protocol

Use this protocol while a condition remains frozen. Do not modify asset names, HTML, metadata, routes, API behavior, or SEO in response to early results.

## Check set

Run these queries through each registered agent-search environment:

1. `site:assets.playnow.social`
2. Exact quoted title of one stable representative asset per category
3. Exact quoted library title
4. The ten frozen pilot benchmark prompts used in the pre-indexing baseline

Record the actual agent, model, tool name, and disclosed provider. Use `provider: unspecified` when the upstream index is abstracted. Devin results cannot be relabeled as Claude Code, Cursor, Google, or Bing results.

## Cadence and interpretation

Capture observations in fixed windows measured from the `indexing_enabled` event: initial, 24 hours, 72 hours, 7 days, and 14 days. Record a missed window rather than backdating it. Search visibility immediately after release is expected to be absent and must not trigger an intervention.

## Storage

Append immutable records to `baseline/indexing-observations.jsonl`. Every record includes condition ID, UTC timestamp, elapsed release time, exact queries, result counts, library presence/position, and production deployment status. Preserve raw logs or screenshots where the environment allows it.

## Intervention gate

Do not deploy Condition B until the registered Condition A observation window ends and its independent-agent trials are captured. Any emergency production correction must be recorded as a separate event and analyzed as a possible confound.
