const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

/**
 * Translates text to English if it's in another language.
 * Also detects the original language.
 */
async function translateToEnglish(text) {
  try {
    const prompt = `You are a translation assistant. Analyze the following text.
If the text is in English, return it as is.
If the text is in another language (like Assamese, Hindi, Bengali), translate it to English.

Return your response as JSON with the following structure:
{
  "original_language": "detected language name (e.g., 'English', 'Assamese', 'Hindi')",
  "english_text": "the text in English"
}

Text to analyze:
"${text}"

Return ONLY the JSON, no other text.`;

    const result = await model.generateContent(prompt);
    const response = result?.response?.text();

    if (!response) {
      console.warn("Empty response from Gemini API for translation");
      return { original_language: "English", english_text: text };
    }

    try {
      // Clean the response - remove markdown code blocks if present
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (e) {
      console.error("Failed to parse translation response:", response);
      return { original_language: "English", english_text: text };
    }
  } catch (error) {
    console.error("Translation error:", error.message);
    return { original_language: "English", english_text: text };
  }
}

/**
 * Extracts structured user profile data from their message.
 */
async function extractUserProfile(englishText) {
  try {
    const prompt = `You are a data extraction assistant for a government scheme eligibility system.
Extract the following information from the user's message. If information is not provided, use null.

Fields to extract:
- age: number or null
- gender: "male", "female", or null
- state: Indian state name or null
- occupation: "student", "farmer", "unemployed", "employed", "retired", or null
- annual_income: number (approximate annual family income in INR) or null
- special_conditions: array of strings like ["registered_marriage", "bpl_card_holder"] or empty array

User message:
"${englishText}"

Return ONLY a valid JSON object with these fields, no other text.`;

    const result = await model.generateContent(prompt);
    const response = result?.response?.text();

    if (!response) {
      console.warn("Empty response from Gemini API for profile extraction");
      return {
        age: null,
        gender: null,
        state: null,
        occupation: null,
        annual_income: null,
        special_conditions: []
      };
    }

    try {
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (e) {
      console.error("Failed to parse profile extraction:", response);
      return {
        age: null,
        gender: null,
        state: null,
        occupation: null,
        annual_income: null,
        special_conditions: []
      };
    }
  } catch (error) {
    console.error("Profile extraction error:", error.message);
    return {
      age: null,
      gender: null,
      state: null,
      occupation: null,
      annual_income: null,
      special_conditions: []
    };
  }
}

/**
 * Generates a friendly explanation of why a user qualifies for a scheme.
 */
async function generateEligibilityExplanation(scheme, userProfile, language = "English") {
  try {
    const prompt = `You are a helpful assistant explaining government schemes to citizens.
  
The user qualifies for: ${scheme.name}
Scheme description: ${scheme.description}

User profile:
- Age: ${userProfile.age || "Not specified"}
- Gender: ${userProfile.gender || "Not specified"}  
- State: ${userProfile.state || "Not specified"}
- Occupation: ${userProfile.occupation || "Not specified"}
- Annual Income: ${userProfile.annual_income ? "₹" + userProfile.annual_income : "Not specified"}

Generate a brief, friendly 2-3 sentence explanation of why this user qualifies for the scheme.
${language !== "English" ? `Translate your response to ${language}.` : ""}

Keep it simple and encouraging. Do not use complex legal terms.`;

    const result = await model.generateContent(prompt);
    const response = result?.response?.text();
    
    if (!response) {
      return `You may be eligible for ${scheme.name}. This scheme provides ${scheme.description}.`;
    }
    
    return response.trim();
  } catch (error) {
    console.error("Eligibility explanation error:", error.message);
    return `You may be eligible for ${scheme.name}. This scheme provides ${scheme.description}.`;
  }
}

/**
 * Translates text from English to the target language.
 */
/**
 * Translates text from English to the target language.
 */
async function translateFromEnglish(text, targetLanguage) {
  if (targetLanguage === "English") {
    return text;
  }

  try {
    const prompt = `Translate the following English text to ${targetLanguage}. 
Keep any scheme names, document names, and URLs unchanged (do not translate them).
Return only the translated text, nothing else.

Text:
"${text}"`;

    const result = await model.generateContent(prompt);
    const response = result?.response?.text();
    
    if (!response) {
      console.warn("Empty response from Gemini API for translation to", targetLanguage);
      return text;
    }
    
    return response.trim();
  } catch (error) {
    console.error("Translation from English error:", error.message);
    return text;
  }
}

/**
 * Answer follow-up questions about schemes using conversation context.
 * This is used when the user asks questions like "what documents do I need?"
 */
async function answerQuestionWithContext(message, eligibleSchemes, potentialSchemes, language = "English") {
  try {
    // Build context from schemes
    let context = "Available schemes information:\n\n";
    
    if (eligibleSchemes && eligibleSchemes.length > 0) {
      context += "ELIGIBLE SCHEMES:\n";
      eligibleSchemes.forEach(scheme => {
        context += `- ${scheme.name}: ${scheme.description}\n`;
        if (scheme.documents) {
          context += `  Documents: ${scheme.documents.map(d => d.name).join(', ')}\n`;
        }
        if (scheme.steps) {
          context += `  Steps: ${scheme.steps.join('; ')}\n`;
        }
      });
    }
    
    if (potentialSchemes && potentialSchemes.length > 0) {
      context += "\nPOTENTIAL SCHEMES (need more info):\n";
      potentialSchemes.forEach(scheme => {
        context += `- ${scheme.name}: ${scheme.description}\n`;
      });
    }

    const prompt = `You are Saarthi AI, a helpful government schemes assistant. 
Based on the following schemes information (including eligible and potential matches), answer the user's follow-up question.

${context}

User question: "${message}"

INSTRUCTIONS:
1. If the user asks about "documents", "required papers", or similar, list the specific documents for the eligible schemes first.
2. If they ask about "how to apply" or "steps", provide the application steps.
3. If they ask about a specific scheme mentioned in the context, focus on that.
4. If there's a typo in the question (e.g. "schen=me", "arenthe"), interpret the user's intent naturally.
5. Be friendly, encouraging, and clear.
6. If the question is completely unrelated to government schemes or the context, politely guide them back to talking about their eligibility.
7. IMPORTANT: Use plain text only. Do NOT use markdown formatting like ** for bold or * for bullets. Just use simple text with line breaks.

${language !== "English" ? `IMPORTANT: Respond entirely in ${language}.` : ""}`;

    const result = await model.generateContent(prompt);
    const response = result?.response?.text();
    
    if (!response) {
      return "I'm sorry, I couldn't generate a response. Could you please rephrase your question?";
    }
    
    return response.trim();
  } catch (error) {
    console.error("Context-aware answer error:", error.message);
    return "I'm sorry, I encountered an error. Could you please try again?";
  }
}

module.exports = {
  translateToEnglish,
  extractUserProfile,
  generateEligibilityExplanation,
  translateFromEnglish,
  answerQuestionWithContext
};
