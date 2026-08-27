(() => {
  const PREFIX = 'arvex_saas_v3_';
  const TOKEN_KEY = 'arvex_admin_token';
  const KEYS = [
    'siteSettings', 'siteImages', 'games', 'plans', 'generalServices', 'tlds',
    'locations', 'comparisonRows', 'faqs', 'testimonials', 'partners', 'reviews',
    'blogPosts', 'coupons', 'currenciesList', 'currency', 'paymentSettings',
    'statusComponents', 'statusIncidents', 'serverNodes', 'adminUsers'
  ];

  let hydrating = true;
  const nativeSetItem = Storage.prototype.setItem;
  const nativeRemoveItem = Storage.prototype.removeItem;

  const api = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      });
      if (!response.ok) throw new Error(`CMS request failed: ${response.status}`);
      return response.json();
    } catch (error) {
      console.warn('[ArveX CMS]', error.message);
      return null;
    }
  };

  const saveKey = async (key, value) => {
    if (hydrating || !localStorage.getItem(TOKEN_KEY)) return;
    await api(`/api/cms/config/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
      body: JSON.stringify({ value }),
    });
  };

  Storage.prototype.setItem = function (key, value) {
    nativeSetItem.call(this, key, value);
    if (this === localStorage && key.startsWith(PREFIX)) {
      const cmsKey = key.slice(PREFIX.length);
      if (KEYS.includes(cmsKey)) {
        try { void saveKey(cmsKey, JSON.parse(value)); } catch { /* ignore malformed values */ }
      }
    }
  };

  Storage.prototype.removeItem = function (key) {
    nativeRemoveItem.call(this, key);
    if (this === localStorage && key.startsWith(PREFIX)) {
      const cmsKey = key.slice(PREFIX.length);
      if (KEYS.includes(cmsKey) && !hydrating && localStorage.getItem(TOKEN_KEY)) {
        void api(`/api/cms/config/${encodeURIComponent(cmsKey)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
        });
      }
    }
  };

  const hydrate = async () => {
    const config = await api('/api/cms/config');
    if (config && Object.keys(config).length) {
      for (const key of KEYS) {
        if (Object.prototype.hasOwnProperty.call(config, key)) {
          nativeSetItem.call(localStorage, PREFIX + key, JSON.stringify(config[key]));
        }
      }
    }
    hydrating = false;
  };

  window.ArveXCMS = {
    async syncAll() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return false;
      for (const key of KEYS) {
        const raw = localStorage.getItem(PREFIX + key);
        if (!raw) continue;
        try {
          await saveKey(key, JSON.parse(raw));
        } catch { /* continue with remaining keys */ }
      }
      return true;
    },
    clearSession() {
      nativeRemoveItem.call(localStorage, TOKEN_KEY);
    },
  };

  void hydrate();
})();
