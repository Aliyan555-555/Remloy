import User from "../models/user.model.js";
import UserProfile from "../models/user_profile.model.js";
import Review from "../models/review.model.js";
import Comment from "../models/comment.model.js";
import Remedy from "../models/remedy.model.js";
import { generateChatCompletion } from "../config/openai.config.js";
import { ERROR_MESSAGES, REMEDY_TYPES } from "../constants/index.js";
import { parseJsonResponse } from "../utils/index.js";

// Constants
const AI_MODEL = "gpt-4-turbo";
const TEMPERATURE = 0.7;


// Validation functions
const validateParameters = (remedyId, userId) => {
  if (!remedyId || !userId) {
    throw new Error(ERROR_MESSAGES.MISSING_PARAMETERS);
  }
};

const validateUser = (user) => {
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }
};

const validateUserProfile = (userProfile) => {
  if (!userProfile) {
    throw new Error(ERROR_MESSAGES.USER_PROFILE_NOT_FOUND);
  }
};

const validateRemedy = (remedy) => {
  if (!remedy) {
    throw new Error(ERROR_MESSAGES.REMEDY_NOT_FOUND);
  }
};

// Data fetching functions
const fetchUserData = async (userId) => {
  const [userProfile, user] = await Promise.all([
    UserProfile.findOne({ userId }).select("-aiQuestionUserAnswers.options"),
    User.findById(userId)
  ]);

  validateUser(user);
  validateUserProfile(userProfile);

  return { userProfile, user };
};

const fetchRemedyData = async (remedyId) => {
  const remedy = await Remedy.findById(remedyId).select(
    "-createdAt -updatedAt -createdBy -equipments -moderationStatus -isActive -media -geographicRestrictions"
  );

  validateRemedy(remedy);
  return remedy;
};

const fetchRemedyFeedback = async (remedyId) => {
  const [reviews, comments] = await Promise.all([
    Review.find({ remedyId }).select(
      "easeOfUseRating effectivenessRating sideEffectsRating overallRating comment"
    ),
    Comment.find({ remedyId }).select(
      "-parentCommentId -userId -remedyId -updatedAt -createdAt -status"
    )
  ]);

  return { reviews, comments };
};



const extractJsonFromCodeBlock = (response) => {
  const match = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (!match) {
    return null;
  }

  try {
    return JSON.parse(match[1]);
  } catch (error) {
    throw new Error(ERROR_MESSAGES.INVALID_JSON_IN_CODE_BLOCK);
  }
};

const extractJsonFromContent = (response) => {
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return null;
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw new Error(ERROR_MESSAGES.INVALID_JSON_CONTENT);
  }
};

const parseAiResponse = (response) => {
  // Try multiple parsing strategies
  try {
    return parseJsonResponse(response);
  } catch (error) {
    const codeBlockJson = extractJsonFromCodeBlock(response);
    if (codeBlockJson) return codeBlockJson;

    const contentJson = extractJsonFromContent(response);
    if (contentJson) return contentJson;

    throw new Error(ERROR_MESSAGES.INVALID_JSON_RESPONSE);
  }
};

// Prompt templates
const createBasePrompt = (user, userProfile, remedy, reviews, comments) => {
  const userData = {
    name: user.username || user.email,
    profile: JSON.stringify(userProfile, null, 2),
    remedy: JSON.stringify(remedy, null, 2),
    reviews: JSON.stringify(reviews, null, 2),
    comments: JSON.stringify(comments, null, 2)
  };

  return {
    userData,
    instructions: `
Generate structured HTML feedback following this exact structure:
1. A bold greeting: "<p><strong>Hi [User Name],</strong></p>"
2. A one-sentence summary combining the user's health profile and the remedy purpose.
3. Generate 3–4 creative section headings based on the content (like "Why This Remedy Could Work for You" or "What Other Users Are Saying" or "Daily Integration Tips") — make each heading unique and relevant.
4. Under each heading, add 3–5 bullet points with practical, helpful, and insightful advice. Every bullet point must be actionable and important - no filler content.
5. End with a "Bonus Tip & Conclusion" section that includes:
   - One key takeaway or pro tip
   - A brief conclusion about the remedy's potential
   - A gentle reminder about consistency or timing

The final result must be a complete, clean HTML string using:
- <p><strong>Hi [Name],</strong></p> for the greeting
- <h3> for each section heading
- <ul><li>...</li></ul> for bullet lists
- <p> for the bonus tip & conclusion

Make every line count - provide only valuable, actionable information that the user can immediately use.`
  };
};

