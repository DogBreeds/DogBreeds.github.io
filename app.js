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

const BREED_VARIATIONS = {
  "labrador-retriever": ["yellow Labrador Retriever", "black Labrador Retriever", "chocolate Labrador Retriever"],
  "golden-retriever": ["light Golden Retriever", "golden Golden Retriever", "dark Golden Retriever"],
  "german-shepherd-dog": ["black and tan German Shepherd", "sable German Shepherd", "black German Shepherd"],
  "great-dane": ["fawn Great Dane", "harlequin Great Dane", "blue Great Dane", "brindle Great Dane"],
  "bernese-mountain-dog": ["Bernese Mountain Dog adult", "Bernese Mountain Dog puppy", "Bernese Mountain Dog coat"],
  "standard-poodle": ["black Standard Poodle", "white Standard Poodle", "brown Standard Poodle", "red Standard Poodle"],
  "border-collie": ["black white Border Collie", "red white Border Collie", "blue merle Border Collie", "tricolor Border Collie"],
  "australian-shepherd": ["blue merle Australian Shepherd", "red merle Australian Shepherd", "black tri Australian Shepherd", "red tri Australian Shepherd"],
  "beagle": ["tricolor Beagle", "lemon white Beagle", "red white Beagle"],
  "english-cocker-spaniel": ["black English Cocker Spaniel", "golden English Cocker Spaniel", "blue roan English Cocker Spaniel", "orange roan English Cocker Spaniel"],
  "shiba-inu": ["red Shiba Inu", "black tan Shiba Inu", "sesame Shiba Inu", "cream Shiba Inu"],
  "siberian-husky": ["black white Siberian Husky", "gray white Siberian Husky", "red white Siberian Husky", "agouti Siberian Husky"],
  "dachshund": ["smooth Dachshund", "longhaired Dachshund", "wirehaired Dachshund", "red Dachshund"],
  "cavalier-king-charles-spaniel": ["Blenheim Cavalier King Charles Spaniel", "tricolor Cavalier King Charles Spaniel", "ruby Cavalier King Charles Spaniel", "black tan Cavalier King Charles Spaniel"],
  "miniature-schnauzer": ["salt pepper Miniature Schnauzer", "black silver Miniature Schnauzer", "black Miniature Schnauzer"],
  "pomeranian": ["orange Pomeranian", "cream Pomeranian", "black Pomeranian", "sable Pomeranian"],
  "pembroke-welsh-corgi": ["red white Pembroke Welsh Corgi", "sable Pembroke Welsh Corgi", "tricolor Pembroke Welsh Corgi"],
  "newfoundland": ["black Newfoundland dog", "brown Newfoundland dog", "Landseer Newfoundland dog"],
  "doberman-pinscher": ["black rust Doberman", "red rust Doberman", "blue Doberman", "fawn Doberman"],
  "boxer": ["fawn Boxer dog", "brindle Boxer dog", "white Boxer dog"],
  "rottweiler": ["Rottweiler adult", "Rottweiler puppy", "Rottweiler markings"],
  "greyhound": ["black Greyhound dog", "brindle Greyhound dog", "fawn Greyhound dog", "blue Greyhound dog"],
  "australian-cattle-dog": ["blue Australian Cattle Dog", "red Australian Cattle Dog", "speckled Australian Cattle Dog"],
  "english-springer-spaniel": ["liver white English Springer Spaniel", "black white English Springer Spaniel", "tricolor English Springer Spaniel"],
  "brittany": ["orange white Brittany dog", "liver white Brittany dog", "roan Brittany dog"],
  "basenji": ["red white Basenji", "black white Basenji", "tricolor Basenji", "brindle Basenji"],
  "whippet": ["brindle Whippet", "fawn Whippet", "black Whippet", "blue Whippet"],
  "havanese": ["black Havanese", "white Havanese", "chocolate Havanese", "sable Havanese"],
  "bichon-frise": ["white Bichon Frise", "cream Bichon Frise", "Bichon Frise puppy"],
  "papillon": ["sable Papillon dog", "black white Papillon dog", "tricolor Papillon dog"],
  "jack-russell-terrier": ["white tan Jack Russell Terrier", "tricolor Jack Russell Terrier", "white black Jack Russell Terrier"],
  "maltese": ["white Maltese dog", "Maltese puppy", "Maltese long coat"]
};

const primaryPhotoCache = new Map();

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function inverse5(n) { return (6 - clamp(Number(n) || 3, 1, 5)) / 5; }
function norm5(n) { return clamp(Number(n) || 3, 1, 5) / 5; }
function inverse100(n) { return (100 - clamp(Number(n) || 50, 0, 100)) / 100; }
function norm100(n) { return clamp(Number(n) || 50, 0, 100) / 100; }
function target5(n, target, spread = 2) { return clamp(1 - Math.abs((Number(n) || 3) - target) / spread, 0, 1); }
function avg(values) { return values.length ? values.reduce((a,b) => a + b, 0) / values.length : 0.5; }

function commonsImage(fileName, width = 1200) {
  if (!fileName) return "";
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}?width=${width}`;
}

function commonsPage(fileName) {
  if (!fileName) return "https://commons.wikimedia.org/";
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName.replaceAll(" ", "_"))}`;
}

