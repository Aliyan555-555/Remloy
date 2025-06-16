// lib/openaiClient.js

import OpenAI from "openai";

// Create a singleton instance (best practice for Node/serverless)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a chat completion using OpenAI's API.
 * 
 * @param {Object} params
 * @param {Array} params.messages - Array of message objects: { role: "system" | "user" | "assistant", content: string }
 * @param {number} [params.temperature=0.7] - Sampling temperature (0-2)
 * @param {string} [params.model="gpt-4o"] - Model name to use
 * @returns {Promise<string>} - The generated text
 */
export const generateChatCompletion = async ({
  messages,
  temperature = 0.7,
  model = "gpt-4-turbo",
}) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing in environment variables.");
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("`messages` must be a non-empty array.");
  }

  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
    });

    const output = response.choices?.[0]?.message?.content?.trim();
    if (!output) {
      throw new Error("No content returned from OpenAI API.");
    }

    return output;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error(error?.message || "Failed to generate chat completion.");
  }
};
