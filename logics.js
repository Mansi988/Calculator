const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

const state = {
  firstOperand: null,
  operator: null,
  currentValue: '0',
  waitingForSecond: false,
};

function updateScreen() {
  resultEl.textContent = state.currentValue;
  expressionEl.textContent = state.operator
    ? `${state.firstOperand} ${state.operator}`
    : '\u00A0';
}

function trimFloat(num) {
  if (!Number.isFinite(num)) return 'Error';
  const rounded = Math.round((num + Number.EPSILON) * 1e10) / 1e10;
  return rounded.toString();
}

function resetAfterError() {
  state.currentValue = '0';
  state.firstOperand = null;
  state.operator = null;
  state.waitingForSecond = false;
}

function inputDigit(digit) {
  if (state.currentValue === 'Error') resetAfterError();

  if (state.waitingForSecond) {
    state.currentValue = digit;
    state.waitingForSecond = false;
  } else {
    state.currentValue = state.currentValue === '0' ? digit : state.currentValue + digit;
  }
  updateScreen();
}

function inputDecimal() {
  if (state.currentValue === 'Error') resetAfterError();

  if (state.waitingForSecond) {
    state.currentValue = '0.';
    state.waitingForSecond = false;
  } else if (!state.currentValue.includes('.')) {
    state.currentValue += '.';
  }
  updateScreen();
}

function setOperator(nextOperator) {
  if (state.currentValue === 'Error') return;

  if (state.operator !== null && !state.waitingForSecond) {
    calculate();
  }
  state.firstOperand = state.currentValue;
  state.operator = nextOperator;
  state.waitingForSecond = true;
  updateScreen();
}

function calculate() {
  if (state.operator === null || state.waitingForSecond) return;

  const a = parseFloat(state.firstOperand);
  const b = parseFloat(state.currentValue);
  let result;

  switch (state.operator) {
    case '+': result = a + b; break;
    case '\u2212': result = a - b; break; // −
    case '\u00D7': result = a * b; break; // ×
    case '\u00F7': result = b === 0 ? NaN : a / b; break; // ÷
    default: return;
  }

  state.currentValue = Number.isNaN(result) ? 'Error' : trimFloat(result);
  state.operator = null;
  state.firstOperand = null;
  state.waitingForSecond = true;
  updateScreen();
}

function percent() {
  if (state.currentValue === 'Error') return;
  const num = parseFloat(state.currentValue);
  state.currentValue = trimFloat(num / 100);
  updateScreen();
}

function backspace() {
  if (state.currentValue === 'Error' || state.waitingForSecond) return;
  state.currentValue = state.currentValue.length > 1 ? state.currentValue.slice(0, -1) : '0';
  updateScreen();
}

function clearAll() {
  state.firstOperand = null;
  state.operator = null;
  state.currentValue = '0';
  state.waitingForSecond = false;
  updateScreen();
}

document.querySelectorAll('.key').forEach((btn) => {
  btn.addEventListener('click', () => {
    const { action, value } = btn.dataset;
    switch (action) {
      case 'number': inputDigit(value); break;
      case 'decimal': inputDecimal(); break;
      case 'operator': setOperator(value); break;
      case 'equals': calculate(); break;
      case 'percent': percent(); break;
      case 'backspace': backspace(); break;
      case 'clear': clearAll(); break;
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') return inputDigit(e.key);
  if (e.key === '.') return inputDecimal();
  if (e.key === '+') return setOperator('+');
  if (e.key === '-') return setOperator('\u2212');
  if (e.key === '*') return setOperator('\u00D7');
  if (e.key === '/') { e.preventDefault(); return setOperator('\u00F7'); }
  if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); return calculate(); }
  if (e.key === 'Backspace') return backspace();
  if (e.key === 'Escape') return clearAll();
  if (e.key === '%') return percent();
});

updateScreen();