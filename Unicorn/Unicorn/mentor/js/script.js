// Constants
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const API_KEY = "AIzaSyABlN7ZLHElyj9lcaJmqaovvKrhgfK8Fv8"; // Replace with your actual Gemini API key

// DOM Elements
const startupForm = document.getElementById("startupForm");
const formSection = document.getElementById("formSection");
const resultsSection = document.getElementById("resultsSection");
const loadingContainer = document.getElementById("loadingContainer");
const errorContainer = document.getElementById("errorContainer");
const resultsGrid = document.getElementById("resultsGrid");
const backToFormBtn = document.getElementById("backToFormBtn");
const retryBtn = document.getElementById("retryBtn");
const submitBtn = document.getElementById("submitBtn");

// Role-specific styling data
const roleStyles = {
  "Mentor": {
    class: "role-mentor",
    icon: "fa-user-tie"
  },
  "Investor": {
    class: "role-investor",
    icon: "fa-hand-holding-dollar"
  },
  "Partner": {
    class: "role-partner",
    icon: "fa-handshake"
  },
  "Organization": {
    class: "role-organization",
    icon: "fa-building"
  },
  "Accelerator": {
    class: "role-organization",
    icon: "fa-rocket"
  }
};

// Default profile image if none provided
const DEFAULT_PROFILE_IMAGE = "https://images.pexels.com/photos/7792644/pexels-photo-7792644.jpeg?auto=compress&cs=tinysrgb&w=600";

// Form validation and submission
startupForm.addEventListener("submit", handleFormSubmit);
backToFormBtn.addEventListener("click", showForm);
retryBtn.addEventListener("click", retrySubmission);

/**
 * Initialize form validation
 */
function initializeFormValidation() {
  const inputs = startupForm.querySelectorAll("input, select, textarea");
  
  inputs.forEach(input => {
    // Clear validation styling on input
    input.addEventListener("input", () => {
      input.classList.remove("error");
      const errorElement = input.parentElement.querySelector(".error-message");
      if (errorElement) {
        errorElement.remove();
      }
    });
  });
}

/**
 * Validate form fields
 * @returns {boolean} Whether the form is valid
 */
function validateForm() {
  let isValid = true;
  const inputs = startupForm.querySelectorAll("input:not([type=checkbox]), select, textarea");
  
  // Clear previous error messages
  const errorMessages = startupForm.querySelectorAll(".error-message");
  errorMessages.forEach(el => el.remove());
  
  inputs.forEach(input => {
    input.classList.remove("error");
    
    if (input.hasAttribute("required") && !input.value.trim()) {
      displayError(input, "This field is required");
      isValid = false;
    } else if (input.id === "funding" && input.value < 0) {
      displayError(input, "Funding cannot be negative");
      isValid = false;
    } else if (input.id === "teamSize" && input.value < 1) {
      displayError(input, "Team must have at least 1 person");
      isValid = false;
    } else if (input.id === "yearsOperating" && input.value < 0) {
      displayError(input, "Years cannot be negative");
      isValid = false;
    }
  });
  
  // Check if at least one support type is selected
  const supportCheckboxes = startupForm.querySelectorAll("input[name='supportNeeded']");
  const atLeastOneChecked = Array.from(supportCheckboxes).some(checkbox => checkbox.checked);
  
  if (!atLeastOneChecked) {
    const checkboxGroup = document.querySelector(".checkbox-group");
    displayError(checkboxGroup, "Select at least one support type");
    isValid = false;
  }
  
  return isValid;
}

/**
 * Display error message for a form field
 * @param {HTMLElement} element - The form element with an error
 * @param {string} message - The error message to display
 */
function displayError(element, message) {
  element.classList.add("error");
  
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;
  
  element.parentElement.appendChild(errorElement);
}

/**
 * Handle form submission
 * @param {Event} event - The form submission event
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  // Collect form data
  const formData = new FormData(startupForm);
  const formValues = {};
  
  // Process regular form fields
  for (const [key, value] of formData.entries()) {
    if (key !== "supportNeeded") {
      formValues[key] = value;
    }
  }
  
  // Process checkboxes (multiple values)
  const supportNeeded = [];
  document.querySelectorAll("input[name='supportNeeded']:checked").forEach(checkbox => {
    supportNeeded.push(checkbox.value);
  });
  formValues.supportNeeded = supportNeeded.join(", ");
  
  try {
    showLoading();
    const profiles = await fetchProfiles(formValues);
    displayResults(profiles);
  } catch (error) {
    console.error("Error:", error);
    showError();
  }
}

/**
 * Fetch profiles from the Gemini API
 * @param {Object} formData - The form data
 * @returns {Promise<Array>} - Promise resolving to an array of profile objects
 */
