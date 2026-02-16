/**
 * Calculator API Module
 * Express API endpoints for calculator operations
 * Reference: docs/01_architecture.md (Application Services layer)
 * Reference: docs/03_folder_structure.md (src/modules - feature-bounded code)
 */

const express = require('express');
const calculationService = require('../services/calculation-service');
const router = express.Router();

/**
 * POST /api/calculate
 * Performs a standard calculation
 */
router.post('/calculate', async (req, res) => {
  try {
    const { expression, mode } = req.body;

    if (!expression) {
      return res.status(400).json({ error: 'Expression is required' });
    }

    const result = await calculationService.processCalculation(expression, mode || 'standard');
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/calculate/scientific
 * Performs a scientific calculation
 */
router.post('/calculate/scientific', async (req, res) => {
  try {
    const { value, operation, secondValue } = req.body;

    if (value === undefined || !operation) {
      return res.status(400).json({ error: 'Value and operation are required' });
    }

    const result = await calculationService.processScientificCalculation(
      parseFloat(value),
      operation,
      secondValue !== undefined ? parseFloat(secondValue) : null
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/history
 * Retrieves calculation history
 */
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = await calculationService.getCalculationHistory(limit);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/history/cleanup
 * Cleans up old calculations
 */
router.post('/history/cleanup', async (req, res) => {
  try {
    const deleted = await calculationService.cleanupHistory();
    res.json({ deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
