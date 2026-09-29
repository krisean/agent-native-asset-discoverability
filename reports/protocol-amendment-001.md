# Protocol Amendment 001: Accelerated Screening Design

- Recorded: 2026-09-29T19:56:38Z
- Timing: after the initial Condition A indexing observation and before any scheduled follow-up or agent trial outcome
- Status: prospective; no observed follow-up result motivated this change

## Rationale

Five sequential 14-day public conditions would require at least 70 observation days and would delay the main agent-retrieval measurement. The first study is therefore changed to a screening design that tests the largest expected feature bundles. The complete A–E decomposition remains a follow-up study if the screen shows a signal.

## Primary screening conditions

1. **A — Basic:** crawlable listing, permanent asset/category pages, previews/downloads, and minimal license label.
2. **B — Semantic + structured:** A plus rich editorial metadata, developer-oriented descriptions, explicit licensing/provenance, canonical metadata, OpenGraph, and JSON-LD.
3. **E — Agent-native:** B plus content-derived audio metadata, documented JSON representations, and the retrieval API.

Conditions C and D are not erased. They are deferred to a second-stage attribution study designed to isolate structured data and MIR metadata if B or E improves retrieval.

## Observation windows

Each public condition is frozen for a maximum of seven days. Measurements occur at:

- Initial release
- 24 hours
- 72 hours
- 7 days

The condition ends at the seven-day checkpoint whether discovery is positive or zero. A missed checkpoint is recorded, not backfilled.

## Agent screening trials

At each checkpoint, use two frozen prompts per category: one broad and one specific where available. Two independent repetitions produce 40 assigned trials per agent and condition (10 categories × 2 prompts × 2 repetitions). Devin, Claude Code, and Cursor should run in the same date window where access permits. An unavailable environment is reported as not tested.

The existing 120-run Devin manifest remains preserved but is superseded before execution by the 40-run screening manifest. No outcomes were collected under the superseded manifest.

## Interpretation

This design estimates bundled effects for A → B → E. It does not identify the isolated causal contribution of JSON-LD, content-derived metadata, or API availability. Any such claims require the deferred C/D attribution study. All reports must distinguish this amendment from the original five-condition plan.
