// =============================================
// EMPIRE BY MK — Admin Panel JS
// =============================================

let editingId = null;
let editingType = null;

window.adminInit = function () {
  renderAdminServices();
  renderAdminTestimonials();
  renderAdminGallery();
  renderExportPreview();
};

// ── Tab Switching ──
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');
  document.getElementById(`admin-${tab}`)?.classList.add('active');
  if (tab === 'export') renderExportPreview();
}

// ── Services Admin ──
function renderAdminServices() {
  const list = document.getElementById('admin-services-list');
  if (!list) return;

  list.innerHTML = DATA.services.map(s => `
    <div class="admin-item">
      <div class="admin-item-icon">${s.icon}</div>
      <div class="admin-item-info">
        <div class="admin-item-name">${s.name}</div>
        <div class="admin-item-price">${s.price}</div>
        <div class="admin-item-desc">${s.description.substring(0, 80)}…</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-edit" onclick="editService(${s.id})">Modifier</button>
        <button class="btn-delete" onclick="deleteService(${s.id})">Supprimer</button>
      </div>
    </div>
  `).join('');
}

function editService(id) {
  const s = id ? DATA.services.find(x => x.id === id) : null;
  editingId = id || null;
  editingType = 'service';

  const modal = document.getElementById('admin-modal');
  document.getElementById('modal-title').textContent = id ? 'Modifier le Service' : 'Nouveau Service';

  document.getElementById('modal-content').innerHTML = `
    <div class="form-group">
      <label>Nom du Service</label>
      <input type="text" id="f-name" value="${s?.name || ''}" placeholder="ex: Coiffure">
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea id="f-desc" placeholder="Description du service...">${s?.description || ''}</textarea>
    </div>
    <div class="form-group">
      <label>Prix</label>
      <input type="text" id="f-price" value="${s?.price || ''}" placeholder="ex: À partir de 5 000 FCFA">
    </div>
    <div class="form-group">
      <label>Icône (emoji)</label>
      <input type="text" id="f-icon" value="${s?.icon || ''}" placeholder="ex: ✂️">
    </div>
    <div class="form-group">
      <label>Image URL</label>
      <input type="url" id="f-image" value="${s?.image || ''}" placeholder="https://...">
    </div>
    <div class="form-group">
      <label>Catégorie</label>
      <select id="f-category">
        <option value="cheveux" ${s?.category === 'cheveux' ? 'selected' : ''}>Cheveux</option>
        <option value="ongles" ${s?.category === 'ongles' ? 'selected' : ''}>Ongles</option>
        <option value="visage" ${s?.category === 'visage' ? 'selected' : ''}>Visage</option>
        <option value="yeux" ${s?.category === 'yeux' ? 'selected' : ''}>Yeux</option>
        <option value="makeup" ${s?.category === 'makeup' ? 'selected' : ''}>Make-up</option>
        <option value="spa" ${s?.category === 'spa' ? 'selected' : ''}>Spa</option>
        <option value="formation" ${s?.category === 'formation' ? 'selected' : ''}>Formation</option>
      </select>
    </div>
  `;

  modal.classList.add('open');
}

function deleteService(id) {
  if (!confirm('Supprimer ce service ?')) return;
  DATA.services = DATA.services.filter(s => s.id !== id);
  saveData('services');
  renderAdminServices();
}

// ── Testimonials Admin ──
function renderAdminTestimonials() {
  const list = document.getElementById('admin-testimonials-list');
  if (!list) return;

  list.innerHTML = DATA.testimonials.map(t => `
    <div class="admin-item">
      <div class="author-avatar" style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#C97070);display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:#080808;font-weight:600;flex-shrink:0">${t.name.charAt(0)}</div>
      <div class="admin-item-info">
        <div class="admin-item-name">${t.name}</div>
        <div class="admin-item-price">${'★'.repeat(t.rating)} — ${t.service}</div>
        <div class="admin-item-desc">${t.comment.substring(0, 80)}…</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-edit" onclick="editTestimonial(${t.id})">Modifier</button>
        <button class="btn-delete" onclick="deleteTestimonial(${t.id})">Supprimer</button>
      </div>
    </div>
  `).join('');
}

