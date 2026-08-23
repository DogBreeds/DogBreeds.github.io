const app = document.getElementById("app");
const AMAZON_TAG = "YOUR-TAG-20";
const AMAZON_DOMAIN = "www.amazon.com";

const SIZE_LABELS = { small: "Small", medium: "Medium", large: "Large" };
const STAT_LABELS = {
  trainability: "Trainability",
  energy: "Energy",
  exercise: "Exercise need",
  stimulation: "Mental stimulation",
  sociability: "Sociability",
  independence: "Independence",
  shedding: "Shedding",
  grooming: "Grooming need",
  barking: "Barking tendency"
};

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function commonsImage(fileName, width = 1200) {
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}?width=${width}`;
}

function commonsPage(fileName) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName.replaceAll(" ", "_"))}`;
}

function amazonSearch(query) {
  const url = new URL(`https://${AMAZON_DOMAIN}/s`);
  url.searchParams.set("k", query);
  if (AMAZON_TAG && AMAZON_TAG !== "YOUR-TAG-20") url.searchParams.set("tag", AMAZON_TAG);
  return url.toString();
}

function petfinderSearch(breed, zip) {
  const url = new URL("https://www.petfinder.com/search/dogs-for-adoption/anywhere/");
  url.searchParams.set("postal_code", zip);
  url.searchParams.set("distance", "100");
  url.searchParams.append("breed[]", breed.petfinder);
  return url.toString();
}

function breedCard(breed) {
  return `
    <button class="breed-card" type="button" data-breed="${esc(breed.id)}" aria-label="Open ${esc(breed.name)}">
      <div class="card-photo"><img loading="lazy" src="${commonsImage(breed.photo, 900)}" alt="${esc(breed.name)}"></div>
      <div class="card-body">
        <div class="card-name">${esc(breed.name)}</div>
        <div class="card-size">${SIZE_LABELS[breed.size]} breed</div>
      </div>
    </button>`;
}

function renderQuiz() {
  app.innerHTML = `
    <section class="hero">
      <p class="kicker">Breed quiz</p>
      <h1>Unsure about the breed?</h1>
      <p class="lead">Take the quiz. Choose “not sure” whenever you do not know. Every breed in this site that fits your answers will appear.</p>
    </section>

    <form class="quiz-form" id="quiz-form">
      <div class="quiz-grid">
        ${question("size", "What size dog do you want?", [["", "Not sure / any size"],["small","Small"],["medium","Medium"],["large","Large"]])}
        ${question("energy", "What energy level do you want?", [["","Not sure"],["low","Lower energy"],["moderate","Moderate"],["high","High energy"]])}
        ${question("experience", "How experienced are you with dogs?", [["","Not sure"],["beginner","First dog / beginner"],["some","Some experience"],["experienced","Experienced"]])}
        ${question("exercise", "How much exercise can you reliably provide each day?", [["","Not sure"],["short","Up to about 45 minutes"],["medium","About 45–90 minutes"],["long","About 1.5–2 hours"],["very-long","2+ hours"]])}
        ${question("home", "What kind of home?", [["","Not sure / no preference"],["apartment","Apartment"],["house","House"],["property","Large property"]])}
        ${question("children", "Will the dog regularly live with children?", [["","Not sure / no preference"],["yes","Yes"],["no","No"]])}
        ${question("grooming", "How much grooming are you comfortable with?", [["","Not sure"],["low","Low"],["moderate","Moderate"],["high","High is fine"]])}
        ${question("shedding", "How much shedding are you comfortable with?", [["","Not sure"],["low","As little as possible"],["moderate","Some shedding is fine"],["high","Heavy shedding is fine"]])}
        ${question("working", "Do you want a dog that enjoys lots of training, tasks or sport?", [["","Not sure"],["yes","Yes"],["no","No, mostly a companion"]])}
      </div>
      <div class="actions">
        <button class="primary" type="submit">SHOW BREEDS</button>
        <button class="secondary" type="reset">RESET</button>
      </div>
    </form>
    <section class="results" id="quiz-results" aria-live="polite"></section>`;

  const form = document.getElementById("quiz-form");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    const matches = BREEDS.filter(breed => matchesQuiz(breed, values));
    renderResults(matches, "quiz-results", "Breeds that fit");
    document.getElementById("quiz-results").scrollIntoView({behavior:"smooth", block:"start"});
  });
  form.addEventListener("reset", () => {
    setTimeout(() => { document.getElementById("quiz-results").innerHTML = ""; }, 0);
  });
}

