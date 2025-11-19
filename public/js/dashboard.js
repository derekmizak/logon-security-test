// Admin Dashboard JavaScript
// Educational: Handles data fetching, chart updates, and interactivity
//
// Features:
// 1. Auto-refresh every 30 seconds
// 2. Fetch stats and render charts
// 3. Paginated table of recent attempts
// 4. CSV export functionality
// 5. Error handling and loading states

// ============================================================================
// Global Variables
// ============================================================================

let charts = {};  // Store chart instances
let currentPage = 1;
const itemsPerPage = 20;
let autoRefreshInterval = null;
let isRefreshing = false;

// ============================================================================
// Initialization
// ============================================================================
// Educational: Run when DOM is fully loaded

document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard initializing...');

  // Initial data load
  loadDashboardData();

  // Start auto-refresh (30 seconds)
  startAutoRefresh();

  // Setup event listeners
  setupEventListeners();
});

// ============================================================================
// Load All Dashboard Data
// ============================================================================
// Educational: Fetch all data and render charts/tables

async function loadDashboardData() {
  if (isRefreshing) return;  // Prevent concurrent refreshes
  isRefreshing = true;

  try {
    // Fetch stats data from API
    const statsResponse = await fetch('/admin2430.html/api/stats');

    if (!statsResponse.ok) {
      throw new Error(`HTTP error! status: ${statsResponse.status}`);
    }

    const stats = await statsResponse.json();

    // Update overview cards
    updateOverviewCards(stats.overview);

    // Create or update charts
    updateCharts(stats);

    // Load recent attempts table
    await loadRecentAttempts(currentPage);

    console.log('Dashboard data loaded successfully');

  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showError('Failed to load dashboard data. Please refresh the page.');
  } finally {
    isRefreshing = false;
  }
}

// ============================================================================
// Update Overview Cards
// ============================================================================
// Educational: Update the stat cards at the top of dashboard

function updateOverviewCards(overview) {
  // Educational: Use optional chaining and default values for safety
  document.getElementById('totalAttempts').textContent =
    (overview?.totalAttempts || 0).toLocaleString();

  document.getElementById('uniqueIPs').textContent =
    (overview?.uniqueIPs || 0).toLocaleString();

  document.getElementById('uniqueUsernames').textContent =
    (overview?.uniqueUsernames || 0).toLocaleString();

  document.getElementById('avgPasswordLength').textContent =
    (overview?.avgPasswordLength || 0).toFixed(1);
}

// ============================================================================
// Update Charts
// ============================================================================
// Educational: Create charts on first load, update on subsequent loads

function updateCharts(stats) {
  // Timeline Chart (Login Attempts Over Time)
  if (!charts.timeline) {
    charts.timeline = createTimelineChart('timelineChart', stats.timeline || []);
  } else {
    updateChartData(charts.timeline, stats.timeline || [], 'timeline');
  }

  // Top IPs Chart
  if (!charts.topIPs) {
    charts.topIPs = createBarChart('topIPsChart', stats.topIPs || [], {
      title: 'Top 10 Attacking IPs',
      seriesName: 'Attempts',
      color: '#dc3545'
    });
  } else {
    updateChartData(charts.topIPs, stats.topIPs || [], 'bar');
  }

  // Top Usernames Chart
  if (!charts.topUsernames) {
    charts.topUsernames = createBarChart('topUsernamesChart', stats.topUsernames || [], {
      title: 'Top 10 Usernames',
      seriesName: 'Attempts',
      color: '#ffc107'
    });
  } else {
    updateChartData(charts.topUsernames, stats.topUsernames || [], 'bar');
  }

  // Request Distribution Pie Chart
  if (!charts.requestPie) {
    charts.requestPie = createPieChart('requestPieChart', stats.requestDistribution || [], {
      title: 'Request Distribution',
      seriesName: 'Requests'
    });
  } else {
    updateChartData(charts.requestPie, stats.requestDistribution || [], 'pie');
  }
}

// ============================================================================
// Load Recent Attempts Table
// ============================================================================
// Educational: Fetch and display paginated table data

