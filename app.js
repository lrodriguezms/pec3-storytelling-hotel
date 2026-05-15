/* APP.JS — Scrollytelling ligero con IntersectionObserver + Plotly.js */
(function () {
  'use strict';

  var C = {
    canceled: '#9d2f2f',
    stable: '#3f6f63',
    accent: '#8b6f47',
    dark: '#243746',
    text: '#1f2933',
    muted: '#66717d',
    grid: '#e6ded1'
  };

  var PLOTLY_CFG = {
    displayModeBar: false,
    responsive: true,
    locale: 'es'
  };

  var currentScene = 0;
  var chartEl, progressEl, chartKickerEl, chartTitleEl;

  var sceneMeta = {
    1: { kicker: 'Escena 1', title: 'Tamaño del problema' },
    2: { kicker: 'Escena 2', title: 'Tipo de hotel' },
    3: { kicker: 'Escena 3', title: 'Canal de distribución' },
    4: { kicker: 'Escena 4', title: 'Antelación de la reserva' },
    5: { kicker: 'Escena 5', title: 'Señales de compromiso' }
  };

  function fmt(n) {
    return Number(n).toLocaleString('es-ES');
  }

  function pct(n) {
    return Number(n).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';
  }

  function baseLayout(extra) {
    var layout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: 'Segoe UI, Arial, sans-serif', color: C.text, size: 13 },
      margin: { t: 40, r: 28, b: 60, l: 68 },
      hoverlabel: {
        bgcolor: '#ffffff',
        bordercolor: C.grid,
        font: { family: 'Segoe UI, Arial, sans-serif', size: 12, color: C.text }
      }
    };
    for (var k in extra) layout[k] = extra[k];
    return layout;
  }

  function plot(el, traces, layout) {
    Plotly.react(el, traces, layout, PLOTLY_CFG);
  }

  function renderScene1(el) {
    var d = storyData.global;
    var traces = [{
      values: [d.canceled, d.notCanceled],
      labels: ['Canceladas', 'No canceladas'],
      type: 'pie',
      hole: 0.68,
      sort: false,
      direction: 'clockwise',
      marker: { colors: [C.canceled, C.stable], line: { color: '#fff', width: 4 } },
      textinfo: 'label+percent',
      textposition: 'outside',
      automargin: true,
      hovertemplate: '<b>%{label}</b><br>%{value} reservas<br>%{percent}<extra></extra>'
    }];

    var layout = baseLayout({
      margin: { t: 18, r: 45, b: 18, l: 45 },
      showlegend: false,
      annotations: [
        { text: '37,5 %', showarrow: false, x: 0.5, y: 0.56, xref: 'paper', yref: 'paper',
          font: { family: 'Georgia, Times New Roman, serif', size: 48, color: C.canceled } },
        { text: 'reservas canceladas', showarrow: false, x: 0.5, y: 0.41, xref: 'paper', yref: 'paper',
          font: { family: 'Segoe UI, Arial, sans-serif', size: 14, color: C.muted } },
        { text: fmt(d.total) + ' reservas analizadas', showarrow: false, x: 0.5, y: 0.32, xref: 'paper', yref: 'paper',
          font: { family: 'Segoe UI, Arial, sans-serif', size: 12, color: C.muted } }
      ]
    });

    plot(el, traces, layout);
  }

  function renderScene2(el) {
    var d = storyData.byHotel;
    var traces = [{
      x: d.map(function (x) { return x.hotel; }),
      y: d.map(function (x) { return x.cancelRate; }),
      customdata: d.map(function (x) { return [fmt(x.bookings), fmt(x.canceled), fmt(x.notCanceled), pct(x.cancelRate)]; }),
      type: 'bar',
      marker: {
        color: d.map(function (x) { return x.hotel === 'City Hotel' ? C.canceled : C.stable; }),
        line: { color: '#fff', width: 2 }
      },
      text: d.map(function (x) { return pct(x.cancelRate); }),
      textposition: 'outside',
      textfont: { family: 'Georgia, Times New Roman, serif', size: 22, color: C.dark },
      hovertemplate: '<b>%{x}</b><br>Reservas: %{customdata[0]}<br>Canceladas: %{customdata[1]}<br>No canceladas: %{customdata[2]}<br>Tasa: %{customdata[3]}<extra></extra>',
      width: [0.42, 0.42]
    }];

    var layout = baseLayout({
      yaxis: { title: 'Tasa de cancelación', ticksuffix: ' %', range: [0, 52], gridcolor: C.grid, zeroline: false },
      xaxis: { tickfont: { size: 14 } },
      shapes: [
        { type: 'line', xref: 'paper', x0: 0, x1: 1, y0: storyData.global.cancelRate, y1: storyData.global.cancelRate,
          line: { color: C.muted, width: 1, dash: 'dot' } }
      ],
      annotations: [
        { text: 'media global: 37,5 %', xref: 'paper', yref: 'y', x: 0.98, y: storyData.global.cancelRate + 1.8,
          showarrow: false, xanchor: 'right', font: { size: 11, color: C.muted } }
      ]
    });

    plot(el, traces, layout);
  }

  function renderScene3(el) {
    var d = storyData.byChannel
      .filter(function (x) { return x.channel !== 'Undefined'; })
      .sort(function (a, b) { return a.cancelRate - b.cancelRate; });

    var traces = [{
      y: d.map(function (x) { return x.channel; }),
      x: d.map(function (x) { return x.cancelRate; }),
      customdata: d.map(function (x) { return [fmt(x.bookings), fmt(x.canceled), pct(x.cancelRate)]; }),
      type: 'bar',
      orientation: 'h',
      marker: {
        color: d.map(function (x) {
          if (x.channel === 'TA/TO') return C.canceled;
          if (x.channel === 'Direct') return C.stable;
          return C.accent;
        }),
        line: { color: '#fff', width: 2 }
      },
      text: d.map(function (x) { return pct(x.cancelRate); }),
      textposition: 'outside',
      textfont: { family: 'Georgia, Times New Roman, serif', size: 18, color: C.dark },
      hovertemplate: '<b>%{y}</b><br>Reservas: %{customdata[0]}<br>Canceladas: %{customdata[1]}<br>Tasa: %{customdata[2]}<extra></extra>'
    }];

    var layout = baseLayout({
      xaxis: { title: 'Tasa de cancelación', ticksuffix: ' %', range: [0, 50], gridcolor: C.grid, zeroline: false },
      yaxis: { tickfont: { size: 13 }, automargin: true },
      margin: { t: 34, r: 62, b: 58, l: 88 },
      annotations: [
        { text: 'TA/TO combina mucho volumen y más incertidumbre', x: 41.4, y: 'TA/TO', showarrow: true,
          ax: -70, ay: -36, arrowcolor: C.canceled, font: { size: 11, color: C.canceled } }
      ]
    });

    plot(el, traces, layout);
  }

  function renderScene4(el) {
    var d = storyData.byLeadTime;
    var colors = d.map(function (_, i) {
      var t = i / (d.length - 1);
      var r = Math.round(38 + (199 - 38) * t);
      var g = Math.round(141 + (53 - 141) * t);
      var b = Math.round(128 + (47 - 128) * t);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    });

    var traces = [
      {
        x: d.map(function (x) { return x.group; }),
        y: d.map(function (x) { return x.cancelRate; }),
        type: 'scatter',
        mode: 'lines',
        name: 'Evolución',
        showlegend: false,
        line: { color: 'rgba(102,113,125,.38)', width: 5, shape: 'linear' },
        hoverinfo: 'skip'
      },
      {
        x: d.map(function (x) { return x.group; }),
        y: d.map(function (x) { return x.cancelRate; }),
        customdata: d.map(function (x) { return [fmt(x.bookings), fmt(x.canceled), pct(x.cancelRate)]; }),
        type: 'scatter',
        mode: 'markers+text',
        marker: { color: colors, size: 17, line: { color: '#fff', width: 3 } },
        text: d.map(function (x) { return pct(x.cancelRate); }),
        textposition: 'top center',
        name: 'Tasa de cancelación',
        showlegend: false,
        textfont: { size: 11, color: C.text },
        hovertemplate: '<b>%{x}</b><br>Reservas: %{customdata[0]}<br>Canceladas: %{customdata[1]}<br>Tasa: %{customdata[2]}<extra></extra>'
      }
    ];

    var layout = baseLayout({
      showlegend: false,
      yaxis: { title: 'Tasa de cancelación', ticksuffix: ' %', range: [0, 80], gridcolor: C.grid, zeroline: false },
      xaxis: { title: 'Antelación de la reserva', tickangle: -25, tickfont: { size: 11 } },
      margin: { t: 66, r: 28, b: 86, l: 68 },
      annotations: [
        { text: '<b>+61,3 puntos</b> entre el mismo día y más de un año', xref: 'paper', yref: 'paper',
          x: 0.5, y: 1.13, showarrow: false, font: { size: 13, color: C.canceled } },
        { text: 'El riesgo crece con la distancia temporal', x: '> 365 días', y: 68.0, showarrow: true,
          ax: -72, ay: -52, arrowcolor: C.canceled, font: { size: 11, color: C.canceled } }
      ]
    });

    plot(el, traces, layout);
  }

  function renderScene5(el) {
    var d = storyData.bySpecialRequestsGrouped;
    var traces = [{
      x: d.map(function (x) { return x.group; }),
      y: d.map(function (x) { return x.cancelRate; }),
      customdata: d.map(function (x) { return [fmt(x.bookings), fmt(x.canceled), fmt(x.notCanceled), pct(x.cancelRate)]; }),
      type: 'bar',
      marker: { color: [C.canceled, C.stable], line: { color: '#fff', width: 2 } },
      text: d.map(function (x) { return pct(x.cancelRate); }),
      textposition: 'outside',
      textfont: { family: 'Georgia, Times New Roman, serif', size: 22, color: C.dark },
      hovertemplate: '<b>%{x}</b><br>Reservas: %{customdata[0]}<br>Canceladas: %{customdata[1]}<br>No canceladas: %{customdata[2]}<br>Tasa: %{customdata[3]}<extra></extra>',
      width: [0.45, 0.45]
    }];

    var layout = baseLayout({
      yaxis: { title: 'Tasa de cancelación', ticksuffix: ' %', range: [0, 60], gridcolor: C.grid, zeroline: false },
      xaxis: { tickfont: { size: 13 } },
      margin: { t: 84, r: 28, b: 60, l: 68 },
      annotations: [
        { text: '<b>−26,3 puntos</b> cuando hay al menos una petición especial', xref: 'paper', yref: 'paper',
          x: 0.5, y: 1.07, showarrow: false, font: { size: 13, color: C.stable } }
      ]
    });

    plot(el, traces, layout);
  }

  var renderers = {
    1: renderScene1,
    2: renderScene2,
    3: renderScene3,
    4: renderScene4,
    5: renderScene5
  };

  function setMeta(num) {
    if (!sceneMeta[num]) return;
    if (chartKickerEl) chartKickerEl.textContent = sceneMeta[num].kicker;
    if (chartTitleEl) chartTitleEl.textContent = sceneMeta[num].title;
  }

  function updateProgress(num) {
    if (!progressEl) return;
    var dots = progressEl.querySelectorAll('.progress__dot');
    dots.forEach(function (dot) {
      dot.classList.toggle('active', parseInt(dot.dataset.scene, 10) === num);
    });
  }

  function activateScene(num) {
    if (num === currentScene) return;
    currentScene = num;

    document.querySelectorAll('.step').forEach(function (step) {
      step.classList.toggle('active', parseInt(step.dataset.scene, 10) === num);
    });

    updateProgress(num);
    setMeta(num);

    if (num >= 1 && num <= 5 && renderers[num]) {
      chartEl.classList.add('transitioning');
      window.setTimeout(function () {
        renderers[num](chartEl);
        chartEl.classList.remove('transitioning');
      }, 130);
    }
  }

  function initObservers() {
    var stepObserver = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];

      if (visible) activateScene(parseInt(visible.target.dataset.scene, 10));
    }, {
      threshold: [0.35, 0.55, 0.75],
      rootMargin: '-18% 0px -30% 0px'
    });

    document.querySelectorAll('.step').forEach(function (step) { stepObserver.observe(step); });

    var scrollyEl = document.querySelector('.scrolly');
    if (scrollyEl && progressEl) {
      var progressObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          progressEl.classList.toggle('visible', entry.isIntersecting);
        });
      }, { threshold: 0.05 });
      progressObserver.observe(scrollyEl);
    }

    var closingEl = document.getElementById('closing');
    if (closingEl) {
      var closingObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            currentScene = 6;
            updateProgress(6);
            document.querySelectorAll('.step').forEach(function (s) { s.classList.remove('active'); });
            if (progressEl) progressEl.classList.add('visible');
          }
        });
      }, { threshold: 0.28 });
      closingObserver.observe(closingEl);
    }
  }

  function initNavigation() {
    var btn = document.getElementById('btn-start');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('step-1').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    if (progressEl) {
      progressEl.querySelectorAll('.progress__dot').forEach(function (dot) {
        dot.addEventListener('click', function () {
          var sc = parseInt(dot.dataset.scene, 10);
          var target = document.getElementById(sc <= 5 ? 'step-' + sc : 'closing');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: sc <= 5 ? 'center' : 'start' });
        });
      });
    }
  }

  function init() {
    chartEl = document.getElementById('chart');
    progressEl = document.querySelector('.progress');
    chartKickerEl = document.getElementById('chart-kicker');
    chartTitleEl = document.getElementById('chart-title');

    if (!chartEl || typeof Plotly === 'undefined' || typeof storyData === 'undefined') return;

    activateScene(1);
    initObservers();
    initNavigation();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
