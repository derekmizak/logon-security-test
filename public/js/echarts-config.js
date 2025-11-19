// ECharts Configuration Helper Functions
// Educational: Reusable chart configurations for consistent styling
//
// Purpose:
// 1. Centralize chart styling and themes
// 2. Provide helper functions for common chart types
// 3. Ensure responsive design across devices
// 4. Maintain consistent color schemes

// ============================================================================
// Color Palette
// ============================================================================
// Educational: Professional color scheme for security dashboards

const COLORS = {
  primary: '#0d6efd',
  danger: '#dc3545',
  success: '#198754',
  warning: '#ffc107',
  info: '#0dcaf0',
  dark: '#212529',
  light: '#f8f9fa',

  // Gradient colors for charts
  gradients: {
    blue: ['#667eea', '#764ba2'],
    red: ['#f83600', '#f9d423'],
    green: ['#11998e', '#38ef7d'],
    purple: ['#8E2DE2', '#4A00E0']
  },

  // Chart series colors (8 distinct colors)
  series: [
    '#5470c6', '#91cc75', '#fac858', '#ee6666',
    '#73c0de', '#3ba272', '#fc8452', '#9a60b4'
  ]
};

// ============================================================================
// Base Chart Configuration
// ============================================================================
// Educational: Default configuration applied to all charts

function getBaseConfig() {
  return {
    // Animation settings
    animation: true,
    animationDuration: 750,
    animationEasing: 'cubicOut',

    // Grid layout (chart margins)
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true  // Ensure labels don't get cut off
    },

    // Tooltip configuration
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#333',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(150, 150, 150, 0.1)'
        }
      }
    },

    // Responsive: Enable media queries for mobile
    media: [
      {
        query: { maxWidth: 768 },
        option: {
          grid: { left: '5%', right: '5%' },
          textStyle: { fontSize: 10 }
        }
      }
    ]
  };
}

// ============================================================================
// Timeline Chart (Line Chart)
// ============================================================================
// Educational: Login attempts over time

function createTimelineChart(containerId, data) {
  const chart = echarts.init(document.getElementById(containerId));

  // Extract dates and counts from data
  const dates = data.map(item => item.date);
  const counts = data.map(item => item.count);

  const option = {
    ...getBaseConfig(),

    title: {
      text: 'Daily Login Attempts',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#666'
      }
    },

    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        rotate: 45,
        fontSize: 11
      },
      axisLine: {
        lineStyle: { color: '#ddd' }
      }
    },

    yAxis: {
      type: 'value',
      name: 'Attempts',
      nameLocation: 'middle',
      nameGap: 50,
      minInterval: 1,  // Prevent decimal values
      axisLine: {
        lineStyle: { color: '#ddd' }
      }
    },

    series: [{
      name: 'Login Attempts',
      type: 'line',
      data: counts,
      smooth: true,  // Smooth line curves
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: COLORS.primary
      },
      itemStyle: {
        color: COLORS.primary,
        borderWidth: 2,
        borderColor: '#fff'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(13, 110, 253, 0.3)' },
            { offset: 1, color: 'rgba(13, 110, 253, 0.05)' }
          ]
        }
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 10,
          shadowColor: COLORS.primary
        }
      }
    }],

    // Toolbox features (save as image, zoom, etc.)
    toolbox: {
      feature: {
        saveAsImage: {
          title: 'Save as Image',
          pixelRatio: 2
        },
        dataZoom: {
          title: { zoom: 'Zoom', back: 'Reset' }
        }
      },
      right: 20
    }
  };

  chart.setOption(option);

  // Educational: Make chart responsive
  window.addEventListener('resize', () => chart.resize());

  return chart;
}

// ============================================================================
// Bar Chart (Horizontal)
// ============================================================================
// Educational: Top IPs or usernames

