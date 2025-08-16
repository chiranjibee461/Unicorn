// Show loading animation
export const showLoading = () => {
  document.getElementById('loadingContainer').classList.remove('hidden');
  document.getElementById('adviceContainer').classList.add('hidden');
};

// Hide loading animation
export const hideLoading = () => {
  document.getElementById('loadingContainer').classList.add('hidden');
  document.getElementById('adviceContainer').classList.remove('hidden');
};

// Render advice data
export const renderAdvice = (adviceData) => {
  const adviceContent = document.getElementById('adviceContent');
  adviceContent.innerHTML = '';
  
  // If there's an error, show error message
  if (adviceData.error) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = adviceData.message;
    adviceContent.appendChild(errorMessage);
    return;
  }
  
  // Create sections for each part of the advice
  const sections = [
    { title: '1. Funding Opportunities', content: adviceData.fundingOpportunities },
    { title: '2. Marketing Strategy', content: adviceData.marketingStrategy },
    { title: '3. Government Rules & Schemes', content: adviceData.governmentRules },
    { title: '4. Business Toolkits', content: adviceData.businessToolkits },
    { title: '5. Support Organizations & Mentors', content: adviceData.supportOrganizations },
    { title: '6. Visual Description', content: adviceData.visualDescription, className: 'visual-description' }
  ];
  
  // Render each section with a delay for animation
  sections.forEach((section, index) => {
    if (!section.content) return;
    
    const sectionElement = document.createElement('div');
    sectionElement.className = `advice-section ${section.className || ''}`;
    
    const title = document.createElement('h3');
    title.textContent = section.title;
    sectionElement.appendChild(title);
    
    const content = document.createElement('p');
    content.innerHTML = formatContent(section.content);
    sectionElement.appendChild(content);
    
    adviceContent.appendChild(sectionElement);
    
    // Add delay for animation
    setTimeout(() => {
      sectionElement.classList.add('visible');
    }, 300 * (index + 1));
  });
};

// Format content with line breaks and bullet points
const formatContent = (text) => {
  // Convert line breaks to paragraphs
  let formattedText = text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
  
  // Wrap in paragraph tags if not already
  if (!formattedText.startsWith('<p>')) {
    formattedText = `<p>${formattedText}</p>`;
  }
  
  // Convert numbered lists
  formattedText = formattedText.replace(/(\d+\.\s.+?)(<br>|<\/p>)/g, '<li>$1</li>$2');
  formattedText = formattedText.replace(/<li>(.+?)<\/li><br>/g, '<li>$1</li>');
  formattedText = formattedText.replace(/<p>(<li>)/g, '<p><ul>$1');
  formattedText = formattedText.replace(/<\/li><\/p>/g, '</li></ul></p>');
  
  return formattedText;
};