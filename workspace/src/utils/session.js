// Generate or retrieve session ID from localStorage
export function getSessionId() {
  let sessionId = localStorage.getItem('sessionId');
  
  if (!sessionId) {
    // Generate a unique session ID
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  }
  
  return sessionId;
}

