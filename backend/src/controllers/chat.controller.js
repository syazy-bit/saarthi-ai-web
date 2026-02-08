const {
  translateToEnglish,
  extractUserProfile,
  generateEligibilityExplanation,
  translateFromEnglish,
  answerQuestionWithContext
} = require("../services/llm.service");
const { checkEligibility } = require("../services/eligibility.service");
const { buildChatResponse } = require("../utils/buildResponse");

/**
 * Handle main chat endpoint
 * POST /api/chat
 */
async function handleChat(req, res) {
  try {
    const { message, conversationHistory = [], lastEligibleSchemes = [], lastPotentialSchemes = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("📩 Incoming message:", message);
    console.log("Context schemes:", { 
      lastEligible: lastEligibleSchemes.length, 
      lastPotential: lastPotentialSchemes.length 
    });

    // Step 1: Translate to English and detect language (with fallback)
    let userLanguage = "English";
    let englishMessage = message;
    
    try {
      const translation = await translateToEnglish(message);
      userLanguage = translation.original_language;
      englishMessage = translation.english_text;
      console.log("🌐 Detected language:", userLanguage);
    } catch (error) {
      console.warn("⚠️ Translation failed, using original message:", error.message);
    }

    // Step 2: Extract user profile from the message (with fallback)
    let userProfile = {
      age: null,
      gender: null,
      state: null,
      occupation: null,
      annual_income: null,
      special_conditions: []
    };
    
    try {
      userProfile = await extractUserProfile(englishMessage);
      console.log("👤 Extracted profile:", userProfile);
    } catch (error) {
      console.warn("⚠️ Profile extraction failed, using empty profile:", error.message);
    }

    // Step 3: Run rule-based eligibility matching (DETERMINISTIC)
    const eligibilityResults = checkEligibility(userProfile);
    console.log("✅ Eligibility check:", {
      eligible: eligibilityResults.eligible.length,
      potential: eligibilityResults.potential.length
    });

    // Step 4: Generate explanations for matched schemes
    const eligibleSchemes = [];
    for (const match of eligibilityResults.eligible) {
      let explanation = `You qualify for ${match.scheme.name}.`;
      
      try {
        explanation = await generateEligibilityExplanation(
          match.scheme,
          userProfile,
          userLanguage
        );
      } catch (error) {
        console.warn("⚠️ Explanation generation failed for", match.scheme.name, ":", error.message);
      }
      
      eligibleSchemes.push({
        ...match.scheme,
        why_eligible: explanation,
        match_reasons: match.reasons,
        is_rule_based: true // Trust badge indicator
      });
    }

    // Step 5: Handle potential matches (need more info)
    const potentialSchemes = eligibilityResults.potential.map(match => ({
      ...match.scheme,
      missing_info: match.missingInfo,
      is_rule_based: true
    }));

    // Step 6: Build response
    let responseText = buildChatResponse(eligibleSchemes, potentialSchemes);
    let usedContextFallback = false;

    // If no NEW eligible schemes matched and we have previous context,
    // use AI to answer the question using that context.
    if (eligibleSchemes.length === 0 && (lastEligibleSchemes.length > 0 || lastPotentialSchemes.length > 0)) {
      console.log("🤖 Attempting context-aware fallback for follow-up question...");
      try {
        const fallbackResponse = await answerQuestionWithContext(
          englishMessage,
          lastEligibleSchemes,
          lastPotentialSchemes,
          userLanguage
        );
        
        // Only use the fallback if it actually provided an answer
        if (fallbackResponse && !fallbackResponse.includes("I don't have enough information")) {
          console.log("✅ Using context-aware fallback response");
          responseText = fallbackResponse;
          usedContextFallback = true;
        } else {
          console.log("⏭️ Fallback couldn't answer the question, using default response");
        }
      } catch (error) {
        console.warn("⚠️ Context fallback failed:", error.message);
      }
    }

    // Translate response if needed (with fallback) - only if we didn't use context fallback
    if (userLanguage !== "English" && !usedContextFallback) {
      try {
        responseText = await translateFromEnglish(responseText, userLanguage);
      } catch (error) {
        console.warn("⚠️ Response translation failed, using English:", error.message);
      }
    }

    console.log("✨ Response ready");
    
    res.json({
      response: responseText,
      detected_language: userLanguage,
      extracted_profile: userProfile,
      eligible_schemes: eligibleSchemes,
      potential_schemes: potentialSchemes,
      is_rule_based: true // Indicates this result is from deterministic logic
    });

  } catch (error) {
    console.error("❌ Chat error:", error);
    res.status(500).json({
      error: "Something went wrong. Please try again.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

module.exports = {
  handleChat
};
