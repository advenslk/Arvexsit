(() => {
  const KEY = 'arvex_saas_v3_games';
  const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const getGames = () => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || 'null');
      return Array.isArray(v) ? v : [];
    } catch { return []; }
  };
  const saveGames = games => localStorage.setItem(KEY, JSON.stringify(games));

  function closeModal() {
    document.getElementById('__arvex_game_editor')?.remove();
  }

  function openEditor(game) {
    closeModal();
    const isNew = !game;
    const current = game || { name:'', slug:'', category:'Sandbox & Survival', startingPrice:5, image:'', bannerImage:'', description:'', shortDescription:'', popular:false, active:true };
    const wrap = document.createElement('div');
    wrap.id = '__arvex_game_editor';
    wrap.innerHTML = `
      <style>
        #__arvex_game_editor{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.88);backdrop-filter:blur(10px);font-family:Arial,sans-serif}
        #__arvex_game_editor .box{width:min(520px,100%);max-height:92vh;overflow:auto;background:#11141e;border:1px solid rgba(34,211,238,.35);border-radius:24px;padding:22px;color:#fff;box-shadow:0 25px 80px rgba(0,0,0,.65)}
        #__arvex_game_editor h3{margin:0;font-size:16px} #__arvex_game_editor p{margin:5px 0 18px;color:#94a3b8;font-size:11px}
        #__arvex_game_editor .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px} #__arvex_game_editor .field{margin-bottom:12px}
        #__arvex_game_editor label{display:block;color:#cbd5e1;font-size:11px;font-weight:700;margin-bottom:5px}
        #__arvex_game_editor input,#__arvex_game_editor textarea,#__arvex_game_editor select{box-sizing:border-box;width:100%;border:1px solid rgba(255,255,255,.1);border-radius:11px;background:#090c12;color:#fff;padding:10px;font-size:12px;outline:none}
        #__arvex_game_editor textarea{resize:vertical} #__arvex_game_editor input:focus,#__arvex_game_editor textarea:focus,#__arvex_game_editor select:focus{border-color:#22d3ee}
        #__arvex_game_editor .actions{display:flex;justify-content:flex-end;gap:8px;border-top:1px solid rgba(255,255,255,.08);padding-top:14px;margin-top:6px}
        #__arvex_game_editor button{border:0;border-radius:11px;padding:10px 15px;font-size:12px;font-weight:800;cursor:pointer}
        #__arvex_game_editor .cancel{background:rgba(255,255,255,.06);color:#cbd5e1} #__arvex_game_editor .save{background:#22d3ee;color:#061016}
        #__arvex_game_editor .check{display:flex;align-items:center;gap:8px;color:#cbd5e1;font-size:11px;font-weight:700;margin:4px 0 12px}
        #__arvex_game_editor .check input{width:auto}
        @media(max-width:520px){#__arvex_game_editor .grid{grid-template-columns:1fr}}
      </style>
      <div class="box" role="dialog" aria-modal="true">
        <h3>${isNew ? 'Add New Game' : 'Edit Game'}</h3>
        <p>Changes are saved to the ArveX Games Catalog in this browser.</p>
        <div class="grid">
          <div class="field"><label>Game Name</label><input id="axg-name" value="${escape(current.name)}" placeholder="Minecraft"></div>
          <div class="field"><label>Category</label><input id="axg-category" value="${escape(current.category || '')}" placeholder="Sandbox & Survival"></div>
          <div class="field"><label>Starting Price ($/mo)</label><input id="axg-price" type="number" min="0" step="0.01" value="${Number(current.startingPrice ?? 5)}"></div>
          <div class="field"><label>Status</label><select id="axg-active"><option value="true" ${current.active !== false ? 'selected':''}>Active</option><option value="false" ${current.active === false ? 'selected':''}>Hidden</option></select></div>
        </div>
        <div class="field"><label>Cover Image URL</label><input id="axg-image" value="${escape(current.image || '')}" placeholder="https://..."></div>
        <div class="field"><label>Banner Image URL (optional)</label><input id="axg-banner" value="${escape(current.bannerImage || '')}" placeholder="https://..."></div>
        <div class="field"><label>Description</label><textarea id="axg-desc" rows="3" placeholder="Short game description">${escape(current.shortDescription || current.description || '')}</textarea></div>
        <label class="check"><input id="axg-popular" type="checkbox" ${current.popular ? 'checked':''}> Mark as Popular</label>
        <div class="actions"><button class="cancel" id="axg-cancel">Cancel</button><button class="save" id="axg-save">${isNew ? 'Add Game' : 'Save Game'}</button></div>
      </div>`;
    document.body.appendChild(wrap);
    wrap.addEventListener('click', e => { if (e.target === wrap) closeModal(); });
    wrap.querySelector('#axg-cancel').onclick = closeModal;
    wrap.querySelector('#axg-save').onclick = () => {
      const name = wrap.querySelector('#axg-name').value.trim();
      const image = wrap.querySelector('#axg-image').value.trim();
      if (!name) return alert('Please enter a game name.');
      if (!image) return alert('Please enter a cover image URL.');
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      const updated = {
        ...current,
        name,
        slug,
        category: wrap.querySelector('#axg-category').value.trim() || 'Game Hosting',
        startingPrice: Math.max(0, Number(wrap.querySelector('#axg-price').value) || 0),
        image,
        bannerImage: wrap.querySelector('#axg-banner').value.trim() || undefined,
        description: wrap.querySelector('#axg-desc').value.trim() || undefined,
        shortDescription: wrap.querySelector('#axg-desc').value.trim() || undefined,
        popular: wrap.querySelector('#axg-popular').checked,
        active: wrap.querySelector('#axg-active').value === 'true'
      };
      const games = getGames();
      if (isNew) { updated.id = 'game-' + Date.now(); games.push(updated); }
      else { const i = games.findIndex(g => g.id === current.id); if (i >= 0) games[i] = updated; else games.push(updated); }
      saveGames(games);
      closeModal();
      location.reload();
    };
    setTimeout(() => wrap.querySelector('#axg-name')?.focus(), 0);
  }

  document.addEventListener('click', e => {
    const target = e.target instanceof Element ? e.target : null;
    const button = target?.closest('button');
    if (!button) return;
    const text = (button.textContent || '').replace(/\s+/g,' ').trim();
    const admin = document.querySelector('text') || document.body;
    const gameTabVisible = [...document.querySelectorAll('button')].some(b => (b.textContent || '').includes('Games Catalog') && b.className.includes('bg-white'));
    if (!gameTabVisible) return;

    if (text === 'Add Game') {
      e.preventDefault(); e.stopImmediatePropagation();
      openEditor(null);
      return;
    }

    const editIcon = button.querySelector('svg');
    if (editIcon && !text && button.closest('div')) {
      const card = button.closest('div')?.parentElement;
      const img = card?.querySelector?.('img[alt]');
      const name = img?.getAttribute('alt');
      if (name) {
        const game = getGames().find(g => g.name === name);
        if (game) { e.preventDefault(); e.stopImmediatePropagation(); openEditor(game); }
      }
    }
  }, true);
})();
