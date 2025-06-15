import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your env
});

const model = "gpt-4-turbo"; // or your preferred model, e.g., "gpt-4o" or "gpt-4-turbo"

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
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that returns JSON only.",
        },
        {
          role: "user",
          content: generateHealthQuestionsPrompt(userHealthData),
        },
      ],
      temperature: 0.7,
    });

    const output = response.choices[0].message?.content;
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
