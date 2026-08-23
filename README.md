# Dog Breed Finder

A dependency-free static dog-breed guide designed for GitHub Pages.

## What is included

- Quiz that starts only after clicking **Take the Quiz** and scores situational lifestyle answers rather than acting like a hard filter
- Collapsible multi-select breed filter plus Large / Medium / Small browsing
- 32 curated breeds
- Breed facts and relative trait stats
- Specific disadvantages and notable health tradeoffs
- Multiple freely licensed photos per breed from Wikimedia Commons
- Common coat / color variations with separate example photos
- Petfinder adoption search by breed and ZIP/postal code
- Breed-specific Amazon product searches
- Cream, brown, moss, blue and salmon visual system with fixed, irregular paw-print trails
- Square corners throughout

## Files

- `index.html` — page shell and navigation
- `styles.css` — visual system and responsive layout
- `breeds.js` — breed facts, matching traits, stats, disadvantages, product fit notes and starter image metadata
- `app.js` — quiz scoring, multi-select filtering, browsing, coat/color variation searches, Wikimedia image loading, adoption search and Amazon links

## Deploy on GitHub Pages

1. Create a repository, for example `dog-breed-finder`.
2. Put these files at the repository root.
3. Push to GitHub.
4. In **Settings → Pages**, choose **Deploy from a branch**, then choose `main` and `/ (root)`.
5. A normal project site will work at `https://YOUR-USERNAME.github.io/dog-breed-finder/`.

If the repository is the special organization repository named `ORGANIZATION.github.io`, the site is instead available directly at `https://ORGANIZATION.github.io/`.

The app uses hash routes such as `#breed/border-collie`, so it works on GitHub Pages without rewrite rules.

## Amazon affiliate links

In `app.js`, replace:

```js
const AMAZON_TAG = "YOUR-TAG-20";
```

with the Amazon Associates tracking ID. If using a marketplace other than Amazon.com, also update `AMAZON_DOMAIN`.

Product searches are breed-specific. Size-dependent gear gives a typical range, but the site tells users to measure the individual dog before ordering.

## Shelter / adoption search

The ZIP-code form opens a Petfinder breed search rather than storing a Petfinder API secret in a public GitHub Pages repository. A later version can render live shelter results inside the page through a small serverless backend.

## Photos and variations

Images come from Wikimedia Commons. Starter images use known Commons files; additional gallery and variation images are loaded through the Wikimedia Commons API. Each displayed gallery/variation image links back to its Commons file page so its exact license and attribution can be checked.

Before a commercial launch, do a final license audit of the selected files and preserve any attribution or share-alike requirements listed on their source pages.

## Adding breeds

Add another object to `BREEDS` in `breeds.js`. The browse pages, filter, quiz scoring, breed page, product links and photo credits update automatically. Add corresponding variation search terms to `BREED_VARIATIONS` in `app.js` when useful.
