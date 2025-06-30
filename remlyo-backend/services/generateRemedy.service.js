import { generateChatCompletion } from "../config/openai.config.js";
import UserProfile from "../models/user_profile.model.js";
import Ailment from "../models/ailment.model.js";
import Remedy, { REMEDY_CATEGORIES } from "../models/remedy.model.js";
import User from "../models/user.model.js";
import { fetchRemedyImageWithType } from "./imagesFetcher.service.js";

/**
 * Generate a detailed prompt for OpenAI to create a remedy in the required format.
 */
const generateRemedyPrompt = (user, userProfile, ailment, symptoms) => `
You are a medical AI assistant specializing in creating comprehensive, well-formatted health remedies. Based on the following user health profile, selected ailment, and user symptoms, generate a detailed JSON object for a remedy. 
The remedy must be safe, effective, and tailored to the user's profile, ailment, and specific symptoms. 

CRITICAL REQUIREMENTS:
- Use HTML tags for ALL fields to create well-structured, readable content
- Use <h2>, <h3>, <h4> for headings and sections
- Use <ul>, <ol>, <li> for lists and bullet points
- Use <p> for paragraphs
- Use <strong>, <em> for emphasis
- Use <div> for sections and <span> for inline elements
- Include ALL fields in the JSON response - do not skip any field
- Make content comprehensive, detailed, and actionable
- If a field doesn't apply, provide a relevant alternative or explanation
- Use proper HTML structure with semantic tags
- Ensure all content is medically accurate and evidence-based

CONTENT STRUCTURE REQUIREMENTS:
- Use <h2> for main sections like "Overview", "Ingredients", "Instructions", "Side Effects", etc.
- Use <h3> for subsections
- Use <ul> and <li> for lists of ingredients, steps, precautions, etc.
- Use <p> for descriptive text and explanations
- Use <strong> for important warnings and key information
- Use <em> for emphasis on important points
- Include detailed explanations for each section
- Use <div class="section"> for major content blocks
- Use <span class="highlight"> for important terms

FIELD REQUIREMENTS:
- name: Clear, descriptive remedy name with <strong> tags for emphasis
- description: Brief overview with <p> tags, include key benefits
- category: Must be one of the provided categories
- ingredients: Detailed list with <ul><li> tags, include quantities, sources, and preparation notes
- instructions: Step-by-step instructions with <ol><li> tags, include timing and technique details
- content: Comprehensive content with all sections using proper HTML structure (see detailed structure below)
- sideEffects: Detailed list with <ul><li> tags, include severity levels, frequency, and management tips
- preparationTime: Clear time indication with <p> tags, include active vs total time
- equipments: List of required tools/equipment with <ul><li> tags, include alternatives and substitutes
- aiConfidenceScore: Number between 0-100 based on evidence strength and safety profile

DETAILED CONTENT FIELD STRUCTURE:
The content field MUST include these sections with proper HTML formatting:

<div class="remedy-content">
  <h2>Overview</h2>
  <p>Comprehensive description of the remedy, its purpose, and how it addresses the specific ailment and symptoms.</p>
  
  <h2>How It Works</h2>
  <p>Detailed explanation of the mechanism of action, including scientific basis and expected effects.</p>
  
  <h2>Ingredients & Preparation</h2>
  <h3>Required Ingredients</h3>
  <ul>
    <li>Detailed ingredient list with quantities and quality specifications</li>
  </ul>
  <h3>Preparation Method</h3>
  <ol>
    <li>Step-by-step preparation instructions</li>
  </ol>
  
  <h2>Usage Instructions</h2>
  <h3>Application Method</h3>
  <ol>
    <li>Detailed application steps</li>
  </ol>
  <h3>Best Practices</h3>
  <ul>
    <li>Tips for optimal results</li>
  </ul>
  
  <h2>Dosage & Frequency</h2>
  <h3>Recommended Dosage</h3>
  <p>Specific dosage information with timing and frequency.</p>
  <h3>Duration of Treatment</h3>
  <p>How long to use the remedy and when to expect results.</p>
  
  <h2>Storage Instructions</h2>
  <ul>
    <li>Storage conditions and requirements</li>
    <li>Shelf life and expiration considerations</li>
  </ul>
  
  <h2>Precautions & Warnings</h2>
  <h3>Safety Considerations</h3>
  <ul>
    <li>Important safety warnings</li>
  </ul>
  <h3>Contraindications</h3>
  <ul>
    <li>When not to use this remedy</li>
  </ul>
  
  <h2>Expected Results</h2>
  <h3>Timeline</h3>
  <p>When to expect results and what to look for.</p>
  <h3>Effectiveness Indicators</h3>
  <ul>
    <li>Signs that the remedy is working</li>
  </ul>
  
  <h2>When to Seek Medical Help</h2>
  <div class="warning">
    <strong>Emergency Situations:</strong>
    <ul>
      <li>Signs that require immediate medical attention</li>
    </ul>
  </div>
  
  <h2>Scientific Evidence</h2>
  <h3>Research Studies</h3>
  <ul>
    <li>Relevant scientific studies and evidence</li>
  </ul>
  <h3>Clinical Evidence</h3>
  <p>Summary of clinical evidence supporting the remedy's effectiveness.</p>
  
  <h2>Alternative Options</h2>
  <p>Other remedies or approaches that might be considered.</p>
  
  <h2>Follow-up Care</h2>
  <p>What to do after completing the remedy course.</p>
</div>

Categories:
Available categories (use EXACTLY as shown - no case changes, no modifications):
${REMEDY_CATEGORIES.map((category) => `- "${category}"`).join("\n")}


User Info:
${user ? `Name: ${user.username || user.email || ""}` : ""}

User Health Profile:
${JSON.stringify(userProfile, null, 2)}

Ailment:
${JSON.stringify(ailment, null, 2)}

User Symptoms:
${
  symptoms ? JSON.stringify(symptoms, null, 2) : "No specific symptoms provided"
}

CRITICAL INSTRUCTIONS:
1. Tailor the remedy specifically to address the user's symptoms and health profile
2. Consider the user's chronic conditions, allergies, and risk factors
3. Ensure the remedy is safe for the user's specific conditions
4. Use comprehensive HTML formatting for all fields with proper semantic structure
5. Make the remedy detailed, actionable, and evidence-based
6. Include all required sections in the content field with proper HTML structure
7. Provide specific, measurable instructions and dosages
8. Include comprehensive safety warnings and precautions
9. Make content engaging, easy to read, and professionally formatted
10. Ensure medical accuracy and include scientific references where applicable
11. Address the specific ailment and symptoms provided
12. Consider the user's age, weight, and other health factors
13. Provide clear timelines and expected outcomes
14. Include emergency warning signs and when to seek medical help

IMPORTANT: You must respond with ONLY a valid JSON object. Do not include any additional text, explanations, or markdown formatting outside the JSON. The response must start with { and end with }.

Respond ONLY with a valid JSON object with these fields:
important note: No use html tags in name,category,description,preparationTime
import fetchRemedyImage from './imagesFetcher.service';

{
  "name": "",
  "description": "",
  "category": "",

  "ingredients": "",
  "instructions": "",
  "content": "",
  "sideEffects": "",
  "preparationTime": "",
  "equipments": "",
  "aiConfidenceScore": 0
}
`;

