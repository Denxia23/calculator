//display function
function updateDisplay(display, text) {
  display.innerText = text;
}

function clearDisplay(display) {
  display.innerText = "";
}

function result(expression, displayExpression, displayResult, history) {
  historyElement = expression;
  expression = operate(expression);
  updateDisplay(displayExpression, expression);
  clearDisplay(displayResult);
  historyElement += ` = ${expression}`;
  history.push(historyElement);
  return expression;
}

function autoResult(expression, operators, displayResult) {
  if (operators.test(expression)) {
    if (expression.endsWith(".") && expression[expression.length - 2] === " ") return;
    updateDisplay(displayResult, operate(expression));
  }
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
      return expression = "-";
    } else {
      return expression;
    }
  } 

  if (pressedKey === "/") {
    pressedKey = "÷";
  }

  if (pressedKey === "*") {
    pressedKey = "×";
  }

  //multiplication and divisition by a negative number
  if (expression.endsWith(" ")) {
    if (/[÷×]/.test(expression[expression.length - 2]) && pressedKey === "-") {
      return expression + "-";
    }
    return expression.slice(0,expression.length - 3) + ` ${pressedKey } `; 
  }

  if (expression.endsWith(".") && expression[expression.length - 2] === " ") return expression;
  
  expression += ` ${pressedKey} `;
  return expression;
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
        if (operators.test(expression) && !expression.endsWith(" ")) {
          expression = result(expression, displayExpression, displayResult, history);
        }
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
        expression = expression.endsWith(" ") ? expression.slice(0, expression.length - 3) : expression.slice(0, expression.length - 1);
        updateDisplay(displayExpression, expression);

        //checks if the expression ends with an operation, and if it isn't a single number
        if (expression.endsWith(" ") || expression.endsWith("-")) {
          if (operators.test(expression.slice(0, expression.length - 3))) {
            updateDisplay(displayResult, operate(expression.slice(0, expression.length - 3)));
          } else {
            clearDisplay(displayResult);
          }
          return;
        }

        if (operators.test(expression)) {
          if (expression.endsWith(".") && expression[expression.length - 2] === " ") {
            if (operators.test(expression.slice(0, expression.length - 4))) {
              updateDisplay(displayResult, operate(expression.slice(0, expression.length - 4)));
            } else {
              clearDisplay(displayResult);
            }
            return;
          }
          updateDisplay(displayResult, operate(expression));
        }
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
      if (operators.test(expression) && !expression.endsWith(" ")) {
        expression = result(expression, displayExpression, displayResult, history);
      }
      return;
    }

    if (e.key === "Backspace") {
      expression = expression.endsWith(" ") ? expression.slice(0, expression.length - 3) : expression.slice(0, expression.length - 1);
      updateDisplay(displayExpression, expression);

      //performs the expression and refreshes the result in display if possible
      if (expression.endsWith(" ") || expression.endsWith("-")) {
        if (operators.test(expression.slice(0, expression.length - 3))) {
          updateDisplay(displayResult, operate(expression.slice(0, expression.length - 3)));
        } else {
          clearDisplay(displayResult);
        }
        return;
      }

      if (operators.test(expression)) {
        if (expression.endsWith(".") && expression[expression.length - 2] === " ") {
          if (operators.test(expression.slice(0, expression.length - 4))) {
            updateDisplay(displayResult, operate(expression.slice(0, expression.length - 4)));
          } else {
            clearDisplay(displayResult);
          }
          return;
        }
        updateDisplay(displayResult, operate(expression));
      }
      return;
    }

    //operators
    if (/([+/*-])/.test(e.key)) {
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