function commonsCategoryPage(category) {
  return `https://commons.wikimedia.org/wiki/Category:${encodeURIComponent(String(category).replaceAll(" ", "_"))}`;
}

function amazonSearch(query) {
  const url = new URL(`https://${AMAZON_DOMAIN}/s`);
  url.searchParams.set("k", query);
  if (AMAZON_TAG && AMAZON_TAG !== "YOUR-TAG-20") url.searchParams.set("tag", AMAZON_TAG);
  return url.toString();
}


function breedCard(breed) {
  const initial = breed.photo
    ? `<img loading="lazy" src="${commonsImage(breed.photo, 900)}" alt="${esc(breed.name)}" data-card-img data-category="${esc(breed.category)}">`
    : `<div class="photo-placeholder" data-card-placeholder data-category="${esc(breed.category)}">Loading photo…</div>`;
  return `
    <button class="breed-card" type="button" data-breed="${esc(breed.id)}" aria-label="Open ${esc(breed.name)}">
      <div class="card-photo">${initial}</div>
      <div class="card-body">
        <div class="card-name">${esc(breed.name)}</div>
        <div class="card-size">${SIZE_LABELS[breed.size]} breed</div>
      </div>
    </button>`;
}

function renderHome() {
  app.innerHTML = `
    <section class="home-hero">
      <div class="hero-copy">
        <p class="kicker">Dog breed guide</p>
        <h1>Find a dog that fits your life.</h1>
        <p class="lead">Dog Breed Finder is a practical guide for comparing breeds before you choose a dog. Browse directly if you already know what matters to you, use the filter for specific traits, or take the quiz if you are not sure how those traits translate into a breed.</p>
        <div class="actions hero-actions">
          <button class="primary" type="button" id="take-quiz">TAKE THE QUIZ</button>
          <button class="secondary" type="button" id="browse-all">BROWSE ALL BREEDS</button>
        </div>
      </div>
      <aside class="about-card" aria-label="How to use the site">
        <p class="section-label">Three ways to explore</p>
        <ol>
          <li><strong>Quiz</strong><span>Answer lifestyle questions and see every strong match.</span></li>
          <li><strong>Filter</strong><span>Choose exact traits when you already know what you want.</span></li>
          <li><strong>Browse</strong><span>Open Large, Medium or Small above and explore freely.</span></li>
        </ol>
      </aside>
    </section>

    <section class="quiz-stage" id="quiz-stage" hidden>
      <div class="quiz-intro">
        <p class="kicker">Breed quiz</p>
        <h2>Find breeds that fit your life.</h2>
        <p class="lead">Answer a few questions about your experience, home and everyday life. You will see the breeds that are the strongest overall matches.</p>
      </div>
      ${quizMarkup()}
    </section>

    <section class="results" id="home-results" aria-live="polite"></section>`;

  document.getElementById("take-quiz").addEventListener("click", () => {
    const stage = document.getElementById("quiz-stage");
    stage.hidden = false;
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("browse-all").addEventListener("click", () => renderInlineAllBreeds());
  setupQuiz();
}

function filterMarkup(id, preferredSize = "") {
  return `
    <details class="filter-shell" id="${id}">
      <summary>
        <span>FILTER BREEDS</span>
        <span class="filter-summary-note">optional, for direct filtering</span>
      </summary>
      <form class="filter-form" data-filter-form>
        <div class="filter-grid">
          ${filterGroup("size", "Size", [["small","Small"],["medium","Medium"],["large","Large"]], preferredSize ? [preferredSize] : [])}
          ${filterGroup("energy", "Energy", [["low","Lower"],["moderate","Moderate"],["high","High"]])}
          ${filterGroup("exercise", "Exercise need", [["light","Lighter"],["moderate","Moderate"],["high","High"]])}
          ${filterGroup("grooming", "Grooming", [["low","Lower"],["moderate","Moderate"],["high","High is fine"]])}
          ${filterGroup("shedding", "Shedding", [["low","Lower"],["moderate","Moderate"],["high","Heavy is fine"]])}
          ${filterGroup("experience", "Owner experience", [["beginner","Beginner-friendly"],["some","Some experience helpful"],["experienced","Experienced handling needed"]])}
          ${filterGroup("home", "Home fit", [["apartment","Apartment-friendly"],["space","Space preferred"]])}
          ${filterGroup("lifestyle", "Lifestyle", [["children","Good with children"],["working","Training / sport"],["companion","Mostly companion"]])}
        </div>
        <div class="actions filter-actions">
          <button class="primary" type="submit">APPLY FILTER</button>
          <button class="secondary" type="reset">CLEAR</button>
        </div>
      </form>
    </details>`;
}

function filterGroup(key, label, options, selected = []) {
  const hasSelection = selected.length > 0;
  return `
    <fieldset class="filter-group" data-filter-group="${key}">
      <legend>${esc(label)}</legend>
      <label class="check-option none-option"><input type="checkbox" name="${key}" value="none"${hasSelection ? "" : " checked"}> <span>None</span></label>
      ${options.map(([value,text]) => `<label class="check-option"><input type="checkbox" name="${key}" value="${value}"${selected.includes(value) ? " checked" : ""}> <span>${esc(text)}</span></label>`).join("")}
    </fieldset>`;
}

function setupFilter(detailsId, resultsId, preferredSize = "") {
  const details = document.getElementById(detailsId);
  if (!details) return;
  const form = details.querySelector("[data-filter-form]");
  setupNoneCheckboxes(form, "[data-filter-group]");

  form.addEventListener("submit", event => {
    event.preventDefault();
    const values = collectCheckboxGroups(form, "[data-filter-group]");
    const matches = BREEDS.filter(breed => matchesFilter(breed, values));
    renderResults(matches, resultsId, "Filtered breeds");
    document.getElementById(resultsId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      form.querySelectorAll("[data-filter-group]").forEach(group => {
        const key = group.dataset.filterGroup;
        group.querySelectorAll("input").forEach(input => {
          input.checked = key === "size" && preferredSize ? input.value === preferredSize : input.value === "none";
        });
      });
      const target = document.getElementById(resultsId);
      if (target) target.innerHTML = "";
    }, 0);
  });
}

function collectCheckboxGroups(form, selector) {
  const result = {};
  form.querySelectorAll(selector).forEach(group => {
    const key = group.dataset.filterGroup || group.dataset.quizGroup;
    result[key] = [...group.querySelectorAll("input:checked")].map(input => input.value).filter(v => v !== "none");
  });
  return result;
}

function setupNoneCheckboxes(scope, groupSelector) {
  scope.querySelectorAll(groupSelector).forEach(group => {
    const inputs = [...group.querySelectorAll('input[type="checkbox"]')];
    const none = inputs.find(input => input.value === "none");
    if (!none) return;
    inputs.forEach(input => {
      input.addEventListener("change", () => {
        if (input === none && none.checked) {
          inputs.filter(other => other !== none).forEach(other => { other.checked = false; });
        } else if (input !== none && input.checked) {
          none.checked = false;
        }
        if (!inputs.some(other => other.checked)) none.checked = true;
      });
    });
  });
}

function matchesAny(value, tests) { return tests.some(test => test(value)); }

function matchesFilter(breed, v) {
  const p = breed.profile;
  if (v.size?.length && !v.size.includes(breed.size)) return false;
  if (v.energy?.length && !matchesAny(p.energy, v.energy.map(x => x === "low" ? n => n <= 2 : x === "moderate" ? n => n >= 2 && n <= 4 : n => n >= 4))) return false;
  if (v.exercise?.length && !matchesAny(p.exercise, v.exercise.map(x => x === "light" ? n => n <= 2 : x === "moderate" ? n => n >= 2 && n <= 3 : n => n >= 4))) return false;
  if (v.grooming?.length && !matchesAny(p.grooming, v.grooming.map(x => x === "low" ? n => n <= 2 : x === "moderate" ? n => n >= 2 && n <= 3 : n => n >= 4))) return false;
  if (v.shedding?.length && !matchesAny(p.shedding, v.shedding.map(x => x === "low" ? n => n <= 2 : x === "moderate" ? n => n >= 2 && n <= 4 : n => n >= 4))) return false;
  if (v.experience?.length) {
    const ok = v.experience.some(x => x === "beginner" ? p.experience === 1 : x === "some" ? p.experience === 2 : p.experience >= 3);
    if (!ok) return false;
  }
  if (v.home?.length) {
    const ok = v.home.some(x => x === "apartment" ? p.apartment >= 4 : p.apartment <= 3);
    if (!ok) return false;
  }
  if (v.lifestyle?.length) {
    const ok = v.lifestyle.some(x => x === "children" ? p.children >= 4 : x === "working" ? p.working >= 4 : p.working <= 3);
    if (!ok) return false;
  }
  return true;
}

function quizMarkup() {
  const steps = [
    quizRadio("experience", "How experienced are you with dogs?", [
      ["beginner","I am a beginner or this would be my first dog"],
      ["some","I have lived with or trained dogs before"],
      ["experienced","I am experienced and comfortable handling more demanding breeds"]
    ]),
    quizRadio("weekday", "On a busy weekday, what is realistically sustainable?", [
      ["short","A few shorter walks and some play"],
      ["hour","About an hour plus a little training or play"],
      ["long","Around 1.5 hours of real activity"],
      ["very-long","2+ hours and I am happy to plan around the dog"]
    ]),
    quizMulti("weekend", "Which Saturday plans actually sound fun with your dog?", [
      ["hike","A long hike, run or outdoor adventure"],
      ["training","Training tricks, agility or dog sport"],
      ["family","A family outing with children"],
      ["social","A café, park or social day"],
      ["quiet","A quiet day at home with a couple of walks"]
    ]),
    quizMulti("household", "Which things describe your home?", [
      ["apartment","Apartment or shared walls"],
      ["children","Young children"],
      ["visitors","Frequent visitors or a busy social household"]
    ]),
    quizMulti("dealbreakers", "Which things would genuinely bother you?", [
      ["hair","Hair around the home"],
      ["grooming","Frequent professional grooming"],
      ["noise","A lot of barking or howling"],
      ["stimulation","Needing to invent mental work every day"],
      ["independent","A dog that is very independent or tests boundaries"]
    ]),
    quizMulti("personality", "Which personalities sound appealing?", [
      ["affectionate","Very affectionate and social"],
      ["eager","Eager to learn and work with me"],
      ["independent","Independent with its own opinions"],
      ["athletic","Athletic and always ready to go"],
      ["calm","Calm and easy to live around"]
    ]),
    quizRadio("training", "How much do you want training to be part of dog ownership?", [
      ["basics","Mostly the basics; I want a forgiving dog"],
      ["regular","Regular short training sessions are fine"],
      ["hobby","Training or dog sport sounds like a hobby I would enjoy"]
    ]),
    quizRadio("ownership", "How central do you want dog ownership to be in your life?", [
      ["fits-around","The dog should mostly fit around the rest of my life"],
      ["major","The dog can be a major daily activity"],
      ["hobby","Training, sport or dog activities can be one of my main hobbies"]
    ])
  ];

  return `
    <form class="quiz-form quiz-wizard" id="quiz-form">
      <div class="quiz-progress" aria-live="polite">
        <span id="quiz-progress-text">Question 1 of ${steps.length}</span>
        <div class="quiz-progress-track"><div class="quiz-progress-fill" id="quiz-progress-fill"></div></div>
      </div>
      <div class="quiz-steps">
        ${steps.map((step, index) => `<div class="quiz-step" data-quiz-step="${index}"${index === 0 ? "" : " hidden"}>${step}</div>`).join("")}
      </div>
      <p class="quiz-validation" id="quiz-validation" aria-live="polite"></p>
      <div class="actions quiz-nav">
        <button class="secondary" type="button" id="quiz-back" hidden>BACK</button>
        <button class="primary" type="button" id="quiz-next">NEXT</button>
        <button class="primary" type="submit" id="quiz-submit" hidden>SEE MY MATCHES</button>
        <button class="link-button quiz-reset" type="reset">START OVER</button>
      </div>
    </form>`;
}

function quizMulti(key, label, options) {
  return `
    <fieldset class="question quiz-question" data-quiz-group="${key}" data-required-group>
      <legend>${esc(label)}</legend>
      <p class="select-note">Select all that apply.</p>
      <div class="choice-list">
        ${options.map(([value,text]) => `<label class="check-option"><input type="checkbox" name="quiz-${key}" value="${value}"> <span>${esc(text)}</span></label>`).join("")}
        <label class="check-option none-option"><input type="checkbox" name="quiz-${key}" value="none"> <span>None</span></label>
      </div>
    </fieldset>`;
}

function quizRadio(key, label, options) {
  return `
    <fieldset class="question quiz-question" data-radio-group="${key}" data-required-group>
      <legend>${esc(label)}</legend>
      <div class="choice-list">
        ${options.map(([value,text]) => `<label class="check-option"><input type="radio" name="quiz-${key}" value="${value}"> <span>${esc(text)}</span></label>`).join("")}
      </div>
    </fieldset>`;
}

function setupQuiz() {
  const form = document.getElementById("quiz-form");
  if (!form) return;
  setupNoneCheckboxes(form, "[data-quiz-group]");

  const steps = [...form.querySelectorAll("[data-quiz-step]")];
  const back = document.getElementById("quiz-back");
  const next = document.getElementById("quiz-next");
  const submit = document.getElementById("quiz-submit");
  const validation = document.getElementById("quiz-validation");
  const progressText = document.getElementById("quiz-progress-text");
  const progressFill = document.getElementById("quiz-progress-fill");
  let current = 0;

  function currentQuestionAnswered() {
    return Boolean(steps[current]?.querySelector("input:checked"));
  }

  function showStep(index, scroll = false) {
    current = clamp(index, 0, steps.length - 1);
    steps.forEach((step, i) => { step.hidden = i !== current; });
    progressText.textContent = `Question ${current + 1} of ${steps.length}`;
    progressFill.style.width = `${((current + 1) / steps.length) * 100}%`;
    back.hidden = current === 0;
    next.hidden = current === steps.length - 1;
    submit.hidden = current !== steps.length - 1;
    validation.textContent = "";
    if (scroll) document.getElementById("quiz-stage")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  next.addEventListener("click", () => {
    if (!currentQuestionAnswered()) {
      validation.textContent = "Choose an answer before continuing.";
      return;
    }
    showStep(current + 1, true);
  });

  back.addEventListener("click", () => showStep(current - 1, true));

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!currentQuestionAnswered()) {
      validation.textContent = "Choose an answer before seeing your matches.";
      return;
    }
    validation.textContent = "";
    const answers = readQuizAnswers(form);
    const scored = BREEDS.map(breed => ({ breed, score: scoreBreedForQuiz(breed, answers) }));
    const matches = scored.filter(item => item.score >= 0.68).map(item => item.breed).sort((a,b) => a.name.localeCompare(b.name));
    renderResults(matches, "home-results", "Quiz matches");
    document.getElementById("home-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      document.getElementById("home-results").innerHTML = "";
      showStep(0, true);
    }, 0);
  });

  showStep(0);
}

