import { initForm } from './form.js';
import { fetchAdvice } from './api.js';
import { renderAdvice, showLoading, hideLoading } from './render.js';

// Initialize magic cursor
const initMagicCursor = () => {
  const cursor = document.querySelector('.magic-cursor');
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.opacity = '0.7';
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    
    // Increase size when near clickable elements
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element && (
      element.tagName === 'BUTTON' || 
      element.tagName === 'SELECT' || 
      element.tagName === 'INPUT' || 
      element.tagName === 'TEXTAREA' || 
      element.closest('button') ||
      element.closest('select') ||
      element.closest('input') ||
      element.closest('textarea')
    )) {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
    } else {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
    }
  });
  
  document.addEventListener('mouseout', () => {
    cursor.style.opacity = '0';
  });
  
  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
  });
  
  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });
};

// Show form section
const showFormSection = () => {
  document.getElementById('formSection').classList.remove('hidden');
  document.getElementById('outputSection').classList.add('hidden');
};

// Show output section
const showOutputSection = () => {
  document.getElementById('formSection').classList.add('hidden');
  document.getElementById('outputSection').classList.remove('hidden');
};

// Initialize back button
const initBackButton = () => {
  const backBtn = document.getElementById('backBtn');
  backBtn.addEventListener('click', showFormSection);
};

// Main initialization function
const init = () => {
  // Initialize UI components
  initMagicCursor();
  initBackButton();
  
  // Initialize form with submission handler
  initForm(async (formData) => {
    // Show output section and loading animation
    showOutputSection();
    showLoading();
    
    try {
      // Fetch advice from API
      const adviceData = await fetchAdvice(formData);
      
      // Hide loading and render advice
      hideLoading();
      renderAdvice(adviceData);
    } catch (error) {
      console.error('Error fetching advice:', error);
      
      // Show error message
      hideLoading();
      renderAdvice({
        error: true,
        message: 'Sorry, we encountered an error while conjuring your magical advice. Please try again later.'
      });
    }
  });
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);