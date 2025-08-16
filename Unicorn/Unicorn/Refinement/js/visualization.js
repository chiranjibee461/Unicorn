/**
 * Visualization functionality for the Business Idea Refiner application
 * Handles SVG rendering and chart creation
 */

const visualization = {
  /**
   * Renders the SVG content in the visualization container
   * @param {string} svgContent - The SVG content to render
   * @returns {boolean} Success status
   */
  renderSvg(svgContent) {
    const container = document.getElementById('visualization-container');
    if (!container) return false;
    
    if (svgContent) {
      container.innerHTML = svgContent;
      return true;
    }
    
    return false;
  },
  
  /**
   * Creates a flowchart visualization from roadmap steps if SVG is not provided
   * @param {Array} steps - The roadmap steps
   * @returns {void}
   */
  createFlowchart(steps) {
    const container = document.getElementById('visualization-container');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create canvas element for Chart.js
    const canvas = document.createElement('canvas');
    canvas.id = 'flowchart-canvas';
    container.appendChild(canvas);
    
    // Define colors for different stages
    const backgroundColors = steps.map((_, index) => {
      const stagePercentage = index / (steps.length - 1);
      if (stagePercentage < 0.33) return '#3563E9'; // Primary for early stages
      if (stagePercentage < 0.66) return '#0EA5E9'; // Secondary for middle stages
      return '#F59E0B'; // Accent for late stages
    });
    
    // Create labels from steps (shortened for better display)
    const labels = steps.map(step => {
      const words = step.split(' ');
      if (words.length > 3) {
        return words.slice(0, 3).join(' ') + '...';
      }
      return step;
    });
    
    // Create dataset with dummy data (just for visualization)
    const data = steps.map((_, index) => 100 - index * (100 / steps.length));
    
    // Create chart using Chart.js
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Implementation Progress',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 2,
          pointBackgroundColor: backgroundColors,
          pointBorderColor: '#fff',
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return steps[context.dataIndex];
              }
            }
          }
        },
        scales: {
          y: {
            display: false,
            beginAtZero: true
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
    
    // Add explanatory text
    const explanationEl = document.createElement('p');
    explanationEl.textContent = 'Implementation Roadmap Timeline';
    explanationEl.style.textAlign = 'center';
    explanationEl.style.marginTop = '10px';
    explanationEl.style.fontWeight = 'bold';
    container.appendChild(explanationEl);
  },
  
  /**
   * Animate the roadmap steps in sequence
   * @returns {void}
   */
  animateRoadmapSteps() {
    const steps = document.querySelectorAll('#implementation-steps li');
    
    steps.forEach((step, index) => {
      // Add animation with delay based on index
      setTimeout(() => {
        step.classList.add('animated');
      }, 300 * index);
    });
  },
  
  /**
   * Initialize visualization based on API response
   * @param {Object} apiResponse - The parsed API response
   * @returns {void}
   */
  initVisualization(apiResponse) {
    // Try to render SVG if available
    const svgRendered = this.renderSvg(apiResponse.svgContent);
    
    // If SVG rendering fails, create a Chart.js visualization
    if (!svgRendered && apiResponse.roadmap.length > 0) {
      this.createFlowchart(apiResponse.roadmap);
    }
    
    // Animate the roadmap steps
    this.animateRoadmapSteps();
  }
};

// Export the visualization module
window.visualization = visualization;