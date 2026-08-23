# Dog Breed Finder

A dependency-free static website designed for GitHub Pages.

## Files

- `index.html` — page shell and navigation
- `styles.css` — cream / brown / moss / blue / salmon visual system and paw-print background
- `breeds.js` — breed facts, stats, disadvantages, quiz traits, Petfinder slugs, product fit notes and Wikimedia photo references
- `app.js` — quiz filtering, browsing, breed pages, Wikimedia gallery loading, Petfinder search and Amazon links

## Deploy on GitHub Pages

1. Create a repository, for example `dog-breed-finder`.
2. Put these files at the repository root.
3. Push to GitHub.
4. In **Settings → Pages**, choose **Deploy from a branch**, then choose `main` and `/ (root)`.
5. The site will work at `https://YOUR-USERNAME.github.io/dog-breed-finder/`.

The app uses hash routes such as `#breed/border-collie`, so it works inside a project GitHub Pages repository without rewrite rules.

## Amazon affiliate links

In `app.js`, replace:

```js
const AMAZON_TAG = "YOUR-TAG-20";
```

with your Amazon Associates tracking ID. If you are using a marketplace other than Amazon.com, also update `AMAZON_DOMAIN` and confirm that your Associates account is registered for that marketplace.

The product searches are deliberately breed-specific. Size-dependent gear includes a typical range, but the page tells users to measure the individual dog before ordering.

## Shelter / adoption search

The ZIP-code form creates a Petfinder search for the exact breed within 100 miles. This avoids storing an API secret in a public GitHub Pages repository. A later version can use the Petfinder API through a small serverless backend if you want results rendered directly inside the site.

## Photos

Starter photos use Wikimedia Commons file references. Breed pages also request up to two additional images from the exact Wikimedia Commons breed category and display the contributor/license metadata returned by Commons.

`#credits` links every starter photo back to its Commons file page. Before a commercial launch, do a final license audit of the chosen files and preserve any attribution or share-alike conditions listed on the source pages.

## Adding breeds

Add another object to `BREEDS` in `breeds.js`. The quiz, browse pages, breed page, Amazon product links and photo-credit list update automatically.
