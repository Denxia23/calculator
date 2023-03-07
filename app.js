//display functions
function updateDisplay(display, text) {
  display.innerText = text;
}

function clearDisplay(display) {
  display.innerText = "";
}

function isSingleNumber(expression, operators) {
  if (!operators.test(expression)) return true;
  if (expression[0] === "-" && !operators.test(expression.slice(1))) return true;
  return false;
}

//auto result
function autoResult(expression, operators, displayResult) {
  //ends with "operator ."
  if (expression.endsWith(".") && expression[expression.length - 2] === " ") {
    expression = expression.slice(0, expression.length - 4);
  }
  //ends with "operator -."
  if (expression.endsWith(".") && expression[expression.length - 2] === "-") {
    clearDisplay(displayResult);
    return;
  }

  if (operate(expression) === "ERROR" || isSingleNumber(expression, operators)) {
    clearDisplay(displayResult);
    return;
  }
  updateDisplay(displayResult, operate(expression));
}

//input handle
function handleDigit(digit, expression) {
  if (digit === ".") {
    if (expression.lastIndexOf(" ") === -1 && expression.includes(".")) return expression;
    if (expression.slice(expression.lastIndexOf(" ")).includes(".")) return expression;
  }
  expression += digit;
  return expression;
}

function handleOperator(operator, expression) {
  pressedKey = operator;
  //empty string
  if (expression === "") {
    if (pressedKey === "-") {
      return "-";
    }
    return expression;
  }
  //
  if (expression === "-") return expression;
  if (pressedKey === "/") {
    pressedKey = "÷";
  }
  if (pressedKey === "*") {
    pressedKey = "×";
  }
  //multiplication and divisition by a negative number
  if (expression.endsWith(" ")) {
    if (/[÷×%]/.test(expression[expression.length - 2]) && pressedKey === "-") {
      return expression + "-";
    }
    return expression.slice(0, expression.length - 3) + ` ${pressedKey} `;
  }

  if ((expression.endsWith(".") && expression[expression.length - 2] === " ") || expression === "." || expression === "-.") return expression;

  expression += ` ${pressedKey} `;
  return expression;
}

function handleDeletion(expression) {
  return expression.endsWith(" ") ? expression.slice(0, expression.length - 3) : expression.slice(0, expression.length - 1);
}

function handleResult(expression, displayExpression, displayResult, history) {
  result = operate(expression);
  if (result === "ERROR") {
    updateDisplay(displayResult, "Can't divide by 0");
    return expression;
  }

  if (expression.endsWith(".") && expression[expression.length - 2] === " ") {
    updateDisplay(displayResult, "Format error");
    return expression;
  }

  if (expression.endsWith(".") && expression[expression.length - 2] === "-"); {
    updateDisplay(displayResult, "Format error");
    return expression;
  }


  updateDisplay(displayExpression, result);
  clearDisplay(displayResult);
  historyElement = `${expression} = ${result}`;
  history.push(historyElement);
  return result;
}

//math functions
function add(a, b) {
  return a + b;
}

function substract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return b !== 0 ? a / b : "ERROR";
}

function percentage(a, b) {
  return b * (a / 100);
}

function operate(expression) {
  let array = expression.split(" ");
  let result;

  //perform multiplication and division first
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] === "×") {
      result = multiply(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
      array[i] = result.toString();
      array.splice(i - 1, 1);
      array.splice(i, 1);
      i -= 2;
    } else if (array[i] === "÷") {
      result = divide(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
      if (result === "ERROR") return "ERROR";
      array[i] = result.toString();
      array.splice(i - 1, 1);
      array.splice(i, 1);
      i -= 2;
    } else if (array[i] === "%") {
      result = percentage(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
      array[i] = result.toString();
      array.splice(i - 1, 1);
      array.splice(i, 1);
      i -= 2;
    }
  }

  //perform addition and subtraction
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] === "+") {
      result = add(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
      array[i] = result.toString();
      array.splice(i - 1, 1);
      array.splice(i, 1);
      i -= 2;
    } else if (array[i] === "-") {
      result = substract(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
      array[i] = result.toString();
      array.splice(i - 1, 1);
      array.splice(i, 1);
      i -= 2;
    }
  }
  return array[0];
}

//main
function main() {
  const displayExpression = document.querySelector(".display .expression");
  const displayResult = document.querySelector(".display .result");

  let expression = "";
  let history = [];

  const operators = /([+×÷%-])/;
  const buttons = document.querySelectorAll(".buttons button");

  //buttons
  for (const button of buttons) {
    if (button.dataset.value === "=") {
      button.addEventListener("click", () => {
        button.blur();
        //checks if the expression is valid
        if (isSingleNumber(expression,operators || expression.endsWith(" "))) return;
        expression = handleResult(expression, displayExpression, displayResult, history);
      });
      continue;
    }

    if (button.dataset.value === "clear") {
      button.addEventListener("click", () => {
        button.blur();
        expression = "";
        clearDisplay(displayExpression);
        clearDisplay(displayResult);
      });
      continue;
    }

    if (button.dataset.value === "delete") {
      button.addEventListener("click", () => {
        button.blur();
        expression = handleDeletion(expression);
        updateDisplay(displayExpression, expression);

        //performs the expression and refreshes the result in display if possible
        if (expression.endsWith(" ") || expression.endsWith("-")) {
          autoResult(expression.slice(0, expression.length - 3), operators, displayResult);
          return;
        }
        autoResult(expression, operators, displayResult);
      });
      continue;
    }

    //operators and digits
    button.addEventListener("click", () => {
      button.blur();
      if (operators.test(button.innerText)) {
        expression = handleOperator(button.innerText, expression);
        updateDisplay(displayExpression, expression);
        return;
      }

      if (!operators.test(button.innerText)) {
        expression = handleDigit(button.innerText, expression);
        updateDisplay(displayExpression, expression);
        autoResult(expression, operators, displayResult);
      }
    });
  }
  //keyboard support
  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      //checks if the expression is valid
      if (isSingleNumber(expression,operators || expression.endsWith(" "))) return;
      expression = handleResult(expression, displayExpression, displayResult, history);
      return;
    }

    if (e.key === "Backspace") {
      expression = handleDeletion(expression);
      updateDisplay(displayExpression, expression);

      //performs the expression and refreshes the result in display if possible
      if (expression.endsWith(" ") || expression.endsWith("-")) {
        autoResult(expression.slice(0, expression.length - 3), operators, displayResult);
        return;
      }
      autoResult(expression, operators, displayResult);
      return;
    }

    //operators
    if (/([+/*%-])/.test(e.key)) {
      expression = handleOperator(e.key, expression);
      updateDisplay(displayExpression, expression);
      return;
    }
    //digits
    if (/(^[0-9.]$)/.test(e.key)) {
      expression = handleDigit(e.key, expression);
      updateDisplay(displayExpression, expression);
      autoResult(expression, operators, displayResult);
    }
  });
}

main();
