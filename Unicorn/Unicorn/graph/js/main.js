// DOM Elements
const businessForm = document.getElementById('business-form');
const formSection = document.getElementById('form-section');
const resultsSection = document.getElementById('results-section');
const loadingOverlay = document.getElementById('loading-overlay');
const backButton = document.getElementById('back-button');
const analyzeButton = document.getElementById('analyze-button');
const predictionResult = document.getElementById('prediction-result');
const predictionReason = document.getElementById('prediction-reason');
const businessSummaryContent = document.getElementById('business-summary-content');

// Global variables
let chart = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  businessForm.addEventListener('submit', handleFormSubmit);
  backButton.addEventListener('click', showForm);
  
  // Add animation to form groups
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach((group, index) => {
    group.style.opacity = '0';
    group.style.animation = `fadeIn 0.5s ease forwards ${index * 0.05}s`;
  });
});

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();
  
  // Validate form
  if (!businessForm.checkValidity()) {
    businessForm.reportValidity();
    return;
  }
  
  // Show loading overlay
  loadingOverlay.classList.remove('hidden');
  loadingOverlay.classList.add('visible');
  
  // Get form data
  const formData = new FormData(businessForm);
  const businessData = Object.fromEntries(formData.entries());
  
  try {
    // Call the mock API (will be replaced with Gemini API later)
    const response = await mockGeminiApiCall(businessData);
    
    // Hide loading overlay
    loadingOverlay.classList.remove('visible');
    setTimeout(() => {
      loadingOverlay.classList.add('hidden');
    }, 300);
    
    // Display results
    displayResults(businessData, response);
  } catch (error) {
    console.error('Error:', error);
    
    // Hide loading overlay
    loadingOverlay.classList.remove('visible');
    setTimeout(() => {
      loadingOverlay.classList.add('hidden');
    }, 300);
    
    // Show error message
    alert('An error occurred while analyzing your startup. Please try again.');
  }
}

// Mock Gemini API call (placeholder for actual API)
async function mockGeminiApiCall(businessData) {
  // This is a mock function that simulates an API call
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Analyze the business data and return a prediction
      const prediction = analyzeBusiness(businessData);
      
      // Return the prediction
      resolve(prediction);
    }, 2000); // Simulate 2 second delay
  });
}

