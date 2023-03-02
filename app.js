//display function
function updateDisplay(display,text) {
    display.innerText = text;
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

//main
function main() {
    const displayExpression = document.querySelector(".display .expression");
    const displayResult = document.querySelector(".display .result");

    let expression = "";
    let history = [];

    const operators = /([+×÷%-])/;
    const buttons = document.querySelectorAll(".buttons div");

    //buttons
    for (const button of buttons) {
        //performs the expression, refreshes the result in display and saves the expression in history
        if (button.dataset.value === "=") {
            button.addEventListener("click", () => {
                if (operators.test(expression)) {
                    historyElement = expression;
                    expression = operate(expression);
                    updateDisplay(displayExpression,expression);
                    updateDisplay(displayResult,"");
                    historyElement += ` = ${expression}`;
                    history.push(historyElement);
                }
            })
            continue;
        }
        
        if (button.dataset.value === "clear") {
            button.addEventListener("click", () => {
                expression = "";
                updateDisplay(displayExpression,expression);
                updateDisplay(displayResult,"");
            })
            continue;
        }
        
        if (button.dataset.value === "delete") {
            button.addEventListener("click", () => {
                expression = expression.endsWith(" ") ? expression.slice(0,expression.length - 3) : expression.slice(0,expression.length - 1);
                updateDisplay(displayExpression,expression);

                //performs the expression and refreshes the result in display if possible
                
                //checks if the expression ends with an expression, and if it isn't a single number
                if (expression.endsWith(" ")) {
                    if (operators.test(expression.slice(0,expression.length - 3))) {
                        updateDisplay(displayResult,operate(expression.slice(0,expression.length - 3)));
                    } else {
                        updateDisplay(displayResult,"");
                    }
                    return;
                } 
                
                if (operators.test(expression)) {
                    if (expression.endsWith(".") && expression[expression.length - 2] === " ") {
                        if (operators.test(expression.slice(0,expression.length - 4))) {
                            updateDisplay(displayResult,operate(expression.slice(0,expression.length - 4)));
                        } else {
                            updateDisplay(displayResult,"");
                        }
                        return;
                    }
                    updateDisplay(displayResult,operate(expression));
                }
            })
            continue;
        }

        button.addEventListener("click", () => {
            if (operators.test(button.innerText) && !expression.endsWith(" ") && expression !== "") {
                expression += ` ${button.innerText} `;
                updateDisplay(displayExpression,expression);
                return;
            }
            
            if (!operators.test(button.innerText)) {
                //prevents user from inputting numbers with more than one "."
                if (button.innerText === "." && expression.slice(expression.lastIndexOf(" ")).includes(".")) {
                    return;
                }
                expression += button.innerText;
                updateDisplay(displayExpression,expression);
                
                //performs the expression and refreshes the result if possible
                if (operators.test(expression)) {
                    if (expression.endsWith(".") && expression[expression.length - 2] === " ") {
                        updateDisplay(displayExpression,expression);
                        return;
                    }
                    updateDisplay(displayResult,operate(expression));
                }
            }
        })
    }
    //keyboard support
    window.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            if (operators.test(expression)) {
                historyElement = expression;
                expression = operate(expression);
                updateDisplay(displayExpression,expression);
                updateDisplay(displayResult,"");
                historyElement += ` = ${expression}`;
                history.push(historyElement);
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
                    updateDisplay(displayResult,"");
                }
                return;
            } 
            
            if (operators.test(expression)) {
                if (expression.endsWith(".") && expression[expression.length - 2] === " ") {
                    if (operators.test(expression.slice(0,expression.length - 4))) {
                        updateDisplay(displayResult,operate(expression.slice(0,expression.length - 4)));
                    } else {
                        updateDisplay(displayResult,"");
                    }
                    return;
                }
                updateDisplay(displayResult,operate(expression));
            }
        } 
        
        if (!expression.endsWith(" ") && /([+-])/.test(e.key) && expression !== "") {
            expression += ` ${e.key} `;
            updateDisplay(displayExpression,expression)
            return;
        }
         
        if (/([0-9.])/.test(e.key)){
            if (e.key === "." && expression.slice(expression.lastIndexOf(" ")).includes(".")) {
                return;
            }
            expression += e.key;  
            updateDisplay(displayExpression,expression)  
            
            //performs the expression and refreshes the result if possible
            if (operators.test(expression)) {
                if (expression.endsWith(".") && expression[expression.length - 2] === " ") {
                    updateDisplay(displayExpression,expression);
                    return;
                }
                updateDisplay(displayResult,operate(expression));
            }
        } return;
        
    })
}

main();