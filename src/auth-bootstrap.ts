const USER_KEY = 'arvex_saas_v3_user';
const ADMIN_TOKEN_KEY = 'arvex_admin_token';

// Keep the existing AppContext logout API intact while ensuring an explicit
// logout also revokes the server-side session. This hook is deliberately narrow:
// it reacts only when the existing auth key is explicitly written to JSON null.
try {
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key: string, value: string) {
    originalSetItem.call(this, key, value);
    if (this === window.localStorage && key === USER_KEY && value === 'null') {
      void fetch('/api/auth/logout', { method: 'POST', credentials: 'include', keepalive: true }).catch(() => {});
    }
  };
} catch {}

function saveUser(user: unknown) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch {}
}

function clearAuth() {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.setItem(USER_KEY, 'null');
    sessionStorage.removeItem('arvex_auth_session_backup');
  } catch {}
}

export const authBootstrap: Promise<void> = (async () => {
  try {
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY) || '';
    const headers: Record<string, string> = {};
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;

    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers,
    });

    if (response.ok) {
      const payload = await response.json().catch(() => null);
      if (payload?.authenticated && payload.user) {
        saveUser(payload.user);
        try { sessionStorage.setItem('arvex_auth_session_backup', JSON.stringify(payload.user)); } catch {}
      } else {
        clearAuth();
      }
      return;
    }

    if (response.status === 401) clearAuth();
  } catch {
    // Network/API failures must not log a user out. The application can render
    // from its last local state and retry server authentication after mount.
  }
})();