// Mock business analysis (will be replaced with Gemini API)
function analyzeBusiness(data) {
  let score = 0;
  const maxScore = 100;
  
  // Calculate a simple score based on various factors
  // 1. Business model factor
  if (['saas', 'subscription'].includes(data.businessModel)) {
    score += 20;
  } else if (['marketplace', 'ecommerce'].includes(data.businessModel)) {
    score += 15;
  } else {
    score += 10;
  }
  
  // 2. Financial health
  const capital = parseInt(data.startupCapital);
  const costs = parseInt(data.monthlyCosts);
  const revenue = parseInt(data.revenue);
  
  // Runway calculation (months)
  const runway = costs > 0 ? capital / costs : 0;
  
  if (runway > 18) score += 20;
  else if (runway > 12) score += 15;
  else if (runway > 6) score += 10;
  else score += 5;
  
  // 3. Unit economics
  const cac = parseInt(data.cac);
  const clv = parseInt(data.clv);
  const clvCacRatio = cac > 0 ? clv / cac : 0;
  
  if (clvCacRatio > 3) score += 20;
  else if (clvCacRatio > 2) score += 15;
  else if (clvCacRatio > 1) score += 10;
  else score += 5;
  
  // 4. Team strength
  const teamSize = parseInt(data.teamSize);
  const founderExperience = parseInt(data.founderExperience);
  
  if (founderExperience > 5 && teamSize > 3) score += 15;
  else if (founderExperience > 3 || teamSize > 2) score += 10;
  else score += 5;
  
  // 5. Market factors
  const marketSize = parseInt(data.marketSize);
  const competitorStrength = data.competitorStrength;
  
  if (marketSize > 100 && ['weak', 'very-weak'].includes(competitorStrength)) {
    score += 15;
  } else if (marketSize > 50 || ['weak', 'medium'].includes(competitorStrength)) {
    score += 10;
  } else {
    score += 5;
  }
  
  // 6. Product readiness
  const productReadiness = data.productReadiness;
  
  if (['launched', 'scaling'].includes(productReadiness)) {
    score += 10;
  } else if (['beta', 'mvp'].includes(productReadiness)) {
    score += 7;
  } else {
    score += 3;
  }
  
  // Ensure score doesn't exceed max
  score = Math.min(score, maxScore);
  
  // Generate growth projection data
  const growthFactor = score / 100;
  const baseGrowth = -20; // Starting point can be negative
  const chartData = [];
  const years = 10;
  
  for (let year = 0; year <= years; year++) {
    // Calculate growth using a more complex formula
    const growth = baseGrowth + (year * growthFactor * 15) + 
                  (Math.pow(year, 1.5) * growthFactor * 2);
    // Clamp growth between -50 and 100
    chartData.push(Math.max(-50, Math.min(100, growth)));
  }
  
  // Generate detailed analysis based on the score and metrics
  let prediction, reason;
  const analysis = [];
  
  if (score >= 75) {
    prediction = "Highly likely to succeed";
    reason = "Strong fundamentals across key success metrics";
    analysis.push(
      `${data.businessName} shows exceptional potential in the ${data.industry} sector.`,
      `With a healthy runway of ${Math.round(runway)} months and strong unit economics (CLV/CAC ratio of ${clvCacRatio.toFixed(1)}x), the business demonstrates solid financial planning.`,
      `The ${data.businessModel} model is well-suited for scalable growth, supported by a ${data.productReadiness} product.`,
      `The experienced founding team (${data.founderExperience} years) and current team size of ${data.teamSize} provides strong execution capability.`,
      `Market conditions are favorable with ${data.demandLevel} demand and ${data.competitorStrength} competition.`,
      `The ${data.growthStrategy} growth strategy aligns well with the ${data.fundingPlan} funding approach.`,
      `Geographic focus on ${data.geoFocus} markets presents significant expansion opportunities.`,
      `The combination of strong market positioning and solid execution capability suggests high probability of success.`
    );
  } else if (score >= 60) {
    prediction = "Likely to succeed";
    reason = "Good foundation with some areas for optimization";
    analysis.push(
      `${data.businessName} shows promising potential in the ${data.industry} sector.`,
      `The business has a reasonable runway of ${Math.round(runway)} months, though unit economics could be improved (CLV/CAC ratio: ${clvCacRatio.toFixed(1)}x).`,
      `The ${data.businessModel} model provides a good foundation for growth.`,
      `Team experience (${data.founderExperience} years) is solid, though scaling the team from ${data.teamSize} members may be needed.`,
      `Market conditions show ${data.demandLevel} demand with ${data.competitorStrength} competition, presenting opportunities.`,
      `The ${data.growthStrategy} strategy appears viable but may need refinement.`,
      `Focus on ${data.geoFocus} markets aligns with current capabilities.`
    );
  } else if (score >= 40) {
    prediction = "Success requires optimization";
    reason = "Several key metrics need improvement";
    analysis.push(
      `${data.businessName} faces some challenges in the ${data.industry} sector.`,
      `The runway of ${Math.round(runway)} months and unit economics (CLV/CAC: ${clvCacRatio.toFixed(1)}x) need attention.`,
      `The ${data.businessModel} model may need refinement for better market fit.`,
      `Team expansion beyond current ${data.teamSize} members and additional experience may be needed.`,
      `Market conditions (${data.demandLevel} demand, ${data.competitorStrength} competition) present both opportunities and challenges.`,
      `The ${data.growthStrategy} strategy may need revision to ensure sustainable growth.`,
      `Consider optimizing the approach to ${data.geoFocus} markets.`
    );
  } else {
    prediction = "Significant challenges ahead";
    reason = "Core metrics require substantial improvement";
    analysis.push(
      `${data.businessName} faces significant challenges in the current form.`,
      `The limited runway of ${Math.round(runway)} months and weak unit economics (CLV/CAC: ${clvCacRatio.toFixed(1)}x) are concerning.`,
      `The ${data.businessModel} model may need fundamental restructuring.`,
      `Current team size of ${data.teamSize} and experience level may be insufficient.`,
      `Market conditions and competitive landscape present substantial challenges.`,
      `The ${data.growthStrategy} strategy needs comprehensive revision.`,
      `Consider re-evaluating the approach to ${data.geoFocus} markets.`
    );
  }
  
  return {
    prediction,
    reason,
    chartData,
    score,
    analysis: analysis.join('\n\n')
  };
}

