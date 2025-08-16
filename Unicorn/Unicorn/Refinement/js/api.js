/**
 * API integration for the Business Idea Refiner application
 * Handles communication with the Gemini API
 */

// API service for handling Gemini API requests
const apiService = {
  // Replace with your actual API key when implementing
  API_KEY: 'AIzaSyABlN7ZLHElyj9lcaJmqaovvKrhgfK8Fv8',
  
  /**
   * Constructs the prompt to send to the Gemini API
   * @param {Object} formData - The user input data
   * @returns {string} The formatted prompt
   */
  constructPrompt(formData) {
    return `
You are a startup mentor. Refine the following idea and generate a professional business plan.

Idea: ${formData.businessIdea}
Industry: ${formData.industry}
Target Customer: ${formData.targetCustomer}
Funding Needed: $${formData.funding}
Timeframe: ${formData.timeframe}
Technology Focus: ${formData.techFocus}

Return the following in this exact format:

REFINED_IDEA: A professional, concise version of the idea (3-5 sentences).

ROADMAP:
1. First step in the roadmap
2. Second step in the roadmap
3. Third step in the roadmap
... (continue with 6-10 steps total)

SVG_FLOWCHART:
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
(Create a simple flowchart showing the roadmap steps with boxes and connecting arrows)
</svg>

Important: Only include these three sections with the exact headers: REFINED_IDEA, ROADMAP, and SVG_FLOWCHART.
    `;
  },

  /**
   * Simulates a call to the Gemini API with a placeholder response
   * In a real implementation, this would make an actual API call
   * @param {Object} formData - The user's input data
   * @returns {Promise<Object>} The API response with refined idea, roadmap, and SVG
   */
  async getIdeaRefinement(formData) {
    // In a real implementation, you would call the actual Gemini API
    // This is a simulation for demonstration purposes
    
    try {
      // Show we're making a request
      console.log('Sending request to Gemini API with form data:', formData);
      
      // Simulate network delay
      await utils.delay(2500);
      
      // For demo purposes, generate a response based on the input
      // In a real implementation, this would be the response from the API
      const response = this.generateMockResponse(formData);
      
      return response;
    } catch (error) {
      console.error('Error in API call:', error);
      throw new Error('Failed to get idea refinement. Please try again.');
    }
  },
  
  /**
   * Parse the API response to extract the refined idea, roadmap, and SVG
   * @param {string} responseText - The raw text response from the API
   * @returns {Object} Parsed response with refinedIdea, roadmap, and svgContent
   */
  parseResponse(responseText) {
    // Extract the refined idea
    const refinedIdeaMatch = responseText.match(/REFINED_IDEA:([\s\S]*?)(?=ROADMAP:|$)/i);
    const refinedIdea = refinedIdeaMatch ? refinedIdeaMatch[1].trim() : '';
    
    // Extract the roadmap steps
    const roadmapMatch = responseText.match(/ROADMAP:([\s\S]*?)(?=SVG_FLOWCHART:|$)/i);
    let roadmap = [];
    
    if (roadmapMatch) {
      // Split the roadmap text by lines and filter out empty lines
      const roadmapText = roadmapMatch[1].trim();
      
      // Extract numbered steps
      roadmap = roadmapText.split('\n')
        .map(line => line.trim())
        .filter(line => /^\d+\./.test(line))
        .map(line => line.replace(/^\d+\.\s*/, ''));
    }
    
    // Extract the SVG content
    const svgMatch = responseText.match(/SVG_FLOWCHART:([\s\S]*?)(?=$)/i);
    let svgContent = '';
    
    if (svgMatch) {
      const svgText = svgMatch[1].trim();
      const extractedSvg = utils.extractSvgContent(svgText);
      svgContent = extractedSvg || '';
    }
    
    return {
      refinedIdea,
      roadmap,
      svgContent
    };
  },
  
  /**
   * Generates a mock response for demonstration purposes
   * In a real implementation, this would be replaced with an actual API call
   * @param {Object} formData - The user input data
   * @returns {Object} The mock response object
   */
  generateMockResponse(formData) {
    // Create a refined idea based on input
    const refinedIdea = `REFINED_IDEA: ${formData.businessIdea.split(' ').slice(0, 3).join(' ')} is a ${formData.techFocus.toLowerCase()} solution for the ${formData.industry.toLowerCase()} industry targeting ${formData.targetCustomer}. The platform will streamline operations, reduce costs, and increase efficiency with an estimated ROI of 30% within the first year. With an initial investment of $${formData.funding}, this venture aims to achieve market penetration within ${formData.timeframe}.`;
    
    // Create a roadmap with 6-8 steps
    const roadmap = `ROADMAP:
1. Market research and competitor analysis to validate the business concept
2. Develop detailed business plan and financial projections
3. Secure initial funding of $${formData.funding}
4. Build minimum viable product (MVP) and test with early adopters
5. Gather feedback and iterate on product features
6. Develop marketing strategy targeting ${formData.targetCustomer}
7. Official product launch with promotional campaign
8. Scale operations and seek additional funding for expansion`;
    
    // Generate a simple SVG flowchart
    const svgContent = `SVG_FLOWCHART:
<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#4B5563" />
    </marker>
  </defs>
  
  <!-- Step 1 -->
  <rect x="50" y="50" width="150" height="60" rx="8" fill="#3563E9" />
  <text x="125" y="85" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Market Research</text>
  
  <!-- Arrow 1-2 -->
  <line x1="200" y1="80" x2="280" y2="80" stroke="#4B5563" stroke-width="2" marker-end="url(#arrowhead)" />
  
  <!-- Step 2 -->
  <rect x="290" y="50" width="150" height="60" rx="8" fill="#3563E9" />
  <text x="365" y="85" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Business Plan</text>
  
  <!-- Arrow 2-3 -->
  <line x1="440" y1="80" x2="520" y2="80" stroke="#4B5563" stroke-width="2" marker-end="url(#arrowhead)" />
  
  <!-- Step 3 -->
  <rect x="530" y="50" width="150" height="60" rx="8" fill="#3563E9" />
  <text x="605" y="85" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Secure Funding</text>
  
  <!-- Arrow 3-4 -->
  <line x1="605" y1="110" x2="605" y2="150" stroke="#4B5563" stroke-width="2" marker-end="url(#arrowhead)" />
  
  <!-- Step 4 -->
  <rect x="530" y="160" width="150" height="60" rx="8" fill="#0EA5E9" />
  <text x="605" y="195" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Build MVP</text>
  
  <!-- Arrow 4-5 -->
  <line x1="530" y1="190" x2="450" y2="190" stroke="#4B5563" stroke-width="2" marker-end="url(#arrowhead)" />
  
  <!-- Step 5 -->
  <rect x="290" y="160" width="150" height="60" rx="8" fill="#0EA5E9" />
  <text x="365" y="195" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Gather Feedback</text>
  
  <!-- Arrow 5-6 -->
  <line x1="290" y1="190" x2="210" y2="190" stroke="#4B5563" stroke-width="2" marker-end="url(#arrowhead)" />
  
  <!-- Step 6 -->
  <rect x="50" y="160" width="150" height="60" rx="8" fill="#0EA5E9" />
  <text x="125" y="195" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Marketing Strategy</text>
  
  <!-- Arrow 6-7 -->
  <line x1="125" y1="220" x2="125" y2="260" stroke="#4B5563" stroke-width="2" marker-end="url(#arrowhead)" />
  
  <!-- Step 7 -->
  <rect x="50" y="270" width="150" height="60" rx="8" fill="#F59E0B" />
  <text x="125" y="305" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Product Launch</text>
  
  <!-- Arrow 7-8 -->
  <line x1="200" y1="300" x2="280" y2="300" stroke="#4B5563" stroke-width="2" marker-end="url(#arrowhead)" />
  
  <!-- Step 8 -->
  <rect x="290" y="270" width="150" height="60" rx="8" fill="#F59E0B" />
  <text x="365" y="305" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Scale Operations</text>
</svg>`;
    
    // Combine all parts
    const fullResponse = `${refinedIdea}\n\n${roadmap}\n\n${svgContent}`;
    
    return this.parseResponse(fullResponse);
  }
};

// Export the API service
window.apiService = apiService;