(() => {
  const QUIZ_KEY = "dogBreedFinder.quizResults.v1";
  const RETURN_KEY = "dogBreedFinder.returnContext.v1";
  const FILTER_PREFIX = "dogBreedFinder.filter.v1:";
  const ALL_KEY = "dogBreedFinder.allDogs.v1";

  const storage = {
    get(key, fallback = null) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch {}
    }
  };

  function normalizeHash() {
    return location.hash || "#quiz";
  }

  function rankedBreedCard(item, index) {
    const breed = item.breed;
    const percent = Math.round(item.score * 100);
    const initial = breed.photo
      ? `<img loading="lazy" src="${commonsImage(breed.photo, 900)}" alt="${esc(breed.name)}" data-card-img data-category="${esc(breed.category)}">`
      : `<div class="photo-placeholder" data-card-placeholder data-category="${esc(breed.category)}">Loading photo…</div>`;
    return `
      <button class="breed-card ranked-breed-card" type="button" data-breed="${esc(breed.id)}" aria-label="Open ${esc(breed.name)}">
        <div class="card-photo">${initial}<span class="rank-badge">#${index + 1}</span></div>
        <div class="card-body">
          <div class="card-name">${esc(breed.name)}</div>
          <div class="rank-meta"><span>${SIZE_LABELS[breed.size]} breed</span><strong>${percent}% match</strong></div>
        </div>
      </button>`;
  }

  function renderQuizRanking(items, { scroll = false } = {}) {
    const target = document.getElementById("home-results");
    if (!target) return;
    const valid = items
      .map(item => ({ breed: BREEDS.find(b => b.id === item.id) || item.breed, score: Number(item.score) }))
      .filter(item => item.breed && Number.isFinite(item.score))
      .sort((a, b) => b.score - a.score || a.breed.name.localeCompare(b.breed.name));

    target.innerHTML = `
      <div class="results-header"><h2>Your ranked matches</h2><div class="count">${valid.length} breed${valid.length === 1 ? "" : "s"}</div></div>
      <div class="quiz-ranking-note">
        <strong>How the ranking works.</strong>
        The score compares your answers with each breed's typical tendencies for owner experience, exercise, home life, sociability, training, grooming, shedding, barking, independence and mental stimulation. A higher score means the breed is a closer match to the preferences you gave us, not that it is objectively a better dog.
        <span>Use this as a shortlist, not a guarantee. Individual dogs vary, health and temperament matter, and you should still research each breed carefully before deciding why a particular match is right for you.</span>
      </div>
      <div class="breed-grid ranked-grid">${valid.map((item, index) => rankedBreedCard(item, index)).join("")}</div>`;
    attachBreedLinks(target);
    activateDynamicCardPhotos(target);
    if (scroll) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function savedQuizResults() {
    const state = storage.get(QUIZ_KEY, null);
    return Array.isArray(state?.results) && state.results.length ? state : null;
  }

  function clearQuizInputs(form) {
    if (!form) return;
    form.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => { input.checked = false; });
  }

  function installQuizPersistence() {
    setupQuiz = function() {
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
        const sizePool = answers.size?.length ? BREEDS.filter(breed => answers.size.includes(breed.size)) : [...BREEDS];
        const scored = sizePool
          .map(breed => ({ breed, score: scoreBreedForQuiz(breed, answers) }))
          .sort((a, b) => b.score - a.score || a.breed.name.localeCompare(b.breed.name));
        const persisted = {
          answers,
          createdAt: Date.now(),
          results: scored.map(item => ({ id: item.breed.id, score: item.score }))
        };
        storage.set(QUIZ_KEY, persisted);
        renderQuizRanking(persisted.results, { scroll: true });
      });

      form.addEventListener("reset", () => {
        setTimeout(() => {
          clearQuizInputs(form);
          showStep(0, true);
          const saved = savedQuizResults();
          if (saved) renderQuizRanking(saved.results);
        }, 0);
      });

      showStep(0);
    };

    const originalRenderHome = renderHome;
    renderHome = function() {
      originalRenderHome();
      const saved = savedQuizResults();
      if (saved) renderQuizRanking(saved.results);

      const takeQuiz = document.getElementById("take-quiz");
      takeQuiz?.addEventListener("click", () => {
        const form = document.getElementById("quiz-form");
        form?.reset();
        const savedNow = savedQuizResults();
        if (savedNow) renderQuizRanking(savedNow.results);
      });
    };
  }

  function filterStateKey() {
    return FILTER_PREFIX + normalizeHash();
  }

  function applyStoredGroups(form, groups) {
    if (!groups) return;
    form.querySelectorAll("[data-filter-group]").forEach(group => {
      const key = group.dataset.filterGroup;
      const selected = Array.isArray(groups[key]) ? groups[key] : [];
      group.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.checked = input.value === "none" ? selected.length === 0 : selected.includes(input.value);
      });
    });
  }

  function installPersistentSizeFilters() {
    setupFilter = function(detailsId, resultsId, preferredSize = "", separatorId = "") {
      const details = document.getElementById(detailsId);
      if (!details) return;
      const form = details.querySelector("[data-filter-form]");
      const key = filterStateKey();
      const saved = storage.get(key, null);
      if (saved?.groups) applyStoredGroups(form, saved.groups);
      setupNoneCheckboxes(form, "[data-filter-group]");

      const apply = (values, shouldScroll = false) => {
        const matches = BREEDS.filter(breed => matchesFilter(breed, values));
        renderResults(matches, resultsId, "Filtered breeds");
        const separator = separatorId ? document.getElementById(separatorId) : null;
        if (separator) separator.hidden = false;
        if (shouldScroll) document.getElementById(resultsId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      };

      form.addEventListener("submit", event => {
        event.preventDefault();
        const values = collectCheckboxGroups(form, "[data-filter-group]");
        storage.set(key, { groups: values, applied: true });
        apply(values, true);
      });

      form.addEventListener("reset", () => {
        setTimeout(() => {
          storage.remove(key);
          form.querySelectorAll("[data-filter-group]").forEach(group => {
            const groupKey = group.dataset.filterGroup;
            group.querySelectorAll("input").forEach(input => {
              input.checked = groupKey === "size" && preferredSize ? input.value === preferredSize : input.value === "none";
            });
          });
          const target = document.getElementById(resultsId);
          if (target) target.innerHTML = "";
          const separator = separatorId ? document.getElementById(separatorId) : null;
          if (separator) separator.hidden = true;
        }, 0);
      });

      if (saved?.applied && saved.groups) {
        details.open = true;
        apply(saved.groups, false);
      }
    };
  }

  function allDogsState() {
    return storage.get(ALL_KEY, { query: "", groups: {}, filterOpen: false });
  }

  function renderAllDogs() {
    const state = allDogsState();
    app.innerHTML = `
      <section class="browse-all-heading">
        <div>
          <p class="kicker">Browse all dogs</p>
          <h1>All dog breeds</h1>
          <p class="lead">Search by breed name, or open the filter to narrow the list by the traits you already care about.</p>
        </div>
        <div class="browse-search-box">
          <label for="breed-search">SEARCH BREEDS</label>
          <input id="breed-search" type="search" autocomplete="off" placeholder="Try Labrador, Collie, Poodle…" value="${esc(state.query || "")}">
        </div>
      </section>
      ${filterMarkup("all-dogs-filter")}
      <section class="results all-dogs-results" id="all-dogs-results" aria-live="polite"></section>`;

    const details = document.getElementById("all-dogs-filter");
    const form = details.querySelector("[data-filter-form]");
    const search = document.getElementById("breed-search");
    if (state.filterOpen) details.open = true;
    if (state.groups) applyStoredGroups(form, state.groups);
    setupNoneCheckboxes(form, "[data-filter-group]");

    let groups = state.groups || {};
    let query = state.query || "";

    const update = () => {
      const q = query.trim().toLowerCase();
      const breeds = BREEDS
        .filter(breed => !q || breed.name.toLowerCase().includes(q))
        .filter(breed => matchesFilter(breed, groups))
        .sort((a, b) => a.name.localeCompare(b.name));
      const target = document.getElementById("all-dogs-results");
      target.innerHTML = `
        <div class="results-header"><h2>${q || Object.values(groups).some(v => v?.length) ? "Matching breeds" : "All breeds"}</h2><div class="count">${breeds.length} of ${BREEDS.length}</div></div>
        ${breeds.length ? `<div class="breed-grid">${breeds.map(breedCard).join("")}</div>` : `<div class="empty">No breed names match the current search and filters.</div>`}`;
      attachBreedLinks(target);
      activateDynamicCardPhotos(target);
      storage.set(ALL_KEY, { query, groups, filterOpen: details.open });
    };

    search.addEventListener("input", () => { query = search.value; update(); });
    form.addEventListener("submit", event => {
      event.preventDefault();
      groups = collectCheckboxGroups(form, "[data-filter-group]");
      update();
      document.getElementById("all-dogs-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    form.addEventListener("reset", () => {
      setTimeout(() => {
        groups = {};
        query = "";
        search.value = "";
        form.querySelectorAll("[data-filter-group]").forEach(group => {
          group.querySelectorAll("input").forEach(input => { input.checked = input.value === "none"; });
        });
        update();
      }, 0);
    });
    details.addEventListener("toggle", () => storage.set(ALL_KEY, { query, groups, filterOpen: details.open }));
    update();
    setAllNavActive();
  }

  function setAllNavActive() {
    document.querySelectorAll(".nav-button").forEach(el => el.classList.remove("active"));
    document.querySelector(".nav-all")?.classList.add("active");
  }

  function installAllDogsRoute() {
    document.querySelector(".nav-all")?.addEventListener("click", () => { location.hash = "all"; });
    const renderIfAll = () => {
      if (location.hash === "#all") {
        renderAllDogs();
        app.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };
    window.addEventListener("hashchange", () => setTimeout(renderIfAll, 0));
    renderIfAll();
  }

  function saveReturnContext(button) {
    const state = {
      hash: normalizeHash(),
      scrollY: window.scrollY,
      breedId: button?.dataset?.breed || ""
    };
    storage.set(RETURN_KEY, state);
  }

  function installSmartBack() {
    document.addEventListener("click", event => {
      const breedButton = event.target.closest?.("[data-breed]");
      if (breedButton) saveReturnContext(breedButton);
    }, true);

    document.addEventListener("click", event => {
      const back = event.target.closest?.("#back-button");
      if (!back || !location.hash.startsWith("#breed/")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const saved = storage.get(RETURN_KEY, null);
      const destination = saved?.hash && !saved.hash.startsWith("#breed/") ? saved.hash : "#all";
      location.hash = destination.replace(/^#/, "");
      const scrollY = Number(saved?.scrollY || 0);
      setTimeout(() => window.scrollTo({ top: scrollY, behavior: "instant" }), 40);
      setTimeout(() => window.scrollTo({ top: scrollY, behavior: "instant" }), 250);
    }, true);
  }

  installQuizPersistence();
  installPersistentSizeFilters();
  installSmartBack();
  installAllDogsRoute();

  if (location.hash !== "#all") route();
})();