/**
 * Generate a remedy based on user health profile and selected ailment.
 * @param {string} userId
 * @param {string} ailmentId
 * @param {Array} symptoms - User's specific symptoms
 * @returns {Promise<Object>} Remedy object
 */
const generateRemedy = async (userId, ailmentId, symptoms) => {
  // Fetch user profile
  const userProfile = await UserProfile.findOne({ userId })
    .select("-aiQuestionUserAnswers.options")
    .lean();
  if (!userProfile) throw new Error("User profile not found");

  // Fetch ailment
  const ailment = await Ailment.findById(ailmentId).lean();
  if (!ailment) throw new Error("Ailment not found");

  // Optionally fetch user for personalization
  let user = null;

  user = await User.findById(userId).lean();

  // Generate prompt
  const prompt = generateRemedyPrompt(user, userProfile, ailment, symptoms);
  console.log(prompt);
  // Call OpenAI
  const aiResponse = await generateChatCompletion({
    messages: [
      { role: "system", content: "You are a helpful health assistant." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    model: "gpt-4-turbo",
  });

  // Parse and validate the AI response
  let remedyData;
  try {
    // Clean the response to remove any markdown formatting or extra text
    let cleanedResponse = aiResponse.trim();

    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/, "")
        .replace(/```\n?/, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse
        .replace(/```\n?/, "")
        .replace(/```\n?/, "");
    }

    // Find the JSON object in the response
    const jsonStart = cleanedResponse.indexOf("{");
    const jsonEnd = cleanedResponse.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON object found in AI response");
    }

    const jsonString = cleanedResponse.substring(jsonStart, jsonEnd + 1);
    remedyData = JSON.parse(jsonString);

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "category",
      "ingredients",
      "instructions",
      "content",
      "sideEffects",
      "preparationTime",
      "equipments",
    ];
    const missingFields = requiredFields.filter(
      (field) => !remedyData[field] || remedyData[field].trim() === ""
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate category matches exactly one of the allowed categories
    if (!REMEDY_CATEGORIES.includes(remedyData.category)) {
      throw new Error(
        `Invalid category: "${
          remedyData.category
        }". Must be one of: ${REMEDY_CATEGORIES.join(", ")}`
      );
    }
  } catch (e) {
    console.error("AI Response:", aiResponse);
    console.error("JSON Parse Error:", e.message);
    throw new Error(
      `Failed to parse AI response as JSON: ${e.message}. Please try again.`
    );
  }

  const now = new Date();

  // Confidence score fallback
  let aiConfidenceScore = Number(remedyData.aiConfidenceScore);
  if (
    isNaN(aiConfidenceScore) ||
    aiConfidenceScore < 0 ||
    aiConfidenceScore > 100
  ) {
    aiConfidenceScore = 0;
  }

  const mediaQuery = `${remedyData.name} remedy`;
  const media = await fetchRemedyImageWithType(mediaQuery);
  // Compose the full remedy object (add backend fields)
  const remedy = {
    ...remedyData,
    type: "ai",
    media,
    aiConfidenceScore,
    isAIGenerated: true,
    moderationStatus: "pending",
    scientificReferences: Array.isArray(remedyData.scientificReferences)
      ? remedyData.scientificReferences
      : [],
    geographicRestrictions: Array.isArray(remedyData.geographicRestrictions)
      ? remedyData.geographicRestrictions
      : [],
    createdBy: userId,
    viewCount: 0,
    averageRating: 0,
    ailments: [ailmentId],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  console.log(remedy);
  return remedy;
};

export default generateRemedy;
