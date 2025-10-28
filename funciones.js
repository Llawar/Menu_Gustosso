(function(){
  const modal = document.getElementById('dish-modal');
  const dialog = modal?.querySelector('.modal-dialog');
  const titleEl = modal?.querySelector('.modal-title');
  const imgEl = modal?.querySelector('.modal-image');
  const ingEl = modal?.querySelector('.modal-ingredients');
  const stepsEl = modal?.querySelector('.modal-steps');
  const closeEls = modal?.querySelectorAll('[data-close]');
  let lastFocused = null;
  let previousBodyOverflow = null;

  const DATA = {
    'Vaporella Saludable': {
      ingredients: [
        'carne molida de res',
        '1 taza de brócoli en floretes',
        '1 zanahoria en rodajas finas',
        '1 vainitas picadas',
        'Sal, pimienta y un chorrito de limón',
      ],
      steps: [
        'Coloca agua en la vaporera y caliéntala.',
        'Salpimenta la carne y colócalo junto con las verduras en la canasta.',
        'Cocina al vapor 8–12 minutos hasta que esté tierno.',
        'Termina con jugo de limón y un hilo de aceite.',
      ],
    },
    'Refresco de Sandia': {
      ingredients: [
        '4 tazas de sandía sin semillas',
        '2 tazas de agua fría',
        'Jugo de 1 limón',
        'Azúcar o miel al gusto',
        'Hielo y hojas de menta (opcional)'
      ],
      steps: [
        'Licúa la sandía con el agua.',
        'Agrega el jugo de limón y endulza al gusto.',
        'Cuela si prefieres una textura más fina.',
        'Sirve con hielo y menta.',
      ],
    },
    'Onigiri': {
      ingredients: [
        '2 tazas de arroz cocido',
        'Sal al gusto',
        'Relleno: huevo con palta',
      ],
      steps: [
        'Humedece tus manos y espolvorea un poco de sal.',
        'Toma arroz, coloca el relleno al centro y forma un triángulo.',
        'Corta en rebanadas finas y sirve.',
        'Disfruta!',
      ],
    },
    'Papas Crocantes': {
      ingredients: [
        '4 papas medianas',
        'chorizo parrillero en trozos, para mas placer',
        '2–3 cucharaditas de aceite',
        '1 cucharadita de sal y 1/2 cucharaditas de pimentón',
        'Ajo en polvo y pimienta al gusto',
      ],
      steps: [
        'Corta las papas en gajos o cubos y enjuágalas.',
        'Sécalas, mezcla con aceite y especias.',
        'incorpora el chorizo parrillero en trozos.',
        'Hornea a 220°C por 25–35 min hasta dorar, volteando a mitad.',
      ],
    },
    'Espagueti ala Boloñesa': {
      ingredients: [
        '300 g de espagueti',
        '300 g de carne molida',
        '1 lata de tomate triturado',
        '1/2 cebolla y 1 diente de ajo',
        'Aceite, sal y pimienta',
      ],
      steps: [
        'Sofríe cebolla y ajo en aceite, añade la carne y dora.',
        'Agrega tomate, salpimenta y cocina 15–20 min.',
        'Cuece el espagueti al dente y mezcla con la salsa.',
      ],
    },
    'Refresco de Jamaica': {
      ingredients: [
        '1 taza de flores de jamaica secas',
        '6 tazas de agua',
        'Azúcar al gusto',
        'Rodajas de naranja (opcional)'
      ],
      steps: [
        'Hierve 3 tazas de agua, añade la jamaica y reposa 10 min.',
        'Cuela, agrega el resto del agua fría y endulza al gusto.',
        'Sirve con hielo; puedes añadir naranja.',
      ],
    },
    'Pizza de Sandia': {
      ingredients: [
        '1 rueda gruesa de sandía',
        'crema dulce',
        'Frutas en trozos (kiwi, frutilla, platano)',
        'cocos rallados'
      ],
      steps: [
        'corta la sandía en trozos',
        'coloca la sandía en un plato',
        'coloca la crema dulce en el plato',
        'coloca las frutas en el plato',
        'coloca los cocos rallados en el plato',
        'Sirve frío'
      ],
    },
  };

  function clearList(el){ while(el.firstChild) el.removeChild(el.firstChild); }

  function openModal({ name, imgSrc, imgAlt }){
    if(!modal) return;
    lastFocused = document.activeElement;
    modal.classList.remove('is-closing');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');

    // Lock body scroll
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    titleEl.textContent = name || '';
    imgEl.src = imgSrc || '';
    imgEl.alt = imgAlt || name || '';

    const data = DATA[name] || { ingredients: ['Información próximamente'], steps: ['Estamos preparando esta receta.'] };
    clearList(ingEl); clearList(stepsEl);
    data.ingredients.forEach(t=>{ const li=document.createElement('li'); li.textContent=t; ingEl.appendChild(li); });
    data.steps.forEach(t=>{ const li=document.createElement('li'); li.textContent=t; stepsEl.appendChild(li); });

    // Focus trap
    setTimeout(()=>{
      const focusable = dialog.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length-1];
      function trap(e){
        if(e.key !== 'Tab') return;
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
      dialog.addEventListener('keydown', trap);
      dialog.dataset.trap = 'true';
      (first||dialog).focus();
    }, 20);
  }

  function closeModal(){
    if(!modal || !modal.classList.contains('is-open')) return;
    modal.classList.add('is-closing');
    // wait for animation end
    const handler = ()=>{
      modal.classList.remove('is-open','is-closing');
      modal.setAttribute('aria-hidden','true');
      // Restore body scroll
      document.body.style.overflow = previousBodyOverflow || '';
      if(lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      dialog.removeEventListener('animationend', handler);
    };
    dialog.addEventListener('animationend', handler);
  }

  // Global listeners
  document.addEventListener('click', (e)=>{
    const card = e.target.closest('.dish-card');
    if(card){
      const name = card.querySelector('.dish-name')?.textContent?.trim();
      const img = card.querySelector('img');
      const imgSrc = img?.getAttribute('src');
      const imgAlt = img?.getAttribute('alt') || name;
      openModal({ name, imgSrc, imgAlt });
      return;
    }
    if(e.target.closest('[data-close]')){
      closeModal();
    }
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeModal();
  });

  // Prevent dialog clicks from closing when clicking inside content
  dialog?.addEventListener('click', (e)=>{
    if(e.target === dialog) e.stopPropagation();
  });
})();