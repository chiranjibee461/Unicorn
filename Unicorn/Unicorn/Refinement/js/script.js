/**
 * Main application logic for the Business Idea Refiner
 * Handles user interactions, form submission, and result display
 */

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
  // Form and elements
  const ideaForm = document.getElementById('idea-form');
  const submitBtn = document.getElementById('submit-btn');
  const backButton = document.getElementById('back-button');
  
  // Results elements
  const refinedIdeaEl = document.getElementById('refined-idea');
  const implementationStepsEl = document.getElementById('implementation-steps');
  const visualizationContainer = document.getElementById('visualization-container');
  
  /**
   * Initialize form input fields with IDs
   */
  function initializeFormFields() {
    // Add name attributes to form fields for easier form data collection
    document.getElementById('business-idea').name = 'businessIdea';
    document.getElementById('industry').name = 'industry';
    document.getElementById('target-customer').name = 'targetCustomer';
    document.getElementById('funding').name = 'funding';
    document.getElementById('timeframe').name = 'timeframe';
    document.getElementById('tech-focus').name = 'techFocus';
  }
  
  /**
   * Handle form submission
   * @param {Event} e - Form submission event
   */
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Processing...</span><i class="fa-solid fa-spinner fa-spin"></i>';
    
    // Show loading section
    utils.showSection('loading-section');
    
    try {
      // Get form data
      const formData = {
        businessIdea: document.getElementById('business-idea').value,
        industry: document.getElementById('industry').value,
        targetCustomer: document.getElementById('target-customer').value,
        funding: document.getElementById('funding').value,
        timeframe: document.getElementById('timeframe').value,
        techFocus: document.getElementById('tech-focus').value
      };
      
      // Validate form data
      if (!validateFormData(formData)) {
        throw new Error('Please fill out all required fields.');
      }
      
      // Call API to get idea refinement
      const response = await apiService.getIdeaRefinement(formData);
      
      // Display results
      displayResults(response);
      
      // Show results section
      utils.showSection('results-section');
    } catch (error) {
      console.error('Error:', error);
      utils.showError(error.message);
    } finally {
      // Reset submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Refine My Idea</span><i class="fa-solid fa-arrow-right"></i>';
    }
  }
  
  /**
   * Validate form data to ensure all required fields are filled
   * @param {Object} formData - The form data to validate
   * @returns {boolean} Is the form data valid
   */
  function validateFormData(formData) {
    for (const key in formData) {
      if (!formData[key]) {
        return false;
      }
    }
    return true;
  }
  
  /**
   * Display the API response results in the UI
   * @param {Object} response - The parsed API response
   */
  function displayResults(response) {
    // Display refined idea
    refinedIdeaEl.textContent = response.refinedIdea;
    
    // Display implementation steps
    implementationStepsEl.innerHTML = utils.formatSteps(response.roadmap);
    
    // Initialize visualization
    visualization.initVisualization(response);
  }
  
  /**
   * Handle back button click
   */
  function handleBackClick() {
    // Clear previous results
    refinedIdeaEl.textContent = '';
    implementationStepsEl.innerHTML = '';
    visualizationContainer.innerHTML = '';
    
    // Show input section
    utils.showSection('input-section');
  }
  
  /**
   * Initialize the application
   */
  function init() {
    // Initialize form fields
    initializeFormFields();
    
    // Add event listeners
    ideaForm.addEventListener('submit', handleSubmit);
    backButton.addEventListener('click', handleBackClick);
    
    // Show input section initially
    utils.showSection('input-section');
    
    console.log('Business Idea Refiner initialized!');
  }
  
  // Initialize the application
  init();
});