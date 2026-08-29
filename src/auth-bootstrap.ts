const USER_KEY = 'arvex_saas_v3_user';
const ADMIN_TOKEN_KEY = 'arvex_admin_token';
const BACKUP_KEY = 'arvex_auth_session_backup';

// Server authentication is authoritative. Local storage is only a UI cache and
// must never promote a stale/old admin identity after a real 401 response.
function saveUser(user: unknown) {
  try {
    const value = JSON.stringify(user);
    localStorage.setItem(USER_KEY, value);
    sessionStorage.setItem(BACKUP_KEY, value);
  } catch {}
}

function clearCachedIdentity() {
  try {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(BACKUP_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {}
}

async function checkSession(headers: Record<string, string>) {
  let sawUnauthorized = false;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`/api/auth/me?auth_check=${Date.now()}-${attempt}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        headers,
      });

      if (response.ok) {
        return { ok: true, unauthorized: false, networkError: false, payload: await response.json().catch(() => null) };
      }

      if (response.status === 401) {
        sawUnauthorized = true;
      } else {
        // A 403/5xx is not proof that the session is invalid.
        return { ok: false, unauthorized: false, networkError: false };
      }
    } catch {
      // Keep retrying. A temporary browser/Cloudflare/API connection failure
      // must not turn into a logout.
    }

    if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));
  }

  return { ok: false, unauthorized: sawUnauthorized, networkError: !sawUnauthorized };
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
      } else {
        clearCachedIdentity();
      }
      return;
    }

    // Only a confirmed server-side 401 clears the cached identity. Network
    // failures leave the existing identity alone so refreshes cannot log out
    // customers/admins during a short API or Cloudflare hiccup.
    if (result.unauthorized) {
      clearCachedIdentity();
      return;
    }

    if (!localUser && backupUser) {
      try { localStorage.setItem(USER_KEY, backupUser); } catch {}
    }
  } catch {
    // Never log out on an unexpected bootstrap error.
  }
})();
