/* ============================================
   Logotipo vizualizatorius
   - paprastas automatinis fono skaidrinimas (chroma-key
     nuo nuotraukos kampų spalvos) — apytikslis, ne AI.
   - 3 fiksuotos zonos ant striukės + laisvas tempimas pele/pirštu.
   ============================================ */

const ZONES = {
  krutine:  { x: 0.38, y: 0.42, size: 0.16 },
  rankove:  { x: 0.72, y: 0.55, size: 0.12 },
  sprandas: { x: 0.50, y: 0.16, size: 0.11 }
};

let currentZone = 'krutine';
let logoDataUrl = null;

function initLogoTool(baseImageSrc){
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const visualizer = document.getElementById('visualizer');
  const baseImg = document.getElementById('viz-base-img');
  const stage = document.getElementById('viz-stage');
  const cleanToggle = document.getElementById('clean-toggle');
  const logoTool = document.getElementById('logo-tool');

  baseImg.src = baseImageSrc;

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', e => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });

  function handleFile(file){
    if (!file.type.includes('png')){
      alert('Prašome įkelti .PNG failą (su skaidriu arba vientisos spalvos fonu).');
      return;
    }
    const reader = new FileReader();
    reader.onload = evt => {
      removeBackground(evt.target.result, cleanUrl => {
        logoDataUrl = cleanUrl;
        visualizer.classList.add('show');
        placeLogo(currentZone);
      });
    };
    reader.readAsDataURL(file);
  }

  function removeBackground(dataUrl, callback){
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = data.data;

      const corners = [
        [0,0], [canvas.width-1,0], [0,canvas.height-1], [canvas.width-1,canvas.height-1]
      ];
      let cr=0, cg=0, cb=0;
      corners.forEach(([x,y]) => {
        const i = (y*canvas.width + x) * 4;
        cr += px[i]; cg += px[i+1]; cb += px[i+2];
      });
      cr/=4; cg/=4; cb/=4;

      const threshold = 38;
      for (let i=0; i<px.length; i+=4){
        const dr = px[i]-cr, dg = px[i+1]-cg, db = px[i+2]-cb;
        const dist = Math.sqrt(dr*dr+dg*dg+db*db);
        if (dist < threshold){
          px[i+3] = 0;
        }
      }
      ctx.putImageData(data, 0, 0);
      callback(canvas.toDataURL('image/png'));
    };
    img.src = dataUrl;
  }

  function placeLogo(zoneKey){
    currentZone = zoneKey;
    const zone = ZONES[zoneKey];
    let el = document.getElementById('viz-logo-el');
    if (!el){
      el = document.createElement('div');
      el.id = 'viz-logo-el';
      el.className = 'viz-logo';
      el.innerHTML = '<img id="viz-logo-img" src="">';
      stage.appendChild(el);
      makeDraggable(el);
    }
    document.getElementById('viz-logo-img').src = logoDataUrl;
    const stageRect = stage.getBoundingClientRect();
    const size = stageRect.width * zone.size;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = (stageRect.width * zone.x - size/2) + 'px';
    el.style.top = (stageRect.height * zone.y - size/2) + 'px';
  }

  document.querySelectorAll('.zone-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.zone-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (logoDataUrl) placeLogo(btn.dataset.zone);
      else currentZone = btn.dataset.zone;
    });
  });

  function makeDraggable(el){
    let dragging = false, offX = 0, offY = 0;
    el.addEventListener('pointerdown', e => {
      dragging = true;
      el.classList.add('dragging');
      el.setPointerCapture(e.pointerId);
      const r = el.getBoundingClientRect();
      offX = e.clientX - r.left;
      offY = e.clientY - r.top;
    });
    el.addEventListener('pointermove', e => {
      if (!dragging) return;
      const stageRect = stage.getBoundingClientRect();
      let x = e.clientX - stageRect.left - offX;
      let y = e.clientY - stageRect.top - offY;
      x = Math.max(-20, Math.min(stageRect.width-20, x));
      y = Math.max(-20, Math.min(stageRect.height-20, y));
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    });
    el.addEventListener('pointerup', e => {
      dragging = false;
      el.classList.remove('dragging');
    });
  }

  cleanToggle.addEventListener('change', () => {
    if (cleanToggle.checked){
      logoTool.classList.add('disabled');
    } else {
      logoTool.classList.remove('disabled');
    }
  });

  window.isCleanOrder = () => cleanToggle.checked;
  window.hasLogoPlaced = () => !!logoDataUrl && !cleanToggle.checked;
  window.getLogoZone = () => currentZone;
}
