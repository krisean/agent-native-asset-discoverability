# Baseline observations

Record observations before indexing or optimization. Use immutable JSON Lines files named `YYYY-MM-DD_<engine-or-agent>_<condition>.jsonl`. Each line must validate conceptually against `observation.schema.json`. Preserve result titles, URLs, rank, timestamp, locale, query ID, and raw evidence path. Do not rewrite old observations when results change.