function readQuizAnswers(form) {
  const answers = {};
  form.querySelectorAll("[data-quiz-group]").forEach(group => {
    answers[group.dataset.quizGroup] = [...group.querySelectorAll("input:checked")].map(i => i.value).filter(v => v !== "none");
  });
  form.querySelectorAll("[data-radio-group]").forEach(group => {
    answers[group.dataset.radioGroup] = group.querySelector("input:checked")?.value || "";
  });
  return answers;
}

function scoreBreedForQuiz(breed, a) {
  const p = breed.profile;
  const s = breed.stats;
  const parts = [];

  if (a.experience === "beginner") parts.push(p.experience === 1 ? 1 : p.experience === 2 ? 0.65 : 0.25);
  if (a.experience === "some") parts.push(p.experience === 1 ? 1 : p.experience === 2 ? 0.95 : 0.65);
  if (a.experience === "experienced") parts.push(1);

  const weekendScores = [];
  for (const choice of a.weekend || []) {
    if (choice === "hike") weekendScores.push(avg([target5(p.energy, 5, 3), target5(p.exercise, 5, 3)]));
    if (choice === "training") weekendScores.push(avg([norm5(p.working), norm100(s.trainability), norm100(s.stimulation)]));
    if (choice === "family") weekendScores.push(avg([norm5(p.children), norm100(s.sociability)]));
    if (choice === "social") weekendScores.push(avg([norm100(s.sociability), norm5(p.apartment)]));
    if (choice === "quiet") weekendScores.push(avg([inverse5(p.energy), inverse5(p.exercise)]));
  }
  if (weekendScores.length) parts.push(avg(weekendScores));

  const dealbreakerScores = [];
  for (const choice of a.dealbreakers || []) {
    if (choice === "hair") dealbreakerScores.push(inverse5(p.shedding));
    if (choice === "grooming") dealbreakerScores.push(inverse5(p.grooming));
    if (choice === "noise") dealbreakerScores.push(inverse100(s.barking));
    if (choice === "stimulation") dealbreakerScores.push(inverse100(s.stimulation));
    if (choice === "independent") dealbreakerScores.push(inverse100(s.independence));
  }
  if (dealbreakerScores.length) parts.push(avg(dealbreakerScores));

  const personalityScores = [];
  for (const choice of a.personality || []) {
    if (choice === "affectionate") personalityScores.push(norm100(s.sociability));
    if (choice === "eager") personalityScores.push(avg([norm100(s.trainability), 1 - norm100(s.independence) * 0.55]));
    if (choice === "independent") personalityScores.push(norm100(s.independence));
    if (choice === "athletic") personalityScores.push(avg([norm5(p.energy), norm5(p.exercise)]));
    if (choice === "calm") personalityScores.push(avg([inverse5(p.energy), inverse5(p.exercise), inverse100(s.barking)]));
  }
  if (personalityScores.length) parts.push(avg(personalityScores));

  if (a.training === "basics") parts.push(avg([norm100(s.trainability), inverse5(p.working), p.experience === 1 ? 1 : p.experience === 2 ? 0.65 : 0.35]));
  if (a.training === "regular") parts.push(avg([norm100(s.trainability), target5(p.working, 3, 3), target5(p.experience, 2, 2)]));
  if (a.training === "hobby") parts.push(avg([norm100(s.trainability), norm5(p.working), norm100(s.stimulation)]));

  const homeScores = [];
  for (const choice of a.household || []) {
    if (choice === "apartment") homeScores.push(avg([norm5(p.apartment), inverse100(s.barking)]));
    if (choice === "children") homeScores.push(norm5(p.children));
    if (choice === "visitors") homeScores.push(norm100(s.sociability));
  }
  if (homeScores.length) parts.push(avg(homeScores));

  if (a.weekday === "short") parts.push(avg([target5(p.exercise, 1, 3), target5(p.energy, 2, 3)]));
  if (a.weekday === "hour") parts.push(avg([target5(p.exercise, 2.5, 2.5), target5(p.energy, 3, 3)]));
  if (a.weekday === "long") parts.push(avg([target5(p.exercise, 4, 2.5), target5(p.energy, 4, 2.5)]));
  if (a.weekday === "very-long") parts.push(avg([norm5(p.exercise), norm5(p.energy)]));

  if (a.ownership === "fits-around") parts.push(avg([inverse5(p.exercise), inverse5(p.grooming), inverse100(s.stimulation), p.experience === 1 ? 1 : 0.65]));
  if (a.ownership === "major") parts.push(avg([target5(p.exercise, 4, 3), target5(p.energy, 4, 3), target5(p.working, 3.5, 3)]));
  if (a.ownership === "hobby") parts.push(avg([norm5(p.working), norm100(s.trainability), norm100(s.stimulation)]));

  return avg(parts);
}

