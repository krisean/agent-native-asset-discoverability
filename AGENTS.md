# Project instructions

- Install dependencies with `npm install`.
- Run the full local verification with `npm run verify`.
- Start the SSR website/API with `npm start`; set `PUBLIC_ORIGIN` to the deployed canonical origin.
- Generated audio and metadata are deterministic outputs of `scripts/generate-corpus.js` and are intentionally versionable experiment artifacts.
- Never alter a deployed condition silently. Append a condition record, preserve old observations/trials, and distinguish baseline from intervention.
- Never deploy metadata/audio mismatch fixtures publicly; they are private verification-test material only.
