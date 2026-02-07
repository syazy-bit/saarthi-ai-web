const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Send a chat message to the backend
 * @param {string} message - User's message
 * @returns {Promise<Object>} API response with eligibility results
 */
export async function sendChatMessage(message) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch all available schemes
 * @returns {Promise<Object>} List of schemes
 */
export async function fetchSchemes() {
  const response = await fetch(`${API_BASE_URL}/schemes`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch a single scheme by ID
 * @param {string} id - Scheme ID
 * @returns {Promise<Object>} Scheme details
 */
export async function fetchSchemeById(id) {
  const response = await fetch(`${API_BASE_URL}/schemes/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Check backend health
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}