function renderInlineAllBreeds() {
  renderResults([...BREEDS].sort((a,b) => a.name.localeCompare(b.name)), "home-results", "All breeds");
  document.getElementById("home-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderResults(breeds, targetId, title) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = `
    <div class="results-header"><h2>${esc(title)}</h2><div class="count">${breeds.length} breed${breeds.length === 1 ? "" : "s"}</div></div>
    ${breeds.length ? `<div class="breed-grid">${breeds.map(breedCard).join("")}</div>` : `<div class="empty">No breeds in the current database are strong matches for that combination. Change one or two choices and try again.</div>`}`;
  attachBreedLinks(target);
  activateDynamicCardPhotos(target);
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
    <section class="browse-heading">
      <div>
        <p class="kicker">Browse breeds</p>
        <h1>${SIZE_LABELS[size]} dogs</h1>
        <p class="lead">${esc(labels[category] || "All")} · ${filtered.length} breed${filtered.length === 1 ? "" : "s"} in the current database</p>
      </div>
      <p class="browse-note">Use the filter if you want to combine several traits without taking the quiz.</p>
    </section>
    ${filterMarkup("browse-filter", size)}
    <section class="results browse-results" id="browse-filter-results" aria-live="polite"></section>
    <section id="browse-results"><div class="breed-grid">${filtered.map(breedCard).join("")}</div></section>`;
  attachBreedLinks(app);
  activateDynamicCardPhotos(app);
  setupFilter("browse-filter", "browse-filter-results", size);
}

function attachBreedLinks(scope) {
  scope.querySelectorAll("[data-breed]").forEach(button => {
    button.addEventListener("click", () => { location.hash = `breed/${button.dataset.breed}`; });
  });
}

async function getCategoryPhotos(category, limit = 6) {
  const cacheKey = `${category}:${limit}`;
  if (primaryPhotoCache.has(cacheKey)) return primaryPhotoCache.get(cacheKey);
  const promise = (async () => {
    const params = new URLSearchParams({
      action: "query",
      generator: "categorymembers",
      gcmtitle: `Category:${category}`,
      gcmtype: "file",
      gcmlimit: String(Math.max(limit * 3, 12)),
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: "1200",
      format: "json",
      origin: "*"
    });
    const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`);
    if (!response.ok) throw new Error("Commons request failed");
    const data = await response.json();
    return Object.values(data.query?.pages || {}).filter(page => {
      const info = page.imageinfo?.[0];
      return info?.thumburl && /\.(jpe?g|png|webp)$/i.test(info.url || "");
    }).slice(0, limit);
  })();
  primaryPhotoCache.set(cacheKey, promise);
  return promise;
}

async function activateDynamicCardPhotos(scope) {
  const placeholders = [...scope.querySelectorAll("[data-card-placeholder]")];
  await Promise.all(placeholders.map(async placeholder => {
    try {
      const pages = await getCategoryPhotos(placeholder.dataset.category, 1);
      const info = pages[0]?.imageinfo?.[0];
      if (!info?.thumburl) throw new Error("No image");
      const img = document.createElement("img");
      img.loading = "lazy";
      img.src = info.thumburl;
      img.alt = placeholder.closest("[data-breed]")?.getAttribute("aria-label")?.replace(/^Open /, "") || "Dog breed";
      placeholder.replaceWith(img);
    } catch {
      placeholder.textContent = "Photo unavailable";
    }
  }));
  scope.querySelectorAll("[data-card-img]").forEach(img => {
    img.addEventListener("error", async () => {
      if (img.dataset.fallbackTried) return;
      img.dataset.fallbackTried = "1";
      try {
        const pages = await getCategoryPhotos(img.dataset.category, 1);
        const info = pages[0]?.imageinfo?.[0];
        if (info?.thumburl) img.src = info.thumburl;
      } catch {}
    }, { once: true });
  });
}


async function findNearbyShelters(zip) {
  const zipResponse = await fetch(`https://api.zippopotam.us/us/${encodeURIComponent(zip.slice(0, 5))}`);
  if (!zipResponse.ok) throw new Error("ZIP lookup failed");
  const zipData = await zipResponse.json();
  const place = zipData.places?.[0];
  if (!place) return [];
  const lat = Number(place.latitude);
  const lon = Number(place.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return [];

  const query = `[out:json][timeout:18];(nwr["amenity"="animal_shelter"](around:50000,${lat},${lon});nwr["animal_shelter"="dog"](around:50000,${lat},${lon});nwr["animal"="dog"]["name"](around:50000,${lat},${lon}););out center tags;`;
  const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Shelter lookup failed");
  const data = await response.json();
  const seen = new Set();
  return (data.elements || []).map(element => {
    const tags = element.tags || {};
    const itemLat = Number(element.lat ?? element.center?.lat);
    const itemLon = Number(element.lon ?? element.center?.lon);
    const name = tags.name || "Animal shelter or rescue";
    const key = `${name.toLowerCase()}|${itemLat.toFixed?.(4)}|${itemLon.toFixed?.(4)}`;
    if (seen.has(key)) return null;
    seen.add(key);
    const website = tags.website || tags["contact:website"] || "";
    const phone = tags.phone || tags["contact:phone"] || "";
    const address = [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"], tags["addr:state"], tags["addr:postcode"]].filter(Boolean).join(" ");
    return { name, lat: itemLat, lon: itemLon, website, phone, address, distance: haversineMiles(lat, lon, itemLat, itemLon) };
  }).filter(item => item && Number.isFinite(item.lat) && Number.isFinite(item.lon))
    .sort((a,b) => a.distance - b.distance)
    .slice(0, 12);
}

function haversineMiles(lat1, lon1, lat2, lon2) {
  const toRad = value => value * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function shelterCard(shelter, breed, index) {
  const mapUrl = `https://www.openstreetmap.org/?mlat=${encodeURIComponent(shelter.lat)}&mlon=${encodeURIComponent(shelter.lon)}#map=15/${encodeURIComponent(shelter.lat)}/${encodeURIComponent(shelter.lon)}`;
  return `<article class="shelter-card">
    <div class="shelter-number">${index + 1}</div>
    <div>
      <h3>${esc(shelter.name)}</h3>
      <p>${shelter.address ? esc(shelter.address) + " · " : ""}${shelter.distance.toFixed(1)} miles away</p>
      <p class="shelter-fit">Dog shelter/rescue near you. Contact them to ask about ${esc(breed.name)}s or similar mixes.</p>
      <div class="shelter-links">
        ${shelter.website ? `<a href="${esc(shelter.website)}" target="_blank" rel="noopener">Shelter website →</a>` : ""}
        ${shelter.phone ? `<a href="tel:${esc(shelter.phone.replace(/[^+\\d]/g, ""))}">${esc(shelter.phone)}</a>` : ""}
        <a href="${esc(mapUrl)}" target="_blank" rel="noopener">Map →</a>
      </div>
    </div>
  </article>`;
}

function renderBreed(breed) {
  const facts = [
    ["Size", SIZE_LABELS[breed.size]],
    ["Typical weight", breed.facts.weight],
    ["Typical height", breed.facts.height],
    ["Lifespan", breed.facts.lifespan],
    ["Coat", breed.facts.coat],
    ["Originally bred for", breed.facts.purpose],
    ["Typical exercise", breed.facts.exercise],
    ["Owner experience", breed.profile.experience === 1 ? "Beginner-friendly" : breed.profile.experience === 2 ? "Some experience helpful" : "Experienced owner preferred"]
  ];
  const products = [
    ["Harness", breed.products.harness, `${breed.name} ${breed.products.harness}`],
    ["Shampoo", breed.products.shampoo, breed.products.shampoo],
    ["Grooming", breed.products.grooming, `${breed.name} ${breed.products.grooming}`],
    ["Bed / crate", breed.products.bed, `${breed.name} ${breed.products.bed}`]
  ];
  const mainPhoto = breed.photo
    ? `<figure class="photo photo-main"><div class="photo-media"><img src="${commonsImage(breed.photo, 1500)}" alt="${esc(breed.name)}"></div><figcaption class="photo-credit"><a href="${commonsPage(breed.photo)}" target="_blank" rel="noopener">Wikimedia Commons source</a></figcaption></figure>`
    : `<div class="gallery-loading" id="primary-photo-loading">Loading a freely licensed Wikimedia Commons photo…</div>`;

  app.innerHTML = `
    <article class="breed-page">
      <header class="breed-heading">
        <div><p class="kicker">${SIZE_LABELS[breed.size]} breed</p><h1>${esc(breed.name)}</h1></div>
        <button class="back" type="button" id="back-button">← BACK</button>
      </header>

      <section class="section">
        <p class="section-label">Pictures</p>
        <div class="gallery" id="gallery">
          ${mainPhoto}
          <div class="gallery-loading" id="gallery-loading">Loading more freely licensed photos from Wikimedia Commons…</div>
        </div>
        <div class="variation-block">
          <div class="variation-heading">
            <h3>Common colors &amp; coat variations</h3>
            <p>These are examples of common appearances. Breed standards can differ by kennel club.</p>
          </div>
          <div class="variation-grid" id="variation-grid"><div class="gallery-loading">Loading variation examples…</div></div>
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
        <h2>Adopt ${/^[aeiou]/i.test(breed.name) ? "an" : "a"} ${esc(breed.name)} at shelters near you</h2>
        <div class="shelter-box">
          <form class="shelter-form" id="shelter-form">
            <div class="field"><label for="zip">ZIP code</label><input class="zip-input" id="zip" name="zip" inputmode="numeric" autocomplete="postal-code" placeholder="e.g. 10001" maxlength="10"></div>
            <button class="primary" type="submit">FIND NEARBY SHELTERS</button>
          </form>
          <p class="help">Shows dog shelters and rescues near the ZIP code. Availability changes quickly, so contact each shelter to ask whether they currently have a ${esc(breed.name)} or similar mix.</p>
          <p class="message" id="shelter-message" aria-live="polite"></p>
          <div class="shelter-results" id="shelter-results"></div>
        </div>
      </section>

      <section class="section">
        <p class="section-label">Recommended products</p>
        <h2>Products that fit the breed</h2>
        <div class="product-grid">${products.map(([label,note,query]) => `<div class="product"><h3>${esc(label)}</h3><p>${esc(note)}</p><a href="${amazonSearch(query)}" target="_blank" rel="sponsored noopener">Search Amazon →</a></div>`).join("")}</div>
      </section>
    </article>`;

  document.getElementById("back-button").addEventListener("click", () => history.length > 1 ? history.back() : location.hash = `browse/${breed.size}/all`);
  document.getElementById("shelter-form").addEventListener("submit", async event => {
    event.preventDefault();
    const zip = String(new FormData(event.currentTarget).get("zip") || "").trim();
    const message = document.getElementById("shelter-message");
    const results = document.getElementById("shelter-results");
    results.innerHTML = "";
    if (!/^\d{5}(-\d{4})?$/.test(zip)) {
      message.className = "message error";
      message.textContent = "Enter a valid U.S. ZIP code.";
      return;
    }
    message.className = "message";
    message.textContent = `Finding dog shelters and rescues near ${zip}…`;
    try {
      const shelters = await findNearbyShelters(zip);
      if (!shelters.length) {
        message.textContent = "No mapped dog shelters were found nearby. Try a nearby ZIP code.";
        return;
      }
      message.textContent = `${shelters.length} nearby shelter${shelters.length === 1 ? "" : "s"} or rescue${shelters.length === 1 ? "" : "s"}. Ask about ${breed.name}s and similar mixes.`;
      results.innerHTML = shelters.map((shelter, index) => shelterCard(shelter, breed, index)).join("");
    } catch (error) {
      message.className = "message error";
      message.textContent = "Shelter search is temporarily unavailable. Try again in a moment.";
    }
  });
  loadCommonsGallery(breed);
  loadVariationGallery(breed);
}

async function loadCommonsGallery(breed) {
  const gallery = document.getElementById("gallery");
  const loading = document.getElementById("gallery-loading");
  const primaryLoading = document.getElementById("primary-photo-loading");
  if (!gallery || !loading) return;
  try {
    const pages = await getCategoryPhotos(breed.category, 7);
    if (primaryLoading && pages.length) {
      const first = pages.shift();
      const figure = commonsFigure(first, breed.name, "photo photo-main");
      primaryLoading.replaceWith(figure);
    }
    const staticName = String(breed.photo || "").toLowerCase();
    const extras = pages.filter(page => !staticName || !page.title.toLowerCase().endsWith(staticName)).slice(0, 5);
    loading.remove();
    for (const page of extras) gallery.appendChild(commonsFigure(page, breed.name, "photo"));
    if (!extras.length) { loading?.remove(); }
  } catch {
    loading.remove();
  }
}

function commonsFigure(page, alt, className = "photo") {
  const info = page.imageinfo?.[0] || {};
  const meta = info.extmetadata || {};
  const artist = plainText(meta.Artist?.value) || "Wikimedia Commons contributor";
  const license = plainText(meta.LicenseShortName?.value) || "free license";
  const source = `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`;
  const figure = document.createElement("figure");
  figure.className = className;
  figure.innerHTML = `<div class="photo-media"><img loading="lazy" src="${esc(info.thumburl)}" alt="${esc(alt)}"></div><figcaption class="photo-credit">${esc(artist)} · ${esc(license)} · <a href="${esc(source)}" target="_blank" rel="noopener">source</a></figcaption>`;
  return figure;
}

async function searchCommonsPhoto(query) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: "8",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "900",
    format: "json",
    origin: "*"
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`);
  if (!response.ok) throw new Error("Commons search failed");
  const data = await response.json();
  return Object.values(data.query?.pages || {}).find(page => {
    const info = page.imageinfo?.[0];
    return info?.thumburl && /\.(jpe?g|png|webp)$/i.test(info.url || "");
  }) || null;
}

async function loadVariationGallery(breed) {
  const grid = document.getElementById("variation-grid");
  if (!grid) return;
  const variations = BREED_VARIATIONS[breed.id] || [`${breed.name} adult`, `${breed.name} puppy`, `${breed.name} coat`];
  grid.innerHTML = "";
  for (const query of variations.slice(0, 4)) {
    const card = document.createElement("article");
    card.className = "variation-card";
    card.innerHTML = `<div class="variation-image"><div class="photo-placeholder">Loading…</div></div><h4>${esc(humanizeVariation(query, breed.name))}</h4>`;
    grid.appendChild(card);
    try {
      const page = await searchCommonsPhoto(query);
      const info = page?.imageinfo?.[0];
      if (!page || !info?.thumburl) throw new Error("No image");
      const source = `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`;
      card.querySelector(".variation-image").innerHTML = `<a href="${esc(source)}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(info.thumburl)}" alt="${esc(query)}"></a>`;
    } catch {
      const imageBox = card.querySelector(".variation-image");
      if (breed.photo) imageBox.innerHTML = `<img loading="lazy" src="${commonsImage(breed.photo, 900)}" alt="${esc(breed.name)}">`;
      else card.querySelector(".photo-placeholder").textContent = "Photo unavailable";
    }
  }
}

function humanizeVariation(query, breedName) {
  const cleaned = String(query).replace(new RegExp(breedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), "").replace(/\bdog\b/ig, "").trim();
  if (!cleaned) return breedName;
  return cleaned.replace(/\b\w/g, char => char.toUpperCase());
}

function plainText(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(String(html), "text/html");
  return (doc.body.textContent || "").trim();
}

function renderCredits() {
  app.innerHTML = `<section class="hero"><p class="kicker">Sources</p><h1>Photo credits</h1><p class="lead">Breed photography comes from Wikimedia Commons. Static starter images link to their file pages, while additional gallery and variation images display their source links beside or through each image.</p></section><div class="credits-list">${BREEDS.map(b => `<div class="credit-row"><strong>${esc(b.name)}</strong><div class="credit-meta">${b.photo ? `<a href="${commonsPage(b.photo)}" target="_blank" rel="noopener">${esc(b.photo)}</a>` : `<a href="${commonsCategoryPage(b.category)}" target="_blank" rel="noopener">Commons category</a>`} · Wikimedia Commons</div></div>`).join("")}</div>`;
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
  if (parts[0] === "quiz") renderHome();
  else if (parts[0] === "browse" && ["small","medium","large"].includes(parts[1])) renderBrowse(parts[1], parts[2] || "all");
  else if (parts[0] === "breed") {
    const breed = BREEDS.find(b => b.id === parts[1]);
    breed ? renderBreed(breed) : renderHome();
  } else if (parts[0] === "credits") renderCredits();
  else renderHome();
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
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
