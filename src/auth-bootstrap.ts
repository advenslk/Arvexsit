const USER_KEY = 'arvex_saas_v3_user';
const ADMIN_TOKEN_KEY = 'arvex_admin_token';
const BACKUP_KEY = 'arvex_auth_session_backup';

// Explicit logout is still authoritative. A failed startup auth check must not
// erase a valid local UI session before the application has had a chance to
// restore it; transient 401/network/proxy races are common during refreshes.
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
  try {
    const value = JSON.stringify(user);
    localStorage.setItem(USER_KEY, value);
    sessionStorage.setItem(BACKUP_KEY, value);
  } catch {}
}

function clearAuth() {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.setItem(USER_KEY, 'null');
    sessionStorage.removeItem(BACKUP_KEY);
  } catch {}
}

async function checkSession(headers: Record<string, string>) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        headers,
      });
      if (response.ok) return { ok: true, payload: await response.json().catch(() => null) };
      if (response.status !== 401) return { ok: false, unauthorized: false };
    } catch {}
    if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 350 * (attempt + 1)));
  }
  return { ok: false, unauthorized: true };
}

export const authBootstrap: Promise<void> = (async () => {
  try {
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY) || '';
    const localUser = localStorage.getItem(USER_KEY);
    const backupUser = sessionStorage.getItem(BACKUP_KEY);
    const headers: Record<string, string> = {};
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;

    const result = await checkSession(headers);
    if (result.ok) {
      const payload = result.payload;
      if (payload?.authenticated && payload.user) {
        saveUser(payload.user);
      } else if (localUser === null && !backupUser) {
        clearAuth();
      }
      return;
    }

    // Never destroy an existing local/backup identity solely because the first
    // refresh-time server check failed. The server remains authoritative for
    // protected API operations, while the UI can restore and retry normally.
    if (!localUser && backupUser) {
      try { localStorage.setItem(USER_KEY, backupUser); } catch {}
    }
  } catch {
    // Network/API failures must never log a user out.
  }
})();
