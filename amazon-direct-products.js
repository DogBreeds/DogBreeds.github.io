(() => {
  const CATALOG = {
    harness: {
      small: { asin: "B01MA58881", name: "rabbitgoo Small No-Pull Dog Harness" },
      medium: { asin: "B01MA5ANKG", name: "rabbitgoo Medium No-Pull Dog Harness" },
      large: { asin: "B01M8JT6FT", name: "rabbitgoo Large No-Pull Dog Harness" },
      xl: { asin: "B07V67JWSH", name: "rabbitgoo XL No-Pull Dog Harness" }
    },
    shampoo: {
      curly: { asin: "B08JM7PKTV", name: "TropiClean PerfectFur Curly & Wavy Coat Shampoo" },
      double: { asin: "B08JM8HCRZ", name: "TropiClean PerfectFur Thick Double Coat Shampoo" },
      shedding: { asin: "B09Y7LKFSQ", name: "FURminator deShedding Ultra Premium Shampoo" },
      gentle: { asin: "B0002IEYIE", name: "earthbath Oatmeal & Aloe Dog Shampoo" }
    },
    grooming: {
      curly: { asin: "B00KAJQJ74", name: "Chris Christensen Big G Slicker Brush" },
      wire: { asin: "B00061MPPQ", name: "Mars Coat King 6-Blade Grooming Rake / Stripper" },
      silky: { asin: "B004UTDHP2", name: "Andis Pet Steel Grooming Comb" },
      smallLong: { asin: "B07NSS9NQ5", name: "FURminator Small Dog Long-Hair deShedding Tool" },
      mediumLong: { asin: "B07PK5ZCZ6", name: "FURminator Medium Dog Long-Hair deShedding Tool" },
      largeLong: { asin: "B07NSL5V36", name: "FURminator Large Dog Long-Hair deShedding Tool" },
      mediumShort: { asin: "B07MZD93QQ", name: "FURminator Medium Dog Short-Hair deShedding Tool" },
      largeShort: { asin: "B07NSL5MD8", name: "FURminator Large Dog Short-Hair deShedding Tool" },
      general: { asin: "B00ZGPI3OY", name: "Hertzko Self-Cleaning Slicker Brush" }
    },
    bed: {
      tiny: { asin: "B0B6HMG653", name: "Bedsure 24×18 in Small Orthopedic Dog Bed" },
      medium: { asin: "B0759MNQV7", name: "Furhaven 30×20 in Medium Orthopedic Dog Bed" },
      large: { asin: "B07W45KSSD", name: "Furhaven 36×27 in Large Orthopedic Dog Bed" },
      xl: { asin: "B0GRBXBPXH", name: "Barker Beds / Big Barker 48×30 in Large Orthopedic Bed" },
      giant: { asin: "B0125QNCBK", name: "Bully Beds 52×34×7 in XL Orthopedic Dog Bed" }
    }
  };

  function maxWeightLb(breed) {
    const text = String(breed?.facts?.weight || "");
    const numbers = (text.match(/\d+(?:\.\d+)?/g) || []).map(Number).filter(Number.isFinite);
    if (!numbers.length) return breed?.size === "large" ? 70 : breed?.size === "medium" ? 40 : 18;
    const imperialNumbers = numbers.slice(0, Math.min(2, numbers.length));
    return Math.max(...imperialNumbers);
  }

  function coatInfo(breed) {
    const coat = String(breed?.facts?.coat || "").toLowerCase();
    const grooming = Number(breed?.profile?.grooming || 0);
    const shedding = Number(breed?.profile?.shedding || 0);
    return {
      coat,
      grooming,
      shedding,
      curly: /curly|wavy|poodle|bichon/.test(coat) || ["standard-poodle", "portuguese-water-dog", "bichon-frise"].includes(breed.id),
      wire: /wiry|wire|harsh/.test(coat),
      silky: /silky|fine/.test(coat),
      double: /double coat|undercoat|plush/.test(coat),
      long: /long|medium-length|feather|plush|rough/.test(coat)
    };
  }

  function harnessFor(breed) {
    const weight = maxWeightLb(breed);
    if (weight <= 25) return CATALOG.harness.small;
    if (weight <= 50) return CATALOG.harness.medium;
    if (weight <= 85) return CATALOG.harness.large;
    return CATALOG.harness.xl;
  }

  function shampooFor(breed) {
    const info = coatInfo(breed);
    if (info.curly) return CATALOG.shampoo.curly;
    if (info.double) return CATALOG.shampoo.double;
    if (info.shedding >= 4) return CATALOG.shampoo.shedding;
    return CATALOG.shampoo.gentle;
  }

  function groomingFor(breed) {
    const info = coatInfo(breed);
    const weight = maxWeightLb(breed);
    if (info.wire) return CATALOG.grooming.wire;
    if (info.curly || info.grooming >= 4 && info.shedding <= 2) return CATALOG.grooming.curly;
    if (info.silky && info.grooming >= 3) return CATALOG.grooming.silky;
    if (info.shedding >= 4 || info.double) {
      if (info.long) {
        if (weight <= 20) return CATALOG.grooming.smallLong;
        if (weight <= 50) return CATALOG.grooming.mediumLong;
        return CATALOG.grooming.largeLong;
      }
      return weight > 50 ? CATALOG.grooming.largeShort : CATALOG.grooming.mediumShort;
    }
    return CATALOG.grooming.general;
  }

  function bedFor(breed) {
    const weight = maxWeightLb(breed);
    if (weight <= 10) return CATALOG.bed.tiny;
    if (weight <= 35) return CATALOG.bed.medium;
    if (weight <= 55) return CATALOG.bed.large;
    if (weight <= 90) return CATALOG.bed.xl;
    return CATALOG.bed.giant;
  }

  function amazonProductUrl(asin) {
    const url = new URL(`https://www.amazon.com/dp/${asin}`);
    if (typeof AMAZON_TAG !== "undefined" && AMAZON_TAG && AMAZON_TAG !== "YOUR-TAG-20") {
      url.searchParams.set("tag", AMAZON_TAG);
    }
    return url.toString();
  }

  function recommendationSet(breed) {
    return [
      { ...harnessFor(breed), extra: "Starting-point size only. Measure the dog's chest/girth and use the listing's size chart before ordering." },
      { ...shampooFor(breed), extra: "Chosen for this breed's coat type and shedding/grooming profile." },
      { ...groomingFor(breed), extra: "Chosen for this breed's coat texture, length and shedding level." },
      { ...bedFor(breed), extra: maxWeightLb(breed) > 90 ? "Chosen as a genuinely larger orthopedic bed for a giant breed. Measure your individual dog from nose to tail base before ordering." : "Bed size is selected from the breed's typical adult weight; measure your individual dog's sleeping length before ordering." }
    ];
  }

  function patchProducts(breed) {
    if (!breed || !document.querySelector(".breed-page")) return;
    const cards = [...document.querySelectorAll(".product-grid .product")];
    if (cards.length < 4) return;
    const recommendations = recommendationSet(breed);

    cards.slice(0, 4).forEach((card, index) => {
      const rec = recommendations[index];
      const note = card.querySelector("p");
      const link = card.querySelector("a");
      if (!rec || !link) return;

      let exact = card.querySelector(".exact-amazon-product");
      if (!exact) {
        exact = document.createElement("div");
        exact.className = "exact-amazon-product";
        link.before(exact);
      }
      exact.innerHTML = `<strong>Recommended item:</strong> ${esc(rec.name)}<span>${esc(rec.extra)}</span>`;

      if (note) {
        const original = breed.products ? [breed.products.harness, breed.products.shampoo, breed.products.grooming, breed.products.bed][index] : "";
        if (original) note.textContent = original;
      }

      link.href = amazonProductUrl(rec.asin);
      link.textContent = "VIEW EXACT PRODUCT ON AMAZON →";
      link.rel = "sponsored noopener";
      link.dataset.asin = rec.asin;
      link.setAttribute("aria-label", `View ${rec.name} on Amazon`);
    });
  }

  function currentBreed() {
    const match = location.hash.match(/^#breed\/(.+)$/);
    if (!match || typeof BREEDS === "undefined") return null;
    return BREEDS.find(item => item.id === match[1]) || null;
  }

  if (typeof renderBreed === "function" && !renderBreed.__directAmazonWrapped) {
    const original = renderBreed;
    const wrapped = function(breed) {
      original(breed);
      patchProducts(breed);
      setTimeout(() => patchProducts(breed), 100);
    };
    wrapped.__directAmazonWrapped = true;
    renderBreed = wrapped;
  }

  const patchCurrent = () => {
    const breed = currentBreed();
    if (breed) patchProducts(breed);
  };

  window.addEventListener("hashchange", () => {
    setTimeout(patchCurrent, 0);
    setTimeout(patchCurrent, 250);
  });
  setTimeout(patchCurrent, 0);
  setTimeout(patchCurrent, 300);
})();