function question(name, label, options) {
  return `<div class="question"><label for="${name}">${esc(label)}</label><select id="${name}" name="${name}">${options.map(([v,t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join("")}</select></div>`;
}

function matchesQuiz(breed, v) {
  const p = breed.profile;
  if (v.size && breed.size !== v.size) return false;
  if (v.energy === "low" && p.energy > 2) return false;
  if (v.energy === "moderate" && (p.energy < 2 || p.energy > 4)) return false;
  if (v.energy === "high" && p.energy < 4) return false;
  if (v.experience === "beginner" && p.experience > 1) return false;
  if (v.experience === "some" && p.experience > 2) return false;
  if (v.exercise === "short" && p.exercise > 1) return false;
  if (v.exercise === "medium" && p.exercise > 3) return false;
  if (v.exercise === "long" && p.exercise > 4) return false;
  if (v.home === "apartment" && p.apartment < 3) return false;
  if (v.children === "yes" && p.children < 4) return false;
  if (v.grooming === "low" && p.grooming > 2) return false;
  if (v.grooming === "moderate" && p.grooming > 3) return false;
  if (v.shedding === "low" && p.shedding > 2) return false;
  if (v.shedding === "moderate" && p.shedding > 4) return false;
  if (v.working === "yes" && p.working < 4) return false;
  if (v.working === "no" && p.working > 3) return false;
  return true;
}

function renderResults(breeds, targetId, title) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = `
    <div class="results-header"><h2>${esc(title)}</h2><div class="count">${breeds.length} breed${breeds.length === 1 ? "" : "s"}</div></div>
    ${breeds.length ? `<div class="breed-grid">${breeds.map(breedCard).join("")}</div>` : `<div class="empty">No breeds in the current starter database fit every answer. Try changing one answer to “not sure.”</div>`}`;
  attachBreedLinks(target);
}

function renderBrowse(size, category) {
  const filtered = BREEDS.filter(b => {
    if (b.size !== size) return false;
    if (category === "all") return true;
    if (category === "beginner") return b.profile.experience === 1;
    if (category === "family") return b.profile.children >= 4 && b.stats.sociability >= 75;
    if (category === "working") return b.profile.working >= 4;
    if (category === "low-grooming") return b.profile.grooming <= 2;
    if (category === "low-energy") return b.profile.energy <= 2;
    return true;
  });
  const labels = {all:"All", beginner:"Beginner-friendly", family:"Family-friendly", working:"Working & sport", "low-grooming":"Lower grooming", "low-energy":"Lower energy"};
  app.innerHTML = `
    <section class="hero">
      <p class="kicker">Browse breeds</p>
      <h1>${SIZE_LABELS[size]} dogs</h1>
      <p class="lead">${esc(labels[category] || "All")} · ${filtered.length} breed${filtered.length === 1 ? "" : "s"} in the current database</p>
    </section>
    <section id="browse-results"><div class="breed-grid">${filtered.map(breedCard).join("")}</div></section>`;
  attachBreedLinks(app);
}

function attachBreedLinks(scope) {
  scope.querySelectorAll("[data-breed]").forEach(button => {
    button.addEventListener("click", () => { location.hash = `breed/${button.dataset.breed}`; });
  });
}

