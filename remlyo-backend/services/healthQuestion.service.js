import { generateChatCompletion } from "../config/openai.config.js";

const generateHealthQuestionsPrompt = (userHealthData) => `
You are a health questionnaire assistant. Based on the following user health data:

${JSON.stringify(userHealthData, null, 2)}

Generate at least 50+ multiple-choice questions, distributed across these categories:
- Lifestyle Habits
- Dietary Habits
- Medical History
- Environmental Exposure
- Health Monitoring

Each category should follow this format:
Categories: Lifestyle, Dietary, Medical, Environmental, Health Monitoring
Format:
[{
  "title": "Category",
  "description": "Brief description",
  "questions": [{
    "name": "field_name",
    "question": "Question text?",
    "options": [
      {"value": "option1", "label": "Option 1"},
      {"value": "option2", "label": "Option 2"},
      {"value": "option3", "label": "Option 3"},
      {"value": "option4", "label": "Option 4"}
    ]
  }]
}]

Respond only with a valid JSON object that is an array of categories.
`;

const generateHealthQuestions = async (userHealthData) => {
  try {
    const output = await generateChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that returns JSON only. and fallow interactions properly",
        },
        {
          role: "user",
          content: generateHealthQuestionsPrompt(userHealthData),
        },
      ],
      temperature: 0.4,
    });
    if (!output) {
      throw new Error("No content returned from OpenAI");
    }

    const parsed = JSON.parse(output);
    return parsed;
  } catch (error) {
    console.error("Error generating health questions:", error);
    throw error;
  }
};

export default generateHealthQuestions;
