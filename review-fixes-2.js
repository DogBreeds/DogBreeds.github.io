(() => {
  const EXACT_GALLERIES = {
    "english-setter": {
      main: "Engelse setter.JPG",
      sides: ["English setter.jpg", "A English Setter.jpg", "English setter in the field.jpg"]
    },
    "cairn-terrier": {
      main: "2Cairn Terrier in grass.jpg",
      sides: ["Cairn terrier.jpg", "Cairn side view.jpg", "Cairn Terrier - 001.jpg"]
    },
    "great-pyrenees": {
      main: "3 year old rescue Great Pyrenees from Cleveland Ohio USA.jpg",
      sides: ["Great Pyrenees Mountain Dog.jpg", "Pyrenean Mountain Dog.jpg", "Great Pyrenees dog and goats.jpg"]
    },
    "miniature-pinscher": {
      main: "Adult Male Miniature Pinscher.jpg",
      sides: ["Miniature Pinscher.jpg", "Black and rust purebred female miniature pinscher.jpg", "Miniature Pinscher Female Dog.png"]
    },
    "american-cocker-spaniel": {
      main: "Lola the American Cocker Spaniel (6900614408).jpg",
      sides: ["Cockeramericain1.jpg", "Cocker Spaniel Puppy.jpg", "4T0A8142 (41716890255).jpg"]
    },
    "german-shorthaired-pointer": {
      main: "Dan Brac alemany.jpg",
      sides: [
        "German Shorthaired PointerMiedzynarodowa wystawa psow rasowych rybnik kamien pazdziernik 2011 15.jpg",
        "Metsosuon kennel 2.jpg",
        "Reinhardt at 3 months (5582733405).jpg"
      ]
    },
    "collie": {
      main: "SmoothCollie Sable.jpg",
      sides: ["SmoothCollie TriColour.jpg", "Smooth Scotch Collie.JPG", "Owczarek szkocki krótkowłosy.jpg"]
    }
  };

  function patchBreedData() {
    if (typeof BREEDS === "undefined") return;
    for (const [id, gallery] of Object.entries(EXACT_GALLERIES)) {
      const breed = BREEDS.find(item => item.id === id);
      if (breed) breed.photo = gallery.main;
    }

    const collie = BREEDS.find(item => item.id === "collie");
    if (collie) {
      collie.name = "Smooth Collie";
      collie.category = "Smooth Collie";
      if (collie.facts) collie.facts.coat = "Short, dense double coat";
      collie.disadvantages = [
        "Smooth Collies still shed heavily despite having much less coat than Rough Collies.",
        "Many are sensitive to noise, harsh handling and chaotic environments.",
        "They can become persistent alert barkers if barking is unintentionally reinforced.",
        "Some hereditary eye disorders and drug-sensitivity genes occur in the breed and matter when choosing lines and medications."
      ];
      if (collie.products) {
        collie.products.shampoo = "Smooth Collie double-coat deshedding shampoo";
        collie.products.grooming = "rubber curry brush and undercoat rake";
      }
    }

    if (typeof CURATED_GALLERY !== "undefined") {
      for (const [id, gallery] of Object.entries(EXACT_GALLERIES)) {
        CURATED_GALLERY[id] = gallery.sides.slice();
      }
    }

    if (typeof AKC_VARIATIONS !== "undefined" && AKC_VARIATIONS.collie) {
      AKC_VARIATIONS.collie = {
        summary: "Breed-standard colors are Sable & White, Tri-Color, Blue Merle, and White.",
        colors: ["Sable & White", "Tri-Color", "Blue Merle", "White"],
        examples: [
          { label: "Sable & White", photo: "SmoothCollie Sable.jpg", query: "adult sable white Smooth Collie" },
          { label: "Tri-Color", photo: "SmoothCollie TriColour.jpg", query: "adult tricolor Smooth Collie" },
          { label: "Blue Merle", photo: "Smooth Scotch Collie.JPG", query: "adult blue merle Smooth Collie" },
          { label: "White", query: "adult white Smooth Collie" }
        ]
      };
    }
  }

  function exactFigure(fileName, alt, className = "photo") {
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
    gallery.appendChild(exactFigure(spec.main, breed.name, "photo photo-main"));
    for (const fileName of spec.sides) gallery.appendChild(exactFigure(fileName, `${breed.name} photo`));
    gallery.dataset.interactive = "";
    if (typeof setupGalleryInteractions === "function") setupGalleryInteractions();
  }

  function installLoader() {
    if (typeof loadBreedGallery !== "function" || loadBreedGallery.__reviewFix2) return;
    const original = loadBreedGallery;
    loadBreedGallery = async function(breed) {
      if (breed && EXACT_GALLERIES[breed.id]) return renderExactGallery(breed);
      return original(breed);
    };
    loadBreedGallery.__reviewFix2 = true;
  }

  function currentBreed() {
    const match = location.hash.match(/^#breed\/(.+)$/);
    if (!match || typeof BREEDS === "undefined") return null;
    return BREEDS.find(item => item.id === match[1]) || null;
  }

  function afterRoute() {
    const breed = currentBreed();
    if (breed && EXACT_GALLERIES[breed.id]) renderExactGallery(breed);
  }

  patchBreedData();
  installLoader();
  if (typeof route === "function") route();
  setTimeout(afterRoute, 0);
  setTimeout(afterRoute, 500);
  window.addEventListener("hashchange", () => {
    setTimeout(afterRoute, 0);
    setTimeout(afterRoute, 500);
  });
})();
