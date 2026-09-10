(() => {
  const QUIZ_OWNER_KEY = "dogBreedFinder.quizResultsOwner.v1";
  const TABLE = "quiz_results";
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

  let mode = "login";
  let client = null;
  let currentUser = null;
  let syncedUserId = "";
  let authBusy = false;

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

  function friendlyError(error) {
    const raw = error?.message || "Something went wrong. Please try again.";
    if (/invalid login credentials/i.test(raw)) return "The email or password is incorrect.";
    if (/email not confirmed/i.test(raw)) return "Confirm your email before logging in.";
    if (/user already registered/i.test(raw)) return "An account already exists for this email. Log in instead.";
    return raw;
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

    setQuizOwner(user.id);
    setSyncStatus("Your latest quiz result is saved to your account.");
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
