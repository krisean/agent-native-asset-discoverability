# Wave 1 Wrap-Up: Condition A Outcome and Competitor Analysis

- Recorded: 2026-10-06T20:30:00Z
- Condition: `A-public-1.0.0` (basic listing; no rich metadata, structured data, derived measurements, or API)
- Observation window: 2026-09-29T19:41:33Z to 2026-10-06T19:41:33Z (7 days, closed)
- Evidence base: `baseline/2026-09-29_web-search_A-public-1.0.0.jsonl` (pre-indexing pilot), `baseline/indexing-observations.jsonl` (initial, unscheduled diagnostics, 24h, 7d; 72h missed and recorded as missed)

## Condition A outcome

Zero appearances of `assets.playnow.social` across all 13 registered queries at every Devin `web_search` checkpoint (provider unspecified). No GitHub repository result and no `www.playnow.social` result surfaced as an intermediary discovery path. Owner-performed Google searches confirmed Google index presence at ~9.6h, so the provider serving `web_search` had not surfaced the domain through day 7. Production serving remained healthy throughout (homepage, robots, sitemap, asset page, audio all 200; sitemap 39 URLs; robots `Allow: /`).

Agent screening trials (40-run manifest `trials/manifest_A-public-1.0.0_devin_screening-a-20260929.json`) were not executed during the window; recorded as not collected rather than backfilled. A-result interpretation is therefore limited to the indexing/search-appearance funnel; no retrieval or selection evidence exists for condition A.

## Competitor census

Domains observed across the pilot baseline and all indexing observations, grouped by strategy:

### Incumbent UGC and marketplace libraries
- `freesound.org` — dominant across nearly every intent prompt; wins on depth of corpus, per-asset pages, ratings, tags, and license labels. Appeared in 6 of 10 benchmark categories at 7d.
- `zapsplat.com`, `audiojungle.net`, `storyblocks.com`, `epidemicsound.com`, `tunetank.com` — commercial libraries with per-asset SEO pages.
- `itch.io` (incl. `elvgames.itch.io`, `roquerx.itch.io`, `sound-digitator.itch.io`) — asset packs; strong on broad "pack" phrasing.
- `assetstore.unity.com`, `qlcomp.com`, `killereks.github.io` — tooling that *includes* sounds rather than sound libraries; wins where prompts imply engine integration (footsteps).

### Free-download SEO sites (fast-growing cohort)
- `sonilo.com` — appeared twice at 7d for the UI-click prompt. Per-asset pages carry `AudioObject` JSON-LD (name, description, `contentUrl`, `encodingFormat`, `duration`, keywords, `isAccessibleForFree`, `license` URL), `Organization`/`WebSite`/`BreadcrumbList` graphs, OpenGraph, canonical links, direct WAV+MP3 downloads, editorial quality notes with measured loudness ("-19.4 LUFS, instant onset"), and a license certificate. This is effectively a deployed condition-B/E-shaped competitor, and this provider's renderer exposes its JSON-LD in results.
- `beeps.studio` — appeared at 7d for "I need a subtle error beep." Explicitly agent-oriented: publishes `llms.txt`, a `/api/sounds` JSON endpoint, per-sound technical parameters (pitch trajectory in Hz/ms, ADSR envelope, filter settings, voice count), and behavioral usage rules ("play when / not when"). Closest observed analogue to the experiment's condition E design.
- `dailysounds.org`, `bestsoundboard.com`, `soundboardnow.com`, `soundeffectsnow.com`, `unstuntedsfx.net`, `freesoundslibrary.com`, `hooksounds.com`, `tunepocket.com`, `ideatogame.com`, `static-fm.com`, `noctunea.com`, `ambientnoise.io`, `ambient-mixer.com`, `mixrelax.com`, `tunetank.com` — keyword-targeted landing pages, mostly editorial text + instant download; some (static-fm, noctunea) are interactive generators rather than file libraries.

### Developer ecosystems and code communities
- `github.com` (Questie, PlayerFootstep, discord-quest-completer, vcmp-steam-like-notifications, SimpleMsgPlugin) — code repos answer prompts phrased as implementation needs ("add a sound when..."). Notably, none of the returned GitHub results linked to the experiment's public repository, so the GitHub intermediary path produced zero discovery for our library.
- `spigotmc.org`, `curseforge.com`, `wowinterface.com`, `betonquest.org`, `docs.api.8crafter.com`, `docs.lonexlabs.com`, `pypi.org` — game-mod and platform docs that ship or reference sounds.

### Unrelated / token-collision results
- `demos.creative-tim.com`, `softui-css.netlify.app`, `creative-tim.com` — "Soft UI" CSS frameworks matched `"Soft UI Notification 01"`.
- `playnow.com` (Canadian gambling operator), `play.google.com`, `soundcloud.com`, `trademarkelite.com` — matched `"PlayNow Sound Effects"` on the brand token alone; not sound-effect competitors.

## Implications for the next phase

1. **Structured data plausibly matters to this provider.** sonilo.com's appearance at 7d — within days of its asset `uploadDate` (2026-10-02, ~4 days old) — coincides with per-asset `AudioObject` JSON-LD that this provider surfaces verbatim. Under Amendment 001 this cannot be attributed causally to JSON-LD, but it is direct observational evidence that a similarly-shaped, freshly published competitor reached visibility inside one checkpoint window where our minimal condition did not.
2. **Agent-oriented interfaces exist in-market.** beeps.studio already exposes `llms.txt`, a JSON API, and selection rules. Condition E's API and derived-measurement features are no longer hypothetical differentiators; they are the existing bar for one observed competitor.
3. **Selection pressure favors actionable pages.** Winners pair the listing with instant multi-format download, explicit license, and descriptive editorial copy. Condition B's rich metadata + explicit licensing targets exactly this gap versus A.
4. **Brand-token fragility.** "PlayNow" collides with an established gambling operator; the compact token surfaced `playnow.com` and the older `events.playnow.social` subdomain in earlier diagnostics. Exact-title and semantic prompts, not brand queries, are the realistic discovery surface.
5. **Non-library results absorb intent prompts.** Engine plugins, mods, and code repos win "add a sound when X" phrasing. Developer-terminology framing (condition B) is the designed counter.

## Readiness checklist for condition B (`B-public-1.0.0` pending registration/deployment)

- [ ] Register `B-public-1.0.0` in `metadata/conditions.json` as `prepared_predeployment` before any public deploy; deploy as a separate immutable release, never a silent A mutation.
- [ ] Capture the pre-deployment state and a fresh pre-indexing baseline only if required by protocol (the frozen pilot benchmark already exists and remains the comparison set).
- [ ] Keep IndexNow submission and console sitemap submission timing recorded as separate intervention events, as with A.
- [ ] After B's `indexing_enabled` event, create the 40-run screening manifest: `node scripts/create-run-manifest.js --condition=B-public-1.0.0 --agent=devin --model=<version> --repetitions=2 --queries-per-intent=2 --seed=<published-seed>`.
- [ ] Schedule all four checkpoints (initial, 24h, 72h, 7d) at registration; the A-wave 72h miss is recorded, not repeated silently.
- [ ] Agent trials require fresh independent sessions with no disclosure of the library; they cannot be run from the session that produced these indexing observations.
- [ ] Claude Code and Cursor remain `not tested` until actual independent trials run in those products.
