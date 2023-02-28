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

function operate(operation) {
    let array = operation.split(" ");
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
    const displayOperation = document.querySelector(".display .operation");
    const displayResult = document.querySelector(".display .result");

    let operation = "";
    let history = [];

    const operations = /([+×÷%-])/;
    const buttons = document.querySelectorAll(".buttons div");

    //buttons
    for (const button of buttons) {
        //performs the operation, refreshes the result in display and saves the operation in history
        if (button.dataset.value === "=") {
            button.addEventListener("click", () => {
                if (operations.test(operation)) {
                    historyElement = operation;
                    operation = operate(operation);
                    updateDisplay(displayOperation,operation);
                    updateDisplay(displayResult,"");
                    historyElement += ` = ${operation}`;
                    history.push(historyElement);
                }
            })
            continue;
        }
        
        if (button.dataset.value === "clear") {
            button.addEventListener("click", () => {
                operation = "";
                updateDisplay(displayOperation,operation);
                updateDisplay(displayResult,"");
            })
            continue;
        }
        
        if (button.dataset.value === "delete") {
            button.addEventListener("click", () => {
                operation = operation.endsWith(" ") ? operation.slice(0,operation.length - 3) : operation.slice(0,operation.length - 1);
                updateDisplay(displayOperation,operation);

                //performs the operation and refreshes the result in display if possible
                if (operation.endsWith(" ")) {
                    if (operations.test(operation.slice(0,operation.length - 3))) {
                        updateDisplay(displayResult,operate(operation.slice(0,operation.length - 3)));
                    } else {
                        updateDisplay(displayResult,"");
                    }
                } else if (operations.test(operation)){
                    updateDisplay(displayResult,operate(operation));
                }
            })
            continue;
        }

        button.addEventListener("click", () => {
            if (operations.test(button.innerText) && !operation.endsWith(" ") && operation !== "") {
                operation += ` ${button.innerText} `;
                updateDisplay(displayOperation,operation);
                return;
            }
            
            if (!operations.test(button.innerText)) {
                operation += button.innerText;
                
                //performs the operation and refreshes the result if possible
                if (operations.test(operation)) {
                    updateDisplay(displayResult,operate(operation));
                }
            }
            updateDisplay(displayOperation,operation);
            
        })
    }
    
    window.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            if (operations.test(operation)) {
                historyElement = operation;
                operation = operate(operation);
                updateDisplay(displayOperation,operation);
                updateDisplay(displayResult,"");
                historyElement += ` = ${operation}`;
                history.push(historyElement);
            }
            return;
        } 
        
        if (e.key === "Backspace") {
            operation = operation.endsWith(" ") ? operation.slice(0,operation.length - 3) : operation.slice(0,operation.length - 1);
            updateDisplay(displayOperation,operation);

            //performs the operation and refreshes the result in display if possible
            if (operation.endsWith(" ")) {
                if (operations.test(operation.slice(0,operation.length - 3))) {
                    updateDisplay(displayResult,operate(operation.slice(0,operation.length - 3)));
                } else {
                    updateDisplay(displayResult,"");
                }
            } else if (operations.test(operation)){
                updateDisplay(displayResult,operate(operation));
            }
            return;
        } 
        
        if (!operation.endsWith(" ") && /([+-])/.test(e.key) && operation !== "") {
            operation += ` ${e.key} `;
            updateDisplay(displayOperation,operation)
            return;
        }
         
        if (/([0-9.])/.test(e.key)){
            operation += e.key;    
            //performs the operation and refreshes the result if possible
            if (operations.test(operation)) {
                updateDisplay(displayResult,operate(operation));
            }
            updateDisplay(displayOperation,operation)

        } return;
        
    })
}

main();