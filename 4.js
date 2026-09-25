/* ============================================
   Produkto puslapio logika: duomenų užpildymas,
   dydžių/kiekių matrica, kainos pakopa, CTA forma.
   ============================================ */

const params = new URLSearchParams(window.location.search);
const productId = params.get('id') || 'p01';
const product = getProduct(productId) || PRODUCTS[0];

document.getElementById('page-title').textContent = product.name + ' su logotipu — Marco Group';
document.getElementById('pd-season').textContent = SEASONS[product.season];

// SEO: kiekvienam produktui atnaujiname canonical ir og: meta žymes,
// kad kiekvienas produkto puslapis (?id=pXX) būtų traktuojamas kaip
// atskiras, unikalus puslapis, o ne visi kaip vienas ir tas pats.
(function updateSeoMeta(){
  const pageUrl = 'https://striukestau.lt/product?id=' + product.id;
  const imageUrl = 'https://striukestau.lt/' + product.images[0];
  const shortDesc = product.name + ' su Jūsų įmonės logotipu. Nuo ' + product.tiers[0].price + '€/vnt., nemokamas pavyzdžio pristatymas.';

  // Canonical nuorodos HTML'e nebėra (kad nebūtų prieštaravimo) -
  // sukuriame ją čia su teisingu produkto adresu.
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', pageUrl);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', product.name + ' su logotipu — Marco Group');

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', shortDesc);

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.setAttribute('content', imageUrl);
})();

// Klientų atsiliepimai (tik realūs, gauti raštu su leidimu skelbti)
const MANTOMA = {
  rating: 5,
  author: "UAB „Mantoma“",
  text: "UAB „Mantoma“ nuoširdžiai dėkoja už puikų bendradarbiavimą! Džiugina tai, kad šios striukės puikiai suderina puikią, draugišką kainą ir puikią kokybę. Tikrai sugrįšime dar ne kartą ir drąsiai rekomenduojame visiems, ieškantiems patikimų partnerių bei kokybiškos produkcijos!"
};

const REVIEWS = {
  "p04": MANTOMA,   // Nr. 8 – Ilgesnio kirpimo striukė su gobtuvu
  "p12": MANTOMA,   // Nr. 6 – Žieminė striukė su gobtuvu
};

// struktūrizuoti duomenys (Schema.org Product) - padeda Google paieškai
const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name + " su logotipu",
  "description": product.desc,
  "image": "https://striukestau.lt/" + product.images[0],
  "brand": { "@type": "Brand", "name": "Marco Group" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "price": product.tiers[0].price,
    "availability": "https://schema.org/InStock",
    "url": window.location.href,
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": { "@type": "MonetaryAmount", "value": 0, "currency": "EUR" },
      "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "LT" },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
        "transitTime": { "@type": "QuantitativeValue", "minValue": 3, "maxValue": 7, "unitCode": "DAY" },
        "businessDays": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "https://schema.org/Monday",
            "https://schema.org/Tuesday",
            "https://schema.org/Wednesday",
            "https://schema.org/Thursday",
            "https://schema.org/Friday"
          ]
        }
      }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "LT",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 14,
      "returnMethod": "https://schema.org/ReturnByMail",
      "returnFees": "https://schema.org/ReturnFeesCustomerResponsibility"
    }
  }
};

// Įvertinimas dedamas TIK tam modeliui, apie kurį atsiliepimas gautas,
// ir tik kartu su matomu atsiliepimu puslapyje (žr. žemiau).
const rev = REVIEWS[product.id];
if (rev) {
  productLd.aggregateRating = {
    "@type": "AggregateRating",
    "ratingValue": rev.rating,
    "reviewCount": 1
  };
  productLd.review = [{
    "@type": "Review",
    "reviewRating": { "@type": "Rating", "ratingValue": rev.rating, "bestRating": 5 },
    "author": { "@type": "Organization", "name": rev.author },
    "reviewBody": rev.text
  }];
}

const ldJson = document.createElement('script');
ldJson.type = 'application/ld+json';
ldJson.textContent = JSON.stringify(productLd);
document.head.appendChild(ldJson);
const productNumber = PRODUCTS.indexOf(product) + 1;
document.getElementById('pd-name').innerHTML = '<span class="pd-number">Nr. ' + productNumber + '</span>' + product.name;
document.getElementById('pd-desc').textContent = product.desc;

// bestseller ženkliukas
if (product.featured) {
  const badge = document.getElementById('pd-bestseller');
  if (badge) badge.style.display = 'inline-block';
}

// spalvos pasirinkimas (jei produktas turi kelias spalvas)
let selectedColor = null;
const colorSelectWrap = document.getElementById('color-select');
const colorOptionsWrap = document.getElementById('color-options');
if (product.colors && product.colors.length > 1) {
  colorSelectWrap.style.display = 'block';
  product.colors.forEach((color, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'color-btn' + (i === 0 ? ' active' : '');
    btn.textContent = color;
    btn.addEventListener('click', () => {
      colorOptionsWrap.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedColor = color;
    });
    colorOptionsWrap.appendChild(btn);
  });
  selectedColor = product.colors[0];
}

// galerija
const mainImg = document.getElementById('pd-main-img');
mainImg.src = product.images[0];
mainImg.alt = product.name + ' su logotipu — Marco Group';
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

// Matomas kliento atsiliepimas (privaloma, kad struktūriniai duomenys būtų teisėti)
if (rev) {
  const box = document.createElement('div');
  box.style.cssText = 'border:1px solid var(--line); border-radius:var(--radius); padding:22px; margin-bottom:28px; background:#fff;';
  box.innerHTML =
    '<span class="label" style="display:block; margin-bottom:10px;">Kliento atsiliepimas</span>' +
    '<div style="letter-spacing:2px; color:#C9A227; margin-bottom:10px;">★★★★★</div>' +
    '<p style="font-size:14.5px; line-height:1.65; color:var(--ink); margin:0 0 12px;">„' + rev.text + '“</p>' +
    '<p style="font-size:13px; color:var(--muted); margin:0;">' + rev.author + ' · ' + rev.rating + ' iš 5</p>';
  const cta = document.getElementById('cta-btn');
  cta.parentNode.insertBefore(box, cta);
}

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
    'Spalva': selectedColor || '—',
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