// Display results
function displayResults(businessData, response) {
  // Hide form and show results
  formSection.style.display = 'none';
  resultsSection.classList.remove('hidden');
  
  // Add a small delay for the animation
  setTimeout(() => {
    resultsSection.classList.add('visible');
  }, 10);
  
  // Set prediction and reason
  predictionResult.textContent = response.prediction;
  predictionReason.textContent = response.reason;
  
  // Add detailed analysis
  const analysisElement = document.createElement('div');
  analysisElement.className = 'detailed-analysis';
  analysisElement.innerHTML = response.analysis.split('\n\n').map(para => 
    `<p>${para}</p>`
  ).join('');
  
  // Clear previous analysis if exists
  const existingAnalysis = document.querySelector('.detailed-analysis');
  if (existingAnalysis) {
    existingAnalysis.remove();
  }
  
  // Add new analysis after prediction reason
  predictionReason.parentNode.insertBefore(analysisElement, predictionReason.nextSibling);
  
  // Set prediction badge color
  predictionResult.className = 'prediction-badge';
  if (response.score >= 75) {
    predictionResult.classList.add('success');
  } else if (response.score >= 60) {
    predictionResult.classList.add('success');
  } else if (response.score >= 40) {
    predictionResult.classList.add('warning');
  } else {
    predictionResult.classList.add('danger');
  }
  
  // Create business summary
  createBusinessSummary(businessData);
  
  // Create chart
  createChart(response.chartData);
}

// Create business summary
function createBusinessSummary(data) {
  // Clear previous content
  businessSummaryContent.innerHTML = '';
  
  // Define key metrics to display
  const summaryItems = [
    { label: 'Business Name', value: data.businessName },
    { label: 'Industry', value: formatValue(data.industry) },
    { label: 'Business Model', value: formatValue(data.businessModel) },
    { label: 'Startup Capital', value: formatCurrency(data.startupCapital) },
    { label: 'Monthly Costs', value: formatCurrency(data.monthlyCosts) },
    { label: 'Current Revenue', value: formatCurrency(data.revenue) },
    { label: 'Market Size', value: `$${data.marketSize}M` },
    { label: 'Team Size', value: data.teamSize },
    { label: 'CAC', value: formatCurrency(data.cac) },
    { label: 'CLV', value: formatCurrency(data.clv) },
    { label: 'Product Stage', value: formatValue(data.productReadiness) },
    { label: 'Growth Strategy', value: formatValue(data.growthStrategy) }
  ];
  
  // Add summary items to the content
  summaryItems.forEach(item => {
    const summaryItem = document.createElement('div');
    summaryItem.className = 'summary-item';
    
    const summaryLabel = document.createElement('div');
    summaryLabel.className = 'summary-label';
    summaryLabel.textContent = item.label;
    
    const summaryValue = document.createElement('div');
    summaryValue.className = 'summary-value';
    summaryValue.textContent = item.value;
    
    summaryItem.appendChild(summaryLabel);
    summaryItem.appendChild(summaryValue);
    
    businessSummaryContent.appendChild(summaryItem);
  });
}

// Create chart
function createChart(chartData) {
  const ctx = document.getElementById('growth-chart').getContext('2d');
  
  // Destroy previous chart if it exists
  if (chart) {
    chart.destroy();
  }
  
  // Create labels for years
  const labels = Array.from({ length: chartData.length }, (_, i) => `Year ${i}`);
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(138, 43, 226, 0.2)');
  gradient.addColorStop(1, 'rgba(138, 43, 226, 0.0)');
  
  // Create the chart
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Projected Growth',
        data: chartData,
        fill: true,
        backgroundColor: gradient,
        borderColor: 'rgba(138, 43, 226, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(138, 43, 226, 1)',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Growth: ${context.raw.toFixed(1)}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: -50,
          max: 100,
          title: {
            display: true,
            text: 'Growth (%)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            callback: function(value) {
              return value + '%';
            },
            stepSize: 25
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Timeline (Years)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart'
      }
    }
  });
}

// Show form
function showForm() {
  // Hide results and show form
  resultsSection.classList.remove('visible');
  
  // Add a small delay to allow the animation to complete
  setTimeout(() => {
    resultsSection.classList.add('hidden');
    formSection.style.display = 'block';
  }, 300);
  
  // Reset prediction badge classes
  predictionResult.classList.remove('success', 'warning', 'danger');
}

// Helper functions
function formatValue(value) {
  if (!value) return 'N/A';
  
  // Convert kebab-case or snake_case to Title Case
  return value
    .replace(/-|_/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function formatCurrency(value) {
  if (!value) return 'N/A';
  
  // Format as currency
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}