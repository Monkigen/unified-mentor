// Function to append value to the display
function appendValue(value) {
const display = document.getElementById('display');
const currentValue = display.value;

// Check if the last character is an operator
const operators = ['+', '-', '*', '/'];
const lastChar = currentValue.slice(-1);

// If the last character is an operator and the new value is also an operator, do not append
if (operators.includes(lastChar) && operators.includes(value)) {
return; // Prevent appending the operator
}

// Append the value to the display
display.value += value;
}

// Function to evaluate the expression and display result
function calculateResult() {
try {
let expression = document.getElementById('display').value;

// Validate the expression to allow only numbers and operators
if (!/^[0-9+\-*/().\s]*$/.test(expression)) {
    throw new Error("Invalid characters in expression");
}

// Prevent division by zero
if (/\/(?:0+(?:\.0*)?|\b0\b)/.test(expression)) {
    throw new Error("Cannot divide by zero");
}

// Use a safer method to evaluate the expression
let result = Function('"use strict";return (' + expression + ')')();

// Check if result is a finite number
if (!isFinite(result)) throw new Error("Math Error");

document.getElementById('display').value = result;
} catch (error) {
document.getElementById('display').value = 'Error: ' + error.message;
}
}

// Function to clear the display
function clearDisplay() {
document.getElementById('display').value = '';
}
