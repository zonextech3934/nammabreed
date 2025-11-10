document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
  const langToggle = document.getElementById('langToggle'); const i18n = window._i18n||{}; let currentLang = localStorage.getItem('nb_lang')||'en';
  function applyLang(l){ currentLang = l; localStorage.setItem('nb_lang',l); document.querySelectorAll('[data-i18n]').forEach(el=>{ const key = el.getAttribute('data-i18n'); if(i18n[l] && i18n[l][key]) el.textContent = i18n[l][key]; }); if(langToggle) langToggle.textContent = (l==='en')?'தமிழ்':'English'; }
  if(langToggle) langToggle.addEventListener('click',()=> applyLang(currentLang==='en'?'ta':'en')); applyLang(currentLang);

  window.togglePurchase = function(btn,closeAll){ const forms = document.querySelectorAll('.purchase-form'); if(closeAll){ forms.forEach(f=>f.classList.remove('active')); return;} if(!btn) return; const rooster = btn.getAttribute('data-rooster'); forms.forEach(f=>{ if(f.getAttribute('data-form-for') !== rooster) f.classList.remove('active') }); const target = document.querySelector('.purchase-form[data-form-for=\"'+rooster+'\"]'); if(target) target.classList.toggle('active'); setTimeout(()=>{ if(target && target.classList.contains('active')) target.scrollIntoView({behavior:'smooth',block:'center'}) },180); }

  window.openLightbox = function(btn){ const img = btn.closest('.rooster-card').querySelector('img').src; const w = window.open('','_blank','toolbar=0,location=0,menubar=0'); w.document.write('<title>Preview</title>'); w.document.write('<style>body{margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh}img{max-width:100%;max-height:100vh;object-fit:contain}</style>'); w.document.write('<img src=\"'+img+'\">'); }

  window.handleSubmit = function(e,form){ const btn = form.querySelector('button[type=\"submit\"]'); if(btn){ btn.disabled=true; const old = btn.textContent; btn.textContent='Sending...'; setTimeout(()=>{ btn.disabled=false; btn.textContent=old; },3500); } return true; }

  // Pagination settings
  const perPage = 20;
  const data = window.ROOSTERS_DATA || [];
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  let currentPage = 1;

  const grid = document.getElementById('galleryGrid');
  const paginationEl = document.getElementById('pagination');

  function renderPage(page){
    if(!grid) return;
    grid.innerHTML = '';
    const start = (page-1)*perPage;
    const slice = data.slice(start, start+perPage);
    slice.forEach(r=>{
      const div = document.createElement('div'); div.className='rooster-card shimmer';
      div.innerHTML = `
        <img src="${r.img}" alt="${r.name}">
        <div class="rooster-body">
          <div class="rooster-title">
            <div><div style="font-weight:800">${r.name}</div><div class="muted" style="font-size:12px">${r.subtitle||''}</div></div>
            <div class="price">₹${r.price}</div>
          </div>
          <div class="buy-row">
            <div style="font-size:13px;color:var(--muted)">Available: ${r.available||1}</div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-outline view-btn" onclick="openLightbox(this)">Preview</button>
              <button class="btn btn-primary buy-btn" data-rooster="${r.name}" data-price="${r.price}" onclick="togglePurchase(this)">Buy</button>
            </div>
          </div>
          <div class="purchase-form" data-form-for="${r.name}">
            <form action="https://formsubmit.co/dhanuragavan6739@gmail.com" method="POST" onsubmit="return handleSubmit(event,this)">
              <input type="hidden" name="Rooster" value="${r.name}">
              <input type="hidden" name="Price" value="₹${r.price}">
              <div class="form-row" style="margin-bottom:8px"><input name="Name" type="text" placeholder="Your name / உங்கள் பெயர்" required><input name="Phone" type="tel" placeholder="Phone / தொலைபேசி" required></div>
              <div style="margin-bottom:8px"><input name="Email" type="email" placeholder="Email / மின்னஞ்சல்" required style="width:100%"></div>
              <div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn btn-outline" onclick="togglePurchase(null,true)">Cancel</button><button type="submit" class="btn btn-primary">Confirm Purchase</button></div>
            </form>
          </div>
        </div>`;
      grid.appendChild(div);
    });
    renderPagination();
  }

  function renderPagination(){
    if(!paginationEl) return;
    paginationEl.innerHTML = '';
    for(let i=1;i<=totalPages;i++){
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i===currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', ()=>{ currentPage = i; renderPage(currentPage); });
      paginationEl.appendChild(btn);
    }
  }

  // initial render
  renderPage(currentPage);

});