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
      const breed = BREEDS.find(item => item.id === ID);
      if (breed) breed.photo = GALLERY.main;
    }
    if (typeof CURATED_GALLERY !== "undefined") CURATED_GALLERY[ID] = GALLERY.sides.slice();
  }

  function renderGallery(breed) {
    const gallery = document.getElementById("gallery");
    if (!gallery || !breed || breed.id !== ID) return;
    gallery.innerHTML = "";
    gallery.appendChild(exactFigure(GALLERY.main, breed.name, "photo photo-main"));
    for (const fileName of GALLERY.sides) gallery.appendChild(exactFigure(fileName, `${breed.name} photo`));
    gallery.dataset.interactive = "";
    if (typeof setupGalleryInteractions === "function") setupGalleryInteractions();
  }

  function installLoader() {
    if (typeof loadBreedGallery !== "function" || loadBreedGallery.__chesapeakeLocked) return;
    const original = loadBreedGallery;
    loadBreedGallery = async function(breed) {
      if (breed?.id === ID) return renderGallery(breed);
      return original(breed);
    };
    loadBreedGallery.__chesapeakeLocked = true;
  }

  function currentBreed() {
    if (typeof BREEDS === "undefined") return null;
    const match = location.hash.match(/^#breed\/(.+)$/);
    return match ? BREEDS.find(item => item.id === match[1]) || null : null;
  }

  applyData();
  installLoader();
  const current = currentBreed();
  if (current?.id === ID && typeof route === "function") route();
  setTimeout(() => { const breed = currentBreed(); if (breed?.id === ID) renderGallery(breed); }, 0);
  setTimeout(() => { const breed = currentBreed(); if (breed?.id === ID) renderGallery(breed); }, 400);
})();
