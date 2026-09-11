(() => {
  const EXACT_GALLERIES = {
    "english-setter": {
      main: "English setter in the field.jpg",
      sides: [
        "English setter.jpg",
        "A English Setter.jpg",
        "Engelse setter.JPG"
      ]
    },
    "italian-greyhound": {
      main: "Italian Greyhound standing gray.jpg",
      sides: [
        "ItalianGreyhound.jpg",
        "000 Charcik Włoski - niebieski.jpg",
        "Italian Greyhound Sitting on Sofa.jpg"
      ]
    },
    "miniature-pinscher": {
      main: "Adult Male Miniature Pinscher.jpg",
      sides: [
        "Grupp 2 DVÄRGPINCHER, Pincerella’s Rinaldo Rosso (24260846206).jpg",
        "Zwergpinscher.Denzo-vom-Reichsgraf-zu-Herrenheim 1500X1500.jpg",
        "Zwergpinscher Marrone Femmina.JPG"
      ]
    },
    "shetland-sheepdog": {
      main: "Fiona the Sheltie.jpg",
      sides: [
        "Berger des shetland.jpg",
        "BergerShetlandBiColor.jpg",
        "Berger des Shetland.jpg"
      ]
    }
  };

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

  function applyData() {
    if (typeof BREEDS !== "undefined") {
      for (const [id, spec] of Object.entries(EXACT_GALLERIES)) {
        const breed = BREEDS.find(item => item.id === id);
        if (breed) breed.photo = spec.main;
      }
    }

    if (typeof CURATED_GALLERY !== "undefined") {
      for (const [id, spec] of Object.entries(EXACT_GALLERIES)) {
        CURATED_GALLERY[id] = spec.sides.slice();
      }
    }
  }

  function renderExactGallery(breed) {
    const spec = EXACT_GALLERIES[breed?.id];
    const gallery = document.getElementById("gallery");
    if (!spec || !gallery) return;

    gallery.innerHTML = "";
    gallery.appendChild(exactFigure(spec.main, breed.name, "photo photo-main"));
    for (const fileName of spec.sides) {
      gallery.appendChild(exactFigure(fileName, `${breed.name} photo`));
    }
    gallery.dataset.interactive = "";
    if (typeof setupGalleryInteractions === "function") setupGalleryInteractions();
  }

  function installLoader() {
    if (typeof loadBreedGallery !== "function" || loadBreedGallery.__reviewFix3) return;
    const original = loadBreedGallery;
    loadBreedGallery = async function(breed) {
      if (breed && EXACT_GALLERIES[breed.id]) return renderExactGallery(breed);
      return original(breed);
    };
    loadBreedGallery.__reviewFix3 = true;
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

  applyData();
  installLoader();
  if (typeof route === "function") route();
  setTimeout(afterRoute, 0);
  setTimeout(afterRoute, 500);
  window.addEventListener("hashchange", () => {
    setTimeout(afterRoute, 0);
    setTimeout(afterRoute, 500);
  });
})();
