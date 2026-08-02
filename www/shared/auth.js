// Shared across all pages: talks to the backend for signup/login/google,
// stores the Supabase session on-device, and guards pages that need auth.

const cfg = window.UKTIO_CONFIG;
const SESSION_KEY = 'utkio_session';

export function saveSession(session) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
  catch (e) { console.warn('saveSession failed', e); }
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); }
  catch (e) { /* ignore */ }
}

export function getAccessToken() {
  const s = getSession();
  return s ? s.access_token : null;
}

// Call at the top of any page that requires login. Redirects to login.html
// if there's no valid-looking session. Returns the session if present.
export function requireAuthOrRedirect() {
  const s = getSession();
  if (!s || !s.access_token) {
    window.location.href = 'login.html';
    return null;
  }
  return s;
}

// Thin wrapper around fetch() that talks to YOUR backend (not Supabase
// directly) and attaches the Supabase access token as a Bearer header.
export async function apiFetch(path, options = {}) {
  const token = getAccessToken();
  const res = await fetch(cfg.BACKEND_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || ('Request failed (' + res.status + ')'));
  return data;
}

export function logout() {
  clearSession();
  window.location.href = 'login.html';
}

// Call right after a successful login/signup/google-auth to send the user
// to the right place: onboarding.html if they haven't finished it yet,
// chat.html otherwise. Falls back to chat.html if the profile fetch fails
// (better to let them in than to trap them on a spinner).
export async function goToPostAuthDestination() {
  try {
    const data = await apiFetch('/users/me');
    window.location.href = (data.profile && data.profile.onboarding_completed)
      ? 'chat.html'
      : 'onboarding.html';
  } catch (e) {
    window.location.href = 'chat.html';
  }
}

// Guard for pages that require a *finished* profile (chat.html, profile.html
// etc). Redirects to login.html if not logged in, or onboarding.html if
// logged in but onboarding isn't done yet. Returns the profile data on
// success, or null (and it has already redirected).
export async function requireCompleteProfile() {
  const s = requireAuthOrRedirect();
  if (!s) return null;

  try {
    const data = await apiFetch('/users/me');
    if (!data.profile || !data.profile.onboarding_completed) {
      window.location.href = 'onboarding.html';
      return null;
    }
    return data;
  } catch (e) {
    // Token invalid/expired etc — bounce to login rather than trap the user.
    window.location.href = 'login.html';
    return null;
  }
}
