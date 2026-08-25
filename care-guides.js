(() => {
  const SPECIAL = {
    "standard-poodle": { akc: "poodle-standard", petmd: "poodle", purina: "poodle" },
    "german-shepherd-dog": { petmd: "german-shepherd" },
    "collie": { akc: "collie", petmd: "collie", purina: "collie" },
    "rough-collie": { akc: "collie", petmd: "collie", purina: "collie" },
    "american-cocker-spaniel": { akc: "cocker-spaniel", petmd: "cocker-spaniel", purina: "cocker-spaniel" },
    "jack-russell-terrier": { akc: "russell-terrier", petmd: "jack-russell-terrier", purina: "russell-terrier" },
    "brittany": { akc: "brittany", petmd: "brittany", purina: "brittany" }
  };

  function sourceSlug(breed, source) {
    return SPECIAL[breed.id]?.[source] || breed.id;
  }

  function guideLinks(breed) {
    const akc = sourceSlug(breed, "akc");
    const petmd = sourceSlug(breed, "petmd");
    const purina = sourceSlug(breed, "purina");
    return [
      {
        label: "AKC BREED GUIDE",
        note: "Breed standard, temperament, exercise, grooming and ownership overview.",
        url: `https://www.akc.org/dog-breeds/${encodeURIComponent(akc)}/`
      },
      {
        label: "PETMD HEALTH & CARE",
        note: "Vet-reviewed health risks, feeding, grooming, exercise and day-to-day care.",
        url: `https://www.petmd.com/dog/breeds/${encodeURIComponent(petmd)}`
      },
      {
        label: "PURINA BREED GUIDE",
        note: "Practical breed information covering temperament, activity, grooming and nutrition.",
        url: `https://www.purina.com/dogs/dog-breeds/${encodeURIComponent(purina)}`
      }
    ];
  }

  function insertCareGuides(breed) {
    if (!breed || !document.querySelector(".breed-page") || document.getElementById("care-guides")) return;
    const sections = [...document.querySelectorAll(".breed-page > .section")];
    const factsSection = sections.find(section => section.querySelector(".section-label")?.textContent?.trim().toLowerCase() === "facts");
    if (!factsSection) return;

    const links = guideLinks(breed);
    const section = document.createElement("section");
    section.className = "section care-guides-section";
    section.id = "care-guides";
    section.innerHTML = `
      <p class="section-label">Care guides</p>
      <h2>${esc(breed.name)} care manuals & references</h2>
      <p class="care-guides-intro">Use several sources rather than relying on one breed summary. Health advice is general, so confirm individual medical or nutrition decisions with your veterinarian.</p>
      <div class="care-guide-grid">
        ${links.map(link => `
          <a class="care-guide-card" href="${link.url}" target="_blank" rel="noopener">
            <strong>${link.label}</strong>
            <span>${link.note}</span>
            <em>OPEN GUIDE →</em>
          </a>`).join("")}
      </div>`;
    factsSection.insertAdjacentElement("afterend", section);
  }

  function currentBreed() {
    const match = location.hash.match(/^#breed\/(.+)$/);
    if (!match || typeof BREEDS === "undefined") return null;
    return BREEDS.find(item => item.id === match[1]) || null;
  }

  if (typeof renderBreed === "function" && !renderBreed.__careGuidesWrapped) {
    const original = renderBreed;
    const wrapped = function(breed) {
      original(breed);
      insertCareGuides(breed);
    };
    wrapped.__careGuidesWrapped = true;
    renderBreed = wrapped;
  }

  const insertCurrent = () => {
    const breed = currentBreed();
    if (breed) insertCareGuides(breed);
  };

  window.addEventListener("hashchange", () => {
    setTimeout(insertCurrent, 0);
    setTimeout(insertCurrent, 250);
  });
  setTimeout(insertCurrent, 0);
  setTimeout(insertCurrent, 300);
})();
