(() => {
  const MAIN_PHOTOS = {
    "german-shepherd-dog": "Adult male German shepherd dog standing at the beach (retouched).jpg",
    "standard-poodle": "Poodle Standard.jpg",
    "rhodesian-ridgeback": "Rhodesian Ridgeback dog.jpg",
    "weimaraner": "Weimaraner.jpg",
    "boxer": "Boxer_puppy_.jpg",
    "rottweiler": "New Pose - panoramio.jpg",
    "west-highland-white-terrier": "A Westie Adult.jpg",
    "whippet": "A whippet in the forests of Sweden.jpg",
    "yorkshire-terrier": "Yorkshireterrierbowie.JPG",
    "miniature-schnauzer": "Miniature Schnauzer Jordy.jpg"
  };

  const EXACT_GALLERIES = {
    "miniature-schnauzer": {
      main: "Miniature Schnauzer Jordy.jpg",
      sides: [
        "Silver Schnauzer - Abby.jpg",
        "Miniature schnauzer blackandsilver.jpg",
        "Schnauzer nain noir.jpg"
      ]
    },
    "boxer": {
      main: "Boxer_puppy_.jpg",
      sides: [
        "Two boxer dogs (2004).jpg",
        "Deutscher Boxer Elmo vom Freudenreich, in Bewegung.jpg",
        "Boxer brindle sitting beach.jpg"
      ]
    }
  };

  const EXACT_VARIATIONS = {
    "miniature-schnauzer": [
      { label: "Salt & Pepper", photo: "Miniature Schnauzer Jordy.jpg" },
      { label: "Black & Silver", photo: "Miniature schnauzer blackandsilver.jpg" },
      { label: "Solid Black", photo: "Schnauzer nain noir.jpg" }
    ],
    "boxer": [
      { label: "Fawn", photo: "Deutscher Boxer Elmo vom Freudenreich, in Bewegung.jpg" },
      { label: "Brindle", photo: "Boxer brindle sitting beach.jpg" }
    ]
  };

  const GALLERY_OVERRIDES = {
    "german-shepherd-dog": ["20110425 German Shepherd Dog 8505.jpg", "Grauer Deutscher Schäferhund Standbild.jpg", "German Shepherd Dog standing.jpg"],
    "standard-poodle": ["Red Standard Poodle.jpg", "Standard black Poodle.jpg", "Standard Poodle cream standing.jpg"],
    "rottweiler": ["\"Prince\" (6302921969).jpg", "\"Prince\" (7216225820).jpg", "Rottweiler-dog.jpg"],
    "whippet": ["Whippet1.jpg", "Whippet fawn.jpg"],
    "west-highland-white-terrier": ["WestHighlandWhiteTerrier.JPG", "West-highland-white-terrier-dog.jpg"],
    "yorkshire-terrier": ["Yorkie standing.jpg"]
  };

  function applyDataPatches() {
    if (typeof BREEDS !== "undefined") {
      for (const breed of BREEDS) {
        if (MAIN_PHOTOS[breed.id]) breed.photo = MAIN_PHOTOS[breed.id];
      }
    }

    if (typeof CURATED_GALLERY !== "undefined") {
      for (const [id, photos] of Object.entries(GALLERY_OVERRIDES)) CURATED_GALLERY[id] = photos;
      for (const [id, gallery] of Object.entries(EXACT_GALLERIES)) CURATED_GALLERY[id] = gallery.sides.slice();
    }

    if (typeof AKC_VARIATIONS !== "undefined") {
      const schnauzer = AKC_VARIATIONS["miniature-schnauzer"];
      if (schnauzer) {
        schnauzer.summary = "Breed-standard colors are Salt & Pepper, Black & Silver, and Solid Black.";
        schnauzer.colors = ["Salt & Pepper", "Black & Silver", "Solid Black"];
        schnauzer.examples = EXACT_VARIATIONS["miniature-schnauzer"].map(item => ({
          label: item.label,
          query: `adult ${item.label} Miniature Schnauzer dog`,
          photo: item.photo
        }));
      }

      const boxer = AKC_VARIATIONS["boxer"];
      if (boxer) {
        boxer.examples = EXACT_VARIATIONS["boxer"].map(item => ({
          label: item.label,
          query: `adult ${item.label} Boxer dog`,
          photo: item.photo
        }));
      }
    }
  }

  function exactPhotoFigure(fileName, alt, className = "photo") {
    const figure = document.createElement("figure");
    figure.className = className;
    figure.dataset.galleryPhoto = "";
    figure.tabIndex = 0;

    const media = document.createElement("div");
    media.className = "photo-media";
    const img = document.createElement("img");
    img.src = commonsImage(fileName, 1200);
    img.alt = alt;
    media.appendChild(img);

    const caption = document.createElement("figcaption");
    caption.className = "photo-credit";
    const link = document.createElement("a");
    link.href = commonsPage(fileName);
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Wikimedia Commons source";
    caption.appendChild(link);
    figure.append(media, caption);
    return figure;
  }

  function renderExactGallery(breed) {
    const spec = EXACT_GALLERIES[breed?.id];
    const gallery = document.getElementById("gallery");
    if (!spec || !gallery) return;

    gallery.innerHTML = "";
    gallery.appendChild(exactPhotoFigure(spec.main, breed.name, "photo photo-main"));
    for (const fileName of spec.sides) {
      gallery.appendChild(exactPhotoFigure(fileName, `${breed.name} photo`));
    }
    gallery.dataset.interactive = "";
    if (typeof setupGalleryInteractions === "function") setupGalleryInteractions();
  }

  function renderExactVariations(breed) {
    const examples = EXACT_VARIATIONS[breed?.id];
    const grid = document.getElementById("variation-grid");
    if (!examples || !grid) return;

    grid.innerHTML = "";
    for (const example of examples) {
      const card = document.createElement("article");
      card.className = "variation-card";

      const media = document.createElement("div");
      media.className = "variation-image";
      const link = document.createElement("a");
      link.href = commonsPage(example.photo);
      link.target = "_blank";
      link.rel = "noopener";
      const img = document.createElement("img");
      img.src = commonsImage(example.photo, 1000);
      img.alt = `${breed.name} ${example.label}`;
      link.appendChild(img);
      media.appendChild(link);

      const label = document.createElement("h4");
      label.textContent = example.label;
      card.append(media, label);
      grid.appendChild(card);
    }
  }

  function installExactGalleryLoader() {
    if (typeof loadBreedGallery !== "function" || loadBreedGallery.__exactLocked) return;
    const original = loadBreedGallery;
    const replacement = async function(breed) {
      if (!breed || !EXACT_GALLERIES[breed.id]) return original(breed);
      renderExactGallery(breed);
    };
    replacement.__exactLocked = true;
    loadBreedGallery = replacement;
  }

  function installExactVariationLoader() {
    if (typeof loadVariationGallery !== "function" || loadVariationGallery.__exactLocked) return;
    const original = loadVariationGallery;
    const replacement = async function(breed) {
      if (!breed || !EXACT_VARIATIONS[breed.id]) return original(breed);
      renderExactVariations(breed);
    };
    replacement.__exactLocked = true;
    loadVariationGallery = replacement;
  }

  function removeAppFocusRing() {
    const main = document.getElementById("app");
    if (main) main.style.outline = "none";
  }

  function patchShelterCopy() {
    const input = document.querySelector("#location");
    if (input) input.placeholder = "e.g. London, UK or Montreal, QC";
    const help = document.querySelector(".shelter-box .help");
    if (help) {
      const heading = document.querySelector(".breed-heading h1, .breed-title h1, .breed-page h1");
      const breedName = heading?.textContent?.trim() || "this breed";
      help.textContent = `Works internationally using OpenStreetMap location and shelter data. Your location is only used for this live shelter lookup and is not prefilled or published by the site. Availability changes quickly, so contact each shelter to ask whether they currently have a ${breedName} or similar mix.`;
    }
  }

  function currentBreed() {
    const match = location.hash.match(/^#breed\/(.+)$/);
    if (!match || typeof BREEDS === "undefined") return null;
    return BREEDS.find(item => item.id === match[1]) || null;
  }

  function afterRoute() {
    removeAppFocusRing();
    patchShelterCopy();
    const breed = currentBreed();
    if (breed && EXACT_GALLERIES[breed.id]) renderExactGallery(breed);
    if (breed && EXACT_VARIATIONS[breed.id]) renderExactVariations(breed);
  }

  applyDataPatches();
  installExactGalleryLoader();
  installExactVariationLoader();
  removeAppFocusRing();

  if (typeof route === "function") route();
  setTimeout(afterRoute, 0);
  setTimeout(afterRoute, 500);
  window.addEventListener("hashchange", () => {
    setTimeout(afterRoute, 0);
    setTimeout(afterRoute, 500);
  });
})();