async function fetchProfiles(formData) {
  // Build the prompt for the Gemini API
  const prompt = buildGeminiPrompt(formData);
  
  try {
    // In a real application, replace this with the actual API call
    // For now, we'll simulate the API response with mock data after a delay
    
    // Uncomment the following code and replace the simulation when you have an actual API key
    /*
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    // Extract and parse the JSON from the response
    const text = data.candidates[0].content.parts[0].text;
    // Find the JSON in the text (it might be surrounded by markdown code blocks)
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                     text.match(/```\n([\s\S]*?)\n```/) ||
                     [null, text];
    
    return JSON.parse(jsonMatch[1]);
    */
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock data
    return generateMockProfiles(formData);
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch profiles");
  }
}

/**
 * Build the prompt to send to the Gemini API
 * @param {Object} formData - The form data
 * @returns {string} - The formatted prompt
 */
function buildGeminiPrompt(formData) {
  return `
You are a startup network assistant. Based on the inputs below, find or simulate 5-10 relevant mentors, investors, or startup organizations that match the criteria. Return a JSON array with each object having:

{
"name": string,
"role": string,
"industry": string,
"location": string,
"contact": string,
"photoUrl": string,
"bio": string,
"matchReason": string
}

Inputs:
Industry: ${formData.industry}
Stage: ${formData.stage}
Location: ${formData.location}
Funding: ${formData.funding}
Support Needed: ${formData.supportNeeded}
Business Model: ${formData.businessModel}
Tech Focus: ${formData.techFocus}
Team Size: ${formData.teamSize}
Years Operating: ${formData.yearsOperating}
Summary: ${formData.summary}
Target Market: ${formData.targetMarket}
Revenue Model: ${formData.revenueModel}
Competitive Advantage: ${formData.competitiveAdvantage}
Contact Method: ${formData.contactMethod}
Risk Appetite: ${formData.riskAppetite}
`;
}

/**
 * Generate mock profiles based on form data
 * @param {Object} formData - The form data
 * @returns {Array} - Array of profile objects
 */
function generateMockProfiles(formData) {
  const profiles = [
    {
      name: "Sarah Johnson",
      role: "Mentor",
      industry: formData.industry,
      location: "San Francisco, CA",
      contact: "sarah.johnson@example.com",
      photoUrl: "https://images.pexels.com/photos/5704849/pexels-photo-5704849.jpeg?auto=compress&cs=tinysrgb&w=600",
      bio: "Former VP of Product at Airbnb with 15+ years of experience scaling startups. Has mentored over 50 founders and helped them raise a combined $30M.",
      matchReason: `Perfect match for your ${formData.stage} stage ${formData.industry} startup. Sarah has specific experience with ${formData.businessModel} business models and has guided companies through their growth phase.`
    },
    {
      name: "Michael Chen",
      role: "Investor",
      industry: "Venture Capital",
      location: formData.location,
      contact: "michael@venturefund.com",
      photoUrl: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600",
      bio: "Partner at Blue Venture Capital with a focus on early-stage technology startups. Previously founded and sold two SaaS companies.",
      matchReason: `Michael's fund typically invests $${Math.floor(formData.funding/100000)*100}K-$${Math.ceil(formData.funding/100000)*200}K in ${formData.stage} companies. He has specific interest in ${formData.techFocus} and ${formData.industry} startups.`
    },
    {
      name: "TechStars Accelerator",
      role: "Organization",
      industry: "Startup Accelerator",
      location: "Boulder, CO",
      contact: "apply@techstars.com",
      photoUrl: "https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=600",
      bio: "Leading global accelerator providing mentorship, funding, and resources to early-stage startups. 90% of companies from their program secure funding.",
      matchReason: `Your ${formData.stage} startup with ${formData.teamSize} team members is an ideal fit for their next cohort. They specifically look for ${formData.businessModel} companies with ${formData.competitiveAdvantage}.`
    },
    {
      name: "Lisa Patel",
      role: "Mentor",
      industry: "Marketing",
      location: "New York, NY",
      contact: "lisa.patel@growthstrategy.com",
      photoUrl: "https://images.pexels.com/photos/3779853/pexels-photo-3779853.jpeg?auto=compress&cs=tinysrgb&w=600",
      bio: "Growth marketing expert who has helped 100+ startups optimize their customer acquisition strategies. Former CMO at Shopify.",
      matchReason: `Based on your need for ${formData.supportNeeded.includes("Marketing") ? "marketing support" : "growth strategy"}, Lisa can provide valuable guidance on customer acquisition for your ${formData.targetMarket} target market.`
    },
    {
      name: "Alex Rivera",
      role: "Partner",
      industry: formData.industry,
      location: "Austin, TX",
      contact: "alex@techpartners.com",
      photoUrl: "https://images.pexels.com/photos/2380794/pexels-photo-2380794.jpeg?auto=compress&cs=tinysrgb&w=600",
      bio: "Technical co-founder with expertise in scaling infrastructure. Has built engineering teams for 3 successful startups and specializes in rapid product development.",
      matchReason: `Alex is looking to partner with ${formData.stage} startups in the ${formData.industry} space. His technical expertise in ${formData.techFocus} complements your business focus and could help accelerate your development timeline.`
    },
    {
      name: "Jennifer Wu",
      role: "Investor",
      industry: "Angel Investing",
      location: "Boston, MA",
      contact: "jennifer@angelinvestor.com",
      photoUrl: "https://images.pexels.com/photos/5793953/pexels-photo-5793953.jpeg?auto=compress&cs=tinysrgb&w=600",
      bio: "Angel investor with a portfolio of 25+ early-stage companies. Specializes in ${formData.industry} startups and typically invests $50K-$250K.",
      matchReason: `Your ${formData.riskAppetite} risk profile and ${formData.businessModel} business model align with Jennifer's investment thesis. She's particularly interested in startups operating for less than ${Math.max(2, parseInt(formData.yearsOperating) + 1)} years.`
    },
    {
      name: "Startup Legal Network",
      role: "Organization",
      industry: "Legal Services",
      location: "Chicago, IL",
      contact: "help@startuplegal.net",
      photoUrl: "https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=600",
      bio: "Network of legal professionals offering discounted services to early-stage startups. Specializes in IP protection, fundraising, and corporate structure.",
      matchReason: `As a ${formData.stage} startup with a unique ${formData.competitiveAdvantage}, their legal services can help you protect your IP and prepare for fundraising.`
    }
  ];
  
  // Add delay animation for each card
  profiles.forEach((profile, index) => {
    profile.animationDelay = index * 150;
  });
  
  return profiles;
}

