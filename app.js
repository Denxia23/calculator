//display functions
function updateDisplay(display,text) {
    display.innerText = text
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
        if (array[i] === "X") {
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

function main() {
    const displayOperation = document.querySelector(".display .operation");
    const displayResult = document.querySelector(".display .result");

    let operation = "";
    const operations = ["+","-","X","÷","%"];

    const buttons = document.querySelectorAll(".buttons div");

    for (const button of buttons) {
        if (button.dataset.value === "=") {
            button.addEventListener("click", () => {
                operation = operate(operation);
                updateDisplay(displayResult,operation);
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
          })
          continue;
        }

        button.addEventListener("click", () => {
            operation += operations.includes(button.innerText) ?` ${button.innerText} `  :button.innerText;
            updateDisplay(displayOperation,operation);
        })
    }
}

main();