(() => {
  const QUIZ_KEY = "dogBreedFinder.quizResults.v1";

  const readState = () => {
    try {
      const raw = localStorage.getItem(QUIZ_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const clamp01 = value => Math.max(0, Math.min(1, Number(value) || 0));
  const avgLocal = values => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0.5;
  const norm5Local = value => Math.max(1, Math.min(5, Number(value) || 3)) / 5;
  const inverse5Local = value => (6 - Math.max(1, Math.min(5, Number(value) || 3))) / 5;
  const norm100Local = value => Math.max(0, Math.min(100, Number(value) || 50)) / 100;
  const inverse100Local = value => (100 - Math.max(0, Math.min(100, Number(value) || 50))) / 100;
  const target5Local = (value, target, spread = 2) => clamp01(1 - Math.abs((Number(value) || 3) - target) / spread);

  function bestItem(items) {
    return items.filter(Boolean).sort((a, b) => b.score - a.score)[0] || null;
  }

  function worstItem(items) {
    return items.filter(Boolean).sort((a, b) => a.score - b.score)[0] || null;
  }

  function factorBreakdown(breed, answers) {
    const p = breed.profile;
    const s = breed.stats;
    const factors = [];

    if (answers.experience === "beginner") {
      const score = p.experience === 1 ? 1 : p.experience === 2 ? 0.65 : 0.25;
      factors.push({
        key: "experience",
        label: "your experience level",
        score,
        positive: p.experience === 1
          ? "It is relatively beginner-friendly, which fits the experience level you selected."
          : "Its handling demands are reasonably close to the experience level you selected.",
        concern: p.experience >= 3
          ? "It generally needs more experienced handling than you said you have."
          : "It may require more consistency than the easiest beginner breeds."
      });
    } else if (answers.experience === "some") {
      const score = p.experience === 1 ? 1 : p.experience === 2 ? 0.95 : 0.65;
      factors.push({
        key: "experience",
        label: "your experience level",
        score,
        positive: "Its handling difficulty is compatible with the dog experience you said you have.",
        concern: p.experience >= 3 ? "It is still a more demanding breed to handle consistently." : "Its handling needs are not a major conflict with your answers."
      });
    }

    if (answers.weekday) {
      let score = 0.5;
      let positive = "Its daily activity needs are reasonably close to the weekday routine you described.";
      let concern = "Its daily activity needs are less aligned with the weekday routine you described.";
      if (answers.weekday === "short") {
        score = avgLocal([target5Local(p.exercise, 1, 3), target5Local(p.energy, 2, 3)]);
        positive = "Its lighter activity needs fit the shorter busy-weekday routine you said is realistic.";
        concern = "Its exercise and energy needs may be too high for the shorter weekdays you described.";
      } else if (answers.weekday === "hour") {
        score = avgLocal([target5Local(p.exercise, 2.5, 2.5), target5Local(p.energy, 3, 3)]);
        positive = "Its activity level is close to the roughly one-hour weekday routine you described.";
        concern = "Its activity needs sit farther from the roughly one-hour weekday routine you described.";
      } else if (answers.weekday === "long") {
        score = avgLocal([target5Local(p.exercise, 4, 2.5), target5Local(p.energy, 4, 2.5)]);
        positive = "Its higher activity needs suit the 1.5-hour weekdays you said you can sustain.";
        concern = "Its normal activity level is less well matched to the 1.5-hour weekdays you described.";
      } else if (answers.weekday === "very-long") {
        score = avgLocal([norm5Local(p.exercise), norm5Local(p.energy)]);
        positive = "Its high activity needs fit the 2+ hours you are willing to build around the dog.";
        concern = "It may not make full use of the very active dog-owning routine you said you want.";
      }
      factors.push({ key: "weekday", label: "weekday activity", score, positive, concern });
    }

    const weekendItems = [];
    for (const choice of answers.weekend || []) {
      if (choice === "hike") weekendItems.push({ score: avgLocal([target5Local(p.energy, 5, 3), target5Local(p.exercise, 5, 3)]), positive: "Its athleticism suits the long hikes, runs or outdoor adventures you selected.", concern: "It is less naturally suited to the long hikes or runs you selected." });
      if (choice === "training") weekendItems.push({ score: avgLocal([norm5Local(p.working), norm100Local(s.trainability), norm100Local(s.stimulation)]), positive: "Its trainability and working drive suit the training or dog-sport weekends you selected.", concern: "It offers less of the training and dog-sport drive you said sounds fun." });
      if (choice === "family") weekendItems.push({ score: avgLocal([norm5Local(p.children), norm100Local(s.sociability)]), positive: "Its family and sociability profile fits the family outings you selected.", concern: "Its family/social profile is a weaker fit for the family outings you selected." });
      if (choice === "social") weekendItems.push({ score: avgLocal([norm100Local(s.sociability), norm5Local(p.apartment)]), positive: "Its sociability fits the café, park and social days you selected.", concern: "It is less naturally aligned with the social public outings you selected." });
      if (choice === "quiet") weekendItems.push({ score: avgLocal([inverse5Local(p.energy), inverse5Local(p.exercise)]), positive: "Its calmer activity profile fits the quieter weekends you selected.", concern: "Its activity level may make your quieter-weekend preference harder to satisfy." });
    }
    if (weekendItems.length) {
      const best = bestItem(weekendItems);
      const worst = worstItem(weekendItems);
      factors.push({ key: "weekend", label: "your weekend lifestyle", score: avgLocal(weekendItems.map(item => item.score)), positive: best.positive, concern: worst.concern });
    }

    const householdItems = [];
    for (const choice of answers.household || []) {
      if (choice === "apartment") householdItems.push({ score: avgLocal([norm5Local(p.apartment), inverse100Local(s.barking)]), positive: "Its home-fit and barking profile work relatively well for the apartment/shared-wall home you selected.", concern: "Its space needs or barking tendency are a weaker fit for the apartment/shared-wall home you selected." });
      if (choice === "children") householdItems.push({ score: norm5Local(p.children), positive: "Its typical family profile is compatible with the young children you said are in the home.", concern: "Its typical fit with young children is weaker than some breeds above it." });
      if (choice === "visitors") householdItems.push({ score: norm100Local(s.sociability), positive: "Its sociability fits the frequent visitors or busy household you described.", concern: "Its lower sociability may require more management in the busy household you described." });
    }
    if (householdItems.length) {
      const best = bestItem(householdItems);
      const worst = worstItem(householdItems);
      factors.push({ key: "household", label: "your home and household", score: avgLocal(householdItems.map(item => item.score)), positive: best.positive, concern: worst.concern });
    }

    const dealbreakerItems = [];
    for (const choice of answers.dealbreakers || []) {
      if (choice === "hair") dealbreakerItems.push({ score: inverse5Local(p.shedding), positive: "Its lower shedding better respects your dislike of hair around the home.", concern: "Its shedding conflicts with your dislike of hair around the home." });
      if (choice === "grooming") dealbreakerItems.push({ score: inverse5Local(p.grooming), positive: "Its lower coat-care burden fits your dislike of frequent grooming.", concern: "Its grooming burden conflicts with your dislike of frequent grooming." });
      if (choice === "noise") dealbreakerItems.push({ score: inverse100Local(s.barking), positive: "Its lower barking tendency fits your preference for a quieter dog.", concern: "Its barking tendency conflicts with your preference for less noise." });
      if (choice === "stimulation") dealbreakerItems.push({ score: inverse100Local(s.stimulation), positive: "It is less demanding for constant mental work, which matches your answer.", concern: "It needs more mental work than you said you want to invent every day." });
      if (choice === "independent") dealbreakerItems.push({ score: inverse100Local(s.independence), positive: "It is more cooperative and less independent, matching your preference.", concern: "Its independence conflicts with your preference for a dog that does not test boundaries much." });
    }
    if (dealbreakerItems.length) {
      const best = bestItem(dealbreakerItems);
      const worst = worstItem(dealbreakerItems);
      factors.push({ key: "dealbreakers", label: "your dealbreakers", score: avgLocal(dealbreakerItems.map(item => item.score)), positive: best.positive, concern: worst.concern });
    }

    const personalityItems = [];
    for (const choice of answers.personality || []) {
      if (choice === "affectionate") personalityItems.push({ score: norm100Local(s.sociability), positive: "Its sociability fits the affectionate, people-oriented personality you selected.", concern: "It is less socially oriented than the affectionate personality you selected." });
      if (choice === "eager") personalityItems.push({ score: avgLocal([norm100Local(s.trainability), 1 - norm100Local(s.independence) * 0.55]), positive: "Its trainability and cooperativeness fit the eager-to-work-with-you personality you selected.", concern: "It is less naturally cooperative than the eager-to-work-with-you personality you selected." });
      if (choice === "independent") personalityItems.push({ score: norm100Local(s.independence), positive: "Its independent temperament matches the self-directed personality you said appeals to you.", concern: "It is less independent than the personality you selected." });
      if (choice === "athletic") personalityItems.push({ score: avgLocal([norm5Local(p.energy), norm5Local(p.exercise)]), positive: "Its energy and exercise profile match the athletic personality you selected.", concern: "It is less athletic than the personality you selected." });
      if (choice === "calm") personalityItems.push({ score: avgLocal([inverse5Local(p.energy), inverse5Local(p.exercise), inverse100Local(s.barking)]), positive: "Its calmer energy and barking profile fit the easy-to-live-with personality you selected.", concern: "Its energy or noise level is less aligned with the calm personality you selected." });
    }
    if (personalityItems.length) {
      const best = bestItem(personalityItems);
      const worst = worstItem(personalityItems);
      factors.push({ key: "personality", label: "the personality you want", score: avgLocal(personalityItems.map(item => item.score)), positive: best.positive, concern: worst.concern });
    }

    if (answers.training) {
      let score = 0.5;
      let positive = "Its trainability fits the role you want training to play.";
      let concern = "Its training profile is a weaker fit for what you said you want.";
      if (answers.training === "basics") {
        score = avgLocal([norm100Local(s.trainability), inverse5Local(p.working), p.experience === 1 ? 1 : p.experience === 2 ? 0.65 : 0.35]);
        positive = "It is relatively forgiving and trainable for the mostly-basics approach you selected.";
        concern = "It asks for more training skill or structured work than your mostly-basics preference suggests.";
      } else if (answers.training === "regular") {
        score = avgLocal([norm100Local(s.trainability), target5Local(p.working, 3, 3), target5Local(p.experience, 2, 2)]);
        positive = "Its trainability fits the regular short training sessions you said are fine.";
        concern = "Its training needs are less aligned with the moderate training commitment you selected.";
      } else if (answers.training === "hobby") {
        score = avgLocal([norm100Local(s.trainability), norm5Local(p.working), norm100Local(s.stimulation)]);
        positive = "Its trainability, working drive and mental needs suit training as a hobby.";
        concern = "It offers less training/working depth than you said you want as a hobby.";
      }
      factors.push({ key: "training", label: "your training commitment", score, positive, concern });
    }

    if (answers.ownership) {
      let score = 0.5;
      let positive = "Its overall demands fit the role you want a dog to play in your life.";
      let concern = "Its overall demands are less aligned with the role you want a dog to play in your life.";
      if (answers.ownership === "fits-around") {
        score = avgLocal([inverse5Local(p.exercise), inverse5Local(p.grooming), inverse100Local(s.stimulation), p.experience === 1 ? 1 : 0.65]);
        positive = "Its overall maintenance is closer to your preference for a dog that fits around the rest of your life.";
        concern = "Its exercise, grooming or mental-work demands may take over more of your life than you said you want.";
      } else if (answers.ownership === "major") {
        score = avgLocal([target5Local(p.exercise, 4, 3), target5Local(p.energy, 4, 3), target5Local(p.working, 3.5, 3)]);
        positive = "Its activity and engagement needs suit making the dog a major daily activity.";
        concern = "Its normal level of activity or engagement is less aligned with making dog ownership a major daily activity.";
      } else if (answers.ownership === "hobby") {
        score = avgLocal([norm5Local(p.working), norm100Local(s.trainability), norm100Local(s.stimulation)]);
        positive = "Its working drive, trainability and mental needs suit dog activities as a major hobby.";
        concern = "It offers less working/training intensity than your hobby-level ownership preference suggests.";
      }
      factors.push({ key: "ownership", label: "how central you want dog ownership to be", score, positive, concern });
    }

    return factors;
  }

  function explanationFor(item, index, ranked, answers) {
    const factors = factorBreakdown(item.breed, answers);
    const strongest = factors
      .filter(factor => Number.isFinite(factor.score))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
    const weakest = factors
      .filter(factor => Number.isFinite(factor.score))
      .sort((a, b) => a.score - b.score)[0];

    let comparison = "";
    if (index < ranked.length - 1) {
      const next = ranked[index + 1];
      const nextFactors = factorBreakdown(next.breed, answers);
      const nextByKey = new Map(nextFactors.map(factor => [factor.key, factor]));
      const deltas = factors
        .map(factor => ({ ...factor, delta: factor.score - (nextByKey.get(factor.key)?.score ?? factor.score) }))
        .sort((a, b) => b.delta - a.delta);
      const bestDelta = deltas[0];
      const pointGap = Math.round((item.score - next.score) * 100);
      comparison = pointGap <= 1
        ? `Very close to #${index + 2} ${next.breed.name}; the scores differ by only ${Math.max(0, pointGap)} point${pointGap === 1 ? "" : "s"}.`
        : bestDelta && bestDelta.delta > 0.01
          ? `Ranks above #${index + 2} ${next.breed.name} mainly because it fits ${bestDelta.label} better based on your answers.`
          : `Ranks above #${index + 2} ${next.breed.name} by ${pointGap} match points across the combined answers.`;
    } else if (index > 0) {
      const previous = ranked[index - 1];
      const previousFactors = factorBreakdown(previous.breed, answers);
      const previousByKey = new Map(previousFactors.map(factor => [factor.key, factor]));
      const deficits = factors
        .map(factor => ({ ...factor, deficit: (previousByKey.get(factor.key)?.score ?? factor.score) - factor.score }))
        .sort((a, b) => b.deficit - a.deficit);
      const biggest = deficits[0];
      if (biggest && biggest.deficit > 0.01) comparison = `Ranks below #${index} ${previous.breed.name} mainly on ${biggest.label}.`;
    }

    return {
      reasons: strongest.map(factor => factor.positive),
      tradeoff: weakest?.concern || "No single major conflict stands out in the answers you gave.",
      comparison
    };
  }

  function decorateRanking() {
    const grid = document.querySelector("#home-results .ranked-grid");
    if (!grid) return;
    const state = readState();
    const answers = state?.answers;
    const savedResults = Array.isArray(state?.results) ? state.results : [];
    if (!answers || !savedResults.length) return;

    const ranked = savedResults
      .map(result => ({ breed: BREEDS.find(breed => breed.id === result.id), score: Number(result.score) }))
      .filter(item => item.breed && Number.isFinite(item.score))
      .sort((a, b) => b.score - a.score || a.breed.name.localeCompare(b.breed.name));

    grid.querySelectorAll(".ranked-breed-card").forEach((card, index) => {
      if (card.querySelector(".match-why")) return;
      const item = ranked[index];
      if (!item) return;
      const details = explanationFor(item, index, ranked, answers);
      const body = card.querySelector(".card-body");
      if (!body) return;
      const why = document.createElement("div");
      why.className = "match-why";
      why.innerHTML = `
        <div class="match-why-title">WHY IT RANKS HERE</div>
        <ul>${details.reasons.map(reason => `<li>${esc(reason)}</li>`).join("")}</ul>
        ${details.comparison ? `<p class="match-comparison">${esc(details.comparison)}</p>` : ""}
        <p class="match-tradeoff"><strong>Watch:</strong> ${esc(details.tradeoff)}</p>`;
      body.appendChild(why);
    });

    const note = document.querySelector("#home-results .quiz-ranking-note");
    if (note && !note.querySelector(".comparison-note")) {
      const extra = document.createElement("span");
      extra.className = "comparison-note";
      extra.textContent = "Each card now shows the strongest reasons for its position, its main tradeoff, and where possible the biggest reason it ranks above the next breed.";
      note.appendChild(extra);
    }
  }

  const scheduleDecorate = () => {
    setTimeout(decorateRanking, 0);
    setTimeout(decorateRanking, 120);
    setTimeout(decorateRanking, 500);
  };

  document.addEventListener("submit", event => {
    if (event.target?.id === "quiz-form") scheduleDecorate();
  });
  window.addEventListener("hashchange", scheduleDecorate);
  document.addEventListener("click", event => {
    if (event.target.closest?.("#take-quiz, #back-button, .nav-quiz")) scheduleDecorate();
  });
  scheduleDecorate();
})();