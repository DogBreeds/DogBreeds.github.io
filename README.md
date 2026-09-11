# Top Dog

A picture-first rebuild of Linus’s Dog Breed Finder. Static HTML, CSS, and JavaScript modules. No build step or package installation is required.

## GitHub Pages

`index.html` and all website assets are at the repository root. No build, dependency installation, or file rearrangement is needed for GitHub Pages.

1. Extract the ZIP and upload all its contents to the root of `DogBreeds/DogBreeds.github.io`, replacing existing files.
2. In **Settings → Pages**, select **Deploy from a branch**, **main**, and **/ (root)**, then save.
3. The site is served at https://dogbreeds.github.io/.

For local preview, run `python -m http.server 8000` from the repository and open http://localhost:8000. The `.nojekyll` file tells GitHub Pages to serve the static files directly.

The original quiz remains at `classic.html`. Its earlier documentation is in `docs/classic-readme.md`.

## Product

- Explore 67 breeds and a mixed-breed group, including Singapore Specials. Search, size and trait filters, sorting, and the Liked dogs filter are visible immediately.
- A picture opens comparison, the text below it opens details, and a heart toggles whether a dog is liked. Photos have no overlays. The first comparison stages two contenders without choosing a top dog. Only the bottom comparison decisions can choose or replace the top dog. Liked dogs, comparison contenders, and the single top dog are independent; choosing a winner does not automatically heart it. Every page transition, including profile reset and deletion, starts at the document top with the banner visible. Rendering happens before focus, which cannot scroll; a post-layout correction prevents stale scroll anchoring. Family view tabs preserve the reading position. The comparison uses aligned rows for looks, size, energy, shedding, coat care, children, training, sociability, barking, and lifespan. Optional per-dimension preferences select a trait value. Both dogs highlight when they share that value, and either button clears the shared selection unless locked. Live match counts appear beside the breed names and above the final choices. Counts include selected trait categories, nonduplicated legacy preferences, and the selected look once each; hearts and locks add no points. Final choice buttons sit at the bottom, after the traits. There is no right panel.
- Equal-weight preferences rank challengers after the final choice. Picking a trait or toggling its optional lock keeps the pair and scroll position stable. A lock requires the same displayed trait category in future candidates; appearance and lifespan are not lockable. Must-haves also exclude candidates. Appearance likes stay breed-specific.
- Choose either contender, like or unlike it, skip, undo, revisit, or declare a winner from comparison. Hearts update in place without replacing photos or moving the comparison. Undo restores comparison choices without undoing hearts. Details always provide a route into comparison.
- Family profiles and notes live in localStorage on this browser. Family has three views: By person shows each top dog, all liked dogs, and exact locked criteria; By dog shows the people who like each breed and top-dog owners; By criterion groups exact locked values with their owners. Unrecorded choices are explicit. Conflicting locks are highlighted, and dog cards can expand the unmet locks and their owners. Older must-haves are included and only exact equivalents are merged. Unlocked preferences remain separate. Hearts do not count as top-dog votes. It does not implement remote invites or live sync.
- The logo and section tabs switch the main view at the top of the page with the banner remaining sticky. Comparison picks still reveal the pair immediately. Sticky breed names and family tabs sit below the measured banner height, including when it wraps on mobile.
- Photo credits are absent from gallery, comparison, winner and family cards. Open details and tap the main photo to see it full screen with its creator, license and Commons source. Thumbnail selection carries through to the full-screen viewer; closing returns to details without changing choices.
- Dog photos fit their frames without cropping or hover zoom, including gallery, comparison, winner, and thumbnail images. Neutral backgrounds fill spare space around portrait or wide source photos.
- Full dog cards retain metric facts, curated photo galleries, variations, trade-offs, editorial trait bars, routine guidance, notes, and links to the original adoption, supplies, and care content.
- People includes Reset choices for the selected person, Delete person, and Clear all data. Each requires confirmation. Reset keeps the name and clears all choices and history; delete removes the profile; clearing all removes the Top Dog storage record and opens a fresh unnamed session. These actions cannot be undone. Other profiles survive individual changes, and other browser storage is untouched. Failed storage writes leave current data intact. Open tabs refresh their profile state when saved data changes.

