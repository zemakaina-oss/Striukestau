/* ============================================
   Produkto puslapio logika: duomenų užpildymas,
   dydžių/kiekių matrica, kainos pakopa, CTA forma.
   ============================================ */

const params = new URLSearchParams(window.location.search);
const productId = params.get('id') || 'p01';
const product = getProduct(productId) || PRODUCTS[0];

document.getElementById('page-title').textContent = product.name + ' — Marco Group';
document.getElementById('pd-season').textContent = SEASONS[product.season];
document.getElementById('pd-name').textContent = product.name;
document.getElementById('pd-desc').textContent = product.desc;

// galerija
const mainImg = document.getElementById('pd-main-img');
mainImg.src = product.images[0];
mainImg.alt = product.name;
const thumbsWrap = document.getElementById('pd-thumbs');
product.images.forEach((src, i) => {
  const t = document.createElement('img');
  t.src = src; t.alt = product.name + ' — nuotrauka ' + (i+1);
  if (i === 0) t.classList.add('active');
  t.addEventListener('click', () => {
    mainImg.src = src;
    thumbsWrap.querySelectorAll('img').forEach(im => im.classList.remove('active'));
    t.classList.add('active');
  });
  thumbsWrap.appendChild(t);
});
if (product.images.length < 2) thumbsWrap.style.display = 'none';

// kainų lentelė
const tiersBody = document.querySelector('#pd-tiers tbody');
product.tiers.forEach(t => {
  const label = t.max ? `${t.min}–${t.max} vnt.` : `${t.min}+ vnt.`;
  const tr = document.createElement('tr');
  tr.dataset.min = t.min; tr.dataset.max = t.max || '';
  tr.innerHTML = `<td>${label}</td><td class="price">${t.price} €</td>`;
  tiersBody.appendChild(tr);
});

// dydžių matrica
const sizeRow = document.getElementById('sm-row');
const productSizes = product.sizes || ['48','50','52','54','56','58'];
productSizes.forEach(sz => {
  const cell = document.createElement('div');
  cell.className = 'sm-cell';
  cell.innerHTML = `<label>${sz}</label><input type="number" min="0" value="0" data-size="${sz}">`;
  sizeRow.appendChild(cell);
});

const sizeInputs = document.querySelectorAll('.sm-cell input');
const totalEl = document.getElementById('sm-total-n');
const unitPriceEl = document.getElementById('sm-unit-price');
const grandTotalEl = document.getElementById('sm-grand-total');
const warningEl = document.getElementById('sm-warning');
const ctaBtn = document.getElementById('cta-btn');

function updateMatrix(){
  let total = 0;
  sizeInputs.forEach(inp => total += Math.max(0, parseInt(inp.value) || 0));
  totalEl.textContent = total;

  tiersBody.querySelectorAll('tr').forEach(tr => {
    const min = parseInt(tr.dataset.min);
    const max = tr.dataset.max ? parseInt(tr.dataset.max) : null;
    const isActive = total >= min && (max === null || total <= max);
    tr.classList.toggle('active-tier', isActive && total > 0);
  });

  if (total > 0){
    const breakdown = tierBreakdown(product, total);
    unitPriceEl.textContent = breakdown.unit.toFixed(2).replace('.', ',') + ' €';
    if (grandTotalEl) grandTotalEl.textContent = breakdown.total.toFixed(2).replace('.', ',') + ' €';
  } else {
    unitPriceEl.textContent = '—';
    if (grandTotalEl) grandTotalEl.textContent = '—';
  }

  // Mygtukas visada aktyvus — tik švelnus įspėjimas, jei kiekis mažesnis nei minimalus.
  warningEl.classList.toggle('show', total > 0 && total < 5);
}
sizeInputs.forEach(inp => inp.addEventListener('input', updateMatrix));
updateMatrix();

// logotipo vizualizatorius
initLogoTool(product.images[0]);

// CTA modalas
const modalOverlay = document.getElementById('modal-overlay');
ctaBtn.addEventListener('click', () => {
  modalOverlay.classList.add('show');
});
document.getElementById('modal-close').addEventListener('click', () => modalOverlay.classList.remove('show'));
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) modalOverlay.classList.remove('show'); });

document.getElementById('lead-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('f-name').value;
  const company = document.getElementById('f-company').value;
  const phone = document.getElementById('f-phone').value;
  const email = document.getElementById('f-email').value;

  let sizesSummary = [];
  sizeInputs.forEach(inp => {
    const v = parseInt(inp.value) || 0;
    if (v > 0) sizesSummary.push(inp.dataset.size + ': ' + v);
  });
  const total = sizesSummary.length ? sizesSummary.reduce((s,x)=>s+parseInt(x.split(': ')[1]),0) : 0;
  const logoInfo = window.hasLogoPlaced() ? 'Su logotipu' : 'Be logotipo / nenurodyta';

  const subject = `Užklausa: ${product.name} — ${company}`;
  const fields = {
    'Modelis': product.name,
    'Dydžiai/kiekiai': sizesSummary.join(', ') || '—',
    'Iš viso vienetų': total,
    'Personalizacija': logoInfo,
    'Vardas': name,
    'Įmonė': company,
    'Tel.': phone,
    'El. paštas': email
  };

  const submitBtn = document.getElementById('lead-submit-btn');
  const statusEl = document.getElementById('lead-status');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Siunčiama...';

  sendLead(fields, subject,
    (via) => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Siųsti užklausą';
      if (via === 'formspree') {
        statusEl.textContent = 'Užklausa išsiųsta — susisieksime greitai.';
        statusEl.classList.add('ok');
        document.getElementById('lead-form').reset();
        setTimeout(() => modalOverlay.classList.remove('show'), 1800);
      } else {
        modalOverlay.classList.remove('show');
      }
    },
    () => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Siųsti užklausą';
      statusEl.textContent = 'Nepavyko išsiųsti automatiškai — atidarėme Jūsų pašto klientą.';
      statusEl.classList.add('err');
    }
  );
});
