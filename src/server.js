/**
 * Express Server
 * Main application entry point
 * Reference: docs/01_architecture.md (Application Services layer)
 */

const express = require('express');
const path = require('path');
const calculatorApi = require('./modules/calculator-api');
const calculationService = require('./services/calculation-service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', calculatorApi);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Calculator server running on port ${PORT}`);
  
  // Cleanup old calculations on startup
  calculationService.cleanupHistory()
    .then(deleted => {
      if (deleted > 0) {
        console.log(`Cleaned up ${deleted} old calculation records`);
      }
    })
    .catch(err => {
      console.error('Error during cleanup:', err);
    });
});

module.exports = app;
