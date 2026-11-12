(function () {
  var store = document.getElementById('citydata');
  var body = document.getElementById('rows');
  if (!store || !body) return;
  var data = JSON.parse(store.textContent);
  var home = document.querySelector('.sitename');
  var base = home ? home.getAttribute('href') : '/';
  var q = document.getElementById('q');
  var sortsel = document.getElementById('sortsel');
  var minsel = document.getElementById('minsel');
  var tally = document.getElementById('tally');
  var buttons = document.querySelectorAll('.sortbtn');
  var labels = ['City', 'Rated Shops', 'Average Stars', 'Median Reviews', 'At 4.5 Stars And Up', 'List A Website'];
  var more = document.getElementById('more');
  var PAGE = 40;
  var state = { col: 1, dir: 'd', all: false };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function fmt(n) { return n.toLocaleString('en-US'); }

  function draw() {
    var term = q.value.trim().toLowerCase();
    var min = parseInt(minsel.value, 10) || 0;
    var rows = data.filter(function (r) { return r[1] >= min && (!term || r[0].toLowerCase().indexOf(term) !== -1); });
    var c = state.col, sign = state.dir === 'a' ? 1 : -1;
    rows.sort(function (a, b) {
      if (c === 0) return sign * a[0].localeCompare(b[0]);
      return sign * (a[c] - b[c]) || b[1] - a[1] || a[0].localeCompare(b[0]);
    });
    var total = rows.length;
    var cut = (state.all || term) ? total : Math.min(PAGE, total);
    var html = '';
    for (var i = 0; i < cut; i++) {
      var r = rows[i];
      var name = r[6] ? '<a href="' + base + r[6] + '/">' + esc(r[0]) + '</a>' : esc(r[0]);
      html += '<tr><th scope="row">' + name + '</th>' +
        '<td data-label="' + labels[1] + '">' + fmt(r[1]) + '</td>' +
        '<td data-label="' + labels[2] + '">' + r[2].toFixed(2) + '</td>' +
        '<td data-label="' + labels[3] + '">' + fmt(r[3]) + '</td>' +
        '<td data-label="' + labels[4] + '"><span class="meter" aria-hidden="true"><i style="width:' + r[4] + '%"></i></span>' + r[4] + '%</td>' +
        '<td data-label="' + labels[5] + '">' + r[5] + '%</td></tr>';
    }
    if (!rows.length) html = '<tr class="empty"><td colspan="6">No city matches that search. Try a shorter name.</td></tr>';
    body.innerHTML = html;
    tally.textContent = 'Showing ' + cut + ' of ' + total + ' cities';
    more.hidden = cut >= total && !state.all;
    more.textContent = state.all ? 'Show Fewer Cities' : 'Show All ' + total + ' Cities';
    if (term) more.hidden = true;
    for (var j = 0; j < buttons.length; j++) {
      var on = parseInt(buttons[j].getAttribute('data-col'), 10) === c;
      buttons[j].parentNode.setAttribute('aria-sort', on ? (state.dir === 'a' ? 'ascending' : 'descending') : 'none');
      buttons[j].className = 'sortbtn' + (on ? ' on ' + state.dir : '');
    }
    var key = c + state.dir;
    for (var k = 0; k < sortsel.options.length; k++) if (sortsel.options[k].value === key) sortsel.selectedIndex = k;
  }

  for (var b = 0; b < buttons.length; b++) {
    buttons[b].addEventListener('click', function () {
      var c = parseInt(this.getAttribute('data-col'), 10);
      if (state.col === c) state.dir = state.dir === 'a' ? 'd' : 'a';
      else { state.col = c; state.dir = c === 0 ? 'a' : 'd'; }
      draw();
    });
  }
  sortsel.addEventListener('change', function () {
    state.col = parseInt(this.value, 10); state.dir = this.value.slice(-1); draw();
  });
  more.addEventListener('click', function () { state.all = !state.all; draw(); });
  minsel.addEventListener('change', draw);
  q.addEventListener('input', draw);
  document.getElementById('tools').addEventListener('submit', function (ev) { ev.preventDefault(); });
  draw();
})();