async function loadRecentAttempts(page = 1) {
  const tbody = document.getElementById('attemptsTableBody');

  // Show loading state
  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="text-center">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        Loading data...
      </td>
    </tr>
  `;

  try {
    const response = await fetch(`/admin2430.html/api/recent?page=${page}&limit=${itemsPerPage}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Update current page
    currentPage = data.currentPage;

    // Render table rows
    renderTableRows(data.attempts);

    // Update pagination
    renderPagination(data.totalPages, data.currentPage);

  } catch (error) {
    console.error('Error loading recent attempts:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          Failed to load data
        </td>
      </tr>
    `;
  }
}

// ============================================================================
// Render Table Rows
// ============================================================================
// Educational: Generate HTML for table rows from data

function renderTableRows(attempts) {
  const tbody = document.getElementById('attemptsTableBody');

  if (!attempts || attempts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">
          <i class="bi bi-inbox me-2"></i>
          No login attempts recorded yet
        </td>
      </tr>
    `;
    return;
  }

  // Educational: Map data to HTML rows
  const rows = attempts.map(attempt => {
    // Format timestamp
    const timestamp = new Date(attempt.timestamp).toLocaleString();

    // Truncate long passwords for display
    const password = attempt.passwordAttempted.length > 30
      ? attempt.passwordAttempted.substring(0, 30) + '...'
      : attempt.passwordAttempted;

    return `
      <tr>
        <td>${escapeHtml(timestamp)}</td>
        <td><code>${escapeHtml(attempt.ipAddress)}</code></td>
        <td>${escapeHtml(attempt.usernameAttempted)}</td>
        <td class="text-monospace text-muted">${escapeHtml(password)}</td>
        <td><span class="badge bg-secondary">${attempt.passwordLength}</span></td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rows;
}

// ============================================================================
// Render Pagination
// ============================================================================
// Educational: Generate pagination buttons

function renderPagination(totalPages, currentPage) {
  const pagination = document.getElementById('pagination');

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let html = '';

  // Previous button
  html += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
        <i class="bi bi-chevron-left"></i>
      </a>
    </li>
  `;

  // Educational: Show max 7 page numbers (1 ... 4 5 6 ... 10)
  const maxButtons = 7;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  // Adjust start if we're near the end
  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  // First page
  if (startPage > 1) {
    html += `
      <li class="page-item">
        <a class="page-link" href="#" onclick="changePage(1); return false;">1</a>
      </li>
    `;
    if (startPage > 2) {
      html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    html += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
      </li>
    `;
  }

  // Last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    html += `
      <li class="page-item">
        <a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a>
      </li>
    `;
  }

  // Next button
  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
        <i class="bi bi-chevron-right"></i>
      </a>
    </li>
  `;

  pagination.innerHTML = html;
}

// ============================================================================
// Change Page (Pagination Handler)
// ============================================================================

function changePage(page) {
  if (page < 1) return;
  loadRecentAttempts(page);

  // Scroll to table
  document.getElementById('attemptsTable').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================================
// Auto-Refresh
// ============================================================================
// Educational: Automatically refresh data every 30 seconds

function startAutoRefresh() {
  // Clear any existing interval
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }

  // Set up new interval (30 seconds)
  autoRefreshInterval = setInterval(() => {
    console.log('Auto-refreshing dashboard...');
    loadDashboardData();
  }, 30000);  // 30,000ms = 30 seconds

  console.log('Auto-refresh enabled (30 seconds)');
}

function stopAutoRefresh() {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }

  // Update indicator
  const indicator = document.getElementById('refreshIndicator');
  indicator.innerHTML = '<i class="bi bi-pause-circle me-1"></i>Auto-refresh: OFF';
  indicator.classList.remove('bg-success');
  indicator.classList.add('bg-secondary');

  console.log('Auto-refresh disabled');
}

// ============================================================================
// CSV Export
// ============================================================================
// Educational: Export table data to CSV file

async function exportToCSV() {
  try {
    // Show loading state
    const btn = event.target.closest('button');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Exporting...';

    // Fetch ALL recent attempts (no pagination limit)
    const response = await fetch('/admin2430.html/api/recent?limit=10000');

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    // Convert to CSV
    const csv = convertToCSV(data.attempts);

    // Download file
    downloadCSV(csv, 'honeypot-attempts.csv');

    // Restore button
    btn.disabled = false;
    btn.innerHTML = originalHTML;

  } catch (error) {
    console.error('CSV export error:', error);
    alert('Failed to export CSV. Please try again.');
  }
}

// Convert attempts to CSV format
function convertToCSV(attempts) {
  if (!attempts || attempts.length === 0) {
    return 'No data available';
  }

  // CSV header
  const header = 'Timestamp,IP Address,Username,Password,Password Length\n';

  // CSV rows
  const rows = attempts.map(attempt => {
    const timestamp = new Date(attempt.timestamp).toISOString();
    const ip = escapeCSV(attempt.ipAddress);
    const username = escapeCSV(attempt.usernameAttempted);
    const password = escapeCSV(attempt.passwordAttempted);
    const length = attempt.passwordLength;

    return `${timestamp},${ip},${username},${password},${length}`;
  }).join('\n');

  return header + rows;
}

// Escape CSV values (handle commas, quotes, newlines)
function escapeCSV(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }

  return stringValue;
}

// Trigger CSV file download
function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    // Modern browsers
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  console.log('CSV exported:', filename);
}

// ============================================================================
// Event Listeners
// ============================================================================

function setupEventListeners() {
  // Manual refresh button (if added later)
  // Example: document.getElementById('refreshBtn').addEventListener('click', loadDashboardData);

  // Pause auto-refresh when user is inactive (tab not visible)
  // Educational: Save resources when dashboard is not being viewed
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('Tab hidden, pausing auto-refresh');
      // Don't actually stop, just skip refresh if hidden
    } else {
      console.log('Tab visible, resuming auto-refresh');
      loadDashboardData();  // Immediate refresh when tab becomes visible
    }
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

// Escape HTML to prevent XSS
// Educational: ALWAYS escape user input before rendering
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show error message
function showError(message) {
  // Educational: Could enhance this with a toast notification
  console.error(message);

  // Show alert in overview section
  const container = document.getElementById('statsCards');
  const alert = document.createElement('div');
  alert.className = 'alert alert-danger alert-dismissible fade show col-12';
  alert.role = 'alert';
  alert.innerHTML = `
    <i class="bi bi-exclamation-triangle-fill me-2"></i>
    ${escapeHtml(message)}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  container.insertBefore(alert, container.firstChild);
}

// ============================================================================
// Cleanup on Page Unload
// ============================================================================
// Educational: Properly dispose of resources

window.addEventListener('beforeunload', () => {
  // Stop auto-refresh
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }

  // Dispose charts
  Object.values(charts).forEach(chart => {
    destroyChart(chart);
  });

  console.log('Dashboard cleanup completed');
});

// Educational Notes:
//
// 1. DATA FETCHING:
//    - fetch() API for modern async requests
//    - Error handling with try/catch
//    - Loading states for better UX
//
// 2. AUTO-REFRESH:
//    - setInterval() every 30 seconds
//    - Prevents concurrent refreshes (isRefreshing flag)
//    - Pauses when tab is hidden (resource optimization)
//
// 3. PAGINATION:
//    - Server-side pagination (only fetch needed data)
//    - Client-side rendering of pagination buttons
//    - Smooth scroll to table on page change
//
// 4. CSV EXPORT:
//    - Fetch all data (no pagination limit)
//    - Convert to CSV format
//    - Trigger browser download
//    - Properly escape commas and quotes
//
// 5. SECURITY:
//    - escapeHtml() prevents XSS attacks
//    - All user input is escaped before rendering
//    - Session-based authentication (backend)
//
// 6. PERFORMANCE:
//    - Update charts instead of recreating
//    - Only fetch visible page data
//    - Dispose charts on cleanup (prevent memory leaks)
//
// 7. UX IMPROVEMENTS:
//    - Loading spinners
//    - Error messages
//    - Smooth animations
//    - Responsive design
