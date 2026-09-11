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

  const HEALTH_WORDS = /cancer|dysplasia|bloat|torsion|cardiac|heart|eye|eyes|ear|ears|epilep|seizure|autoimmune|thyroid|kidney|liver|joint|patella|hip|elbow|spine|disc|ivdd|allerg|skin|dental|deaf|hearing|vision|von willebrand|addison|cushing|pancrea|health|disease|disorder|syndrome|condition/i;

  function sourceSlug(breed, source) {
    return SPECIAL[breed.id]?.[source] || breed.id;
  }

  function level(value, low, high) {
    const n = Number(value) || 0;
    if (n <= low) return "lower";
    if (n >= high) return "high";
    return "moderate";
  }

  function healthNotes(breed) {
    const notes = (breed.disadvantages || []).filter(item => HEALTH_WORDS.test(item));
    if (notes.length) return notes.slice(0, 2);
    return [
      `Ask your veterinarian about screening and preventive care that matter specifically for ${breed.name}s, especially as the dog ages.`
    ];
  }

  function carePriorities(breed) {
    const p = breed.profile || {};
    const s = breed.stats || {};
    const exercise = breed.facts?.exercise || "Daily exercise needs vary by individual dog.";
    const coat = breed.facts?.coat || "Coat care varies by individual dog.";
    const groomingLevel = level(p.grooming, 2, 4);
    const sheddingLevel = level(p.shedding, 2, 4);
    const stimulationLevel = level(s.stimulation, 40, 75);
    const barkingLevel = level(s.barking, 35, 70);
    const independenceLevel = level(s.independence, 35, 70);
    const health = healthNotes(breed);

    const dailyDetails = [
      exercise,
      `${breed.name}s have ${stimulationLevel} mental-stimulation needs in this guide.`,
      barkingLevel === "high" ? "Plan for deliberate work on settling and nuisance barking." : independenceLevel === "high" ? "Training should account for a fairly independent temperament rather than assuming constant handler focus." : "Short, consistent training sessions should fit the breed well."
    ];

    const coatDetails = [
      coat,
      `Grooming demand is ${groomingLevel}; shedding is ${sheddingLevel}.`,
      breed.products?.grooming ? `Useful routine tools: ${breed.products.grooming}.` : "Use coat-appropriate brushing and nail care on a regular schedule."
    ];

    return [
      {
        title: "DAILY ROUTINE",
        text: dailyDetails.join(" ")
      },
      {
        title: "COAT & GROOMING",
        text: coatDetails.join(" ")
      },
      {
        title: "HEALTH TO WATCH",
        text: health.join(" ")
      }
    ];
  }

  function guideLinks(breed) {
    const akc = sourceSlug(breed, "akc");
    const petmd = sourceSlug(breed, "petmd");
    const purina = sourceSlug(breed, "purina");
    const health = healthNotes(breed)[0];
    return [
      {
        label: `${breed.name.toUpperCase()} — AKC`,
        note: `Use this for ${breed.name}-specific temperament, exercise, grooming and breed-standard guidance.`,
        url: `https://www.akc.org/dog-breeds/${encodeURIComponent(akc)}/`
      },
      {
        label: `${breed.name.toUpperCase()} — PETMD`,
        note: `Use this for veterinary care and health risks. On this site, the main health note is: ${health}`,
        url: `https://www.petmd.com/dog/breeds/${encodeURIComponent(petmd)}`
      },
      {
        label: `${breed.name.toUpperCase()} — PURINA`,
        note: `Use this for practical ${breed.name} feeding, activity, coat-care and day-to-day ownership guidance.`,
        url: `https://www.purina.com/dogs/dog-breeds/${encodeURIComponent(purina)}`
      }
    ];
  }

  function insertCareGuides(breed) {
    if (!breed || !document.querySelector(".breed-page") || document.getElementById("care-guides")) return;
    const sections = [...document.querySelectorAll(".breed-page > .section")];
    const factsSection = sections.find(section => section.querySelector(".section-label")?.textContent?.trim().toLowerCase() === "facts");
    if (!factsSection) return;

    const priorities = carePriorities(breed);
    const links = guideLinks(breed);
    const section = document.createElement("section");
    section.className = "section care-guides-section";
    section.id = "care-guides";
    section.innerHTML = `
      <p class="section-label">Care guides</p>
      <h2>How to care for a ${esc(breed.name)}</h2>
      <p class="care-guides-intro">These are the main care priorities for this breed based on the exercise, coat, behavior and health information in this guide. Individual dogs still vary.</p>
      <div class="care-priority-grid">
        ${priorities.map(item => `
          <div class="care-priority-card">
            <strong>${esc(item.title)}</strong>
            <span>${esc(item.text)}</span>
          </div>`).join("")}
      </div>
      <div class="care-reference-heading">
        <h3>Breed-specific manuals & references</h3>
        <p>Cross-check several sources, and confirm medical or nutrition decisions with your veterinarian.</p>
      </div>
      <div class="care-guide-grid">
        ${links.map(link => `
          <a class="care-guide-card" href="${link.url}" target="_blank" rel="noopener">
            <strong>${esc(link.label)}</strong>
            <span>${esc(link.note)}</span>
            <em>OPEN ${esc(breed.name.toUpperCase())} GUIDE →</em>
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