function editTestimonial(id) {
  const t = id ? DATA.testimonials.find(x => x.id === id) : null;
  editingId = id || null;
  editingType = 'testimonial';

  document.getElementById('modal-title').textContent = id ? 'Modifier le Témoignage' : 'Nouveau Témoignage';

  document.getElementById('modal-content').innerHTML = `
    <div class="form-group">
      <label>Nom Client</label>
      <input type="text" id="f-name" value="${t?.name || ''}" placeholder="ex: Nadège Mballa">
    </div>
    <div class="form-group">
      <label>Commentaire</label>
      <textarea id="f-comment" placeholder="Avis du client...">${t?.comment || ''}</textarea>
    </div>
    <div class="form-group">
      <label>Note (1–5)</label>
      <select id="f-rating">
        ${[1,2,3,4,5].map(n => `<option value="${n}" ${t?.rating === n ? 'selected' : ''}>${n} étoile${n > 1 ? 's' : ''}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Service concerné</label>
      <input type="text" id="f-service" value="${t?.service || ''}" placeholder="ex: Soins du Visage">
    </div>
  `;

  document.getElementById('admin-modal').classList.add('open');
}

function deleteTestimonial(id) {
  if (!confirm('Supprimer ce témoignage ?')) return;
  DATA.testimonials = DATA.testimonials.filter(t => t.id !== id);
  saveData('testimonials');
  renderAdminTestimonials();
}

// ── Gallery Admin ──
function renderAdminGallery() {
  const list = document.getElementById('admin-gallery-list');
  if (!list) return;

  list.innerHTML = DATA.gallery.map(g => `
    <div class="admin-item">
      <img src="${g.after}" alt="${g.title}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;flex-shrink:0" onerror="this.style.display='none'">
      <div class="admin-item-info">
        <div class="admin-item-name">${g.title}</div>
        <div class="admin-item-desc">Catégorie: ${g.category}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-edit" onclick="editGallery(${g.id})">Modifier</button>
        <button class="btn-delete" onclick="deleteGallery(${g.id})">Supprimer</button>
      </div>
    </div>
  `).join('');
}

function editGallery(id) {
  const g = id ? DATA.gallery.find(x => x.id === id) : null;
  editingId = id || null;
  editingType = 'gallery';

  document.getElementById('modal-title').textContent = id ? 'Modifier l\'Image' : 'Nouvelle Image';

  document.getElementById('modal-content').innerHTML = `
    <div class="form-group">
      <label>Titre</label>
      <input type="text" id="f-title" value="${g?.title || ''}" placeholder="ex: Transformation Coiffure">
    </div>
    <div class="form-group">
      <label>Image Avant (URL)</label>
      <input type="url" id="f-before" value="${g?.before || ''}" placeholder="https://...">
    </div>
    <div class="form-group">
      <label>Image Après (URL)</label>
      <input type="url" id="f-after" value="${g?.after || ''}" placeholder="https://...">
    </div>
    <div class="form-group">
      <label>Catégorie</label>
      <select id="f-cat-gallery">
        <option value="coiffure" ${g?.category === 'coiffure' ? 'selected' : ''}>Coiffure</option>
        <option value="visage" ${g?.category === 'visage' ? 'selected' : ''}>Visage</option>
        <option value="cils" ${g?.category === 'cils' ? 'selected' : ''}>Cils</option>
        <option value="ongles" ${g?.category === 'ongles' ? 'selected' : ''}>Ongles</option>
        <option value="makeup" ${g?.category === 'makeup' ? 'selected' : ''}>Make-up</option>
        <option value="perruque" ${g?.category === 'perruque' ? 'selected' : ''}>Perruque</option>
      </select>
    </div>
  `;

  document.getElementById('admin-modal').classList.add('open');
}

function deleteGallery(id) {
  if (!confirm('Supprimer cette image ?')) return;
  DATA.gallery = DATA.gallery.filter(g => g.id !== id);
  saveData('gallery');
  renderAdminGallery();
}

// ── Modal Save ──
function saveModal() {
  if (editingType === 'service') saveService();
  else if (editingType === 'testimonial') saveTestimonial();
  else if (editingType === 'gallery') saveGalleryItem();
  closeModal();
}

function saveService() {
  const s = {
    id: editingId || Date.now(),
    name: document.getElementById('f-name').value.trim(),
    description: document.getElementById('f-desc').value.trim(),
    price: document.getElementById('f-price').value.trim(),
    icon: document.getElementById('f-icon').value.trim(),
    image: document.getElementById('f-image').value.trim(),
    category: document.getElementById('f-category').value
  };
  if (!s.name) return;
  if (editingId) {
    const idx = DATA.services.findIndex(x => x.id === editingId);
    DATA.services[idx] = s;
  } else {
    DATA.services.push(s);
  }
  saveData('services');
  renderAdminServices();
}

function saveTestimonial() {
  const t = {
    id: editingId || Date.now(),
    name: document.getElementById('f-name').value.trim(),
    comment: document.getElementById('f-comment').value.trim(),
    rating: parseInt(document.getElementById('f-rating').value),
    service: document.getElementById('f-service').value.trim(),
    date: new Date().toISOString().split('T')[0]
  };
  if (!t.name) return;
  if (editingId) {
    const idx = DATA.testimonials.findIndex(x => x.id === editingId);
    DATA.testimonials[idx] = t;
  } else {
    DATA.testimonials.push(t);
  }
  saveData('testimonials');
  renderAdminTestimonials();
}

function saveGalleryItem() {
  const g = {
    id: editingId || Date.now(),
    title: document.getElementById('f-title').value.trim(),
    before: document.getElementById('f-before').value.trim(),
    after: document.getElementById('f-after').value.trim(),
    category: document.getElementById('f-cat-gallery').value
  };
  if (!g.title) return;
  if (editingId) {
    const idx = DATA.gallery.findIndex(x => x.id === editingId);
    DATA.gallery[idx] = g;
  } else {
    DATA.gallery.push(g);
  }
  saveData('gallery');
  renderAdminGallery();
}

function closeModal() {
  document.getElementById('admin-modal').classList.remove('open');
  editingId = null;
  editingType = null;
}

// ── Persist to localStorage ──
function saveData(type) {
  if (type === 'services') localStorage.setItem('empireServices', JSON.stringify(DATA.services));
  if (type === 'testimonials') localStorage.setItem('empireTestimonials', JSON.stringify(DATA.testimonials));
  if (type === 'gallery') localStorage.setItem('empireGallery', JSON.stringify(DATA.gallery));
}

// ── Export JSON ──
function downloadJSON(type) {
  let data, filename;
  if (type === 'services') { data = DATA.services; filename = 'services.json'; }
  else if (type === 'testimonials') { data = DATA.testimonials; filename = 'testimonials.json'; }
  else if (type === 'gallery') { data = DATA.gallery; filename = 'gallery.json'; }
  else {
    // All
    downloadJSON('services');
    setTimeout(() => downloadJSON('testimonials'), 200);
    setTimeout(() => downloadJSON('gallery'), 400);
    return;
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function renderExportPreview() {
  const preview = document.getElementById('export-preview');
  if (!preview) return;
  preview.textContent = JSON.stringify({
    services: DATA.services.length + ' services',
    testimonials: DATA.testimonials.length + ' témoignages',
    gallery: DATA.gallery.length + ' images',
    exportedAt: new Date().toLocaleString('fr-FR')
  }, null, 2);
}

function resetToDefaults() {
  if (!confirm('Réinitialiser toutes les données ? Cela supprimera vos modifications.')) return;
  localStorage.removeItem('empireServices');
  localStorage.removeItem('empireTestimonials');
  localStorage.removeItem('empireGallery');
  location.reload();
}
