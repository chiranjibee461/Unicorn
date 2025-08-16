// Fetch advice from the Gemini API
export const fetchAdvice = async (formData) => {
  // In a real application, you would replace this with your actual Gemini API key
  const apiKey = 'AIzaSyABlN7ZLHElyj9lcaJmqaovvKrhgfK8Fv8';
  
  // Construct the prompt for Gemini
  const prompt = `You are an expert startup mentor who explains advice like a teacher on a magical blackboard. Analyze the following startup:

Business Idea: ${formData.businessIdea}
Industry: ${formData.industry}
Region: ${formData.region}
Stage: ${formData.stage}
Capital: ${formData.capital}
Timeline: ${formData.timeline}
Experience: ${formData.experience}
Platform: ${formData.platform}

Now give advice in this order:
1. Funding Opportunities
2. Marketing Strategy
3. Government Rules & Schemes
4. Business Toolkits
5. Support Organizations & Mentors
6. Visual Description (like a chalkboard drawing of the whole plan)

Make it creative, inspiring, clear, and visionary like a teacher explaining on a blackboard.`;

  try {
    // For development/demo purposes, we'll use a mock response
    // In a production environment, uncomment the fetch code below
    
    /*
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return processGeminiResponse(data);
    */
    
    // Mock response for demo purposes
    return await getMockResponse(formData);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

// Process the Gemini API response
const processGeminiResponse = (response) => {
  try {
    // Extract the text from the response
    const text = response.candidates[0].content.parts[0].text;
    
    // Parse the text into sections
    return parseResponseIntoSections(text);
  } catch (error) {
    console.error('Error processing Gemini response:', error);
    throw new Error('Failed to process the AI response');
  }
};

// Parse the response text into structured sections
const parseResponseIntoSections = (text) => {
  // Split the text by numbered sections
  const sections = {
    fundingOpportunities: extractSection(text, '1. Funding Opportunities', '2. Marketing Strategy'),
    marketingStrategy: extractSection(text, '2. Marketing Strategy', '3. Government Rules & Schemes'),
    governmentRules: extractSection(text, '3. Government Rules & Schemes', '4. Business Toolkits'),
    businessToolkits: extractSection(text, '4. Business Toolkits', '5. Support Organizations & Mentors'),
    supportOrganizations: extractSection(text, '5. Support Organizations & Mentors', '6. Visual Description'),
    visualDescription: extractSection(text, '6. Visual Description', null)
  };
  
  return sections;
};

// Helper function to extract a section from the text
const extractSection = (text, startMarker, endMarker) => {
  const startIndex = text.indexOf(startMarker);
  
  if (startIndex === -1) {
    return '';
  }
  
  const startWithoutMarker = startIndex + startMarker.length;
  
  let endIndex;
  if (endMarker) {
    endIndex = text.indexOf(endMarker, startWithoutMarker);
    if (endIndex === -1) {
      endIndex = text.length;
    }
  } else {
    endIndex = text.length;
  }
  
  return text.substring(startWithoutMarker, endIndex).trim();
};

// Mock response for development/demo purposes
const getMockResponse = async (formData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    fundingOpportunities: `For a ${formData.stage} stage ${formData.industry} startup with $${formData.capital} capital in ${formData.region}, I recommend:

1. Angel Investors: Seek out angels who specialize in ${formData.industry} startups at the ${formData.stage} stage.
2. Venture Capital: For ${formData.industry} in ${formData.region}, consider VCs like InnoVenture Partners and GrowthCap Ventures.
3. Crowdfunding: Platforms like Kickstarter or Indiegogo can provide both funding and market validation.
4. Accelerator Programs: Apply to Y Combinator, TechStars, or industry-specific accelerators for funding, mentorship, and connections.
5. Government Grants: ${formData.region} offers innovation grants for ${formData.industry} startups, particularly those solving local challenges.`,

    marketingStrategy: `For your ${formData.platform} ${formData.industry} business:

1. Target Audience: Focus on early adopters who are familiar with your industry pain points.
2. Content Marketing: Create educational content demonstrating your expertise in ${formData.industry}.
3. Community Building: Establish a community around your solution on platforms where your customers gather.
4. Strategic Partnerships: Collaborate with complementary businesses in the ${formData.industry} ecosystem.
5. Data-Driven Approach: Implement analytics to track and optimize your marketing efforts from day one.
6. Growth Hacking: Identify and leverage unique distribution channels specific to ${formData.industry}.`,

    governmentRules: `For ${formData.industry} businesses in ${formData.region}:

1. Business Registration: Register as an LLC or Corporation based on your growth plans.
2. Industry Regulations: ${formData.industry} businesses must comply with data protection laws like GDPR or CCPA.
3. Tax Incentives: R&D tax credits available for innovative ${formData.industry} solutions.
4. Licensing Requirements: Verify if your specific ${formData.industry} niche requires special permits or certifications.
5. Employment Laws: Understand contractor vs. employee classifications, especially for remote teams.
6. Intellectual Property: File patents, trademarks, or copyrights to protect your innovations.`,

    businessToolkits: `Essential tools for your ${formData.stage} ${formData.industry} startup:

1. Project Management: Asana, Trello, or ClickUp to organize tasks and workflows.
2. Communication: Slack for internal comms, Intercom for customer engagement.
3. Analytics: Google Analytics and Mixpanel to track user behavior.
4. CRM: HubSpot or Pipedrive to manage customer relationships.
5. Finance: QuickBooks or Xero for accounting, Stripe for payments.
6. Development: GitHub for code management, Figma for design.
7. Marketing: Mailchimp for email campaigns, Canva for graphic design.
8. Legal: Clerky or LegalZoom for standard legal documents.`,

    supportOrganizations: `Organizations that can help your ${formData.industry} startup in ${formData.region}:

1. Industry Associations: ${formData.industry} Alliance offers networking and resources.
2. Startup Hubs: TechHub and Innovation Center provide workspace and community.
3. Mentorship Programs: Founders Network and SCORE offer experienced mentors.
4. Online Communities: ProductHunt and IndieHackers for feedback and visibility.
5. Local Universities: Partner with research departments for talent and resources.
6. Government Support: Small Business Development Centers provide free consulting.
7. Peer Groups: Join mastermind groups with other founders at similar stages.`,

    visualDescription: `Imagine a magical chalkboard with your ${formData.industry} business at the center, surrounded by interconnected nodes of opportunity. Funding streams flow in from the left as golden rivers, marketing channels radiate outward as colorful pathways, government regulations form a protective framework, and toolkit symbols provide the foundation. Support organizations orbit like friendly stars, all creating a vibrant ecosystem for your vision. The chalk lines pulse with energy, showing how each element supports your journey from ${formData.stage} to success. Your timeline of ${formData.timeline} is marked by milestones, and your ${formData.experience} experience adds special glowing highlights to certain paths. The ${formData.platform} platform is represented as the ground upon which everything is built, either digital, physical, or a blend of both worlds.`
  };
};