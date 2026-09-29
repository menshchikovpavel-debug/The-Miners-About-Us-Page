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
  var MARKV = '3';
  $('#awardsList').innerHTML = D.awards.map(function (a) {
    var badge = '<div class="awards__badge"><img src="Assets/marks/' + a.mark + '.svg?v=' + MARKV + '" alt="" loading="lazy"></div>';
    return '<li class="up"><i>' + badge + '<h3>' + a.t1 + '<br>' + a.t2 + '</h3>' +
      '<p' + (a.ph ? ' class="ph"' : '') + '>' + a.d + '</p></i></li>';
  }).join('');

  $('#pressList').innerHTML = D.press.map(function (p) {
    // a drawn mark, not a glyph — 22 × 18 units, set to 32 px tall in CSS
    var mark = '<span class="quotes__m" aria-hidden="true">' +
      '<svg viewBox="0 0 22 18" fill="currentColor" role="presentation">' +
      '<path d="M0 0 H9 L6 16.5 A1.5 1.5 0 0 1 3 16.5 Z"/>' +
      '<path d="M13 0 H22 L19 16.5 A1.5 1.5 0 0 1 16 16.5 Z"/>' +
      '</svg></span>';
    var logo = '<img src="Assets/marks/' + p.mark + '.svg?v=' + MARKV + '" alt="' + p.outlet + '" loading="lazy">';
    var src = p.url ? '<a href="' + p.url + '" target="_blank" rel="noopener">' + logo + '</a>' : logo;
    return '<li class="up"><i>' + mark + '<blockquote>' + p.quote + '</blockquote>' +
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
      fsMax: clamp(w * .127, 56, 360), fs2: clamp(w * .048, 30, 72)
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
  var WAYS = D.ways, NW = WAYS.length;
  track.innerHTML = WAYS.map(function (w) {
    var ext = /^mailto:/.test(w.href) ? '' : ' target="_blank" rel="noopener"';
    return '<article class="dcard"><a class="dcard__a" href="' + w.href + '"' + ext + '>' +
      '<div class="dcard__top"><h3 class="dcard__t">' + w.t + '</h3><span class="dcard__y">' + w.meta + '</span></div>' +
      '<img class="dcard__pic" src="Assets/img/' + w.img + '.jpg" alt="" loading="lazy">' +
      '<div class="dcard__cols"><p>' + w.body + '</p></div>' +
      '</a></article>';
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
    drum.style.height = (vh() + Math.max(1, NW - per) * vh() * .85) + 'px';
  }
  // the whole rank keeps a constant step, so the 30 px gap never closes.
  // only the vertical drop and the fade mark a card as leaving or arriving.
  function drumFrame() {
    var r = drum.getBoundingClientRect(), runway = r.height - vh();
    if (runway <= 0) return;
    var p = clamp(-r.top / runway, 0, 1);
    var per = narrow() ? 1 : 2, steps = Math.max(1, NW - per);
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
     timeline — a scroll list with a live scrollbar
     ============================================================ */
  var tlist = $('#tlist'), tbar = $('#tlistBar'), tthumb = $('#tlistThumb');
  (function buildList() {
    var html = '';
    YEARS.forEach(function (y, i) {
      html += '<div class="tlist__t" style="grid-row:' + (i + 1) + '">' +
        '<h3>' + y.title + '</h3><b>' + y.year + '</b></div>' +
        '<div class="tlist__row up" style="grid-row:' + (i + 1) + '"><i>' +
        '<img src="' + img(y.photos[0]) + '" alt="" loading="lazy">' +
        '<div class="tx"><p>' + y.paras.join(' ') + '</p></div>' +
        '</i></div>';
    });
    tlist.insertAdjacentHTML('beforeend', html);
  })();
  var tTexts = [].slice.call(tlist.querySelectorAll('.tlist__t'));
  var tRows = [].slice.call(tlist.querySelectorAll('.tlist__row'));

  function listRows() {
    if (!tTexts.length) return;
    var n = narrow();
    tTexts.forEach(function (t, i) { t.style.gridRow = String(n ? 2 * i + 1 : i + 1); });
    tRows.forEach(function (r2, i) { r2.style.gridRow = String(n ? 2 * i + 2 : i + 1); });
    // the rail spans 1/-1, which only reaches the last EXPLICIT line
    tlist.style.gridTemplateRows = 'repeat(' + (n ? 2 * N : N) + ', auto)';
  }

  function listFrame() {
    if (!tlist || !tRows.length) return;
    var r = tlist.getBoundingClientRect(), line = vh() * .45;
    var p = clamp((line - r.top) / Math.max(1, r.height), 0, 1);
    tthumb.style.top = (p * (tbar.clientHeight - tthumb.offsetHeight)).toFixed(1) + 'px';
    tbar.setAttribute('aria-valuenow', Math.round(p * 100));
    var act = 0;
    tRows.forEach(function (r2, i) { if (r2.getBoundingClientRect().top <= line) act = i; });
    tTexts.forEach(function (t, i) { t.classList.toggle('on', i === act); });
  }

  (function dragBar() {
    if (!tbar) return;
    var down = false;
    function jump(cy) {
      var b = tbar.getBoundingClientRect(), th = tthumb.offsetHeight;
      var p = clamp((cy - b.top - th / 2) / Math.max(1, b.height - th), 0, 1);
      var r = tlist.getBoundingClientRect();
      scrollTo({ top: scrollY + (r.top + p * r.height - vh() * .45), behavior: 'auto' });
    }
    tbar.addEventListener('pointerdown', function (e) { down = true; tbar.classList.add('is-drag'); tbar.setPointerCapture(e.pointerId); jump(e.clientY); });
    tbar.addEventListener('pointermove', function (e) { if (down) jump(e.clientY); });
    ['pointerup', 'pointercancel'].forEach(function (ev) { tbar.addEventListener(ev, function () { down = false; tbar.classList.remove('is-drag'); }); });
    tbar.addEventListener('keydown', function (e) {
      var s2 = vh() * .6;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { scrollBy({ top: s2 }); e.preventDefault(); }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { scrollBy({ top: -s2 }); e.preventDefault(); }
    });
  })();

  /* ---------------- the line-length rule, page-wide ----------------
     A width cap in ch only gets you close: a run of short words still
     fits several more than the measure suggests. So measure the rendered
     lines and tighten only the paragraphs that run past MAX_WORDS. */
  var MAX_WORDS = 8;
  var COPY = '.headrow__t p,.story__txt p,' +
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
  var GROUPS = '.story__txt,.apart,.awards,.grow,.quotes';

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
  var HEADS = '.display,.h2,.ftr__h,.dcard__t,.grow h3,.awards h3,.tile__in h3';

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

  // Every size on screen has to be one of the tokens. When a heading will not
  // fit its gutter we do not scale it by a ratio — we step down the ladder to
  // the next kegel in the collection and try again.
  function ladder() {
    var raw = getComputedStyle(document.documentElement).getPropertyValue('--ladder');
    var out = raw.trim().split(/\s+/).map(parseFloat).filter(function (n) { return n > 0; });
    return out.sort(function (x, y) { return y - x; });
  }

  function fitHeads() {
    var on = narrow(), steps = ladder();
    [].forEach.call(document.querySelectorAll(HEADS), function (el) {
      el.style.fontSize = '';
      if (on && el.classList.contains('h2') && fitSlogan(el)) return;
      var box = el.clientWidth, row = el.closest('.row');
      if (row) {
        var rs = getComputedStyle(row);
        box = Math.min(box, row.clientWidth - parseFloat(rs.paddingLeft) - parseFloat(rs.paddingRight));
      }
      if (!box) return;
      var base = parseFloat(getComputedStyle(el).fontSize);
      if (widestWord(el) <= box + .5) return;    // sub-pixel ties are not overflow
      for (var i = 0; i < steps.length; i++) {
        if (steps[i] >= base) continue;                 // only ever smaller
        el.style.fontSize = steps[i] + 'px';
        if (widestWord(el) <= box + .5) return;
      }
    });
  }

  // a row of sibling headings settles on one step, not one each
  function levelHeads(sel) {
    var els = [].slice.call(document.querySelectorAll(sel));
    if (els.length < 2) return;
    var min = Infinity;
    els.forEach(function (e) { min = Math.min(min, parseFloat(getComputedStyle(e).fontSize)); });
    els.forEach(function (e) { e.style.fontSize = min + 'px'; });
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
    listRows();
    drumGeo();
    heroLines();
    fitHeads();
    levelHeads('.dcard__t');
    levelHeads('.tlist__t h3');
    capLines();
    frameTick();
  }
  var ticking = false, lastFrame = 0;
  function frameTick() {
    lastFrame = performance.now();
    try {
      revealFrame(); numsFrame(); drumFrame(); listFrame(); hdrState();
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
