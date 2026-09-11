(() => {
  const ID = "chesapeake-bay-retriever";
  const GALLERY = {
    main: "Chessie1.JPG",
    sides: [
      "MACH Chesapeake.jpg",
      "BIR Grupp 8- CHESAPEAKE BAY RETRIEVER, Cheslabben Cherry Blossom (23605985544).jpg",
      "Chesapeake Bay Retriever1.jpg"
    ]
  };

  function applyData() {
    if (typeof BREEDS !== "undefined") {
      const breed = BREEDS.find(item => item.id === ID);
      if (breed) breed.photo = GALLERY.main;
    }
    if (typeof CURATED_GALLERY !== "undefined") {
      CURATED_GALLERY[ID] = GALLERY.sides.slice();
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

  function renderGallery() {
    if (location.hash !== `#breed/${ID}`) return;
    const breed = typeof BREEDS !== "undefined" ? BREEDS.find(item => item.id === ID) : null;
    const gallery = document.getElementById("gallery");
    if (!breed || !gallery) return;

    gallery.innerHTML = "";
    gallery.appendChild(exactFigure(GALLERY.main, breed.name, "photo photo-main"));
    for (const fileName of GALLERY.sides) {
      gallery.appendChild(exactFigure(fileName, `${breed.name} photo`));
    }
    gallery.dataset.interactive = "";
    if (typeof setupGalleryInteractions === "function") setupGalleryInteractions();
  }

  function syncCards() {
    document.querySelectorAll(`[data-breed="${ID}"]`).forEach(card => {
      const photo = card.querySelector(".card-photo");
      if (!photo) return;
      let img = photo.querySelector("img");
      if (!img) {
        photo.innerHTML = "";
        img = document.createElement("img");
        img.loading = "lazy";
        img.alt = "Chesapeake Bay Retriever";
        photo.appendChild(img);
      }
      img.src = commonsImage(GALLERY.main, 900);
      img.alt = "Chesapeake Bay Retriever";
      img.dataset.cardImg = "";
      img.dataset.category = "Chesapeake Bay Retriever";
    });
  }

  function syncAll() {
    applyData();
    syncCards();
    renderGallery();
  }

  if (typeof loadBreedGallery === "function" && !loadBreedGallery.__chesapeakeFinalLocked) {
    const originalLoadBreedGallery = loadBreedGallery;
    loadBreedGallery = async function(breed) {
      if (breed?.id === ID) {
        renderGallery();
        return;
      }
      return originalLoadBreedGallery(breed);
    };
    loadBreedGallery.__chesapeakeFinalLocked = true;
  }

  if (typeof renderBreed === "function" && !renderBreed.__chesapeakeFinalLocked) {
    const originalRenderBreed = renderBreed;
    renderBreed = function(breed) {
      originalRenderBreed(breed);
      if (breed?.id === ID) {
        renderGallery();
        setTimeout(renderGallery, 500);
        setTimeout(renderGallery, 900);
      }
    };
    renderBreed.__chesapeakeFinalLocked = true;
  }

  window.addEventListener("hashchange", () => {
    setTimeout(syncAll, 0);
    setTimeout(syncAll, 500);
    setTimeout(syncAll, 900);
  });

  document.addEventListener("click", event => {
    if (event.target.closest?.(`[data-breed="${ID}"]`)) {
      applyData();
    }
  }, true);

  syncAll();
  setTimeout(syncAll, 500);
  setTimeout(syncAll, 900);
})();