function renderBreed(breed) {
  const facts = [
    ["Size", SIZE_LABELS[breed.size]],
    ["Typical weight", breed.facts.weight],
    ["Typical height", breed.facts.height],
    ["Lifespan", breed.facts.lifespan],
    ["Coat", breed.facts.coat],
    ["Originally bred for", breed.facts.purpose],
    ["Typical exercise", breed.facts.exercise]
  ];
  const products = [
    ["Harness", breed.products.harness, `${breed.name} ${breed.products.harness}`],
    ["Shampoo", breed.products.shampoo, breed.products.shampoo],
    ["Grooming", breed.products.grooming, `${breed.name} ${breed.products.grooming}`],
    ["Bed / crate", breed.products.bed, `${breed.name} ${breed.products.bed}`]
  ];

  app.innerHTML = `
    <article class="breed-page">
      <header class="breed-heading">
        <div><p class="kicker">${SIZE_LABELS[breed.size]} breed</p><h1>${esc(breed.name)}</h1></div>
        <button class="back" type="button" id="back-button">← BACK</button>
      </header>

      <section class="section">
        <p class="section-label">Pictures</p>
        <div class="gallery" id="gallery">
          <figure class="photo">
            <div class="photo-media"><img src="${commonsImage(breed.photo, 1400)}" alt="${esc(breed.name)}"></div>
            <figcaption class="photo-credit"><a href="${commonsPage(breed.photo)}" target="_blank" rel="noopener">Wikimedia Commons source</a></figcaption>
          </figure>
          <div class="gallery-loading" id="gallery-loading">Loading more freely licensed photos from Wikimedia Commons…</div>
        </div>
      </section>

      <section class="section">
        <p class="section-label">Facts</p>
        <div class="facts-grid">${facts.map(([k,v]) => `<div class="fact"><span class="fact-name">${esc(k)}</span><span class="fact-value">${esc(v)}</span></div>`).join("")}</div>
      </section>

      <section class="section">
        <p class="section-label">Stats</p>
        <p class="stats-note">Relative breed tendency scores from 0–100. They are scales, not probabilities, and individual dogs vary.</p>
        <div class="stats">${Object.entries(breed.stats).map(([key,value]) => `<div class="stat"><div class="stat-name">${esc(STAT_LABELS[key])}</div><div class="stat-track"><div class="stat-fill" style="width:${Number(value)}%"></div></div><div class="stat-value">${Number(value)}%</div></div>`).join("")}</div>
      </section>

      <section class="section">
        <p class="section-label">Disadvantages</p>
        <h2>Things to know before getting one</h2>
        <ul class="disadvantages">${breed.disadvantages.map(d => `<li>${esc(d)}</li>`).join("")}</ul>
      </section>

      <section class="section">
        <p class="section-label">Adoption</p>
        <h2>Find ${esc(breed.name)}s near you</h2>
        <div class="shelter-box">
          <form class="shelter-form" id="shelter-form">
            <div class="field"><label for="zip">ZIP code</label><input class="zip-input" id="zip" name="zip" inputmode="numeric" autocomplete="postal-code" placeholder="e.g. 10001" maxlength="10"></div>
            <button class="primary" type="submit">FIND NEARBY DOGS</button>
          </form>
          <p class="help">Searches Petfinder for this breed near the ZIP code, so results come from shelters and rescues that currently list matching dogs.</p>
          <p class="message" id="shelter-message" aria-live="polite"></p>
        </div>
      </section>

      <section class="section">
        <p class="section-label">Recommended products</p>
        <h2>Products that fit the breed</h2>
        <div class="product-grid">${products.map(([label,note,query]) => `<div class="product"><h3>${esc(label)}</h3><p>${esc(note)}. Always measure the individual dog before ordering size-dependent gear.</p><a href="${amazonSearch(query)}" target="_blank" rel="sponsored noopener">Search Amazon →</a></div>`).join("")}</div>
      </section>
    </article>`;

  document.getElementById("back-button").addEventListener("click", () => history.length > 1 ? history.back() : location.hash = `browse/${breed.size}/all`);
  document.getElementById("shelter-form").addEventListener("submit", event => {
    event.preventDefault();
    const zip = String(new FormData(event.currentTarget).get("zip") || "").trim();
    const message = document.getElementById("shelter-message");
    if (!/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(zip)) {
      message.className = "message error";
      message.textContent = "Enter a valid ZIP or postal code.";
      return;
    }
    message.className = "message";
    message.textContent = `Opening ${breed.name} adoption results near ${zip}…`;
    window.open(petfinderSearch(breed, zip), "_blank", "noopener");
  });
  loadCommonsGallery(breed);
}

