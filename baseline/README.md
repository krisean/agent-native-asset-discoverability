# Baseline observations

Record observations before indexing or optimization. Use immutable JSON Lines files named `YYYY-MM-DD_<engine-or-agent>_<condition>.jsonl`. Each line must validate conceptually against `observation.schema.json`. Preserve result titles, URLs, rank, timestamp, locale, query ID, and raw evidence path. Do not rewrite old observations when results change.

## Provider labeling

Use the exact agent/tool identity visible during collection. Do not infer an upstream provider. The initial pilot file is collected with Devin's `web_search` tool; its provider, geography, and personalization are unspecified. It is not a Google or Bing baseline. Claude Code and Cursor results require fresh sessions in those products and must not be backfilled from Devin results.
