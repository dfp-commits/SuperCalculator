/**
 * Calculation Validator
 * Validates calculator inputs and expressions
 * Reference: docs/01_architecture.md (Domain/Core layer)
 */

/**
 * Validates that a value is a valid number
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid number
 */
function isValidNumber(value) {
  return typeof value === 'number' && isFinite(value);
}

/**
 * Validates a basic operation string
 * @param {string} operation - Operation to validate
 * @returns {boolean} True if valid operation
 */
function isValidBasicOperation(operation) {
  return ['+', '-', '*', '/'].includes(operation);
}

/**
 * Validates a scientific operation string
 * @param {string} operation - Operation to validate
 * @returns {boolean} True if valid operation
 */
function isValidScientificOperation(operation) {
  const validOps = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'pow', 'exp'];
  return validOps.includes(operation.toLowerCase());
}

/**
 * Validates an expression string
 * @param {string} expression - Expression to validate
 * @returns {Object} Validation result with isValid and error message
 */
function validateExpression(expression) {
  if (!expression || typeof expression !== 'string') {
    return { isValid: false, error: 'Expression must be a non-empty string' };
  }

  const cleaned = expression.replace(/\s/g, '');
  
  if (cleaned.length === 0) {
    return { isValid: false, error: 'Expression cannot be empty' };
  }

  // Check for balanced parentheses
  let parenCount = 0;
  for (const char of cleaned) {
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (parenCount < 0) {
      return { isValid: false, error: 'Unbalanced parentheses' };
    }
  }
  
  if (parenCount !== 0) {
    return { isValid: false, error: 'Unbalanced parentheses' };
  }

  // Check for valid characters
  if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) {
    return { isValid: false, error: 'Invalid characters in expression' };
  }

  return { isValid: true };
}

module.exports = {
  isValidNumber,
  isValidBasicOperation,
  isValidScientificOperation,
  validateExpression
};
