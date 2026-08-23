/* ============================================
   Logotipo vizualizatorius
   - paprastas automatinis fono skaidrinimas (chroma-key
     nuo nuotraukos kampų spalvos) — apytikslis, ne AI.
   - laisvas tempimas pele/pirštu + dydžio keitimas kampo rankenėle.
   ============================================ */

let logoDataUrl = null;
let dragging = false;
let resizing = false;

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
        placeLogoDefault();
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

  function ensureLogoEl(){
    let el = document.getElementById('viz-logo-el');
    if (!el){
      el = document.createElement('div');
      el.id = 'viz-logo-el';
      el.className = 'viz-logo';
      el.innerHTML =
        '<img id="viz-logo-img" src="" draggable="false">' +
        '<div id="viz-logo-resize" class="viz-logo-resize" title="Vilkite, kad pakeistumėte dydį"></div>';
      stage.appendChild(el);
      makeDraggable(el);
      makeResizable(el, document.getElementById('viz-logo-resize'));
    }
    return el;
  }

  function placeLogoDefault(){
    const el = ensureLogoEl();
    document.getElementById('viz-logo-img').src = logoDataUrl;
    const stageRect = stage.getBoundingClientRect();
    // Pradinė pozicija — apytiksliai viršutinė-vidurinė dalis, vartotojas pats pakoreguoja.
    const size = stageRect.width * 0.16;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = (stageRect.width * 0.5 - size/2) + 'px';
    el.style.top = (stageRect.height * 0.38 - size/2) + 'px';
    el.style.display = 'block';
  }

  function makeDraggable(el){
    let offX = 0, offY = 0;

    el.addEventListener('pointerdown', e => {
      if (e.target.id === 'viz-logo-resize') return; // rankenėlė tvarko save
      dragging = true;
      el.classList.add('dragging');
      try { el.setPointerCapture(e.pointerId); } catch(err){}
      const r = el.getBoundingClientRect();
      offX = e.clientX - r.left;
      offY = e.clientY - r.top;
    });

    el.addEventListener('pointermove', e => {
      if (!dragging) return;
      const stageRect = stage.getBoundingClientRect();
      const w = el.offsetWidth, h = el.offsetHeight;
      let x = e.clientX - stageRect.left - offX;
      let y = e.clientY - stageRect.top - offY;
      x = Math.max(-w*0.4, Math.min(stageRect.width - w*0.6, x));
      y = Math.max(-h*0.4, Math.min(stageRect.height - h*0.6, y));
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    });

    function stopDrag(e){
      dragging = false;
      el.classList.remove('dragging');
      try { if (e && e.pointerId != null) el.releasePointerCapture(e.pointerId); } catch(err){}
    }
    el.addEventListener('pointerup', stopDrag);
    el.addEventListener('pointercancel', stopDrag);
    el.addEventListener('lostpointercapture', stopDrag);
  }

  function makeResizable(el, handle){
    let startX = 0, startY = 0, startW = 0, startH = 0;
    const MIN_SIZE = 30;

    handle.addEventListener('pointerdown', e => {
      e.stopPropagation();
      resizing = true;
      try { handle.setPointerCapture(e.pointerId); } catch(err){}
      startX = e.clientX;
      startY = e.clientY;
      startW = el.offsetWidth;
      startH = el.offsetHeight;
    });

    handle.addEventListener('pointermove', e => {
      if (!resizing) return;
      e.stopPropagation();
      const stageRect = stage.getBoundingClientRect();
      const maxSize = Math.min(stageRect.width, stageRect.height) * 0.9;
      const delta = Math.max(e.clientX - startX, e.clientY - startY);
      let newSize = Math.max(MIN_SIZE, Math.min(maxSize, startW + delta));
      el.style.width = newSize + 'px';
      el.style.height = newSize + 'px';
    });

    function stopResize(e){
      resizing = false;
      try { if (e && e.pointerId != null) handle.releasePointerCapture(e.pointerId); } catch(err){}
    }
    handle.addEventListener('pointerup', stopResize);
    handle.addEventListener('pointercancel', stopResize);
    handle.addEventListener('lostpointercapture', stopResize);
  }

  cleanToggle.addEventListener('change', () => {
    // Sustabdome bet kokią "užstrigusią" tempimo/dydžio keitimo būseną,
    // kad varnelės paspaudimas niekada nepaliktų puslapio "pakibusio".
    dragging = false;
    resizing = false;

    const el = document.getElementById('viz-logo-el');
    if (cleanToggle.checked){
      logoTool.classList.add('disabled');
      if (el) el.style.display = 'none';
    } else {
      logoTool.classList.remove('disabled');
      if (el && logoDataUrl) el.style.display = 'block';
    }
  });

  window.isCleanOrder = () => cleanToggle.checked;
  window.hasLogoPlaced = () => !!logoDataUrl && !cleanToggle.checked;
  window.getLogoZone = () => 'custom';
}
