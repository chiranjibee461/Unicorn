/**
 * Utility functions for the Business Idea Refiner application
 */

// DOM manipulation helpers
const utils = {
  /**
   * Show a section and hide others
   * @param {string} sectionId - The ID of the section to show
   */
  showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  },
  
  /**
   * Format a list of steps into HTML list items
   * @param {Array} steps - Array of step strings
   * @returns {string} HTML string with formatted list items
   */
  formatSteps(steps) {
    if (!Array.isArray(steps)) {
      console.error('Steps is not an array:', steps);
      return '';
    }
    
    return steps.map((step, index) => {
      return `<li data-step="${index + 1}">${step}</li>`;
    }).join('');
  },
  
  /**
   * Display an error message to the user
   * @param {string} message - Error message to display
   */
  showError(message) {
    alert(`Error: ${message}`);
    this.showSection('input-section');
  },
  
  /**
   * Extract SVG content from a response
   * @param {string} text - Text that may contain SVG content
   * @returns {string|null} SVG content or null if not found
   */
  extractSvgContent(text) {
    const svgRegex = /<svg[\s\S]*?<\/svg>/i;
    const match = text.match(svgRegex);
    return match ? match[0] : null;
  },
  
  /**
   * Creates a button element
   * @param {string} text - Button text
   * @param {string} className - CSS class name
   * @param {Function} onClick - Click event handler
   * @returns {HTMLButtonElement} The created button
   */
  createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.addEventListener('click', onClick);
    return button;
  },
  
  /**
   * Safely parse JSON with error handling
   * @param {string} jsonString - JSON string to parse
   * @param {any} defaultValue - Default value to return on error
   * @returns {any} Parsed object or default value
   */
  safeJsonParse(jsonString, defaultValue = {}) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return defaultValue;
    }
  },
  
  /**
   * Creates a delay using Promise
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after the delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  /**
   * Get form data as an object
   * @param {HTMLFormElement} form - Form element
   * @returns {Object} Form data as key-value pairs
   */
  getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }
};

// Export the utils object
window.utils = utils;