- Mixed-breed dogs are searchable as mongrels, crossbreeds, village dogs, and Singapore Specials. Trait values are unknown, not fabricated averages: no confirmed trait matches or hard-lock eligibility without an individual dog. Details link to SOSD for individual Singapore Specials.

## Files

- `index.html`, `topdog.css`, `topdog.mjs`: new experience.
- `engine.mjs`: pure matching and family ranking.
- `family.mjs`: read-only family relationship indexes and lock conflict analysis.
- `dogs.json`: consolidated existing breed content.
- `classic.html`: preserved original experience, including the existing Supabase quiz account integration. Its records are separate from new match profiles.
- `scripts/extract-data.mjs`: reproduces breed data from original data declarations and data patches without running their UI.
- `scripts/check-matching.mjs`: meaningful model invariants and persistence validation.

## Browse order and population data

Popularity sorts all breeds and the mixed-breed group by rough worldwide living-population estimates, descending. The same estimates break preference-score ties; locks and preference fit remain primary in matching. Each detail view shows an estimated count and expandable scenario range. There is no country selector or editorial opening sequence. The source view checks the 157M named-breed subtotal plus the 680M mixed/village scenario against a 700M–1B global benchmark. Singapore Specials are included once within the mixed group. The remaining ~63M against a 900M reference is explicitly unallocated, not independently measured.

The model combines historical international registrations, 2016–2025 UK and Australian observations, Japanese 2025 breed ratios for missing international counts, and lifespan. Coverage expansion is explicitly an assumption. Standard Poodle is separated from other Poodle sizes; Greyhound includes a separate racing-stock estimate. These are low-confidence model estimates, not census statistics. See [method and sources](docs/breed-population-research.md). All inputs are in `data/population-inputs.json`; regenerate with `node scripts/build-populations.mjs` and check reproducibility with `node scripts/build-populations.mjs --check`.

Do not turn these scenarios into measured population claims, allergy guarantees, aggression guarantees, match probabilities, or family consensus. Existing trait scores remain editorial, displayed as qualitative bars.

Breed content: https://github.com/DogBreeds/DogBreeds.github.io

## Validation

Run `node --check topdog.mjs`, `node --check engine.mjs`, `node scripts/check-matching.mjs`, `node scripts/check-single-player.mjs`, and `node scripts/check-family.mjs`. The single-player harness invokes the actual click handler and tests independent hearts, photo and detail actions, staged first contenders, same-route challenger selection, voting, skip, undo, winner, resume, family likes, and post-layout scroll correction. It also checks profile reset/deletion, clear-all cancellation and confirmation, persistence after reload, storage failures, unrelated storage preservation, and stale-tab refresh. It does not simulate visual browser layout.

The new Standard Poodle main image uses the previously listed `Red Standard Poodle.jpg`, whose Commons description identifies it as a Standard Poodle. The old main file was explicitly named as a Miniature Poodle. The classic experience retains its original image.

No browser UI or WebMCP runtime validation has been performed. Photo source pages are checked for representative entries; images load directly from Commons with a curated same-breed fallback. The Commons metadata API is best-effort; source and license pages remain linked when it is unavailable.

## Next iteration

Test discovery with Ada before extending authentication. Watch whether she can pick a picture, indicate a reason, compare two dogs, and find her liked dogs unaided. Supabase shared households, invitations, per-member preferences, and notes would follow. Use membership-checked RLS before enabling remote collaboration; never expose a service-role key. Regional population estimates require defensible sources and methodology. Priced care budgets require location and assumptions.

The GitHub website updates when you commit these files to its publishing branch. For the existing private preview, `npm run build` copies the root website assets to an ignored `dist/` staging directory used by `.openai/hosting.json`. The root files remain the only authored website source.
