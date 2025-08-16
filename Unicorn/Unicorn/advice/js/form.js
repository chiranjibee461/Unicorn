// Initialize the business form
export const initForm = (onSubmit) => {
  const form = document.getElementById('businessForm');
  const inputs = form.querySelectorAll('input, textarea, select');
  
  // Function to validate the form
  const validateForm = () => {
    let isValid = true;
    
    inputs.forEach(input => {
      // Remove any existing error classes
      input.classList.remove('error');
      
      // Check if the input is required and empty
      if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.add('error');
        isValid = false;
      }
    });
    
    return isValid;
  };
  
  // Function to get form data
  const getFormData = () => {
    const formData = {
      businessIdea: document.getElementById('businessIdea').value,
      industry: document.getElementById('industry').value,
      stage: document.getElementById('stage').value,
      region: document.getElementById('region').value,
      capital: document.getElementById('capital').value,
      timeline: document.getElementById('timeline').value,
      experience: document.getElementById('experience').value,
      platform: document.getElementById('platform').value
    };
    
    return formData;
  };
  
  // Add shake animation to error fields
  inputs.forEach(input => {
    input.addEventListener('animationend', () => {
      input.classList.remove('error');
    });
  });
  
  // Add focus effect to form groups
  inputs.forEach(input => {
    const formGroup = input.closest('.form-group');
    
    input.addEventListener('focus', () => {
      formGroup.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      formGroup.classList.remove('focused');
    });
  });
  
  // Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Add shake animation to the form if invalid
      form.classList.add('error');
      setTimeout(() => {
        form.classList.remove('error');
      }, 500);
      return;
    }
    
    // Get form data
    const formData = getFormData();
    
    // Call the onSubmit callback with the form data
    onSubmit(formData);
  });
  
  return {
    reset: () => form.reset(),
    getFormData
  };
};
