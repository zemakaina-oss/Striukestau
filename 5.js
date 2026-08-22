/* ============================================
   Formos siuntimas — Formspree su mailto: atsarginiu variantu.
   ============================================ */

const FORM_ENDPOINT = "https://formspree.io/f/xjybllwk";

function sendLead(fields, subject, onSuccess, onError) {
  const bodyText = Object.entries(fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const mailtoFallback = () => {
    const s = encodeURIComponent(subject);
    const b = encodeURIComponent(bodyText);
    window.location.href = `mailto:info@striukestau.lt?subject=${s}&body=${b}`;
  };

  if (!FORM_ENDPOINT) {
    mailtoFallback();
    if (onSuccess) onSuccess('mailto');
    return;
  }

  const payload = { ...fields, _subject: subject };

  fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (res.ok) {
        if (onSuccess) onSuccess('formspree');
      } else {
        throw new Error('Formspree atsakė klaida: ' + res.status);
      }
    })
    .catch(err => {
      console.error('Formos siuntimas nepavyko, naudojamas mailto: atsarginis variantas.', err);
      mailtoFallback();
      if (onError) onError(err);
    });
}