async function loadCommonsGallery(breed) {
  const gallery = document.getElementById("gallery");
  const loading = document.getElementById("gallery-loading");
  if (!gallery || !loading) return;
  try {
    const params = new URLSearchParams({
      action: "query",
      generator: "categorymembers",
      gcmtitle: `Category:${breed.category}`,
      gcmtype: "file",
      gcmlimit: "18",
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: "1200",
      format: "json",
      origin: "*"
    });
    const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`);
    if (!response.ok) throw new Error("Commons request failed");
    const data = await response.json();
    const pages = Object.values(data.query?.pages || {}).filter(page => {
      const info = page.imageinfo?.[0];
      return info?.thumburl && /\.(jpe?g|png|webp)$/i.test(info.url || "") && !page.title.endsWith(breed.photo);
    }).slice(0, 2);
    loading.remove();
    for (const page of pages) {
      const info = page.imageinfo[0];
      const meta = info.extmetadata || {};
      const artist = plainText(meta.Artist?.value) || "Wikimedia Commons contributor";
      const license = plainText(meta.LicenseShortName?.value) || "free license";
      const source = `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`;
      const figure = document.createElement("figure");
      figure.className = "photo";
      figure.innerHTML = `<div class="photo-media"><img loading="lazy" src="${esc(info.thumburl)}" alt="${esc(breed.name)}"></div><figcaption class="photo-credit">${esc(artist)} · ${esc(license)} · <a href="${esc(source)}" target="_blank" rel="noopener">source</a></figcaption>`;
      gallery.appendChild(figure);
    }
    if (!pages.length) {
      const fallback = document.createElement("div");
      fallback.className = "gallery-loading";
      fallback.textContent = "More photos are available from the Wikimedia Commons source link.";
      gallery.appendChild(fallback);
    }
  } catch (error) {
    loading.textContent = "More photos could not be loaded right now. The main photo source is linked above.";
  }
}

function plainText(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(String(html), "text/html");
  return (doc.body.textContent || "").trim();
}

async function renderCredits() {
  app.innerHTML = `<section class="hero"><p class="kicker">Sources</p><h1>Photo credits</h1><p class="lead">The starter images are hosted by Wikimedia Commons. Each file's license and attribution requirements are controlled by its Commons file page.</p></section><div class="credits-list">${BREEDS.map(b => `<div class="credit-row"><strong>${esc(b.name)}</strong><div class="credit-meta"><a href="${commonsPage(b.photo)}" target="_blank" rel="noopener">${esc(b.photo)}</a> · Wikimedia Commons</div></div>`).join("")}</div>`;
}

function setActiveNav(route) {
  document.querySelectorAll(".nav-button").forEach(el => el.classList.remove("active"));
  if (route === "quiz") document.querySelector(".nav-quiz")?.classList.add("active");
  if (route.startsWith("browse/large")) document.querySelector(".nav-large")?.classList.add("active");
  if (route.startsWith("browse/medium")) document.querySelector(".nav-medium")?.classList.add("active");
  if (route.startsWith("browse/small")) document.querySelector(".nav-small")?.classList.add("active");
}

function route() {
  const raw = location.hash.replace(/^#/, "") || "quiz";
  setActiveNav(raw);
  closeDropdowns();
  const parts = raw.split("/");
  if (parts[0] === "quiz") renderQuiz();
  else if (parts[0] === "browse" && ["small","medium","large"].includes(parts[1])) renderBrowse(parts[1], parts[2] || "all");
  else if (parts[0] === "breed") {
    const breed = BREEDS.find(b => b.id === parts[1]);
    breed ? renderBreed(breed) : renderQuiz();
  } else if (parts[0] === "credits") renderCredits();
  else renderQuiz();
  app.focus({preventScroll:true});
  window.scrollTo({top:0, behavior:"instant"});
}

function closeDropdowns() {
  document.querySelectorAll("[data-nav-group]").forEach(group => group.classList.remove("open"));
  document.querySelectorAll("[data-dropdown-trigger]").forEach(btn => btn.setAttribute("aria-expanded", "false"));
}

document.querySelector("[data-route='quiz']").addEventListener("click", () => { location.hash = "quiz"; });
document.querySelectorAll("[data-dropdown-trigger]").forEach(trigger => {
  trigger.addEventListener("click", () => {
    const group = trigger.closest("[data-nav-group]");
    const willOpen = !group.classList.contains("open");
    closeDropdowns();
    if (willOpen) {
      group.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});
document.querySelectorAll("[data-nav-group]").forEach(group => {
  group.addEventListener("mouseleave", () => {
    group.classList.remove("open");
    group.querySelector("[data-dropdown-trigger]")?.setAttribute("aria-expanded", "false");
  });
});
document.querySelectorAll("[data-browse]").forEach(button => {
  button.addEventListener("click", () => {
    const [size, category] = button.dataset.browse.split(":");
    location.hash = `browse/${size}/${category}`;
  });
});
document.addEventListener("click", event => {
  if (!event.target.closest("[data-nav-group]")) closeDropdowns();
});
window.addEventListener("hashchange", route);
route();
