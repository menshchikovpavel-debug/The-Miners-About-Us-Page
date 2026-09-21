/* The Miners — About us V2
   header · reveals · numbers two-state squeeze · timeline variants A/B/C */
(function () {
  'use strict';
  var D = window.MINERS, YEARS = D.years, N = YEARS.length;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var img = function (n) { return 'Assets/img/' + n + '.jpg'; };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var easeIO = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  // what CSS media queries and vw units see — innerWidth lies inside embedded views
  var vw = function () { return document.documentElement.clientWidth || innerWidth; };
  // matches the svh unit the sticky panels are sized in
  var vh = function () { return document.documentElement.clientHeight || innerHeight; };
  var narrow = function () { return vw() <= 760; };

  /* ---------------- header ---------------- */
  var hdr = $('#hdr'), burger = $('#burger'), mnav = $('#mnav'), menuOpen = false;
  function hdrState() { hdr.classList.toggle('is-solid', menuOpen || scrollY > 40); }
  burger.addEventListener('click', function () {
    menuOpen = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(menuOpen));
    mnav.hidden = !menuOpen;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    hdrState();
  });
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) burger.click(); });

  /* ---------------- reveal ---------------- */
  var pending = [];
  function collectReveals() {
    pending = [].slice.call(document.querySelectorAll('.up:not(.in)'));
    if (reduce) { pending.forEach(function (el) { el.classList.add('in'); }); pending = []; return; }
    pending.forEach(function (el) {
      var inner = el.firstElementChild;
      if (!inner || el.dataset.d) return;
      var i = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
      inner.style.transitionDelay = (i % 5) * 70 + 'ms';
      el.dataset.d = '1';
    });
  }
  function revealFrame() {
    if (!pending.length) return;
    var H = vh(), keep = [];
    for (var i = 0; i < pending.length; i++) {
      var el = pending[i], r = el.getBoundingClientRect();
      if (r.top < H * .93 && r.bottom > -H * .2) el.classList.add('in'); else keep.push(el);
    }
    pending = keep;
  }

  /* ---------------- awards · quotes · collab logos ---------------- */
  $('#awardsList').innerHTML = D.awards.map(function (a) {
    var badge = '<div class="awards__badge"><img src="Assets/marks/' + a.mark + '.svg" alt="" loading="lazy"></div>';
    return '<li class="up"><i>' + badge + '<h3>' + a.t1 + '<br>' + a.t2 + '</h3>' +
      '<p' + (a.ph ? ' class="ph"' : '') + '>' + a.d + '</p></i></li>';
  }).join('');

  $('#pressList').innerHTML = D.press.map(function (p) {
    var mark = '<span class="quotes__m" aria-hidden="true">“</span>';
    var logo = '<img src="Assets/marks/' + p.mark + '.svg" alt="' + p.outlet + '" loading="lazy">';
    var src = p.url ? '<a href="' + p.url + '" target="_blank" rel="noopener">' + logo + '</a>' : logo;
    return '<li class="up"><i>' + mark + '<blockquote>“' + p.quote + '”</blockquote>' +
      '<div class="quotes__src">' + src + '</div></i></li>';
  }).join('');

  $('#logoGrid').innerHTML = D.collabs.map(function (c) {
    return '<li><img src="Assets/logos/' + c + '.png" alt="" loading="lazy"></li>';
  }).join('');

  /* ============================================================
     numbers — the blue panel is pinned to the top and squeezed
     by the section underneath, which always rides 40 px over it
     ============================================================ */
  var nums = $('#nums'), numsPanel = $('#numsPanel'), numsRow = $('#numsRow');
  var cols = [].slice.call(numsRow.children);
  var nEls = cols.map(function (c) { return c.querySelector('.nums__n'); });
  var lEls = cols.map(function (c) { return c.querySelector('.nums__l'); });
  var autoContent = [], counted = false, countStart = 0;
  function hdrH() { return hdr.getBoundingClientRect().height || 92; }
  function minH() { return hdrH() + (narrow() ? 250 : 190); }

  var numRatio = [], labRatio = [], labMin = [];
  function numsSizes() {
    var w = vw();
    return {
      lb1: clamp(w * .0119, 12, 18), lb2: clamp(w * .0105, 11, 15),
      pd1: w > 760 ? 46 : 12, pd2: w > 760 ? 20 : 8,
      fsMax: clamp(w * .127, 56, 192), fs2: clamp(w * .048, 30, 72)
    };
  }
  // measure every string once at 100 px so the type can be fitted to the row later
  function measureNums() {
    numsRow.style.setProperty('--num-fs', '100px');
    numsRow.style.setProperty('--lab-fs', '100px');
    cols.forEach(function (c) { c.style.width = 'auto'; c.style.flex = '0 0 auto'; c.style.paddingInline = '0'; });
    numRatio = nEls.map(function (e) { return e.getBoundingClientRect().width / 100; });
    labRatio = lEls.map(function (e) {
      e.style.width = 'max-content'; var r = e.getBoundingClientRect().width / 100; e.style.width = ''; return r;
    });
    labMin = lEls.map(function (e) {
      e.style.width = 'min-content'; var r = e.getBoundingClientRect().width / 100; e.style.width = ''; return r;
    });
  }
  var countDone = false;
  function finalNums() {
    countDone = true;
    nEls.forEach(function (el) {
      var f = el.dataset.count + (el.dataset.suffix || '');
      if (el.textContent !== f) el.textContent = f;
    });
  }
  function countUp() {
    if (counted || reduce) { if (reduce) finalNums(); return; }
    counted = true; countStart = performance.now();
    setTimeout(finalNums, 1250);            // rAF can stall in embedded views
    nEls.forEach(function (el) {
      var t = parseFloat(el.dataset.count), suf = el.dataset.suffix || '';
      var dec = (String(t).split('.')[1] || '').length, t0 = performance.now();
      (function step(now) {
        if (countDone) return;
        var p = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - p, 3);
        el.textContent = (t * e).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(step); else countDone = true;
      })(t0);
    });
  }
  function numsFrame() {
    var H = vh(), MINH = minH();
    // the panel is pinned to the top and its height is whatever is left of the
    // section — so the white block below squeezes it, with no dwell either side
    var d = Math.max(0, -nums.getBoundingClientRect().top);
    var h = clamp(H - d, MINH, H);
    numsPanel.style.height = h + 'px';
    var k = clamp((H - h) / Math.max(1, H - MINH), 0, 1);
    var hd = hdrH();        // 0 tall · 1 compact
    if (nums.getBoundingClientRect().top < H * .8) countUp();
    if (counted && performance.now() - countStart > 1250) finalNums();

    var s = numsSizes();
    var rowCS = getComputedStyle(numsRow);
    var total = numsRow.clientWidth - parseFloat(rowCS.paddingLeft) - parseFloat(rowCS.paddingRight);
    if (!(total > 0) || !numRatio.length) return;
    var sumR = numRatio.reduce(function (a, b) { return a + b; }, 0);

    /* ---- phone: one figure per row, label right-aligned beside it.
       State 1 spreads four huge figures down the panel, state 2 packs
       them small and tight at the top. ---- */
    if (narrow()) {
      // Display 144 is the size in the frame. The only thing that may push it
      // down is a label that cannot wrap any narrower than its longest word.
      var gapX = 14, fitM = Infinity;
      numRatio.forEach(function (r, i) {
        fitM = Math.min(fitM, (total - (labMin[i] || 0) * 16 - gapX) / Math.max(.001, r));
      });
      var big = Math.min(144, fitM);
      var fsM = lerp(big, Math.min(big, 56), k);
      numsRow.style.setProperty('--num-fs', fsM + 'px');
      numsRow.style.setProperty('--lab-fs', lerp(16, 14, k) + 'px');
      numsRow.style.setProperty('--num-pad', '0px');
      cols.forEach(function (c) {
        c.style.width = ''; c.style.paddingInline = ''; c.style.paddingTop = '';
        c.style.paddingBottom = '';
      });
      nEls.forEach(function (e) { e.style.marginBottom = ''; e.style.marginLeft = ''; });
      lEls.forEach(function (e) { e.style.marginLeft = ''; });
      var rows = cols.reduce(function (a, c) { return a + c.getBoundingClientRect().height; }, 0);
      var top = hd + lerp(24, 14, k), bot = lerp(24, 14, k);
      var free = h - top - bot - rows;
      numsRow.style.paddingTop = top + 'px';
      numsRow.style.rowGap = Math.max(6, lerp(Math.max(0, free / 3), 10, k)) + 'px';
      return;
    }
    numsRow.style.paddingTop = '';
    numsRow.style.rowGap = '';

    var per = 4;
    var pd = lerp(s.pd1, s.pd2, k);
    var slack = total * .07;
    var fit = (total - per * 2 * s.pd1 - slack) / Math.max(.001, sumR);
    var fs = lerp(Math.min(s.fsMax, fit), s.fs2, k);
    var lb = lerp(s.lb1, s.lb2, k);
    numsRow.style.setProperty('--num-fs', fs + 'px');
    numsRow.style.setProperty('--lab-fs', lb + 'px');
    numsRow.style.setProperty('--num-pad', pd + 'px');

    var autoW = numRatio.map(function (r, i) { return Math.max(r * fs, labRatio[i] * lb) + 2 * pd; });
    var sumAuto = autoW.reduce(function (a, b) { return a + b; }, 0);
    var extra = (total - sumAuto) / per, eq = total / per;
    var numH = nEls[0].getBoundingClientRect().height, labH = lEls[0].getBoundingClientRect().height;
    var hEff = h, hdOff = hd;                          // clear the fixed header
    var pt1 = hdOff + 60;
    var ptC = hdOff + Math.max(0, (hEff - hdOff - numH - labH - 8) / 2);
    var pt = lerp(pt1, ptC, k);
    var pb1 = 60;
    var gap = lerp(Math.max(0, hEff - pt1 - pb1 - numH - labH), 8, k);

    cols.forEach(function (c, i) {
      var w = lerp(autoW[i] + extra, eq, k);
      c.style.width = w + 'px';
      c.style.paddingInline = pd + 'px';
      c.style.paddingTop = pt + 'px';
      c.style.paddingBottom = '0px';
      nEls[i].style.marginBottom = gap + 'px';
      var iw = nEls[i].getBoundingClientRect().width, lw = lEls[i].getBoundingClientRect().width;
      nEls[i].style.marginLeft = lerp(0, Math.max(0, (w - 2 * pd - iw) / 2), k) + 'px';
      lEls[i].style.marginLeft = lerp(0, Math.max(0, (w - 2 * pd - lw) / 2), k) + 'px';
    });
    numsRow.style.setProperty('--div-top', lerp(hdOff + 26, hdOff + Math.max(10, (hEff - hdOff - numH - labH) / 2 - 6), k) + 'px');
    numsRow.style.setProperty('--div-bot', lerp(36, Math.max(10, (hEff - hdOff - numH - labH) / 2 - 6), k) + 'px');
  }

  /* ============================================================
     variant A — the frame stays put, the cards slide inside it
     ============================================================ */
  var drum = $('#drum'), track = $('#drumTrack'), frame = $('.drum__frame');
  track.innerHTML = YEARS.map(function (y) {
    return '<article class="dcard">' +
      '<div class="dcard__top"><h3 class="dcard__t">' + y.title + '</h3><span class="dcard__y">Year ' + y.year + '</span></div>' +
      '<img class="dcard__pic" src="' + img(y.photos[0]) + '" alt="" loading="lazy">' +
      '<div class="dcard__cols"><p>' + y.paras[0] + '</p><p>' + y.paras[1] + '</p></div>' +
      '</article>';
  }).join('');
  var dcards = [].slice.call(track.children), dG = { w: 0, step: 0, h: 0 };
  function drumGeo() {
    var cs = getComputedStyle(frame);
    var inner = frame.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var h = frame.clientHeight;
    var gap = narrow() ? 14 : 30, per = narrow() ? 1 : 2;
    var w = (inner - gap * (per - 1)) / per;
    dG = { w: w, step: w + gap, h: h };
    dcards.forEach(function (c) { c.style.width = w + 'px'; });
    drum.style.height = (vh() + Math.max(1, N - per) * vh() * .85) + 'px';
  }
  // the whole rank keeps a constant step, so the 30 px gap never closes.
  // only the vertical drop and the fade mark a card as leaving or arriving.
  function drumFrame() {
    var r = drum.getBoundingClientRect(), runway = r.height - vh();
    if (runway <= 0) return;
    var p = clamp(-r.top / runway, 0, 1);
    var per = narrow() ? 1 : 2, steps = Math.max(1, N - per);
    var cur = p * steps;
    dcards.forEach(function (c, i) {
      var t = i - cur;
      if (t < -1.15 || t > per + 1.15) { c.style.visibility = 'hidden'; return; }
      var x = t * dG.step, y = 0, o = 1;
      if (t < 0) { var f = easeIO(clamp(-t, 0, 1)); y = dG.h * .55 * f; o = 1 - f; }
      else if (t > per - 1) { var g = easeIO(clamp(t - (per - 1), 0, 1)); y = dG.h * .55 * g; o = 1 - g; }
      c.style.visibility = 'visible';
      c.style.opacity = o.toFixed(3);
      c.style.zIndex = String(Math.round(60 - t * 4));
      c.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    });
  }

  /* ============================================================
     variant B — big year
     ============================================================ */
  var bigy = $('#bigy'), byYear = $('#byYear'), byPh = $('#byPh');
  var byTitle = $('#byTitle'), byC1 = $('#byC1'), byC2 = $('#byC2');
  var byIdx = -1, prevIdx = 0, reels = [], byLabel, STEP = 100 / 20;

  // where the photos land, per year — deliberately different each time
  // positions are % of the 1176 × 548 stage — deliberately different each year
  var SPOTS = [
    [{ l: -9, t: 2, w: 25, r: -8 }, { l: 84, t: 50, w: 25, r: 4 }],
    [{ l: -11, t: 46, w: 24, r: 6 }, { l: 87, t: -4, w: 26, r: -5 }],
    [{ l: -5, t: 52, w: 23, r: -9 }, { l: 85, t: 0, w: 24, r: 5 }],
    [{ l: -10, t: 0, w: 25, r: 7 }, { l: 83, t: 48, w: 24, r: -6 }],
    [{ l: -3, t: -2, w: 23, r: -5 }, { l: 86, t: 44, w: 25, r: 8 }],
    [{ l: -9, t: 50, w: 25, r: -6 }, { l: 84, t: -2, w: 23, r: 6 }],
    [{ l: -7, t: 0, w: 24, r: 5 }, { l: 82, t: 50, w: 25, r: -8 }],
    [{ l: -11, t: 40, w: 23, r: -4 }, { l: 86, t: -4, w: 26, r: 6 }]
  ];

  // phone: the stage is narrow, so the photos get their own set of spots —
  // always inside 0…100 % of the stage and roughly twice the area
  var SPOTS_M = [
    [{ l: 0, t: 4, w: 46, r: -5 }, { l: 54, b: 2, w: 46, r: 4 }],
    [{ l: 2, t: 6, w: 44, r: 5 }, { l: 54, b: 4, w: 46, r: -4 }],
    [{ l: 0, t: 5, w: 46, r: -6 }, { l: 56, b: 1, w: 44, r: 3 }],
    [{ l: 3, t: 7, w: 44, r: 4 }, { l: 53, b: 3, w: 47, r: -5 }],
    [{ l: 0, t: 3, w: 47, r: -4 }, { l: 55, b: 2, w: 45, r: 5 }],
    [{ l: 2, t: 6, w: 46, r: -5 }, { l: 54, b: 0, w: 44, r: 4 }],
    [{ l: 0, t: 5, w: 45, r: 4 }, { l: 55, b: 4, w: 45, r: -5 }],
    [{ l: 3, t: 4, w: 44, r: -3 }, { l: 53, b: 1, w: 47, r: 5 }]
  ];

  (function buildBigY() {
    byLabel = document.createElement('span'); byLabel.className = 'sr';
    byYear.innerHTML = String(YEARS[0].year).split('').map(function () {
      var it = ''; for (var d = 0; d < 20; d++) it += '<em>' + (d % 10) + '</em>';
      return '<span class="reel"><u>' + it + '</u></span>';
    }).join('');
    byYear.setAttribute('aria-hidden', 'true');
    byYear.parentElement.appendChild(byLabel);
    reels = [].slice.call(byYear.querySelectorAll('u')).map(function (u, i) {
      u.style.transitionDelay = (i * 70) + 'ms';
      return { u: u, pos: 0, d: 0 };
    });
  })();
  function snapReel(r, pos) {
    var keep = r.u.style.transitionDelay;
    r.u.style.transition = 'none';
    r.u.style.transform = 'translateY(' + (-pos * STEP) + '%)';
    void r.u.offsetHeight;
    r.u.style.transition = ''; r.u.style.transitionDelay = keep; r.pos = pos;
  }
  function setYear(year, dir) {
    String(year).split('').forEach(function (ch, i) {
      var r = reels[i], d = +ch, base = r.pos % 10;
      if (r.d === d && base === d) return;
      if (r.pos !== base) snapReel(r, base);
      var to;
      if (dir >= 0) to = d > base ? d : d + 10;
      else if (d < base) to = d;
      else { snapReel(r, base + 10); to = d; }
      r.pos = to; r.d = d;
      r.u.style.transform = 'translateY(' + (-to * STEP) + '%)';
    });
    byLabel.textContent = year;
  }
  var OUT = 420;                                   // the old content leaves first
  function swap(el, html, delay) {
    var fresh = document.createElement('div');
    fresh.className = 'sw';
    fresh.innerHTML = html;
    if (reduce) { el.replaceChildren(fresh); return; }
    // a fast scroll can stack these up — drop anything already on its way out
    [].slice.call(el.children).forEach(function (c) { if (c.classList.contains('ghost')) c.remove(); });
    var old = el.lastElementChild, wait = 0;
    if (old) {
      old.classList.add('ghost', 'swap-out');
      setTimeout(function () { if (old.parentNode) old.remove(); }, OUT + 80);
      wait = OUT;                                  // only then does the new one arrive
    }
    fresh.classList.add('swap-in');
    fresh.style.animationDelay = (wait + (delay || 0)) + 'ms';
    el.appendChild(fresh);
    setTimeout(function () { capLines(fresh); }, 0);   // reflow-heavy — never inside a scroll frame
  }

  function showYear(i) {
    if (i === byIdx) return;
    var y = YEARS[i], dir = i >= prevIdx ? 1 : -1;
    byIdx = i; prevIdx = i;
    setYear(y.year, dir);
    // old photos fade and slide up behind the year, new ones arrive after they have gone
    var spots = (narrow() ? SPOTS_M : SPOTS)[i % SPOTS.length];
    var gen = (byPh.dataset.gen = String((+byPh.dataset.gen || 0) + 1));
    [].slice.call(byPh.children).forEach(function (f) {
      if (f.dataset.out) { f.remove(); return; }   // already leaving from a previous swap
      f.dataset.out = '1';
      f.style.animation = 'none';
      f.style.opacity = '0';
      f.style.transform = 'translateY(-70px)';
      setTimeout(function () { if (f.parentNode) f.remove(); }, OUT + 60);
    });
    setTimeout(function () {
      if (byPh.dataset.gen !== gen) return;        // a newer year already took over
      spots.forEach(function (sp, k) {
        // a keyframe, not a rAF-driven transition: a frame that never runs
        // used to leave the photo parked 46 px low and invisible
        var fig = document.createElement('figure');
        var vert = sp.b === undefined ? 'top:' + sp.t + '%' : 'bottom:' + sp.b + '%';
        fig.style.cssText = 'left:' + sp.l + '%;' + vert + ';width:' + sp.w + '%;' +
          'aspect-ratio:4/3;animation-delay:' + (k * 90) + 'ms';
        fig.innerHTML = '<img style="transform:rotate(' + sp.r + 'deg)" src="' +
          img(y.photos[k]) + '" alt="" loading="lazy">';
        byPh.appendChild(fig);
      });
    }, reduce ? 0 : OUT);
    // title first, then the body columns and the rule together
    swap(byTitle, y.title, 0);
    swap(byC1, '<p>' + y.paras[0] + '</p>', 120);
    swap(byC2, '<p>' + y.paras[1] + '</p>', 200);
    [byC1, byC2].forEach(function (el, n) {
      el.classList.remove('on'); void el.offsetHeight;
      setTimeout(function () { el.classList.add('on'); }, OUT + 80 + n * 90);
    });
  }
  function bigyFrame() {
    var r = bigy.getBoundingClientRect(), runway = r.height - vh();
    if (runway <= 0) return;
    var p = clamp(-r.top / runway, 0, 1);
    showYear(clamp(Math.floor(p * N), 0, N - 1));
  }

  /* ============================================================
     variant C — scroll list with a live scrollbar
     ============================================================ */
  var tlist = $('#tlist'), tbar = $('#tlistBar'), thumb = $('#tlistThumb');
  (function buildList() {
    var html = '';
    YEARS.forEach(function (y, i) {
      html += '<div class="tlist__t" style="grid-row:' + (i + 1) + '"><h3>' + y.title + '</h3><b>' + y.year + '</b></div>' +
        '<div class="tlist__row up" style="grid-row:' + (i + 1) + '"><i>' +
        '<img src="' + img(y.photos[0]) + '" alt="" loading="lazy">' +
        '<div class="tx">' + y.paras.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' +
        '</i></div>';
    });
    tlist.style.gridTemplateRows = 'repeat(' + N + ', auto)';
    tlist.insertAdjacentHTML('beforeend', html);
  })();
  var tTitles = [].slice.call(tlist.querySelectorAll('.tlist__t'));
  var tRows = [].slice.call(tlist.querySelectorAll('.tlist__row'));
  function listRows() {
    var n = narrow();
    tTitles.forEach(function (t, i) { t.style.gridRow = String(n ? 2 * i + 1 : i + 1); });
    tRows.forEach(function (r, i) { r.style.gridRow = String(n ? 2 * i + 2 : i + 1); });
    tlist.style.gridTemplateRows = 'repeat(' + (n ? 2 * N : N) + ', auto)';
  }
  function listFrame() {
    var r = tlist.getBoundingClientRect(), line = vh() * .45;
    var p = clamp((line - r.top) / Math.max(1, r.height), 0, 1);
    thumb.style.top = (p * (tbar.clientHeight - thumb.offsetHeight)).toFixed(1) + 'px';
    tbar.setAttribute('aria-valuenow', Math.round(p * 100));
    var act = 0;
    tRows.forEach(function (row, i) { if (row.getBoundingClientRect().top <= line) act = i; });
    tTitles.forEach(function (t, i) { t.classList.toggle('on', i === act); });
  }
  (function dragBar() {
    var down = false;
    function jump(cy) {
      var b = tbar.getBoundingClientRect(), th = thumb.offsetHeight;
      var p = clamp((cy - b.top - th / 2) / Math.max(1, b.height - th), 0, 1);
      var r = tlist.getBoundingClientRect();
      scrollTo({ top: scrollY + (r.top + p * r.height - vh() * .45), behavior: 'auto' });
    }
    tbar.addEventListener('pointerdown', function (e) { down = true; tbar.classList.add('is-drag'); tbar.setPointerCapture(e.pointerId); jump(e.clientY); });
    tbar.addEventListener('pointermove', function (e) { if (down) jump(e.clientY); });
    ['pointerup', 'pointercancel'].forEach(function (ev) { tbar.addEventListener(ev, function () { down = false; tbar.classList.remove('is-drag'); }); });
    tbar.addEventListener('keydown', function (e) {
      var s = vh() * .6;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { scrollBy({ top: s }); e.preventDefault(); }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { scrollBy({ top: -s }); e.preventDefault(); }
    });
  })();

  /* ---------------- pills ---------------- */
  var pills = [].slice.call(document.querySelectorAll('.vnav a'));
  function pillFrame() {
    var best = null, bd = Infinity;
    pills.forEach(function (a) {
      var s = document.getElementById(a.dataset.v); if (!s) return;
      var d = Math.abs(s.getBoundingClientRect().top - vh() * .3);
      if (d < bd) { bd = d; best = a; }
    });
    pills.forEach(function (a) { a.classList.toggle('on', a === best); });
  }


  /* ---------------- the line-length rule, page-wide ----------------
     A width cap in ch only gets you close: a run of short words still
     fits several more than the measure suggests. So measure the rendered
     lines and tighten only the paragraphs that run past MAX_WORDS. */
  var MAX_WORDS = 8;
  var COPY = '.headrow__t p,.story__txt p,.dcard__cols p,.bigy__col p,.tlist__row p,' +
            '.tile__in p,.awards p,.careers__in p,.grow p,.quotes blockquote,.ftr p';

  function worstLine(el) {
    var rng = document.createRange(), best = 0;
    var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var node, top = null, n = 0;
    while ((node = walk.nextNode())) {
      var txt = node.textContent, re = /\S+/g, m;
      while ((m = re.exec(txt))) {
        rng.setStart(node, m.index); rng.setEnd(node, m.index + m[0].length);
        var t = Math.round(rng.getBoundingClientRect().top);
        if (top === null || Math.abs(t - top) > 3) { if (n > best) best = n; n = 1; top = t; }
        else n++;
      }
    }
    return n > best ? n : best;
  }

  function fitLine(el) {
    el.style.maxWidth = '';
    el.style.columns = '';
    // on a phone every text block runs the full width of the screen —
    // two narrow columns read worse than a line that carries a ninth word
    if (narrow()) return;
    var full = el.getBoundingClientRect().width;
    if (!full || worstLine(el) <= MAX_WORDS) return;
    var lo = full * .82, hi = full;          // a nudge, not a squeeze — copy does the rest
    for (var i = 0; i < 6; i++) {
      var mid = (lo + hi) / 2;
      el.style.maxWidth = mid + 'px';
      if (worstLine(el) > MAX_WORDS) hi = mid; else lo = mid;
    }
    el.style.maxWidth = Math.round(lo) + 'px';
    if (worstLine(el) > MAX_WORDS) el.style.maxWidth = Math.round(full * .82) + 'px';
  }

  /* columns that sit side by side share one measure, so a tightened
     paragraph never ends up narrower than the one next to it */
  var GROUPS = '.story__txt,.dcard__cols,.bigy__bot,.tlist__row,.apart,.awards,.grow,.quotes';

  function level(g) {
    var els = [].filter.call(g.querySelectorAll(COPY), function (e) {
      return e.getBoundingClientRect().width && !e.closest('.ghost');
    });
    if (els.length < 2) return;
    var min = Infinity;
    els.forEach(function (e) { min = Math.min(min, e.getBoundingClientRect().width); });
    els.forEach(function (e) { e.style.maxWidth = Math.round(min) + 'px'; });
  }

  /* The phone type scale comes straight from the Figma variables (Display 144,
     H1 96, H2 64 …), which is larger than a 390 px screen can always hold. Rather
     than guess a smaller number, shrink a heading only when its longest word
     would not fit. */
  var HEADS = '.display,.h2,.ftr__h,.dcard__t,.bigy__t,.tlist__t h3,.grow h3,.awards h3,.tile__in h3';

  function widestWord(el) {
    var rng = document.createRange(), walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var node, max = 0;
    while ((node = walk.nextNode())) {
      var txt = node.textContent, re = /\S+/g, m;
      while ((m = re.exec(txt))) {
        rng.setStart(node, m.index); rng.setEnd(node, m.index + m[0].length);
        var w = rng.getBoundingClientRect().width;
        if (w > max) max = w;
      }
    }
    return max;
  }

  // the hero sets a word to a line on a phone, so nothing hangs alone
  function heroLines() {
    var on = narrow();
    [].forEach.call(document.querySelectorAll('.hero .display .up > i'), function (i) {
      if (!i.dataset.txt) i.dataset.txt = i.textContent;
      var want = on
        ? i.dataset.txt.trim().split(/\s+/).map(function (w) { return '<span>' + w + '</span>'; }).join('')
        : i.dataset.txt;
      if (i.innerHTML !== want) i.innerHTML = want;
    });
  }

  // how many lines a run of text actually takes
  function lineCount(el) {
    var r = document.createRange(); r.selectNodeContents(el);
    var seen = [];
    [].forEach.call(r.getClientRects(), function (x) {
      for (var i = 0; i < seen.length; i++) if (Math.abs(seen[i] - x.top) < 5) return;
      seen.push(x.top);                 // sub-pixel drift is not a new line
    });
    return seen.length || 1;
  }

  // a section slogan is two lines of copy — on a phone it steps down through the
  // real tokens (Title 48, then Large subtitle 36) until each half sits on one line
  var SLOGAN_STEPS = [48, 36];

  function fitSlogan(el) {
    var parts = [].slice.call(el.querySelectorAll('.up > i'));
    if (!parts.length) return false;
    for (var i = 0; i < SLOGAN_STEPS.length; i++) {
      el.style.fontSize = SLOGAN_STEPS[i] + 'px';
      var ok = parts.every(function (p) { return lineCount(p) === 1; });
      if (ok) return true;
    }
    return false;                    // stays at 36 and the word fit takes over
  }

  function fitHeads() {
    var on = narrow();
    [].forEach.call(document.querySelectorAll(HEADS), function (el) {
      el.style.fontSize = '';
      if (!on) return;
      if (el.classList.contains('h2') && fitSlogan(el)) return;
      // the element itself can already be overflowing, so cap by the gutter
      var box = el.clientWidth, row = el.closest('.row');
      if (row) {
        var rs = getComputedStyle(row);
        box = Math.min(box, row.clientWidth - parseFloat(rs.paddingLeft) - parseFloat(rs.paddingRight));
      }
      if (!box) return;
      var word = widestWord(el); if (word <= box) return;
      el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * box / word) + 'px';
      if (el.classList.contains('h2')) return;
    });
  }

  function capLines(root) {
    try { measure(root || document); } catch (e) { /* never break the page over a line break */ }
  }

  function measure(root) {
    [].forEach.call(root.querySelectorAll(COPY), function (el) {
      if (el.getBoundingClientRect().width) fitLine(el);
    });
    if (narrow()) return;
    var groups = [].slice.call(root.querySelectorAll(GROUPS));
    if (root.closest && root.closest(GROUPS)) groups.push(root.closest(GROUPS));
    groups.forEach(level);
  }

  /* ---------------- loop ---------------- */
  function layout() {
    nums.style.height = (vh() + 4) + 'px';
    measureNums();
    drumGeo();
    bigy.style.height = (N * vh() * .9) + 'px';
    listRows();
    heroLines();
    fitHeads();
    capLines();
    frameTick();
  }
  var ticking = false, lastFrame = 0;
  function frameTick() {
    lastFrame = performance.now();
    try {
      revealFrame(); numsFrame(); drumFrame(); bigyFrame(); listFrame(); pillFrame(); hdrState();
    } finally {
      ticking = false;          // a throw must never strand the loop
    }
  }
  function onScroll() {
    // rAF is paused while the tab is hidden; a frame that never ran
    // would otherwise leave the latch stuck and freeze every animation
    if (ticking && performance.now() - lastFrame > 400) ticking = false;
    if (!ticking) { ticking = true; requestAnimationFrame(frameTick); }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('visibilitychange', function () { if (!document.hidden) { ticking = false; onScroll(); } });
  addEventListener('pageshow', function () { ticking = false; onScroll(); });
  addEventListener('resize', function () { clearTimeout(layout._t); layout._t = setTimeout(layout, 120); });
  addEventListener('load', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  collectReveals();
  layout();
})();
