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
    "yorkshire-terrier": "Yorkshireterrierbowie.JPG",
    "miniature-schnauzer": "Miniature schnauzer blackandsilver.jpg"
  };

  const GALLERY_OVERRIDES = {
    "german-shepherd-dog": ["20110425 German Shepherd Dog 8505.jpg", "Grauer Deutscher Schäferhund Standbild.jpg", "German Shepherd Dog standing.jpg"],
    "standard-poodle": ["Red Standard Poodle.jpg", "Standard black Poodle.jpg", "Standard Poodle cream standing.jpg"],
    "boxer": ["Standing dog.jpg", "Male fawn Boxer undocked.jpg", "Flashy Fawn FCI Boxer.jpg"],
    "rottweiler": ["\"Prince\" (6302921969).jpg", "\"Prince\" (7216225820).jpg", "Rottweiler-dog.jpg"],
    "whippet": ["Whippet1.jpg", "Whippet fawn.jpg"],
    "west-highland-white-terrier": ["WestHighlandWhiteTerrier.JPG", "West-highland-white-terrier-dog.jpg"],
    "yorkshire-terrier": ["Yorkie standing.jpg"],
    "miniature-schnauzer": ["Silver Schnauzer - Abby.jpg", "Miniature Schnauzer Jordy.jpg", "Schnauzer nain noir.jpg"]
  };

  const SCHNAUZER_MAIN = "Miniature schnauzer blackandsilver.jpg";
  const SCHNAUZER_SIDES = [
    "Silver Schnauzer - Abby.jpg",
    "Miniature Schnauzer Jordy.jpg",
    "Schnauzer nain noir.jpg"
  ];

  const SCHNAUZER_VARIATIONS = [
    { label: "Salt & Pepper", photo: "Miniature Schnauzer Jordy.jpg" },
    { label: "Black & Silver", photo: SCHNAUZER_MAIN },
    { label: "Solid Black", photo: "Schnauzer nain noir.jpg" }
  ];

  function applyDataPatches() {
    if (typeof BREEDS !== "undefined") {
      for (const breed of BREEDS) {
        if (MAIN_PHOTOS[breed.id]) breed.photo = MAIN_PHOTOS[breed.id];
      }
    }

    if (typeof CURATED_GALLERY !== "undefined") {
      for (const [id, photos] of Object.entries(GALLERY_OVERRIDES)) CURATED_GALLERY[id] = photos;
    }

    if (typeof AKC_VARIATIONS !== "undefined" && AKC_VARIATIONS["miniature-schnauzer"]) {
      const spec = AKC_VARIATIONS["miniature-schnauzer"];
      spec.summary = "Breed-standard colors are Salt & Pepper, Black & Silver, and Solid Black.";
      spec.colors = ["Salt & Pepper", "Black & Silver", "Solid Black"];
      spec.examples = SCHNAUZER_VARIATIONS.map(item => ({
        label: item.label,
        query: `adult ${item.label} Miniature Schnauzer dog`,
        photo: item.photo
      }));
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

  function renderExactSchnauzerGallery(breed) {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;
    gallery.innerHTML = "";
    gallery.appendChild(exactPhotoFigure(SCHNAUZER_MAIN, breed.name, "photo photo-main"));
    for (const fileName of SCHNAUZER_SIDES) {
      gallery.appendChild(exactPhotoFigure(fileName, `${breed.name} photo`));
    }
    gallery.dataset.interactive = "";
    if (typeof setupGalleryInteractions === "function") setupGalleryInteractions();
  }

  function renderExactSchnauzerVariations(breed) {
    const grid = document.getElementById("variation-grid");
    if (!grid) return;
    grid.innerHTML = "";

    for (const example of SCHNAUZER_VARIATIONS) {
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

  function installExactSchnauzerGallery() {
    if (typeof loadBreedGallery !== "function" || loadBreedGallery.__schnauzerLocked) return;
    const original = loadBreedGallery;
    const replacement = async function(breed) {
      if (!breed || breed.id !== "miniature-schnauzer") return original(breed);
      renderExactSchnauzerGallery(breed);
    };
    replacement.__schnauzerLocked = true;
    loadBreedGallery = replacement;
  }

  function installExactSchnauzerVariations() {
    if (typeof loadVariationGallery !== "function" || loadVariationGallery.__schnauzerLocked) return;
    const original = loadVariationGallery;
    const replacement = async function(breed) {
      if (!breed || breed.id !== "miniature-schnauzer") return original(breed);
      renderExactSchnauzerVariations(breed);
    };
    replacement.__schnauzerLocked = true;
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

  function afterRoute() {
    removeAppFocusRing();
    patchShelterCopy();
    if (location.hash === "#breed/miniature-schnauzer") {
      const breed = typeof BREEDS !== "undefined" ? BREEDS.find(item => item.id === "miniature-schnauzer") : null;
      if (breed) {
        renderExactSchnauzerGallery(breed);
        renderExactSchnauzerVariations(breed);
      }
    }
  }

  applyDataPatches();
  installExactSchnauzerGallery();
  installExactSchnauzerVariations();
  removeAppFocusRing();

  if (typeof route === "function") route();
  setTimeout(afterRoute, 0);
  setTimeout(afterRoute, 500);
  window.addEventListener("hashchange", () => {
    setTimeout(afterRoute, 0);
    setTimeout(afterRoute, 500);
  });
})();
