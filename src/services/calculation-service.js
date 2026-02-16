/**
 * Calculation Service
 * Application service layer - orchestrates calculation execution and history storage
 * Reference: docs/01_architecture.md (Application Services layer)
 * Reference: docs/03_folder_structure.md (src/services - orchestration, transaction boundaries)
 */

const calculatorEngine = require('../core/calculator-engine');
const validator = require('../core/calculation-validator');
const historyStore = require('../infrastructure/history-store');

/**
 * Processes a standard calculation
 * @param {string} expression - Mathematical expression
 * @param {string} mode - Calculator mode ('standard' or 'scientific')
 * @returns {Promise<Object>} Result object with expression, result, and formatted result
 */
async function processCalculation(expression, mode = 'standard') {
  // Validate expression
  const validation = validator.validateExpression(expression);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Calculate result
  let result;
  try {
    result = calculatorEngine.evaluateExpression(expression);
  } catch (error) {
    throw new Error(`Calculation failed: ${error.message}`);
  }

  // Format result
  const formattedResult = calculatorEngine.formatNumber(result);

  // Store in history (fire and forget - don't block on storage)
  historyStore.storeCalculation(expression, formattedResult, mode)
    .catch(err => {
      // Log error but don't fail the request
      console.error('Failed to store calculation history:', err);
    });

  return {
    expression,
    result: result,
    formattedResult,
    mode
  };
}

/**
 * Processes a scientific calculation
 * @param {number} value - Input value
 * @param {string} operation - Scientific operation
 * @param {number} [secondValue] - Second operand for operations like pow
 * @returns {Promise<Object>} Result object
 */
async function processScientificCalculation(value, operation, secondValue = null) {
  // Validate inputs
  if (!validator.isValidNumber(value)) {
    throw new Error('Invalid value: must be a number');
  }

  if (!validator.isValidScientificOperation(operation)) {
    throw new Error(`Invalid scientific operation: ${operation}`);
  }

  // Calculate result
  let result;
  try {
    result = calculatorEngine.calculateScientific(value, operation, secondValue);
  } catch (error) {
    throw new Error(`Scientific calculation failed: ${error.message}`);
  }

  // Format result
  const formattedResult = calculatorEngine.formatNumber(result);

  // Build expression string for history
  const expression = secondValue !== null 
    ? `${operation}(${value}, ${secondValue})`
    : `${operation}(${value})`;

  // Store in history
  historyStore.storeCalculation(expression, formattedResult, 'scientific')
    .catch(err => {
      console.error('Failed to store calculation history:', err);
    });

  return {
    expression,
    result: result,
    formattedResult,
    mode: 'scientific'
  };
}

/**
 * Retrieves calculation history
 * @param {number} [limit=50] - Maximum number of records
 * @returns {Promise<Array>} Array of calculation records
 */
async function getCalculationHistory(limit = 50) {
  try {
    return await historyStore.getHistory(limit);
  } catch (error) {
    throw new Error(`Failed to retrieve history: ${error.message}`);
  }
}

/**
 * Cleans up old calculations
 * @returns {Promise<number>} Number of records deleted
 */
async function cleanupHistory() {
  try {
    return await historyStore.cleanupOldCalculations();
  } catch (error) {
    throw new Error(`Failed to cleanup history: ${error.message}`);
  }
}

module.exports = {
  processCalculation,
  processScientificCalculation,
  getCalculationHistory,
  cleanupHistory
};
