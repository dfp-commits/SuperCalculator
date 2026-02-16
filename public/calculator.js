/**
 * Calculator Frontend Logic
 * Interface layer - handles user input and API communication
 * Reference: docs/01_architecture.md (Interface/API layer)
 */

const API_BASE = '/api';

let currentMode = 'standard';
let currentExpression = '';
let currentResult = '0';
let waitingForNewInput = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupModeToggle();
    loadHistory();
    
    // Cleanup old history periodically (every hour)
    setInterval(() => {
        fetch(`${API_BASE}/history/cleanup`, { method: 'POST' })
            .catch(err => console.error('Cleanup error:', err));
    }, 3600000);
});

/**
 * Sets up mode toggle buttons
 */
function setupModeToggle() {
    document.getElementById('standardMode').addEventListener('click', () => {
        switchMode('standard');
    });
    
    document.getElementById('scientificMode').addEventListener('click', () => {
        switchMode('scientific');
    });
}

/**
 * Switches between standard and scientific modes
 */
function switchMode(mode) {
    currentMode = mode;
    
    const standardBtn = document.getElementById('standardMode');
    const scientificBtn = document.getElementById('scientificMode');
    const standardCalc = document.getElementById('standardCalculator');
    const scientificCalc = document.getElementById('scientificCalculator');
    
    if (mode === 'standard') {
        standardBtn.classList.add('active');
        scientificBtn.classList.remove('active');
        standardCalc.style.display = 'grid';
        scientificCalc.style.display = 'none';
    } else {
        scientificBtn.classList.add('active');
        standardBtn.classList.remove('active');
        standardCalc.style.display = 'none';
        scientificCalc.style.display = 'grid';
    }
    
    clearAll();
}

/**
 * Appends a number to the current expression
 */
function appendNumber(number) {
    if (waitingForNewInput) {
        currentExpression = '';
        waitingForNewInput = false;
    }
    
    currentExpression += number;
    updateDisplay();
}

/**
 * Appends an operator to the current expression
 */
function appendOperator(operator) {
    if (waitingForNewInput) {
        currentExpression = currentResult;
        waitingForNewInput = false;
    }
    
    currentExpression += operator;
    updateDisplay();
}

/**
 * Appends a decimal point
 */
function appendDecimal() {
    if (waitingForNewInput) {
        currentExpression = '0';
        waitingForNewInput = false;
    }
    
    if (!currentExpression || currentExpression === '') {
        currentExpression = '0';
    }
    
    if (!currentExpression.includes('.')) {
        currentExpression += '.';
    }
    
    updateDisplay();
}

/**
 * Performs a scientific operation
 */
async function scientificOperation(operation) {
    const value = parseFloat(currentResult) || 0;
    
    try {
        const response = await fetch(`${API_BASE}/calculate/scientific`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                value: value,
                operation: operation
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentResult = data.formattedResult;
            currentExpression = data.expression;
            waitingForNewInput = true;
            updateDisplay();
            loadHistory();
        } else {
            showError(data.error || 'Calculation failed');
        }
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

/**
 * Performs the calculation
 */
async function calculate() {
    if (!currentExpression || currentExpression === '') {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                expression: currentExpression,
                mode: currentMode
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentResult = data.formattedResult;
            currentExpression = data.expression;
            waitingForNewInput = true;
            updateDisplay();
            loadHistory();
        } else {
            showError(data.error || 'Calculation failed');
        }
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

/**
 * Clears the current entry
 */
function clearEntry() {
    currentExpression = '';
    updateDisplay();
}

/**
 * Clears everything
 */
function clearAll() {
    currentExpression = '';
    currentResult = '0';
    waitingForNewInput = false;
    updateDisplay();
}

/**
 * Updates the display
 */
function updateDisplay() {
    const expressionEl = document.getElementById('expression');
    const resultEl = document.getElementById('result');
    
    expressionEl.textContent = currentExpression || '';
    resultEl.textContent = currentResult || '0';
    resultEl.classList.remove('error');
}

/**
 * Shows an error message
 */
function showError(message) {
    const resultEl = document.getElementById('result');
    resultEl.textContent = 'Error: ' + message;
    resultEl.classList.add('error');
    currentResult = '0';
    waitingForNewInput = true;
}

/**
 * Loads calculation history
 */
async function loadHistory() {
    try {
        const response = await fetch(`${API_BASE}/history?limit=10`);
        const history = await response.json();
        
        const historyEl = document.getElementById('history');
        historyEl.innerHTML = '';
        
        if (history.length === 0) {
            historyEl.innerHTML = '<div style="color: #999; text-align: center; padding: 20px;">No calculations yet</div>';
            return;
        }
        
        history.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'history-item';
            itemEl.onclick = () => {
                currentExpression = item.expression;
                currentResult = item.result;
                waitingForNewInput = false;
                updateDisplay();
            };
            
            itemEl.innerHTML = `
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
                <div class="history-mode">${item.mode}</div>
            `;
            
            historyEl.appendChild(itemEl);
        });
    } catch (error) {
        console.error('Failed to load history:', error);
    }
}
