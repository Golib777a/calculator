class Calculator {
    constructor() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
        this.expression = '';
        
        this.expressionElement = document.getElementById('expression');
        this.resultElement = document.getElementById('result');
        
        this.init();
    }
    
    init() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButton(e.target);
            });
        });
        
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        this.updateDisplay();
    }
    
    handleButton(button) {
        const action = button.dataset.action;
        const value = button.dataset.value;
        
        if (action === 'number') {
            this.inputNumber(value);
        } else if (action === 'operator') {
            this.inputOperator(value);
        } else if (action === 'equals') {
            this.calculate();
        } else if (action === 'clear') {
            this.clear();
        } else if (action === 'toggle') {
            this.toggleSign();
        } else if (action === 'percent') {
            this.percent();
        } else if (action === 'decimal') {
            this.inputDecimal();
        }
        
        this.updateDisplay();
    }
    
    handleKeyboard(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            this.inputNumber(key);
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            e.preventDefault();
            this.inputOperator(key);
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            this.calculate();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.clear();
        } else if (key === 'Backspace') {
            this.backspace();
        } else if (key === '.') {
            this.inputDecimal();
        } else if (key === '%') {
            this.percent();
        }
        
        this.updateDisplay();
    }
    
    inputNumber(num) {
        if (this.waitingForOperand) {
            this.currentValue = num;
            this.waitingForOperand = false;
        } else {
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
        
        this.limitDigits();
    }
    
    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentValue = '0.';
            this.waitingForOperand = false;
            return;
        }
        
        if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }
    }
    
    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentValue);
        
        if (this.operator && this.waitingForOperand) {
            this.operator = nextOperator;
            this.expression = `${this.formatExpression(this.previousValue)} ${this.getOperatorSymbol(nextOperator)}`;
            return;
        }
        
        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operator) {
            const result = this.performCalculation(this.operator, this.previousValue, inputValue);
            this.currentValue = String(result);
            this.previousValue = result;
        }
        
        this.waitingForOperand = true;
        this.operator = nextOperator;
        this.expression = `${this.formatExpression(this.previousValue)} ${this.getOperatorSymbol(nextOperator)}`;
    }
    
    performCalculation(op, first, second) {
        switch (op) {
            case '+':
                return first + second;
            case '-':
                return first - second;
            case '*':
                return first * second;
            case '/':
                return second === 0 ? 0 : first / second;
            default:
                return second;
        }
    }
    
    calculate() {
        if (!this.operator || this.waitingForOperand) {
            return;
        }
        
        const inputValue = parseFloat(this.currentValue);
        const result = this.performCalculation(this.operator, this.previousValue, inputValue);
        
        this.expression = `${this.formatExpression(this.previousValue)} ${this.getOperatorSymbol(this.operator)} ${this.formatExpression(inputValue)} =`;
        this.currentValue = String(result);
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = true;
    }
    
    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
        this.expression = '';
    }
    
    backspace() {
        if (this.waitingForOperand) {
            return;
        }
        
        this.currentValue = this.currentValue.length > 1 ? this.currentValue.slice(0, -1) : '0';
    }
    
    toggleSign() {
        const value = parseFloat(this.currentValue);
        this.currentValue = String(-value);
    }
    
    percent() {
        const value = parseFloat(this.currentValue);
        this.currentValue = String(value / 100);
    }
    
    limitDigits() {
        if (this.currentValue.replace('.', '').length > 12) {
            this.currentValue = this.currentValue.slice(0, -1);
        }
    }
    
    formatExpression(num) {
        const value = typeof num === 'string' ? parseFloat(num) : num;
        if (Math.abs(value) >= 1e9) {
            return value.toExponential(4);
        }
        return value.toLocaleString('ru-RU', { maximumFractionDigits: 8 });
    }
    
    formatResult(num) {
        const str = String(num);
        if (str.length > 12) {
            if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-6 && num !== 0)) {
                return num.toExponential(6);
            }
            return num.toPrecision(10);
        }
        return str;
    }
    
    getOperatorSymbol(op) {
        switch (op) {
            case '*': return '×';
            case '/': return '÷';
            case '-': return '−';
            case '+': return '+';
            default: return op;
        }
    }
    
    updateDisplay() {
        this.expressionElement.textContent = this.expression;
        
        let displayValue = this.currentValue;
        const num = parseFloat(this.currentValue);
        
        if (!isNaN(num)) {
            if (this.currentValue.includes('.') && this.currentValue.endsWith('.')) {
                displayValue = this.formatExpression(num) + '.';
            } else if (this.currentValue.includes('.')) {
                const parts = this.currentValue.split('.');
                const intPart = parseFloat(parts[0]);
                displayValue = this.formatExpression(intPart) + '.' + parts[1];
            } else {
                displayValue = this.formatExpression(num);
            }
        }
        
        this.resultElement.textContent = displayValue;
        this.adjustFontSize();
        this.updateOperatorButtons();
    }
    
    adjustFontSize() {
        const length = this.resultElement.textContent.length;
        const baseSize = 4;
        const maxSize = 5;
        const minSize = 2.5;
        
        let newSize;
        if (length <= 6) {
            newSize = maxSize;
        } else if (length <= 9) {
            newSize = baseSize;
        } else if (length <= 12) {
            newSize = 3;
        } else {
            newSize = minSize;
        }
        
        this.resultElement.style.fontSize = `${newSize}rem`;
    }
    
    updateOperatorButtons() {
        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.classList.remove('active');
            if (this.operator === btn.dataset.value && this.waitingForOperand) {
                btn.classList.add('active');
            }
        });
    }
}

// Инициализация калькулятора
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
});

// Регистрация service worker для PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful:', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}
