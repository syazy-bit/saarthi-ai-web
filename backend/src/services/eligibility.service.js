const schemes = require("../data/schemes.json");

/**
 * Rule-based eligibility matching engine.
 * This is deterministic and explainable - NOT AI-based.
 */
function checkEligibility(userProfile) {
  // Normalize user input once for cleaner, safer comparisons
  const normalizedUser = {
    ...userProfile,
    state: userProfile.state?.toLowerCase(),
    gender: userProfile.gender?.toLowerCase(),
    occupation: userProfile.occupation?.toLowerCase()
  };

  const matchedSchemes = [];
  const partialMatches = [];

  for (const scheme of schemes) {
    const eligibility = scheme.eligibility;
    const matchResult = {
      scheme,
      matched: true,
      reasons: [],
      missingInfo: []
    };

    // Check state
    if (eligibility.state) {
      if (normalizedUser.state) {
        if (normalizedUser.state !== eligibility.state.toLowerCase()) {
          matchResult.matched = false;
          matchResult.reasons.push(`Requires residence in ${eligibility.state}`);
        } else {
          matchResult.reasons.push(`You are a resident of ${eligibility.state}`);
        }
      } else {
        matchResult.missingInfo.push("state");
      }
    }

    // Check age
    if (eligibility.min_age !== undefined) {
      if (normalizedUser.age !== null) {
        if (normalizedUser.age < eligibility.min_age) {
          matchResult.matched = false;
          matchResult.reasons.push(`Minimum age is ${eligibility.min_age}`);
        } else {
          matchResult.reasons.push(`You meet the minimum age requirement (${eligibility.min_age}+)`);
        }
      } else {
        matchResult.missingInfo.push("age");
      }
    }

    if (eligibility.max_age !== undefined) {
      if (normalizedUser.age !== null) {
        if (normalizedUser.age > eligibility.max_age) {
          matchResult.matched = false;
          matchResult.reasons.push(`Maximum age is ${eligibility.max_age}`);
        } else {
          matchResult.reasons.push(`You meet the age requirement (up to ${eligibility.max_age})`);
        }
      } else {
        matchResult.missingInfo.push("age");
      }
    }

    // Check gender
    if (eligibility.gender) {
      if (normalizedUser.gender) {
        if (normalizedUser.gender !== eligibility.gender.toLowerCase()) {
          matchResult.matched = false;
          matchResult.reasons.push(`This scheme is for ${eligibility.gender} applicants`);
        } else {
          matchResult.reasons.push(`This scheme is available for ${eligibility.gender} applicants`);
        }
      } else {
        matchResult.missingInfo.push("gender");
      }
    }

    // Check income
    if (eligibility.max_annual_income !== undefined) {
      if (normalizedUser.annual_income !== null) {
        if (normalizedUser.annual_income > eligibility.max_annual_income) {
          matchResult.matched = false;
          matchResult.reasons.push(`Family income must be below ₹${eligibility.max_annual_income.toLocaleString()}/year`);
        } else {
          matchResult.reasons.push(`Your income is within the eligible range`);
        }
      } else {
        matchResult.missingInfo.push("annual_income");
      }
    }

    // Check occupation
    if (eligibility.occupation) {
      if (normalizedUser.occupation) {
        if (normalizedUser.occupation !== eligibility.occupation.toLowerCase()) {
          matchResult.matched = false;
          matchResult.reasons.push(`This scheme is intended for ${eligibility.occupation} applicants`);
        } else {
          matchResult.reasons.push(`You are a ${eligibility.occupation}`);
        }
      } else {
        matchResult.missingInfo.push("occupation");
      }
    }

    // Check target groups
    if (eligibility.target_groups) {
      const hasAll = eligibility.target_groups.includes("all");
      const matchesGender = normalizedUser.gender && eligibility.target_groups.includes(normalizedUser.gender);
      if (!hasAll && !matchesGender) {
        if (normalizedUser.gender) {
          matchResult.matched = false;
          matchResult.reasons.push(`Target group: ${eligibility.target_groups.join(", ")}`);
        } else {
          matchResult.missingInfo.push("gender");
        }
      }
    }

    // Check special conditions
    if (eligibility.special_condition) {
      if (normalizedUser.special_conditions && normalizedUser.special_conditions.length > 0) {
        if (!normalizedUser.special_conditions.includes(eligibility.special_condition)) {
          matchResult.matched = false;
          matchResult.reasons.push(`Requires: ${eligibility.special_condition.replace(/_/g, " ")}`);
        } else {
          matchResult.reasons.push(`You meet the special requirement: ${eligibility.special_condition.replace(/_/g, " ")}`);
        }
      } else {
        matchResult.missingInfo.push("special_conditions");
      }
    }

    // Add explicit status field for frontend clarity
    matchResult.status = matchResult.matched
      ? (matchResult.missingInfo.length === 0 ? "eligible" : "needs_more_info")
      : "not_eligible";

    // Categorize result
    if (matchResult.matched && matchResult.missingInfo.length === 0) {
      matchedSchemes.push(matchResult);
    } else if (matchResult.matched && matchResult.missingInfo.length > 0) {
      // Potentially eligible - needs more info
      partialMatches.push(matchResult);
    }
    // If not matched, we don't include it
  }

  return {
    eligible: matchedSchemes,
    potential: partialMatches
  };
}

/**
 * Get all schemes (for browsing)
 */
function getAllSchemes() {
  return schemes;
}

/**
 * Get a single scheme by ID
 */
function getSchemeById(id) {
  return schemes.find(s => s.id === id);
}

module.exports = {
  checkEligibility,
  getAllSchemes,
  getSchemeById
};
