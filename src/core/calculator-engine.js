/**
 * Core Calculator Engine
 * Pure functions for calculator operations - no framework dependencies
 * Reference: docs/01_architecture.md (Domain/Core layer)
 */

/**
 * Performs basic arithmetic operations
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @param {string} operation - Operation type: '+', '-', '*', '/'
 * @returns {number} Calculation result
 * @throws {Error} If division by zero or invalid operation
 */
function calculateBasic(a, b, operation) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Invalid operands: must be numbers');
  }

  switch (operation) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) {
        throw new Error('Division by zero');
      }
      return a / b;
    default:
      throw new Error(`Invalid operation: ${operation}`);
  }
}

/**
 * Evaluates a mathematical expression
 * @param {string} expression - Mathematical expression string
 * @returns {number} Calculation result
 * @throws {Error} If expression is invalid
 */
function evaluateExpression(expression) {
  if (!expression || typeof expression !== 'string') {
    throw new Error('Invalid expression');
  }

  // Remove whitespace
  const cleaned = expression.replace(/\s/g, '');
  
  // Validate expression contains only valid characters
  if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) {
    throw new Error('Invalid characters in expression');
  }

  try {
    // Use Function constructor for safe evaluation
    // In production, consider using a proper expression parser
    const result = Function('"use strict"; return (' + cleaned + ')')();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid calculation result');
    }
    
    return result;
  } catch (error) {
    throw new Error(`Expression evaluation failed: ${error.message}`);
  }
}

/**
 * Performs scientific operations
 * @param {number} value - Input value
 * @param {string} operation - Scientific operation: 'sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'pow', 'exp'
 * @param {number} [secondValue] - Second operand for operations like pow
 * @returns {number} Calculation result
 * @throws {Error} If operation is invalid or input is invalid
 */
function calculateScientific(value, operation, secondValue = null) {
  if (typeof value !== 'number') {
    throw new Error('Invalid value: must be a number');
  }

  switch (operation.toLowerCase()) {
    case 'sin':
      return Math.sin(value);
    case 'cos':
      return Math.cos(value);
    case 'tan':
      return Math.tan(value);
    case 'log':
      if (value <= 0) {
        throw new Error('Logarithm of non-positive number');
      }
      return Math.log10(value);
    case 'ln':
      if (value <= 0) {
        throw new Error('Natural logarithm of non-positive number');
      }
      return Math.log(value);
    case 'sqrt':
      if (value < 0) {
        throw new Error('Square root of negative number');
      }
      return Math.sqrt(value);
    case 'pow':
      if (typeof secondValue !== 'number') {
        throw new Error('Power operation requires second value');
      }
      return Math.pow(value, secondValue);
    case 'exp':
      return Math.exp(value);
    default:
      throw new Error(`Invalid scientific operation: ${operation}`);
  }
}

/**
 * Formats a number for display
 * @param {number} value - Number to format
 * @param {number} [precision=10] - Decimal precision
 * @returns {string} Formatted number string
 */
function formatNumber(value, precision = 10) {
  if (typeof value !== 'number' || !isFinite(value)) {
    return 'Error';
  }

  // Handle very large or very small numbers
  if (Math.abs(value) > 1e10 || (Math.abs(value) < 1e-10 && value !== 0)) {
    return value.toExponential(precision);
  }

  // Round to avoid floating point precision issues
  const rounded = Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
  
  // Remove trailing zeros
  return rounded.toString();
}

module.exports = {
  calculateBasic,
  evaluateExpression,
  calculateScientific,
  formatNumber
};
