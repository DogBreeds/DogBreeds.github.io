# Worldwide breed population estimates

Reviewed 11 September 2026, using registrations through 2025. These are rough model estimates for 67 named breeds plus a mixed-breed and village-dog group. Unregistered purebred dogs stay under their breed. Mixed-breed pets and non-standardized village dogs are counted in the additional group. The catalog still omits some named breeds and is not a global census.

**Popularity** sorts the numerical central estimates, descending. Preference scores and locks take precedence in matching; estimated population breaks score ties. No editorial opening sequence is mixed into the sort.


## Check against the world total

The 67 named breeds sum to **157,456,900** dogs, about **157 million**. This is well below the published **700 million–1 billion** worldwide range summarized in [this overview](https://en.wikipedia.org/wiki/Dog#Population), which refers to 2020 estimates. It is a broad scale benchmark, not a newly measured 2026 census.

The model uses **900 million** as a reference scenario and assumes **75%** are mixed-breed or non-standardized village dogs. This produces **675 million**, published as **680 million** at two significant digits. The 65–85% sensitivity shares and the 75% central share are explicit assumptions. [Shannon et al. (2015)](https://pubmed.ncbi.nlm.nih.gov/26483491/) identifies village dogs as far more numerous than purebred dogs but does not measure our chosen share. Free-ranging status must not be equated with mixed ancestry.

| Component | Central value used in the catalog |
| --- | ---: |
| 67 named breeds | 157,456,900 |
| Mixed-breed and village dogs | 680,000,000 |
| Catalog total | 837,456,900 |
| Unallocated remainder against 900 million | 62,543,100 |

The catalog total of approximately **837 million** is directionally within the world range, with room for unlisted breeds. The remainder is arithmetic, not an independent population estimate. This check does not validate the individual breed counts or the 75% assumption. We have not inflated all purebred estimates to exhaust the worldwide total.

The group includes Singapore Specials, mixed-breed pets, crossbreeds, and non-standardized village dogs. Singapore Specials are a named example and search alias, not an additional population row. Purebred dogs are excluded from this group even when unregistered or free-ranging. The group's photos are mixed-breed examples, not specifically Singapore Specials.

Individual low/high scenarios are not independent and should not be summed into a global uncertainty interval. The published central total is checked against the world benchmark; generation rejects a central total above the world budget or a negative unlisted remainder. The comparison checks for traits and locks remain separate from population arithmetic.

Mixed dogs have no single size, temperament, shedding rate, or lifespan. Their trait values stay unknown, do not count as confirmed matches, and cannot silently satisfy hard locks. Users can like and choose the category, open details, and follow the [SOSD adoption listings](https://www.sosd.org.sg/adopt-a-dog/) to meet individual Singapore Specials.

## Observed inputs

| Input | Source | Use |
| --- | --- | --- |
| Historical international registrations | [FCI survey published in 2013, reproduced table](https://en.wikipedia.org/wiki/List_of_most_popular_dog_breeds#FCI_Worldwide_Figures_2013) | International scale for 23 catalog breeds and two grouped categories. Reporting years and country coverage vary. The [original newsletter](https://newsletter15.dogdotcom.be/en/skk.aspx) could not be retrieved, so the checked transcription is identified explicitly. |
| UK annual registrations, 2016–2025 | Royal Kennel Club: [Gundog](https://www.royalkennelclub.com/media/jwnpo5lt/10-yearly-breeds-stats-gundog.pdf), [Hound](https://www.royalkennelclub.com/media/0alpujzy/10-yearly-breeds-stats-hound.pdf), [Working](https://www.royalkennelclub.com/media/ugoht4iy/10-yearly-breeds-stats-working.pdf), [Terrier](https://www.royalkennelclub.com/media/4duje03p/10-yearly-breeds-stats-terrier.pdf), [Pastoral](https://www.royalkennelclub.com/media/qiwna0nw/10-yearly-breeds-stats-pastoral.pdf), [Utility](https://www.royalkennelclub.com/media/g05csh5p/10-yearly-breeds-stats-utility.pdf), [Toy](https://www.royalkennelclub.com/media/vutlpvk0/10-yearly-breeds-stats-toy.pdf) | Ten-year average and change from the first two years. Use column years; the Utility title has an inconsistent year range. |
| Australian annual registrations, 2016–2025 | Dogs Australia [2010–2017](https://dogsaustralia.org.au/media/10160/rego-stats-list_2010-2017.pdf) and [2018–2025](https://dogsaustralia.org.au/media/10430/rego-stats-list_2018-2025.pdf) | Same calculations, using only 2016–2017 from the older file. |
| Japanese annual registrations, 2025 | [Japan Kennel Club](https://www.jkc.or.jp/registr-statistics/) | Additional breed-to-Labrador ratios where no international count is available. Missing breeds are omitted, not treated as zero. Other Japanese registries are not included. |
| More than 50,000 Greyhounds at commercial tracks worldwide | [GREY2K USA Worldwide](https://www.grey2kusa.org/about/worldwide.php), an advocacy organization | Separate rough anchor because kennel-club records omit almost all racing Greyhounds. This is not a count of retired pets. |

Lifespan is the midpoint of the existing breed profile's range, not a newly measured survival estimate. [Numeric inputs](population-inputs.json) retain the source labels, observations, and parameters separately.

## Calculation

Let `mean10(b,c)` be mean annual registrations over 2016–2025 for breed `b` in country `c`, and `base(b,c)` the mean in 2016–2017. Recorded zero years remain in these means. A missing country is omitted. `geoMean` is the geometric mean of positive ratios, giving available countries equal influence in log space.

1. **International anchor:** `annual(b) = historical(b) × geoMean(mean10(b,c) / base(b,c))` across the UK and Australia. Ten-year averaging smooths puppy booms. Holding the earlier international scale constant until 2016–2017 is an approximation because comparable prior country history is unavailable here.
2. **Grouped anchor:** calculate the breed's share as the arithmetic mean of its ten-year share within the group in the UK and Australia. Multiply the group's international count by its own trend factor and that share. The 118,653 Poodle registrations cover all sizes, so only the Standard share goes to Standard Poodle. Pomeranian and Keeshond divide a German Spitz group that also includes Klein and Mittel varieties. Neither receives the whole group.
3. **No international count:** `annual(b) = annual(Labrador) × geoMean(breed-to-Labrador ratios)`. Ratios use UK and Australian ten-year means plus Japan's 2025 ratio where reported. This assumes relative registry prevalence transfers across countries and periods. Labrador provides an international scale; it is not forced to rank first.
4. **Central population:** `annual(b) × meanLifespan(b) × 8`. Registrations times lifespan approximate a living population under roughly stable births and survival. **The ×8 expansion is our model assumption** for missing countries and unregistered purebred dogs. It is not a measured registration coverage rate or a factor calibrated against a global breed census.
5. **Scenarios:** use ×3 and ×20 instead of ×8. For group shares and regional imputations, halve the lower result and double the upper result for additional uncertainty. These are sensitivity choices, not statistical confidence limits or guaranteed bounds. Display and sorting use two significant digits.
6. **Greyhound exception:** use the 50,000 racing-dog anchor with assumed total-to-racing ratios of ×5 centrally, ×2 low, and ×15 high. This gives about 250,000 worldwide, with scenarios of 100,000–750,000. The multipliers allow for retired pets, breeding stock, and dogs outside commercial tracks; those totals are not independently observed here. Do not add the registry estimate again.

The main ×8 assumption changes absolute totals. Breed-specific coverage and choice of regions can also change the ranking. Nearby ranks are not statistically distinguishable. Every breed's estimate details state low confidence.

## Definitions and limitations

- Registration events are not a census of births or living dogs. Survival, unregistered litters, exports, duplicate registrations, and changing registry participation are not individually modeled.
- Chihuahua coats and all Dachshund varieties are combined. German Shepherd and Weimaraner coat variants are combined. Akita includes Japanese and American registry categories to match the broad existing profile. Smooth and Rough Collies remain separate. Standard Poodle is not all Poodles.
- The registries do not sample the world randomly. JKC particularly underrepresents Shibas because other Japanese registries matter. Working Kelpies and Australian Cattle Dogs also have substantial populations outside kennel-club records. Nordic, Asian, African, and Latin American breed distributions remain weakly represented.
- Registration averages miss the exact age structure of rapidly rising or declining breeds. Lifespan midpoints are coarse. Scenario ranges may still miss the true population.
- The [AKC 2025 ranking](https://www.akc.org/expert-advice/dog-breeds/most-popular-dog-breeds-2025/) supplies US ranks, not counts, and is not turned into fabricated observations. The [FCI European population study](https://www.fci.be/medias/FCI-RAP-2024-UE-PED-2022-en-20241104-19802.pdf) also uses accumulated registrations to approximate pedigree populations but does not validate our global multiplier.

## Maintenance

In the source repository, `data/population-inputs.json` separates observations and assumptions. `scripts/population-model.mjs` contains the calculation. `node scripts/build-populations.mjs` generates the public module and copies the inputs and this method. Its `--check` option detects stale output. `scripts/extract-population-inputs.py` refreshes UK and Australian observations from `pdftotext -layout` copies of the cited PDFs. Original breed IDs, content, and saved choices are preserved.

Replace assumptions with broader registry, insurance, veterinary, or household survey evidence when available. Keep estimates labeled and provenance visible in the secondary source view.
