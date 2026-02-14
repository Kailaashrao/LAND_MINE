/* =============================================
   Life Band – Chart.js Configuration & Helpers
   Global chart defaults + reusable chart builders
   ============================================= */

const Charts = (() => {

  // ---- Apply global Chart.js defaults ----
  function configure() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#64748B';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
    Chart.defaults.plugins.tooltip.backgroundColor = '#0F172A';
    Chart.defaults.plugins.tooltip.titleFont = { weight: '600', size: 13 };
    Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.elements.line.tension = 0.4;
    Chart.defaults.elements.point.radius = 3;
    Chart.defaults.elements.point.hoverRadius = 6;
    Chart.defaults.scale.grid = { color: 'rgba(226,232,240,0.6)', drawBorder: false };
  }

  // ---- Gradient fill helper ----
  function createGradient(ctx, colorTop, colorBottom) {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.clientHeight);
    gradient.addColorStop(0, colorTop);
    gradient.addColorStop(1, colorBottom);
    return gradient;
  }

  // ---- Reusable: Line chart ----
  function createLineChart(canvasId, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: { legend: { display: datasets.length > 1 } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: false }
        },
        ...options
      }
    });
  }

  // ---- Reusable: Bar chart ----
  function createBarChart(canvasId, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: datasets.length > 1 } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true }
        },
        ...options
      }
    });
  }

  // ---- Reusable: Doughnut chart ----
  function createDoughnutChart(canvasId, labels, data, colors, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0,
          spacing: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16 } }
        },
        ...options
      }
    });
  }

  // ---- Theme color palettes ----
  const colors = {
    blue:    { main: '#2563EB', light: 'rgba(37,99,235,0.1)',  border: 'rgba(37,99,235,0.8)' },
    red:     { main: '#DC2626', light: 'rgba(220,38,38,0.1)',  border: 'rgba(220,38,38,0.8)' },
    green:   { main: '#059669', light: 'rgba(5,150,105,0.1)',  border: 'rgba(5,150,105,0.8)' },
    amber:   { main: '#D97706', light: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.8)' },
    violet:  { main: '#7C3AED', light: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.8)' },
    cyan:    { main: '#0891B2', light: 'rgba(8,145,178,0.1)',  border: 'rgba(8,145,178,0.8)' }
  };

  // ---- Auto-configure on load ----
  configure();

  // Attach to App for backward compat
  if (typeof App !== 'undefined') {
    App.configureCharts = configure;
  }

  // ---- Public API ----
  return {
    configure,
    createGradient,
    createLineChart,
    createBarChart,
    createDoughnutChart,
    colors
  };

})();
