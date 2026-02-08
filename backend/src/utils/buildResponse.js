/**
 * Build chat response text based on eligibility results
 * @param {Array} eligibleSchemes - Schemes user is eligible for
 * @param {Array} potentialSchemes - Schemes that need more info
 * @returns {string} Response text to show user
 */
function buildChatResponse(eligibleSchemes, potentialSchemes) {
  if (eligibleSchemes.length > 0) {
    const schemeNames = eligibleSchemes.map(s => `**${s.name}**`).join(', ');
    return `Based on the information you provided, I found ${eligibleSchemes.length} scheme(s) you may be eligible for: ${schemeNames}!`;
  } else if (potentialSchemes.length > 0) {
    return `I found some schemes that might be relevant, but I need a bit more information to confirm your eligibility.`;
  } else {
    return `I couldn't find matching schemes based on the information provided. Could you tell me more about yourself? For example: your age, state, occupation, and family income.`;
  }
}

module.exports = {
  buildChatResponse
};
