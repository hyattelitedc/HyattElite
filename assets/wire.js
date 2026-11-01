/* Hyatt Elite archwire — gold smile-curve wire with grey brackets and tooth bars.
   Same geometry family as the clinic reel-cover grid: quadratic smile curve,
   brackets tangent to the wire, two gold centre teeth. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var uid = 0;
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  if (!document.getElementById('hw-style')) {
    var s = document.createElement('style');
    s.id = 'hw-style';
    s.textContent =
      '.hw .hw-line{stroke-dasharray:1;stroke-dashoffset:0}' +
      '.hw.hw-anim .hw-line{animation:hwDraw 2.4s cubic-bezier(.65,0,.35,1) .15s both}' +
      '.hw.hw-anim .hw-glow{animation:hwFade 1.2s ease 1.6s both}' +
      '.hw .hw-b rect{transform-box:fill-box;transform-origin:center}' +
      '.hw.hw-anim .hw-b rect{animation:hwPop .55s cubic-bezier(.3,1.7,.5,1) both;animation-delay:calc(.55s + var(--i) * .085s)}' +
      '.hw.hw-anim .hw-t{animation:hwRise .9s cubic-bezier(.22,.9,.27,1.05) both;animation-delay:calc(.2s + var(--i) * .07s)}' +
      '.hw .hw-spark{opacity:0}.hw.hw-anim .hw-spark{animation:hwFade .6s ease 2.6s both}' +
      '@keyframes hwDraw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}' +
      '@keyframes hwPop{from{transform:scale(0) rotate(-20deg)}to{transform:none}}' +
      '@keyframes hwRise{from{transform:translateY(46px);opacity:0}to{transform:none;opacity:1}}' +
      '@keyframes hwFade{from{opacity:0}to{opacity:1}}' +
      '.hw.hw-paused *{animation-play-state:paused!important}' +
      '@media (prefers-reduced-motion:reduce){.hw *{animation:none!important}.hw .hw-spark{display:none}}';
    document.head.appendChild(s);
  }

  /* opts: w,h (viewBox), y0 (wire height at the edges), ymid (height at centre),
     count (brackets), teeth (bool), toothOpacity, bracket (fill), spark (bool),
     anim (bool, play on load) */
  window.HyattWire = function (svg, o) {
    o = Object.assign({ w: 1440, h: 320, y0: 110, ymid: 210, count: 14, teeth: true,
      toothOpacity: 0.13, toothColor: '#ffffff', bracket: '#4f4c4d', spark: true, anim: true,
      stroke: 7, par: 'xMidYMid slice' }, o || {});
    var id = 'hw' + (++uid), w = o.w, y0 = o.y0, c = 2 * o.ymid - o.y0;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + o.h);
    svg.setAttribute('preserveAspectRatio', o.par);
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('hw');
    if (o.anim) svg.classList.add('hw-anim');
    var d = 'M0 ' + y0 + ' Q' + (w / 2) + ' ' + c + ' ' + w + ' ' + y0;

    var defs = el('defs', {}, svg);
    var lg = el('linearGradient', { id: id + 'g', x1: 0, y1: 0, x2: w, y2: 0, gradientUnits: 'userSpaceOnUse' }, defs);
    el('stop', { offset: 0, 'stop-color': '#8a6d2c' }, lg);
    el('stop', { offset: .5, 'stop-color': '#f1d590' }, lg);
    el('stop', { offset: 1, 'stop-color': '#8a6d2c' }, lg);
    var rg = el('radialGradient', { id: id + 'r' }, defs);
    el('stop', { offset: 0, 'stop-color': '#fff6d8', 'stop-opacity': 1 }, rg);
    el('stop', { offset: .35, 'stop-color': '#f1d590', 'stop-opacity': .6 }, rg);
    el('stop', { offset: 1, 'stop-color': '#f1d590', 'stop-opacity': 0 }, rg);

    var n = o.count, step = w / n, pts = [];
    for (var i = 0; i < n; i++) {
      var x = step * (i + 0.5), t = x / w;
      var y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * c + t * t * y0;
      var ang = Math.atan(2 * (c - y0) * (1 - 2 * t) / w) * 180 / Math.PI;
      pts.push({ x: x, y: y, a: ang, i: Math.abs(i - (n - 1) / 2) });
    }
    if (o.teeth) {
      var tg = el('g', {}, svg);
      pts.forEach(function (p, k) {
        var centre = (k === n / 2 - 1 || k === n / 2);
        var r = el('rect', { x: p.x - 17, y: p.y - 55, width: 34, height: 110, rx: 17,
          fill: centre ? '#c9a24a' : o.toothColor, 'fill-opacity': centre ? .9 : o.toothOpacity,
          class: 'hw-t', style: '--i:' + p.i }, tg);
      });
    }
    el('path', { d: d, fill: 'none', stroke: '#c9a24a', 'stroke-opacity': .16, 'stroke-width': o.stroke * 3.2, class: 'hw-glow' }, svg);
    var bg = el('g', { fill: o.bracket }, svg);
    pts.forEach(function (p) {
      var g = el('g', { transform: 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + p.a.toFixed(2) + ')', class: 'hw-b', style: '--i:' + p.i }, bg);
      el('rect', { x: -30, y: -20, width: 60, height: 40, rx: 10 }, g);
    });
    el('path', { d: d, fill: 'none', stroke: 'url(#' + id + 'g)', 'stroke-width': o.stroke, 'stroke-linecap': 'round', pathLength: 1, class: 'hw-line' }, svg);
    if (o.spark) {
      var sp = el('g', { class: 'hw-spark' }, svg);
      var glow = el('circle', { r: 22, fill: 'url(#' + id + 'r)' }, sp);
      var core = el('circle', { r: 3.5, fill: '#fffaf0' }, sp);
      [glow, core].forEach(function (node) {
        var am = el('animateMotion', { dur: '5.5s', repeatCount: 'indefinite', path: d, keyPoints: '0;1;0', keyTimes: '0;.5;1', calcMode: 'spline', keySplines: '.45 0 .55 1;.45 0 .55 1' }, node);
      });
    }
    return { points: pts, path: d };
  };
})();
