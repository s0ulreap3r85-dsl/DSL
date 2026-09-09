/* Cambio de idioma, memoria de la eleccion, y contador de la guerra. */

(function(){
  var nodes = document.querySelectorAll('[data-t]');
  var base = {};
  nodes.forEach(function(n){ base[n.getAttribute('data-t')] = n.textContent; });
  base.days = 'd';

  var sel = document.getElementById('lang');
  var root = document.documentElement;
  var dayLabel = 'd';

  function store(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function load(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }

  function apply(code){
    var d = code === 'es' ? base : (DICT[code] || base);
    nodes.forEach(function(n){
      var k = n.getAttribute('data-t');
      if (d[k]) n.textContent = d[k];
      else if (base[k]) n.textContent = base[k];
    });
    dayLabel = d.days || 'd';
    root.setAttribute('lang', code);
    root.setAttribute('dir', code === 'ar' ? 'rtl' : 'ltr');
    tick();
  }

  var saved = load('dsl770.lang');
  var guess = (navigator.language || 'es').slice(0,2).toLowerCase();
  var start = saved || (DICT[guess] ? guess : (guess === 'es' ? 'es' : 'en'));
  sel.value = start;

  sel.addEventListener('change', function(){
    store('dsl770.lang', sel.value);
    apply(sel.value);
  });

  /* contador de la guerra */
  var el = document.getElementById('cd');
  function next(){
    var n = new Date();
    var t = new Date(n.getFullYear(), n.getMonth(), n.getDate(), 21, 0, 0, 0);
    t.setDate(t.getDate() + ((5 - t.getDay() + 7) % 7));
    if (t <= n) t.setDate(t.getDate() + 7);
    return t;
  }
  var target = next();
  function pad(v){ return String(v).padStart(2,'0'); }
  function tick(){
    var ms = target - new Date();
    if (ms <= 0){ target = next(); ms = target - new Date(); }
    var s = Math.floor(ms/1000);
    el.textContent = Math.floor(s/86400) + dayLabel + ' ' + pad(Math.floor(s%86400/3600)) + ':' + pad(Math.floor(s%3600/60)) + ':' + pad(s%60);
  }
  tick();
  setInterval(tick, 1000);

  if (start !== 'es') apply(start);
})();
