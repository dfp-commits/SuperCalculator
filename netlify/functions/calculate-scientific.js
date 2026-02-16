/**
 * Netlify Serverless Function - Calculate Scientific
 * Handles scientific calculation API requests
 * Reference: docs/01_architecture.md (Application Services layer)
 */

const calculationService = require('../../src/services/calculation-service');

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { value, operation, secondValue } = body;

    if (value === undefined || !operation) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Value and operation are required' })
      };
    }

    const result = await calculationService.processScientificCalculation(
      parseFloat(value),
      operation,
      secondValue !== undefined ? parseFloat(secondValue) : null
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
