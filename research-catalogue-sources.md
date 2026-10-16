# Research: Catalogue Sources — Local JSON vs TMDB vs OMDb

Ticket: #3 (child of map #1) — survey catalogue options for MVP emotion-based movie recommender (~50–100 movies).
Recommendation up front: **local-curated JSON for v1, with a future live-API path (TMDB-first).**

## 1. Options compared

| Dimension | Curated local JSON (~50–100 movies) | TMDB API (v3) | OMDb API |
|---|---|---|---|
| Cost | Free, no key, no quota | Free for non-commercial use with attribution; commercial use needs a separate written agreement (custom pricing, contact sales) | Free key: 1,000 req/day; higher limits + Poster API via Patreon pledge (from ~$1/mo) |
| Rate limits | None (local file) | Legacy 40 req/10s limit disabled (Dec 2019); current guidance ≈ 40 req/sec upper bound, respect `429` | 1,000/day free cap; patron tiers raise it (exact per-tier caps on Patreon page) |
| Licensing | We own the curation; poster/synopsis text still third-party copyright — use TMDB-sourced or short original blurbs, attribute | Non-commercial free w/ attribution (logo + "This product uses the TMDB API but is not endorsed or certified by TMDB"); commercial = negotiated licence | All content CC BY-NC 4.0 — non-commercial only regardless of tier; no commercial path |
| Fields (vs MVP needs: title, year, genre, synopsis, rating, poster) | Whatever schema we define; seed from TMDB/OMDb then freeze | `title`, `release_date`, `genres[]`, `overview`, `vote_average`/`vote_count`, `poster_path`/`backdrop_path`, `runtime`, `tagline`, `imdb_id`, `popularity` | `Title`, `Year`, `Genre`, `Plot` (short/full), `Ratings[]` (IMDb + Rotten Tomatoes + Metacritic), `Poster`, plus `Director`, `Actors`, `Runtime`, `Awards` |
| Emotion tags | Native: add `emotions[]` (+ intensity) per movie at curation time | No emotion/mood field; tags must live in our layer, keyed by `tmdb_id` (and/or `imdb_id`) | No emotion/mood field; same — our layer keyed by `imdbID` |
| Availability risk | Zero (ships with app, works offline) | No SLA; key management + network + attribution/logo obligations | One-maintainer service; poster API patron-gated; slower evolution |

## 2. Findings (with sources)

### TMDB
- Free for non-commercial use "as long as you attribute TMDB as the source of the data and/or images"; commercial use requires contacting TMDB sales for a licence. Source: TMDB developer FAQ (`developer.themoviedb.org/docs/faq`).
- Attribution = TMDB logo in app (unmodified, less prominent than own branding) + notice "This product uses the TMDB API but is not endorsed or certified by TMDB." Source: same FAQ.
- Rate limiting: legacy 40 req/10s disabled Dec 16, 2019; current upper bound "somewhere in the 40 requests per second range", subject to change, respect `429`. Source: `developer.themoviedb.org/docs/rate-limiting`.
- Movie-details payload covers all MVP fields (`title`, `release_date`, `genres`, `overview`, `vote_average`, `poster_path`, etc.). Source: `developer.themoviedb.org/reference/movie-details` (example: Star Wars, id 11).
- No emotion/mood tags in the API — recommender affect layer must be ours, joined on `id`/`imdb_id`.
- Note: TMDB terms-of-use page itself returned 403 to the fetcher, so full ToU (incl. the widely-cited 6-month cache cap) was verified only via secondary summaries — re-check before storing TMDB data long-term.

### OMDb
- Free key = 1,000 daily limit; Poster API patron-only (280k+ posters, up to 2000×3000). Source: `omdbapi.com` front page + `omdbapi.com/apikey.aspx`.
- Paid path is Patreon pledge (from ~$1/mo) raising daily quota; no metered billing. Source: `omdbapi.com/apikey.aspx` + Patreon-linked pricing summaries.
- Licence: "All content licensed under CC BY-NC 4.0" (site footer, `omdbapi.com`) — non-commercial only, so no commercial upgrade path unlike TMDB.
- Single REST endpoint with `t=` (title) / `i=` (IMDb ID) / `s=` (search), `plot=short|full`, `r=json|xml`. Strength: aggregated ratings (IMDb + RT + Metacritic) in one response. Source: `omdbapi.com` Usage/Parameters tables.
- No emotion tags either; join on `imdbID`.

### Local-curated JSON
- No source to cite: it is a build decision. 50–100 records with a fixed schema is trivial to ship, version, and test; works offline; zero key/quota/attribution-logo burden at runtime (attribute seed sources once in README/About instead).
- Proposed v1 schema (unblocks catalogue-schema decision):
  `id, title, year, genres[], synopsis, rating (0–10 + source label), poster_url, emotions[] ({label, intensity 0–1}), tmdb_id?, imdb_id?`
  Keeping optional `tmdb_id`/`imdb_id` from day one makes the future live-API path a pure enrichment step.

## 3. Recommendation

1. **v1: ship local-curated JSON** (~50–100 movies, schema above). Deterministic, offline, no keys/quotas, emotion tags are first-class data rather than a bolt-on.
2. **Seed it from TMDB** (rich overviews, posters, genre ids) with OMDb as ratings cross-check (RT/Metacritic where TMDB only has its own vote average). Record source + ids per row.
3. **Future live path: TMDB-first.** When the MVP needs freshness/search depth, add a TMDB-backed enrichment/search adapter keyed by stored `tmdb_id`, keeping the local file as fallback/cache and the emotion-tag table untouched. OMDb stays optional (ratings supplement only) because CC BY-NC 4.0 blocks any commercial future.
4. Open follow-ups for the map driver (not this ticket): finalise the catalogue schema + emotion taxonomy, and confirm poster-image hosting/attribution wording.

## Sources
- https://developer.themoviedb.org/docs/faq (free non-commercial + attribution + commercial-via-sales)
- https://developer.themoviedb.org/docs/rate-limiting (~40 req/s, legacy limits disabled Dec 2019)
- https://developer.themoviedb.org/reference/movie-details (field list)
- https://developer.themoviedb.org/docs/getting-started (API key via account settings)
- http://www.omdbapi.com/ (usage, parameters, 1,000/day free, patron-only Poster API, CC BY-NC 4.0 footer)
- http://www.omdbapi.com/apikey.aspx (free vs patron tiers)