const generateAiFullFeedbackPrompt = (userData, instructions) => {
  return `You are Remi's AI, an advanced health assistant. Generate a personalized AI feedback report for the user below, strictly following the JSON schema provided. Use the user's health profile, remedy details, and review insights. Be empathetic, clear, and detailed.

**USER INFO**
- Name: ${userData.name}

**User Health Profile:**  
${userData.profile}

**Remedy Details:**  
${userData.remedy}

**User Reviews:**  
${userData.reviews}

**User Comments:**  
${userData.comments}

**INSTRUCTIONS:**
${instructions}

**REQUIRED JSON RESPONSE FORMAT:**
You must respond with ONLY a valid JSON object in this exact format:

{
  "feedbackText": "<p><strong>Hi [User Name],</strong></p><p>[One-sentence summary]</p><h3>[Section Heading 1]</h3><ul><li>[Bullet point 1]</li><li>[Bullet point 2]</li><li>[Bullet point 3]</li></ul><h3>[Section Heading 2]</h3><ul><li>[Bullet point 1]</li><li>[Bullet point 2]</li><li>[Bullet point 3]</li></ul><h3>Bonus Tip & Conclusion</h3><p>[Key takeaway, conclusion, and reminder]</p>",
  "aiSummary": {
    "confidenceScore": 85,
    "confidenceExplanation": "Based on your age and chronic conditions, this remedy shows strong potential for addressing your specific health concerns.",
    "recommendationReason": "This remedy is recommended because it aligns with your health profile and has shown positive outcomes for users with similar conditions."
  },
  "advanceAiInsights": {
    "healthMatchScore": 90,
    "matchedFactors": {
      "ageRange": "30-40",
      "diet": "Vegetarian",
      "stressLevel": "Moderate",
      "sleepPattern": "Regular",
      "previousRemedySuccess": "High"
    },
    "aiConfidenceRating": {
      "score": 88,
      "basedOnUsers": 120
    },
    "selectedReasons": [
      "Matches chronic condition",
      "Positive user outcomes"
    ],
    "similarUserOutcomes": [
      {
        "improvement": "Reduced pain",
        "percentage": 75
      }
    ],
    "aiLearningLog": {
      "lastUpdated": "2024-06-01T12:00:00Z",
      "newRatings": 5,
      "insights": ["Improved sleep", "Reduced stress"]
    },
    "remedyAdjustmentNotice": {
      "message": "Adjust dosage if you experience side effects.",
      "active": true
    }
  },
  "disclaimerShown": true
}

IMPORTANT: Respond with ONLY the JSON object above, no extra text, no markdown formatting, no code blocks.`;
};

const generateSimpleFeedbackPrompt = (userData, instructions) => {
  return `You are Remi, an expert AI health advisor that writes deeply personalized and insightful remedy feedback using clean HTML.

Please generate structured HTML feedback for the following user and remedy. Follow this exact structure:

${instructions}

Here is the user data:

User:
- Name: ${userData.name}

User Profile:
${userData.profile}

Remedy:
${userData.remedy}

User Reviews:
${userData.reviews}

User Comments:
${userData.comments}`;
};

// AI completion functions
const generateAiCompletion = async (prompt, systemMessage) => {
  return await generateChatCompletion({
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      { role: "user", content: prompt },
    ],
    temperature: TEMPERATURE,
    model: AI_MODEL,
  });
};

const generateAiFullFeedback = async (userData, instructions) => {
  const prompt = generateAiFullFeedbackPrompt(userData, instructions);
  const response = await generateAiCompletion(
    prompt,
    "You are Remi's AI, a helpful health assistant. Always respond with valid JSON only."
  );
  
  return parseAiResponse(response);
};

const generateSimpleFeedback = async (userData, instructions) => {
  const prompt = generateSimpleFeedbackPrompt(userData, instructions);
  return await generateAiCompletion(
    prompt,
    "You are Remi's AI, a helpful health assistant. Generate clean HTML feedback only."
  );
};

// Main function
const generateAiFeedback = async (remedyId, userId) => {
  try {
    // Validate input parameters
    validateParameters(remedyId, userId);

    // Fetch all required data
    const { userProfile, user } = await fetchUserData(userId);
    const remedy = await fetchRemedyData(remedyId);
    const { reviews, comments } = await fetchRemedyFeedback(remedyId);

    // Create base prompt data
    const { userData, instructions } = createBasePrompt(
      user,
      userProfile,
      remedy,
      reviews,
      comments
    );

    // Generate feedback based on remedy type
    if (remedy.type === REMEDY_TYPES.AI) {
      return await generateAiFullFeedback(userData, instructions);
    } else {
      return await generateSimpleFeedback(userData, instructions);
    }
  } catch (error) {
    // Re-throw validation errors as-is, wrap others for better error handling
    if (Object.values(ERROR_MESSAGES).includes(error.message)) {
      throw error;
    }
    throw new Error(`Failed to generate AI feedback: ${error.message}`);
  }
};

export default generateAiFeedback;
