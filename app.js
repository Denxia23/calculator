//display function
function updateDisplay(display,text) {
    display.innerText = text;
}

function clearDisplay(display) {
    display.innerText = "";
}
//math functions
function add(a,b) {
    return a + b;
}

function substract(a,b) {
    return a - b;
}

function multiply(a,b) {
    return a * b;
}

function divide(a,b) {
    return b !== 0 ? a/b : "ERROR";
}

function percentage(a,b) {
    return b * (a/100);
}

function operate(expression) {
    let array = expression.split(" ");
    let result;
    
    //perform multiplication and division first
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] === "×") {
            result = multiply(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
            array[i] = result.toString();
            array.splice(i - 1,1);
            array.splice(i,1);
            i -= 2;
        } else if (array[i] === "÷") {
            result = divide(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
            if (result === "ERROR") {
              return "ERROR";
            }
            array[i] = result.toString();
            array.splice(i - 1,1);
            array.splice(i,1);
            i -= 2;
        } else if (array[i] === "%") {
            result = percentage(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
            array[i] = result.toString();
            array.splice(i - 1,1);
            array.splice(i,1);
            i -= 2;
        }
    }

    //perform addition and subtraction
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] === "+") {
            result = add(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
            array[i] = result.toString();
            array.splice(i - 1,1);
            array.splice(i,1);
            i -= 2;
           
        } else if (array[i] === "-") {
            result = substract(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
            array[i] = result.toString();
            array.splice(i - 1,1);
            array.splice(i,1);
            i -= 2;
        }
    }
    return array[0];
}

function result(expression,displayExpression,displayResult,history) {
    historyElement = expression;
    expression = operate(expression);
    updateDisplay(displayExpression,expression);
    clearDisplay(displayResult);
    historyElement += ` = ${expression}`;
    history.push(historyElement);
    return expression;
}

function autoResult(expression,operators,displayExpression,displayResult) {
    if (operators.test(expression)) {
        if (expression.endsWith(".") && expression[expression.length - 2] === " ") {
            updateDisplay(displayExpression,expression);
            return;
        }
        updateDisplay(displayResult,operate(expression));
    }
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
                    expression = result(expression,displayExpression,displayResult,history);
                }
            })
            continue;
        }
        
        if (button.dataset.value === "clear") {
            button.addEventListener("click", () => {
                button.blur();
                expression = "";
                clearDisplay(displayExpression);
                clearDisplay(displayResult);
            })
            continue;
        }
        
        if (button.dataset.value === "delete") {
            button.addEventListener("click", () => {
                button.blur();
                expression = expression.endsWith(" ") ? expression.slice(0,expression.length - 3) : expression.slice(0,expression.length - 1);
                updateDisplay(displayExpression,expression);
                
                //checks if the expression ends with an operation, and if it isn't a single number
                if (expression.endsWith(" ")) {
                    if (operators.test(expression.slice(0,expression.length - 3))) {
                        updateDisplay(displayResult,operate(expression.slice(0,expression.length - 3)));
                    } else {
                        clearDisplay(displayResult);
                    }
                    return;
                } 
                
                if (operators.test(expression)) {
                    if (expression.endsWith(".") && expression[expression.length - 2] === " ") {
                        if (operators.test(expression.slice(0,expression.length - 4))) {
                            updateDisplay(displayResult,operate(expression.slice(0,expression.length - 4)));
                        } else {
                            clearDisplay(displayResult);
                        }
                        return;
                    }
                    updateDisplay(displayResult,operate(expression));
                }
            })
            continue;
        }

        button.addEventListener("click", () => {
            button.blur();
            if (operators.test(button.innerText) && !expression.endsWith(" ") && expression !== "") {
                expression += ` ${button.innerText} `;
                updateDisplay(displayExpression,expression);
                return;
            }
            
            if (!operators.test(button.innerText)) {
                //prevents user from inputting numbers with more than one "."
                if (button.innerText === ".") {
                    if (expression.lastIndexOf(" ") === -1 && expression.slice(expression.lastIndexOf(" ") * 0).includes(".")) {
                        return;
                    } 
                    if (expression.slice(expression.lastIndexOf(" ")).includes(".")) return;               
                }
                expression += button.innerText;
                updateDisplay(displayExpression,expression);
                
                //performs the expression and refreshes the result if possible
                autoResult(expression,operators,displayExpression,displayResult);
            }
        })
    }
    //keyboard support
    window.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            //checks if the expression is valid
            if (operators.test(expression) && !expression.endsWith(" ")) {
                expression = result(expression,displayExpression,displayResult,history);
            }
            return;
        } 
        
        if (e.key === "Backspace") {
            expression = expression.endsWith(" ") ? expression.slice(0,expression.length - 3) : expression.slice(0,expression.length - 1);
            updateDisplay(displayExpression,expression);

            //performs the expression and refreshes the result in display if possible
            if (expression.endsWith(" ")) {
                if (operators.test(expression.slice(0,expression.length - 3))) {
                    updateDisplay(displayResult,operate(expression.slice(0,expression.length - 3)));
                } else {
                    clearDisplay(displayResult);
                }
                return;
            } 
            
            if (operators.test(expression)) {
                if (expression.endsWith(".") && expression[expression.length - 2] === " ") {
                    if (operators.test(expression.slice(0,expression.length - 4))) {
                        updateDisplay(displayResult,operate(expression.slice(0,expression.length - 4)));
                    } else {
                        clearDisplay(displayResult);
                    }
                    return;
                }
                updateDisplay(displayResult,operate(expression));
            }
        } 
        
        if (!expression.endsWith(" ") && /([+/*-])/.test(e.key) && expression !== "") {
            pressedKey = e.key;
            if (pressedKey === "/") {
                pressedKey = "÷"
            }

            if (pressedKey === "*") {
                pressedKey = "×";
            }

            expression += ` ${pressedKey} `;
            updateDisplay(displayExpression,expression);
            return;
        }
         
        if (/(^[0-9.]$)/.test(e.key)){
            if (e.key === ".") {
                if (expression.lastIndexOf(" ") === -1 && expression.slice(expression.lastIndexOf(" ") * 0).includes(".")) {
                    return;
                } 
                if (expression.slice(expression.lastIndexOf(" ")).includes(".")) return;               
            }
            expression += e.key;  
            updateDisplay(displayExpression,expression);  
            
            //performs the expression and refreshes the result if possible
            autoResult(expression,operators,displayExpression,displayResult);
        } return;
        
    })
}

main();