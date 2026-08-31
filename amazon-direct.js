(() => {
  const PICKS = {
    harnessSmall: { asin:"B0BZ83F98C", name:"rabbitgoo XS no-pull harness" },
    harnessMedium: { asin:"B01M6YASY1", name:"rabbitgoo medium no-pull harness" },
    harnessLarge: { asin:"B01M8JT6FT", name:"rabbitgoo large no-pull harness" },
    harnessGiant: { asin:"B0D92V634P", name:"WINGOIN XXL harness for 110–160 lb giant breeds" },

    bedSmall: { asin:"B0FRY7TN6R", name:"24-inch calming bed for dogs up to about 25 lb" },
    bedMedium: { asin:"B0FGC9KLW8", name:"30 × 20-inch orthopedic dog bed" },
    bedLarge: { asin:"B089RGDQBB", name:"35-inch Bedsure orthopedic dog bed" },
    bedXL: { asin:"B0BDLGZCTY", name:"44 × 32-inch EHEYCIGA orthopedic XL dog bed" },
    bedGiant: { asin:"B0DB8BC3BN", name:"47.75-inch raised dog bed rated for large/giant dogs" },

    shampooGentle: { asin:"B00DTEV54Y", name:"Burt’s Bees oatmeal dog shampoo" },
    shampooDeshed: { asin:"B09Y7LKFSQ", name:"FURminator Ultra Premium deShedding shampoo, 16 oz" },

    groomingCurly: { asin:"B00KAJQJ74", name:"Chris Christensen Big G slicker brush" },
    groomingShortSmall: { asin:"B007B6VU50", name:"KONG ZoomGroom for small dogs" },
    groomingShortLarge: { asin:"B0002AR19Q", name:"KONG ZoomGroom for medium/large dogs" },
    groomingUndercoat: { asin:"B01KSAII5A", name:"Safari double-row undercoat rake" },
    groomingWire: { asin:"B00OGLNC7C", name:"Mars Coat King stripping knife for terrier/wiry coats" },
    groomingGeneral: { asin:"B00ZGPI3OY", name:"Hertzko self-cleaning slicker brush" }
  };

  function currentBreed() {
    if (typeof BREEDS === "undefined") return null;
    const match = location.hash.match(/^#breed\/(.+)$/);
    return match ? BREEDS.find(item => item.id === match[1]) || null : null;
  }

  function maxWeightLb(breed) {
    const text = [breed?.facts?.weight, breed?.facts?.weightMale, breed?.facts?.weightFemale].filter(Boolean).join(" ");
    const numbers = [...text.matchAll(/(\d+(?:\.\d+)?)\s*lb/gi)].map(match => Number(match[1]));
    return numbers.length ? Math.max(...numbers) : breed?.size === "small" ? 25 : breed?.size === "medium" ? 50 : 90;
  }

  function harnessPick(breed) {
    const max = maxWeightLb(breed);
    if (max <= 25) return PICKS.harnessSmall;
    if (max <= 50) return PICKS.harnessMedium;
    if (max <= 105) return PICKS.harnessLarge;
    return PICKS.harnessGiant;
  }

  function bedPick(breed) {
    const max = maxWeightLb(breed);
    if (max <= 25) return PICKS.bedSmall;
    if (max <= 50) return PICKS.bedMedium;
    if (max <= 75) return PICKS.bedLarge;
    if (max <= 110) return PICKS.bedXL;
    return PICKS.bedGiant;
  }

  function shampooPick(breed) {
    return Number(breed?.profile?.shedding || 0) >= 4 ? PICKS.shampooDeshed : PICKS.shampooGentle;
  }

  function groomingPick(breed) {
    const coat = String(breed?.facts?.coat || "").toLowerCase();
    const grooming = Number(breed?.profile?.grooming || 0);
    const shedding = Number(breed?.profile?.shedding || 0);
    const max = maxWeightLb(breed);

    if (/curly|wool|corded|poodle/.test(coat) || breed?.id === "standard-poodle") return PICKS.groomingCurly;
    if (/wire|wiry|harsh/.test(coat)) return PICKS.groomingWire;
    if (/short|smooth/.test(coat) && grooming <= 2) return max <= 25 ? PICKS.groomingShortSmall : PICKS.groomingShortLarge;
    if (/double/.test(coat) || shedding >= 4) return PICKS.groomingUndercoat;
    return PICKS.groomingGeneral;
  }

  function pickFor(breed, query) {
    const q = String(query || "").toLowerCase();
    if (q.includes("harness")) return harnessPick(breed);
    if (q.includes("shampoo")) return shampooPick(breed);
    if (q.includes("bed") || q.includes("crate")) return bedPick(breed);
    return groomingPick(breed);
  }

  function productUrl(asin) {
    const url = new URL(`https://${AMAZON_DOMAIN}/dp/${asin}`);
    if (AMAZON_TAG && AMAZON_TAG !== "YOUR-TAG-20") url.searchParams.set("tag", AMAZON_TAG);
    return url.toString();
  }

  amazonSearch = function(query) {
    const breed = currentBreed();
    if (!breed) return productUrl(PICKS.groomingGeneral.asin);
    return productUrl(pickFor(breed, query).asin);
  };

  function decorateBreedProducts() {
    const breed = currentBreed();
    if (!breed) return;
    document.querySelectorAll(".breed-page .product").forEach(card => {
      const heading = card.querySelector("h3")?.textContent?.trim().toLowerCase() || "";
      let pick;
      if (heading.includes("harness")) pick = harnessPick(breed);
      else if (heading.includes("shampoo")) pick = shampooPick(breed);
      else if (heading.includes("bed") || heading.includes("crate")) pick = bedPick(breed);
      else pick = groomingPick(breed);
      const link = card.querySelector("a");
      if (!link || !pick) return;
      link.href = productUrl(pick.asin);
      link.textContent = "View recommended item →";
      link.dataset.amazonAsin = pick.asin;
      let note = card.querySelector(".direct-amazon-pick");
      if (!note) {
        note = document.createElement("p");
        note.className = "direct-amazon-pick";
        card.insertBefore(note, link);
      }
      note.textContent = `Direct pick: ${pick.name}. Measure your dog before ordering size-dependent gear.`;
    });
  }

  if (typeof renderBreed === "function" && !renderBreed.__amazonDirectWrapped) {
    const original = renderBreed;
    renderBreed = function(breed) {
      original(breed);
      decorateBreedProducts();
    };
    renderBreed.__amazonDirectWrapped = true;
  }

  const refresh = () => {
    if (location.hash.startsWith("#breed/")) {
      decorateBreedProducts();
    }
  };
  window.addEventListener("hashchange", () => { setTimeout(refresh, 0); setTimeout(refresh, 250); });
  setTimeout(refresh, 0);
  setTimeout(refresh, 350);

  if (location.hash.startsWith("#breed/") && typeof route === "function") route();
})();
