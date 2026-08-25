(() => {
  const MAIN_PHOTOS = {
    "german-shepherd-dog": "Adult male German shepherd dog standing at the beach (retouched).jpg",
    "standard-poodle": "Poodle Standard.jpg",
    "rhodesian-ridgeback": "Rhodesian Ridgeback dog.jpg",
    "weimaraner": "Weimaraner.jpg",
    "boxer": "1. Brindle boxer dog, female.jpg",
    "rottweiler": "New Pose - panoramio.jpg",
    "west-highland-white-terrier": "A Westie Adult.jpg",
    "whippet": "A whippet in the forests of Sweden.jpg",
    "yorkshire-terrier": "Yorkshireterrierbowie.JPG"
  };

  const GALLERY_OVERRIDES = {
    "german-shepherd-dog": [
      "20110425 German Shepherd Dog 8505.jpg",
      "Grauer Deutscher Schäferhund Standbild.jpg",
      "German Shepherd Dog standing.jpg"
    ],
    "standard-poodle": [
      "Red Standard Poodle.jpg",
      "Standard black Poodle.jpg",
      "Standard Poodle cream standing.jpg"
    ],
    "boxer": [
      "Standing dog.jpg",
      "Male fawn Boxer undocked.jpg",
      "Flashy Fawn FCI Boxer.jpg"
    ],
    "rottweiler": [
      "\"Prince\" (6302921969).jpg",
      "\"Prince\" (7216225820).jpg",
      "Rottweiler-dog.jpg"
    ],
    "whippet": [
      "Whippet1.jpg",
      "Whippet fawn.jpg"
    ],
    "west-highland-white-terrier": [
      "WestHighlandWhiteTerrier.JPG",
      "West-highland-white-terrier-dog.jpg"
    ],
    "yorkshire-terrier": [
      "Yorkie standing.jpg"
    ]
  };

  function applyDataPatches() {
    if (typeof BREEDS !== "undefined") {
      for (const breed of BREEDS) {
        if (MAIN_PHOTOS[breed.id]) breed.photo = MAIN_PHOTOS[breed.id];
      }
    }
    if (typeof CURATED_GALLERY !== "undefined") {
      for (const [id, photos] of Object.entries(GALLERY_OVERRIDES)) {
        CURATED_GALLERY[id] = photos;
      }
    }
  }

  function patchShelterCopy() {
    const input = document.querySelector("#location");
    if (input) {
      input.placeholder = "e.g. London, UK or Montreal, QC";
      input.autocomplete = "postal-code";
    }

    const box = document.querySelector(".shelter-box");
    const help = box?.querySelector(".help");
    if (help) {
      const heading = document.querySelector(".breed-heading h1, .breed-title h1, .breed-page h1");
      const breedName = heading?.textContent?.trim() || "this breed";
      help.textContent = `Works internationally using OpenStreetMap location and shelter data. Your location is only used for this live shelter lookup and is not prefilled or published by the site. Availability changes quickly, so contact each shelter to ask whether they currently have a ${breedName} or similar mix.`;
    }
  }

  function bindImageFallbacks() {
    document.querySelectorAll("img").forEach(img => {
      if (img.dataset.sitePatchBound === "1") return;
      img.dataset.sitePatchBound = "1";
      img.addEventListener("error", () => {
        const card = img.closest(".breed-card");
        if (card && typeof CURATED_GALLERY !== "undefined" && typeof commonsImage === "function") {
          const fallback = CURATED_GALLERY[card.dataset.breed]?.[0];
          if (fallback && !img.dataset.sitePatchFallback) {
            img.dataset.sitePatchFallback = "1";
            img.src = commonsImage(fallback, 900);
            return;
          }
        }

        const main = img.closest(".photo-main");
        if (main) {
          const replacement = document.querySelector("#gallery .photo:not(.photo-main) img");
          if (replacement?.src && replacement.src !== img.src && !img.dataset.sitePatchFallback) {
            img.dataset.sitePatchFallback = "1";
            img.src = replacement.src;
            const mainLink = main.querySelector("a");
            const replacementLink = replacement.closest("figure")?.querySelector("a");
            if (mainLink && replacementLink) mainLink.href = replacementLink.href;
          }
          return;
        }

        const optional = img.closest(".variation-card, #gallery .photo:not(.photo-main)");
        if (optional) optional.remove();
      }, { once: true });
    });
  }

  function applyRenderedPatches() {
    patchShelterCopy();
    bindImageFallbacks();
  }

  applyDataPatches();

  const appRoot = document.getElementById("app");
  if (appRoot) {
    new MutationObserver(applyRenderedPatches).observe(appRoot, { childList: true, subtree: true });
  }

  if (typeof route === "function") route();
  applyRenderedPatches();
})();
