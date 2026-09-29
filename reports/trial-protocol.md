# Trial execution protocol

1. Select a registered condition and freeze its public deployment.
2. Randomize benchmark query order using a recorded seed; preassign model/condition blocks.
3. Start a fresh agent session/profile with normal tools and no mention of the domain, API, asset names, or experiment.
4. Submit the benchmark `prompt` verbatim. Do not help the agent search.
5. Preserve raw agent/tool logs and final project artifacts. Hash raw logs with SHA-256.
6. Record every issued search query, visited domain, candidate asset, download, and integration supported by evidence.
7. Mark discovery when the library appears in results or is visited; retrieval when an asset becomes a considered candidate; selection when chosen; integration only when used in the generated project.
8. Mark `audio_inspected` only for playback, decoding, waveform/spectral analysis, or another byte-level inspection. Reading metadata is insufficient.
9. Record license comprehension as correct, incorrect, or not stated. Record negative outcomes unchanged.
10. Validate the trial, append it under `trials/`, and never edit it after analysis begins. Corrections are new records linked in notes.

Infrastructure failures remain recorded as excluded with a preregistered reason. Search/model drift, indexing delay, personalization, geography, and unavailable settings must be retained as limitations.
