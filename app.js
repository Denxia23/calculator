//display functions


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

    //perform multiplication and division first
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] === "*") {
            let result = multiply(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
            array[i] = result.toString();
            array.splice(i - 1,1);
            array.splice(i,1);
            i -= 2;
           
        } else if (array[i] === "/") {
            let result = divide(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
            array[i] = result.toString();
            array.splice(i - 1,1);
            array.splice(i,1);
            i -= 2;
        } else if (array[i] === "%") {
            let result = percentage(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
            array[i] = result.toString();
            array.splice(i - 1,1);
            array.splice(i,1);
            i -= 2;
        }
    }

    //perform addition and subtraction
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] === "+") {
            let result = add(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
            array[i] = result.toString();
            array.splice(i - 1,1);
            array.splice(i,1);
            i -= 2;
           
        } else if (array[i] === "-") {
            let result = substract(parseFloat(array[i - 1]), parseFloat(array[i + 1]));
            array[i] = result.toString();
            array.splice(i - 1,1);
            array.splice(i,1);
            i -= 2;
        }
    }
}

function main() {
    const displayOperation = document.querySelector(".display .operation");
    const displayResult = document.querySelector(".display .result");

    let operation = "";
    const digits = ["1","2","3","4","5","6","7","8","9","0"];
    const operations = ["+","-","x","/","%"];

    const buttons = document.querySelectorAll(".buttons div");

    for (const button of buttons) {
        button.addEventListener("click", () => {
            operation += digits.includes(button.innerText) ? button.innerText : ` ${button.innerText} `;
            console.log(operation);
        })
    }
}

main();