/**
 * Display profile results
 * @param {Array} profiles - Array of profile objects
 */
function displayResults(profiles) {
  resultsGrid.innerHTML = "";
  
  profiles.forEach(profile => {
    const card = createProfileCard(profile);
    resultsGrid.appendChild(card);
  });
  
  hideLoading();
  formSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");
  
  // Trigger animation for each card
  setTimeout(() => {
    const cards = document.querySelectorAll(".profile-card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = "fadeIn var(--transition-slow) forwards";
      }, index * 150);
    });
  }, 100);
}

/**
 * Create a profile card element
 * @param {Object} profile - The profile data
 * @returns {HTMLElement} - The card element
 */
function createProfileCard(profile) {
  const card = document.createElement("div");
  card.className = "profile-card";
  card.style.animationDelay = `${profile.animationDelay}ms`;
  
  // Determine role styling
  const roleStyle = roleStyles[profile.role] || roleStyles["Mentor"];
  
  // Use provided photo URL or default
  const photoUrl = profile.photoUrl || DEFAULT_PROFILE_IMAGE;
  
  card.innerHTML = `
    <div class="profile-card-header">
      <img src="${photoUrl}" alt="${profile.name}" class="profile-image">
      <div class="profile-header-content">
        <h3 class="profile-name">${profile.name}</h3>
        <div class="profile-industry">${profile.industry}</div>
        <span class="profile-role ${roleStyle.class}">
          <i class="fas ${roleStyle.icon}"></i> ${profile.role}
        </span>
      </div>
    </div>
    <div class="profile-card-body">
      <div class="profile-detail">
        <i class="fas fa-map-marker-alt"></i>
        <span>${profile.location}</span>
      </div>
      <div class="profile-detail">
        <i class="fas fa-envelope"></i>
        <span>${profile.contact}</span>
      </div>
      <div class="profile-bio">${profile.bio}</div>
      <div class="match-reason">
        <strong>Why this is a great match:</strong>
        ${profile.matchReason}
      </div>
      <button class="contact-btn">
        <i class="fas fa-paper-plane"></i> Contact
      </button>
    </div>
  `;
  
  // Add contact button event listener
  const contactBtn = card.querySelector(".contact-btn");
  contactBtn.addEventListener("click", () => {
    alert(`Contact ${profile.name} at ${profile.contact}`);
  });
  
  return card;
}

/**
 * Show loading state
 */
function showLoading() {
  loadingContainer.classList.remove("hidden");
  errorContainer.classList.add("hidden");
  resultsGrid.innerHTML = "";
}

/**
 * Hide loading state
 */
function hideLoading() {
  loadingContainer.classList.add("hidden");
}

/**
 * Show error state
 */
function showError() {
  loadingContainer.classList.add("hidden");
  errorContainer.classList.remove("hidden");
}

/**
 * Show the form and hide results
 */
function showForm() {
  resultsSection.classList.add("hidden");
  formSection.classList.remove("hidden");
}

/**
 * Retry form submission
 */
function retrySubmission() {
  errorContainer.classList.add("hidden");
  submitBtn.click();
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  initializeFormValidation();
});