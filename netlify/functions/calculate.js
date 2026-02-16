/**
 * Netlify Serverless Function - Calculate
 * Handles calculation API requests
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
    const { expression, mode } = body;

    if (!expression) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Expression is required' })
      };
    }

    const result = await calculationService.processCalculation(
      expression,
      mode || 'standard'
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
