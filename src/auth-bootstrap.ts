const USER_KEY = 'arvex_saas_v3_user';
const ADMIN_TOKEN_KEY = 'arvex_admin_token';
const BACKUP_KEY = 'arvex_auth_session_backup';

// Authentication is server-authoritative, but a temporary refresh/network race
// must never destroy the browser's current UI identity or revoke its server
// session. Explicit logout is handled by the existing logout flow.
function saveUser(user: unknown) {
  try {
    const value = JSON.stringify(user);
    localStorage.setItem(USER_KEY, value);
    sessionStorage.setItem(BACKUP_KEY, value);
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
      } else if (localUser === null && backupUser) {
        try { localStorage.setItem(USER_KEY, backupUser); } catch {}
      }
      return;
    }

    // IMPORTANT: never call logout/clearAuth here. A refresh can temporarily
    // fail while Cloudflare, the API process, or the browser reconnects. Keep
    // the existing local identity and let the next authenticated API request
    // retry. This prevents the refresh -> logout loop.
    if (!localUser && backupUser) {
      try { localStorage.setItem(USER_KEY, backupUser); } catch {}
    }
  } catch {
    // Network/API failures must never log a user out.
  }
})();
