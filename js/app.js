(async function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var res = await Promise.all([CosmoData.getConfig(), CosmoData.getCategories(), CosmoData.getProducts()]);
  var config = res[0], categories = res[1], products = res[2];

  /* ---------- Utilidades ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var money = new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: config.currency || 'MXN', maximumFractionDigits: 0
  });
  function priceText(cat, p) {
    var own = p && p.price != null;
    return (own ? '' : (cat.pricePrefix || '')) + money.format(own ? p.price : cat.price);
  }
  // Proporción de una imagen: la del producto, si no la de la categoría, si no 2:3 (vertical)
  function ratioOf(cat, p) {
    var css = (p && p.ratio) || cat.ratio || '2 / 3';
    var parts = css.split('/');
    var num = parseFloat(parts[0]) / (parseFloat(parts[1]) || 1);
    return { css: css, num: num > 0 ? num : 2 / 3 };
  }
  var channel = config.orderChannel === 'facebook' ? 'Facebook' : 'WhatsApp';
  function orderUrl(msg) {
    return channel === 'WhatsApp'
      ? config.whatsappUrl + '?text=' + encodeURIComponent(msg)
      : config.facebookUrl;
  }

  /* ---------- Botones de pedido generales ---------- */
  document.querySelectorAll('[data-order]').forEach(function (a) {
    a.href = orderUrl(a.dataset.msg || 'Hola, quiero hacer un pedido en Cosmo Lab.');
    a.textContent = (a.dataset.label || 'Pedir') + ' por ' + channel;
  });

  /* ---------- Contacto y "pronto" ---------- */
  var arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  var contacts = [
    { name: 'WhatsApp', value: config.whatsappLabel, url: config.whatsappUrl },
    { name: 'Instagram', value: config.instagramLabel, url: config.instagramUrl },
    { name: 'Facebook', value: 'Cosmo Lab', url: config.facebookUrl },
    { name: 'Ubicación', value: 'Ver en Google Maps', url: config.mapsUrl }
  ].filter(function (c) { return c.url; });
  $('#contactList').innerHTML = contacts.map(function (c) {
    return '<li><a class="contact__row" href="' + esc(c.url) + '" target="_blank" rel="noopener">' +
      '<span class="contact__name">' + esc(c.name) + '</span>' +
      '<span class="contact__value">' + esc(c.value) + '</span>' + arrow + '</a></li>';
  }).join('');

  $('#soonList').innerHTML = (config.comingSoon || []).map(function (t) {
    return '<li>' + esc(t) + '</li>';
  }).join('');

  /* ---------- Vista ampliada ---------- */
  var viewer = $('#viewer');
  function openViewer(cat, p) {
    $('#viewerImg').src = p.image;
    $('#viewerImg').alt = p.title;
    $('#viewerImg').style.aspectRatio = ratioOf(cat, p).css;
    $('#viewerCat').textContent = cat.fullName;
    $('#viewerName').textContent = p.title;
    $('#viewerPrice').textContent = priceText(cat, p) + (cat.spec ? ' · ' + cat.spec.value : '');
    var link = $('#viewerLink');
    link.href = orderUrl('Hola, me interesa: ' + p.title + ' (' + cat.fullName + ').');
    link.textContent = 'Pedir por ' + channel;
    if (typeof viewer.showModal === 'function') viewer.showModal(); else viewer.setAttribute('open', '');
  }
  $('#viewerClose').addEventListener('click', function () { viewer.close(); });
  viewer.addEventListener('click', function (e) { if (e.target === viewer) viewer.close(); });

  /* ---------- Carrusel (uno por categoría) ---------- */
  function createCarousel(root, cat, items) {
    var stage = $('.stage', root), track = $('.stage__track', root), dotsBox = $('.dots', root);
    var counter = $('.counter', root);
    var n = items.length, half = Math.floor(n / 2), cur = 0;
    var cards = [], dots = [], timer = null, paused = false, startX = null, suppress = false;

    items.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'card'; b.setAttribute('aria-label', p.title);
      b.style.setProperty('--r', ratioOf(cat, p).num);
      var img = new Image();
      img.loading = 'lazy'; img.decoding = 'async'; img.draggable = false;
      img.src = p.image; img.alt = p.title;
      img.style.objectPosition = p.focus || '50% 50%';
      b.append(img);
      b.addEventListener('click', function () {
        if (suppress) return;
        if (i === cur) openViewer(cat, p); else { stop(); go(i); }
      });
      track.append(b); cards.push(b);

      var d = document.createElement('button');
      d.type = 'button'; d.className = 'dot'; d.setAttribute('aria-label', p.title);
      d.addEventListener('click', function () { stop(); go(i); });
      dotsBox.append(d); dots.push(d);
    });

    function layout() {
      cards.forEach(function (c, i) {
        var o = ((i - cur + n + half) % n) - half;
        c.style.setProperty('--o', o);
        c.style.setProperty('--a', Math.abs(o));
        var active = o === 0;
        c.classList.toggle('is-active', active);
        c.tabIndex = active ? 0 : -1;
        c.setAttribute('aria-hidden', Math.abs(o) > 2 ? 'true' : 'false');
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === cur); });
      if (counter) counter.textContent = (cur + 1) + ' / ' + n;
      // Precarga las imágenes cercanas para que no aparezcan en blanco al avanzar
      for (var k = -3; k <= 3; k++) {
        var near = cards[(((cur + k) % n) + n) % n].firstChild;
        if (near.loading !== 'eager') near.loading = 'eager';
      }
      $('.carousel__name', root).textContent = items[cur].title;
      $('.carousel__price', root).textContent = priceText(cat, items[cur]);
      var link = $('.carousel__order', root);
      link.href = orderUrl('Hola, me interesa: ' + items[cur].title + ' (' + cat.fullName + ').');
      link.textContent = 'Pedir por ' + channel;
    }
    function go(i) { cur = (i + n) % n; layout(); }

    if (n > 10) { dotsBox.hidden = true; counter.hidden = false; } else { counter = null; }
    if (n < 2) {
      $('.stage__btn--prev', root).hidden = true;
      $('.stage__btn--next', root).hidden = true;
      dotsBox.hidden = true;
    }
    $('.stage__btn--prev', root).addEventListener('click', function () { stop(); go(cur - 1); });
    $('.stage__btn--next', root).addEventListener('click', function () { stop(); go(cur + 1); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { stop(); go(cur - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { stop(); go(cur + 1); e.preventDefault(); }
    });

    // Deslizar con el dedo o arrastrar con el mouse
    stage.addEventListener('pointerdown', function (e) { startX = e.clientX; suppress = false; });
    stage.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) > 40) {
        suppress = true; stop();
        go(dx < 0 ? cur + 1 : cur - 1);
        setTimeout(function () { suppress = false; }, 60);
      }
    });
    stage.addEventListener('pointercancel', function () { startX = null; });

    // Avance automático: se detiene en cuanto la persona interactúa
    var autoOn = false;
    function tick() { if (!paused) go(cur + 1); }
    function start() {
      if (reduceMotion || n < 2 || timer) return;
      autoOn = true; timer = setInterval(tick, 5000);
    }
    function stop() { autoOn = false; if (timer) { clearInterval(timer); timer = null; } }
    root.addEventListener('pointerenter', function () { paused = true; });
    root.addEventListener('pointerleave', function () { paused = false; });
    root.addEventListener('focusin', function () { paused = true; });
    root.addEventListener('focusout', function () { paused = false; });

    layout();
    return {
      show: function () {
        stage.classList.remove('is-ready');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { stage.classList.add('is-ready'); });
        });
        start();
      },
      hide: function () { stop(); }
    };
  }

  /* ---------- Pestañas y paneles ---------- */
  var tabsBox = $('#tabs'), panelsBox = $('#panels');
  var tabEls = [], panelEls = [], instances = {};

  var check = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  categories.forEach(function (cat) {
    var items = products.filter(function (p) { return p.category === cat.id; });

    // Pestaña
    var tab = document.createElement('button');
    tab.type = 'button'; tab.className = 'tab'; tab.id = 'tab-' + cat.id;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', 'panel-' + cat.id);
    tab.setAttribute('aria-selected', 'false');
    tab.tabIndex = -1;
    tab.innerHTML = '<span class="tab__name">' + esc(cat.name) + '</span><span class="tab__price">' + esc(priceText(cat)) + '</span>';
    tab.addEventListener('click', function () { select(cat.id); });
    tabsBox.append(tab); tabEls.push(tab);

    // Panel
    var panel = document.createElement('div');
    panel.className = 'panel'; panel.id = 'panel-' + cat.id; panel.hidden = true;
    panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', 'tab-' + cat.id);

    var html = '';
    if (items.length) {
      var gid = 'ring-' + cat.id;
      html +=
        '<div class="carousel" aria-roledescription="carrusel" aria-label="' + esc(cat.fullName) + '">' +
          '<div class="stage">' +
            '<svg class="ring ring--back" viewBox="0 0 1200 300" aria-hidden="true" focusable="false">' +
              '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">' +
                '<stop offset="0" stop-color="#22D3EE" stop-opacity="0"/><stop offset=".18" stop-color="#22D3EE"/>' +
                '<stop offset=".5" stop-color="#3B82F6"/><stop offset=".82" stop-color="#A855F7"/>' +
                '<stop offset="1" stop-color="#E879F9" stop-opacity="0"/></linearGradient></defs>' +
              '<path d="M20 150 A580 95 0 0 1 1180 150" fill="none" stroke="url(#' + gid + ')" stroke-width="3" stroke-linecap="round"/>' +
            '</svg>' +
            '<div class="stage__track" role="group"></div>' +
            '<svg class="ring ring--front" viewBox="0 0 1200 300" aria-hidden="true" focusable="false">' +
              '<path d="M20 150 A580 95 0 0 0 1180 150" fill="none" stroke="url(#' + gid + ')" stroke-width="4" stroke-linecap="round"/>' +
            '</svg>' +
            '<button class="stage__btn stage__btn--prev" type="button" aria-label="Anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
            '<button class="stage__btn stage__btn--next" type="button" aria-label="Siguiente"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
          '</div>' +
          '<div class="carousel__caption" aria-live="polite">' +
            '<div class="carousel__meta"><span class="carousel__name"></span><span class="carousel__price"></span></div>' +
            '<a class="btn btn--primary carousel__order" href="#" target="_blank" rel="noopener">Pedir</a>' +
          '</div>' +
          '<div class="dots" role="group" aria-label="Elegir producto"></div>' +
          '<p class="counter" aria-hidden="true" hidden></p>' +
        '</div>';
    } else {
      html += '<div class="wrap"><p class="empty">Estamos preparando los diseños de esta categoría. Pronto los verás aquí.</p></div>';
    }

    // Información de la categoría
    html += '<div class="wrap info"><div class="info__main">' +
      '<h2 class="info__title">' + esc(cat.fullName) + '</h2>' +
      '<p class="info__tagline">' + esc(cat.tagline || '') + '</p>' +
      '<div class="spec">' +
        (cat.spec ? '<div class="spec__item"><span class="spec__label">' + esc(cat.spec.label) + '</span><span class="spec__value">' + esc(cat.spec.value) + '</span></div><span class="spec__divider" aria-hidden="true"></span>' : '') +
        '<div class="spec__item"><span class="spec__label">' + esc(cat.priceLabel || 'Precio') + '</span><span class="spec__value spec__value--price">' + esc(priceText(cat)) + '</span></div>' +
      '</div>' +
      '<a class="btn btn--primary" href="' + esc(orderUrl('Hola, quiero información de: ' + cat.fullName + '.')) + '" target="_blank" rel="noopener">Pedir por ' + channel + '</a>' +
      '</div><div class="info__side">';

    if (cat.priceTable) {
      html += cat.priceTable.map(function (g) {
        return '<div class="ptable"><h3>' + esc(g.group) + '</h3><p class="ptable__note">' + esc(g.note || '') + '</p><ul>' +
          g.rows.map(function (r) {
            return '<li><span>' + esc(r.label) + '</span><span class="ptable__price">' + money.format(r.price) + '</span></li>';
          }).join('') + '</ul></div>';
      }).join('');
    }
    if (cat.features && cat.features.length) {
      html += '<h3>Características</h3><ul class="checks">' +
        cat.features.map(function (f) { return '<li>' + check + '<span>' + esc(f) + '</span></li>'; }).join('') + '</ul>';
    }
    if (cat.includes && cat.includes.length) {
      html += '<h3>Incluye</h3><ul class="checks">' +
        cat.includes.map(function (f) { return '<li>' + check + '<span>' + esc(f) + '</span></li>'; }).join('') + '</ul>';
    }
    (cat.sections || []).forEach(function (sec) {
      html += '<h3>' + esc(sec.title) + '</h3>';
      if (sec.text) html += '<p class="info__text">' + esc(sec.text) + '</p>';
      if (sec.items) html += '<ul class="checks">' + sec.items.map(function (f) { return '<li>' + check + '<span>' + esc(f) + '</span></li>'; }).join('') + '</ul>';
    });
    html += '</div></div>';

    // Catálogo en cuadrícula (solo si hay más de un producto)
    if (items.length > 1) {
      html += '<div class="wrap gridwrap"><h3 class="gridwrap__title">Todo el catálogo</h3><p class="gridwrap__hint">Toca un diseño para verlo más grande.</p><ul class="grid">' +
        items.map(function (p, i) {
          return '<li class="tile"><button class="tile__media" type="button" data-i="' + i + '" style="aspect-ratio:' + ratioOf(cat, p).css + '" aria-label="Ver ' + esc(p.title) + ' más grande">' +
            '<img loading="lazy" decoding="async" alt="' + esc(p.title) + '" src="' + esc(p.image) + '" style="object-position:' + esc(p.focus || '50% 50%') + '"></button>' +
            '<div class="tile__info"><span class="tile__name">' + esc(p.title) + '</span><span class="tile__price">' + esc(priceText(cat, p)) + '</span></div>' +
            '<a class="tile__order" href="' + esc(orderUrl('Hola, me interesa: ' + p.title + ' (' + cat.fullName + ').')) + '" target="_blank" rel="noopener">Pedir por ' + channel + '</a></li>';
        }).join('') + '</ul></div>';
    }

    panel.innerHTML = html;
    panelsBox.append(panel); panelEls.push(panel);

    panel.querySelectorAll('.tile__media').forEach(function (b) {
      b.addEventListener('click', function () { openViewer(cat, items[+b.dataset.i]); });
    });
    if (items.length) instances[cat.id] = createCarousel($('.carousel', panel), cat, items);
  });

  var activeId = null;
  function select(id, focusTab) {
    if (!categories.some(function (c) { return c.id === id; })) id = categories[0].id;
    if (id === activeId) return;
    if (activeId && instances[activeId]) instances[activeId].hide();
    categories.forEach(function (c, i) {
      var on = c.id === id;
      tabEls[i].setAttribute('aria-selected', on ? 'true' : 'false');
      tabEls[i].tabIndex = on ? 0 : -1;
      panelEls[i].hidden = !on;
      if (on && focusTab) tabEls[i].focus();
    });
    activeId = id;
    var at = tabEls[categories.findIndex(function (c) { return c.id === id; })];
    if (tabsBox.scrollWidth > tabsBox.clientWidth) {
      tabsBox.scrollTo({ left: at.offsetLeft - (tabsBox.clientWidth - at.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    if (instances[id]) instances[id].show();
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  }

  tabsBox.addEventListener('keydown', function (e) {
    var idx = tabEls.indexOf(document.activeElement), len = categories.length, t = null;
    if (idx < 0) return;
    if (e.key === 'ArrowRight') t = (idx + 1) % len;
    if (e.key === 'ArrowLeft') t = (idx - 1 + len) % len;
    if (e.key === 'Home') t = 0;
    if (e.key === 'End') t = len - 1;
    if (t !== null) { e.preventDefault(); select(categories[t].id, true); }
  });

  window.addEventListener('hashchange', function () {
    var id = location.hash.slice(1);
    if (categories.some(function (c) { return c.id === id; })) select(id);
  });

  select(location.hash.slice(1));
})();
