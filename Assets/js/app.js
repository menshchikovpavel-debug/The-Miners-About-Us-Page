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
    var vh = innerHeight, keep = [];
    for (var i = 0; i < pending.length; i++) {
      var el = pending[i], r = el.getBoundingClientRect();
      if (r.top < vh * .93 && r.bottom > -vh * .2) el.classList.add('in'); else keep.push(el);
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
  function minH() { return hdrH() + 190; }

  var numRatio = [], labRatio = [];
  function numsSizes() {
    var vw = innerWidth;
    return {
      lb1: clamp(vw * .0119, 12, 18), lb2: clamp(vw * .0105, 11, 15),
      pd1: vw > 760 ? 46 : 12, pd2: vw > 760 ? 20 : 8,
      fsMax: clamp(vw * .127, 56, 192), fs2: clamp(vw * .048, 30, 72)
    };
  }
  // measure every string once at 100 px so the type can be fitted to the row later
  function measureNums() {
    numsRow.style.setProperty('--num-fs', '100px');
    numsRow.style.setProperty('--lab-fs', '100px');
    cols.forEach(function (c) { c.style.width = 'auto'; c.style.flex = '0 0 auto'; c.style.paddingInline = '0'; });
    numRatio = nEls.map(function (e) { return e.getBoundingClientRect().width / 100; });
    labRatio = lEls.map(function (e) { return e.getBoundingClientRect().width / 100; });
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
    var vh = innerHeight, MINH = minH();
    // the panel is pinned to the top and its height is whatever is left of the
    // section — so the white block below squeezes it, with no dwell either side
    var d = Math.max(0, -nums.getBoundingClientRect().top);
    var h = clamp(vh - d, MINH, vh);
    numsPanel.style.height = h + 'px';
    var k = clamp((vh - h) / Math.max(1, vh - MINH), 0, 1);
    var hd = hdrH();        // 0 tall · 1 compact
    if (nums.getBoundingClientRect().top < vh * .8) countUp();
    if (counted && performance.now() - countStart > 1250) finalNums();

    var s = numsSizes();
    var rowCS = getComputedStyle(numsRow);
    var total = numsRow.clientWidth - parseFloat(rowCS.paddingLeft) - parseFloat(rowCS.paddingRight);
    if (!(total > 0) || !numRatio.length) return;
    var sumR = numRatio.reduce(function (a, b) { return a + b; }, 0);

    var narrow = innerWidth <= 760, per = narrow ? 2 : 4;
    var pd = lerp(s.pd1, s.pd2, k);
    var slack = total * .07;
    var fit = narrow
      ? (total / per - 2 * s.pd1 - 6) / Math.max(.001, Math.max.apply(null, numRatio))
      : (total - per * 2 * s.pd1 - slack) / Math.max(.001, sumR);
    var fs = lerp(Math.min(s.fsMax, fit), s.fs2, k);
    var lb = lerp(s.lb1, s.lb2, k);
    numsRow.style.setProperty('--num-fs', fs + 'px');
    numsRow.style.setProperty('--lab-fs', lb + 'px');
    numsRow.style.setProperty('--num-pad', pd + 'px');

    var autoW = numRatio.map(function (r, i) { return Math.max(r * fs, labRatio[i] * lb) + 2 * pd; });
    var sumAuto = autoW.reduce(function (a, b) { return a + b; }, 0);
    var extra = (total - sumAuto) / per, eq = total / per;
    var numH = nEls[0].getBoundingClientRect().height, labH = lEls[0].getBoundingClientRect().height;
    var hEff = narrow ? h / 2 : h;
    var hdOff = narrow ? hd * .6 : hd;                 // clear the fixed header
    var pt1 = hdOff + (innerWidth > 760 ? 60 : 16);
    var ptC = hdOff + Math.max(0, (hEff - hdOff - numH - labH - 8) / 2);
    var pt = lerp(pt1, ptC, k);
    var pb1 = (innerWidth > 760 ? 60 : 20);
    var gap = lerp(Math.max(0, hEff - pt1 - pb1 - numH - labH), 8, k);

    cols.forEach(function (c, i) {
      var w = narrow ? total / per : lerp(autoW[i] + extra, eq, k);
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
    var gap = innerWidth > 760 ? 30 : 14, per = innerWidth > 760 ? 2 : 1;
    var w = (inner - gap * (per - 1)) / per;
    dG = { w: w, step: w + gap, h: h };
    dcards.forEach(function (c) { c.style.width = w + 'px'; });
    drum.style.height = (innerHeight + Math.max(1, N - per) * innerHeight * .85) + 'px';
  }
  // the whole rank keeps a constant step, so the 30 px gap never closes.
  // only the vertical drop and the fade mark a card as leaving or arriving.
  function drumFrame() {
    var r = drum.getBoundingClientRect(), runway = r.height - innerHeight;
    if (runway <= 0) return;
    var p = clamp(-r.top / runway, 0, 1);
    var per = innerWidth > 760 ? 2 : 1, steps = Math.max(1, N - per);
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
    var spots = SPOTS[i % SPOTS.length];
    var gen = (byPh.dataset.gen = String((+byPh.dataset.gen || 0) + 1));
    [].slice.call(byPh.children).forEach(function (f) {
      if (f.dataset.out) { f.remove(); return; }   // already leaving from a previous swap
      f.dataset.out = '1';
      f.style.opacity = '0';
      f.style.transform = 'rotate(' + (f.dataset.r || '0') + 'deg) translateY(-70px)';
      setTimeout(function () { if (f.parentNode) f.remove(); }, OUT + 60);
    });
    setTimeout(function () {
      if (byPh.dataset.gen !== gen) return;        // a newer year already took over
      spots.forEach(function (sp, k) {
        var fig = document.createElement('figure');
        fig.dataset.r = sp.r;
        fig.style.cssText = 'left:' + sp.l + '%;top:' + sp.t + '%;width:' + sp.w + '%;aspect-ratio:4/3;' +
          'opacity:0;transform:rotate(' + sp.r + 'deg) translateY(46px);transition-delay:' + (k * 90) + 'ms';
        fig.innerHTML = '<img src="' + img(y.photos[k]) + '" alt="" loading="lazy">';
        byPh.appendChild(fig);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            fig.style.opacity = '1';
            fig.style.transform = 'rotate(' + sp.r + 'deg)';
          });
        });
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
    var r = bigy.getBoundingClientRect(), runway = r.height - innerHeight;
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
  function listFrame() {
    var r = tlist.getBoundingClientRect(), line = innerHeight * .45;
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
      scrollTo({ top: scrollY + (r.top + p * r.height - innerHeight * .45), behavior: 'auto' });
    }
    tbar.addEventListener('pointerdown', function (e) { down = true; tbar.classList.add('is-drag'); tbar.setPointerCapture(e.pointerId); jump(e.clientY); });
    tbar.addEventListener('pointermove', function (e) { if (down) jump(e.clientY); });
    ['pointerup', 'pointercancel'].forEach(function (ev) { tbar.addEventListener(ev, function () { down = false; tbar.classList.remove('is-drag'); }); });
    tbar.addEventListener('keydown', function (e) {
      var s = innerHeight * .6;
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
      var d = Math.abs(s.getBoundingClientRect().top - innerHeight * .3);
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

  function capLines(root) {
    try { measure(root || document); } catch (e) { /* never break the page over a line break */ }
  }

  function measure(root) {
    [].forEach.call(root.querySelectorAll(COPY), function (el) {
      if (el.getBoundingClientRect().width) fitLine(el);
    });
    var groups = [].slice.call(root.querySelectorAll(GROUPS));
    if (root.closest && root.closest(GROUPS)) groups.push(root.closest(GROUPS));
    groups.forEach(level);
  }

  /* ---------------- loop ---------------- */
  function layout() {
    nums.style.height = (innerHeight + 4) + 'px';
    measureNums();
    drumGeo();
    bigy.style.height = (N * innerHeight * .9) + 'px';
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