function createBarChart(containerId, data, options = {}) {
  const chart = echarts.init(document.getElementById(containerId));

  // Extract labels and values
  const labels = data.map(item => item.label);
  const values = data.map(item => item.value);

  const option = {
    ...getBaseConfig(),

    title: {
      text: options.title || 'Top Items',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#666'
      }
    },

    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },

    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#ddd' } }
    },

    yAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: '#ddd' } },
      axisLabel: {
        fontSize: 11,
        // Educational: Truncate long labels
        formatter: (value) => {
          return value.length > 20 ? value.substring(0, 20) + '...' : value;
        }
      }
    },

    series: [{
      name: options.seriesName || 'Count',
      type: 'bar',
      data: values,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: options.color || COLORS.danger },
            { offset: 1, color: options.color ? options.color + 'aa' : COLORS.danger + 'aa' }
          ]
        },
        borderRadius: [0, 5, 5, 0]  // Rounded right corners
      },
      label: {
        show: true,
        position: 'right',
        fontSize: 11,
        color: '#666'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        }
      }
    }],

    toolbox: {
      feature: {
        saveAsImage: {
          title: 'Save as Image',
          pixelRatio: 2
        }
      },
      right: 20
    }
  };

  chart.setOption(option);

  // Responsive
  window.addEventListener('resize', () => chart.resize());

  return chart;
}

// ============================================================================
// Pie Chart
// ============================================================================
// Educational: Request distribution by path

function createPieChart(containerId, data, options = {}) {
  const chart = echarts.init(document.getElementById(containerId));

  // Format data for ECharts pie chart
  const pieData = data.map(item => ({
    name: item.label,
    value: item.value
  }));

  const option = {
    animation: true,
    animationDuration: 750,

    title: {
      text: options.title || 'Distribution',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#666'
      }
    },

    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#333',
      textStyle: { color: '#fff' }
    },

    legend: {
      orient: 'vertical',
      right: 10,
      top: 'middle',
      textStyle: { fontSize: 11 }
    },

    series: [{
      name: options.seriesName || 'Requests',
      type: 'pie',
      radius: ['40%', '70%'],  // Donut chart
      center: ['40%', '50%'],
      data: pieData,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{d}%',
        fontSize: 11
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      // Use color palette
      color: COLORS.series
    }],

    toolbox: {
      feature: {
        saveAsImage: {
          title: 'Save as Image',
          pixelRatio: 2
        }
      },
      right: 20,
      top: 20
    }
  };

  chart.setOption(option);

  // Responsive
  window.addEventListener('resize', () => chart.resize());

  return chart;
}

// ============================================================================
// Update Chart Data (for auto-refresh)
// ============================================================================
// Educational: Update existing chart without destroying it (smooth transitions)

function updateChartData(chart, newData, chartType) {
  if (!chart) return;

  let option;

  if (chartType === 'timeline') {
    const dates = newData.map(item => item.date);
    const counts = newData.map(item => item.count);

    option = {
      xAxis: { data: dates },
      series: [{ data: counts }]
    };
  }
  else if (chartType === 'bar') {
    const labels = newData.map(item => item.label);
    const values = newData.map(item => item.value);

    option = {
      yAxis: { data: labels },
      series: [{ data: values }]
    };
  }
  else if (chartType === 'pie') {
    const pieData = newData.map(item => ({
      name: item.label,
      value: item.value
    }));

    option = {
      series: [{ data: pieData }]
    };
  }

  // Educational: notMerge: false allows smooth transitions
  chart.setOption(option, { notMerge: false, lazyUpdate: true });
}

// ============================================================================
// Destroy Chart (cleanup)
// ============================================================================
// Educational: Properly dispose of charts to prevent memory leaks

function destroyChart(chart) {
  if (chart && !chart.isDisposed()) {
    chart.dispose();
  }
}

// Educational Notes:
//
// 1. ECHARTS BASICS:
//    - ECharts uses a declarative configuration object
//    - Charts are rendered in a DOM container (div with id)
//    - Charts must be resized manually on window resize
//
// 2. CHART TYPES:
//    - Line: Time series data (trends over time)
//    - Bar: Comparisons (top IPs, usernames)
//    - Pie: Proportions (request distribution)
//
// 3. RESPONSIVE DESIGN:
//    - Use media queries in chart config
//    - Call chart.resize() on window resize
//    - Adjust font sizes for mobile
//
// 4. PERFORMANCE:
//    - Use updateChartData() instead of recreating charts
//    - Dispose charts when removing them (prevents memory leaks)
//    - Limit data points for large datasets (>1000 points)
//
// 5. CUSTOMIZATION:
//    - Color palette defined at top
//    - Base config applied to all charts
//    - Options object for per-chart customization
//
// 6. ACCESSIBILITY:
//    - Tooltips provide data on hover
//    - Labels show values directly on charts
//    - Toolbox allows saving as images
//
// 7. ADVANCED FEATURES:
//    - dataZoom: Zoom and pan controls
//    - saveAsImage: Export as PNG
//    - Animations: Smooth transitions
