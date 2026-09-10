(() => {
  const QUIZ_OWNER_KEY = "dogBreedFinder.quizResultsOwner.v1";
  const TABLE = "quiz_results";
  const HISTORY_TABLE = "quiz_result_history";
  const config = window.DOG_BREED_FINDER_SUPABASE || {};
  const quiz = window.DogBreedFinderQuiz;
  const projectUrl = String(config.url || "").trim().replace(/\/+$/, "");
  const publishableKey = String(config.publishableKey || "").trim();

  const dialog = document.getElementById("account-dialog");
  const openButton = document.getElementById("account-open");
  const closeButton = document.getElementById("account-close");
  const signedOutPanel = document.getElementById("account-signed-out");
  const signedInPanel = document.getElementById("account-signed-in");
  const loginTab = document.getElementById("account-login-tab");
  const createTab = document.getElementById("account-create-tab");
  const form = document.getElementById("account-form");
  const emailInput = document.getElementById("account-email");
  const passwordInput = document.getElementById("account-password");
  const submitButton = document.getElementById("account-submit");
  const message = document.getElementById("account-message");
  const emailDisplay = document.getElementById("account-email-display");
  const syncStatus = document.getElementById("account-sync-status");
  const logoutButton = document.getElementById("account-logout");
  const historyButton = document.getElementById("quiz-history-open");
  const historyDialog = document.getElementById("quiz-history-dialog");
  const historyCloseButton = document.getElementById("quiz-history-close");
  const historyList = document.getElementById("quiz-history-list");

  let mode = "login";
  let client = null;
  let currentUser = null;
  let syncedUserId = "";
  let authBusy = false;
  let historyStates = [];

  function isConfigured() {
    return /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(projectUrl) &&
      /^sb_publishable_/.test(publishableKey);
  }

  function getQuizOwner() {
    try { return localStorage.getItem(QUIZ_OWNER_KEY) || ""; }
    catch { return ""; }
  }

  function setQuizOwner(userId) {
    try { localStorage.setItem(QUIZ_OWNER_KEY, userId); }
    catch {}
  }

  function clearQuizOwner() {
    try { localStorage.removeItem(QUIZ_OWNER_KEY); }
    catch {}
  }

  function setMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error", isError);
  }

  function setSyncStatus(text, isError = false) {
    syncStatus.textContent = text;
    syncStatus.classList.toggle("error", isError);
  }

  function setMode(nextMode) {
    mode = nextMode;
    const creating = mode === "create";
    loginTab.classList.toggle("active", !creating);
    createTab.classList.toggle("active", creating);
    loginTab.setAttribute("aria-selected", String(!creating));
    createTab.setAttribute("aria-selected", String(creating));
    passwordInput.autocomplete = creating ? "new-password" : "current-password";
    submitButton.textContent = creating ? "CREATE ACCOUNT" : "LOG IN";
    if (!client) {
      setMessage(
        isConfigured()
          ? "Account saving could not load. Check your connection and try again."
          : "Account saving is not connected yet.",
        true
      );
    } else {
      setMessage(creating ? "Use at least 6 characters for your password." : "");
    }
  }

  function setSignedInView(user) {
    currentUser = user || null;
    const signedIn = Boolean(currentUser);
    signedOutPanel.hidden = signedIn;
    signedInPanel.hidden = !signedIn;
    openButton.textContent = signedIn ? "ACCOUNT" : "LOG IN";
    openButton.setAttribute(
      "aria-label",
      signedIn ? `Account for ${currentUser.email || "signed-in user"}` : "Log in or create an account"
    );
    emailDisplay.textContent = currentUser?.email || "your account";
  }

  function showDialog() {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");

    if (!currentUser) {
      setMode(mode);
      setTimeout(() => emailInput.focus(), 0);
    }
  }

  function closeDialog() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function escapeHtml(value) {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    };
    return String(value ?? "").replace(/[&<>"']/g, character => characters[character]);
  }

  function breedName(id) {
    const breeds = typeof BREEDS === "undefined" ? [] : BREEDS;
    const breed = breeds.find(item => item.id === id);
    if (breed) return breed.name;
    return String(id || "Dog breed")
      .replaceAll("-", " ")
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  function formatQuizDate(state) {
    const date = new Date(Number(state.createdAt));
    if (Number.isNaN(date.getTime())) return "Saved quiz";
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date);
  }

  function renderHistory(states) {
    historyStates = states.filter(state => quiz?.isValidState(state));
    if (!historyStates.length) {
      historyList.innerHTML = `<div class="history-empty">You do not have any saved quiz results yet. Take the quiz and your results will appear here.</div>`;
      return;
    }

    historyList.innerHTML = historyStates.map((state, index) => {
      const matches = [...state.results]
        .sort((a, b) => Number(b.score) - Number(a.score))
        .slice(0, 3);
      return `
        <article class="history-card">
          <div class="history-heading">
            <strong>${escapeHtml(formatQuizDate(state))}</strong>
            <span>${state.results.length} matches</span>
          </div>
          <ol class="history-matches">
            ${matches.map((match, matchIndex) => `
              <li class="history-match">
                <span>#${matchIndex + 1} ${escapeHtml(breedName(match.id))}</span>
                <strong>${Math.round(Number(match.score) * 100)}% match</strong>
              </li>`).join("")}
          </ol>
          <button class="secondary history-view" type="button" data-history-index="${index}">VIEW FULL RESULTS</button>
        </article>`;
    }).join("");
  }

  function showHistoryDialog() {
    if (typeof historyDialog.showModal === "function") historyDialog.showModal();
    else historyDialog.setAttribute("open", "");
  }

  function closeHistoryDialog() {
    if (typeof historyDialog.close === "function") historyDialog.close();
    else historyDialog.removeAttribute("open");
  }

  async function loadQuizHistory() {
    showHistoryDialog();
    historyStates = [];

    if (!client || !currentUser) {
      historyList.innerHTML = `
        <div class="history-empty">
          Log in to see results saved to your account.
          <br><button class="primary" type="button" data-history-login>LOG IN</button>
        </div>`;
      return;
    }

    historyList.innerHTML = `<div class="history-loading">Loading your past results…</div>`;
    const { data, error } = await client
      .from(HISTORY_TABLE)
      .select("quiz_state,result_created_at")
      .eq("user_id", currentUser.id)
      .order("result_created_at", { ascending: false })
      .limit(50);

    if (error) {
      historyList.innerHTML = `<div class="history-empty">Your past results could not load. Please try again.</div>`;
      return;
    }

    renderHistory((data || []).map(row => row.quiz_state));
  }

  function friendlyError(error) {
    const raw = error?.message || "Something went wrong. Please try again.";
    if (/invalid login credentials/i.test(raw)) return "The email or password is incorrect.";
    if (/email not confirmed/i.test(raw)) return "Confirm your email before logging in.";
    if (/user already registered/i.test(raw)) return "An account already exists for this email. Log in instead.";
    return raw;
  }

  async function saveQuizToHistory(state, user = currentUser) {
    if (!client || !user || !quiz?.isValidState(state)) return false;
    const { error } = await client
      .from(HISTORY_TABLE)
      .upsert({
        user_id: user.id,
        result_created_at: Math.trunc(Number(state.createdAt)),
        quiz_state: state
      }, {
        onConflict: "user_id,result_created_at",
        ignoreDuplicates: true
      });
    return !error;
  }

  async function saveQuizToCloud(state, user = currentUser) {
    if (!client || !user || !quiz?.isValidState(state)) return false;
    const quizTime = new Date(Number(state.createdAt));
    const updatedAt = Number.isNaN(quizTime.getTime()) ? new Date().toISOString() : quizTime.toISOString();
    const { error } = await client
      .from(TABLE)
      .upsert({
        user_id: user.id,
        quiz_state: state,
        updated_at: updatedAt
      }, { onConflict: "user_id" });

    if (error) {
      setSyncStatus("Your result is saved on this device, but could not be saved to your account.", true);
      return false;
    }

    const historySaved = await saveQuizToHistory(state, user);
    setQuizOwner(user.id);
    setSyncStatus(
      historySaved
        ? "Your quiz result is saved to your account."
        : "Your latest result is saved, but your past-results list could not be updated.",
      !historySaved
    );
    if (historyDialog.open) loadQuizHistory();
    return true;
  }

  async function syncNewestQuiz(user) {
    if (!client || !user || !quiz) return;
    setSyncStatus("Checking your saved quiz result…");

    const localOwner = getQuizOwner();
    if (localOwner && localOwner !== user.id) {
      quiz.clearSavedResults();
      clearQuizOwner();
    }

    const { data, error } = await client
      .from(TABLE)
      .select("quiz_state")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      setSyncStatus("Could not load your saved quiz result. Your result on this device is unchanged.", true);
      return;
    }

    const localState = quiz.getSavedResults();
    const remoteState = quiz.isValidState(data?.quiz_state) ? data.quiz_state : null;

    if (!localState && !remoteState) {
      setQuizOwner(user.id);
      setSyncStatus("Complete the quiz and your result will be saved here.");
      return;
    }

    const localTime = Number(localState?.createdAt || 0);
    const remoteTime = Number(remoteState?.createdAt || 0);

    if (remoteState && remoteTime > localTime) {
      quiz.replaceSavedResults(remoteState);
      await saveQuizToHistory(remoteState, user);
      setQuizOwner(user.id);
      setSyncStatus("Your saved quiz result has been restored.");
      return;
    }

    await saveQuizToCloud(localState, user);
  }

  async function handleSession(session) {
    const user = session?.user || null;
    setSignedInView(user);

    if (!user) {
      if (getQuizOwner()) {
        quiz?.clearSavedResults();
        clearQuizOwner();
        if (!location.hash || location.hash === "#quiz") setTimeout(() => location.reload(), 0);
      }
      syncedUserId = "";
      return;
    }

    if (syncedUserId === user.id) return;
    syncedUserId = user.id;
    await syncNewestQuiz(user);
  }

  async function submitAccount(event) {
    event.preventDefault();
    if (!client || authBusy) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    authBusy = true;
    submitButton.disabled = true;
    submitButton.textContent = mode === "create" ? "CREATING…" : "LOGGING IN…";
    setMessage("");

    try {
      if (mode === "create") {
        const redirectTo = `${location.origin}${location.pathname}`;
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo }
        });
        if (error) throw error;

        if (data.session) {
          await handleSession(data.session);
        } else {
          setMessage("Check your email to confirm your account, then return here to log in.");
        }
      } else {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await handleSession(data.session);
      }
    } catch (error) {
      setMessage(friendlyError(error), true);
    } finally {
      authBusy = false;
      submitButton.disabled = false;
      submitButton.textContent = mode === "create" ? "CREATE ACCOUNT" : "LOG IN";
    }
  }

  async function logOut() {
    if (!client || authBusy) return;
    authBusy = true;
    logoutButton.disabled = true;
    setSyncStatus("Logging out…");

    const userId = currentUser?.id || "";
    const { error } = await client.auth.signOut();
    if (error) {
      setSyncStatus(friendlyError(error), true);
      logoutButton.disabled = false;
      authBusy = false;
      return;
    }

    if (getQuizOwner() === userId) {
      quiz?.clearSavedResults();
      clearQuizOwner();
    }
    location.reload();
  }

  openButton.addEventListener("click", showDialog);
  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", event => {
    if (event.target === dialog) closeDialog();
  });
  loginTab.addEventListener("click", () => setMode("login"));
  createTab.addEventListener("click", () => setMode("create"));
  form.addEventListener("submit", submitAccount);
  logoutButton.addEventListener("click", logOut);
  historyButton.addEventListener("click", loadQuizHistory);
  historyCloseButton.addEventListener("click", closeHistoryDialog);
  historyDialog.addEventListener("click", event => {
    if (event.target === historyDialog) closeHistoryDialog();
  });
  historyList.addEventListener("click", event => {
    if (event.target.closest("[data-history-login]")) {
      closeHistoryDialog();
      showDialog();
      return;
    }

    const viewButton = event.target.closest("[data-history-index]");
    if (!viewButton) return;
    const state = historyStates[Number(viewButton.dataset.historyIndex)];
    if (!quiz?.isValidState(state)) return;
    closeHistoryDialog();
    location.hash = "quiz";
    setTimeout(() => {
      quiz.replaceSavedResults(state);
      document.getElementById("home-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  });

  window.addEventListener("dogbreedfinder:quiz-saved", event => {
    if (currentUser) saveQuizToCloud(event.detail?.state, currentUser);
  });

  if (!isConfigured()) {
    setSignedInView(null);
    submitButton.disabled = true;
    setMessage("Account saving is not connected yet.", true);
    return;
  }

  if (!window.supabase?.createClient) {
    setSignedInView(null);
    submitButton.disabled = true;
    setMessage("Account saving could not load. Check your connection and try again.", true);
    return;
  }

  client = window.supabase.createClient(projectUrl, publishableKey, {
    auth: {
      flowType: "pkce",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  client.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => handleSession(session), 0);
  });

  client.auth.getSession()
    .then(({ data, error }) => {
      if (error) throw error;
      return handleSession(data.session);
    })
    .catch(error => {
      setSignedInView(null);
      setMessage(friendlyError(error), true);
    });
})();
