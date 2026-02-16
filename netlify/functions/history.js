/**
 * Netlify Serverless Function - History
 * Handles history API requests
 * Reference: docs/01_architecture.md (Application Services layer)
 */

const calculationService = require('../../src/services/calculation-service');

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

  try {
    if (event.httpMethod === 'GET') {
      // Get history
      const limit = parseInt(event.queryStringParameters?.limit) || 50;
      const history = await calculationService.getCalculationHistory(limit);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(history)
      };
    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
