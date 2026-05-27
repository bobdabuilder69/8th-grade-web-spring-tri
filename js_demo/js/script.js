alert(
	"Welcome to the Number Guessing Game! Click the button to start playing.",
);
let number = 0;
let counter = 0;
function showMessage() {
	number = Math.floor(Math.random() * 100) + 1;
	counter = 0;
	machineGuess();
}
const machineGuess = () => {
	const userGuess = prompt("Guess a number between 1 and 100:");
	if (userGuess == number) {
		alert("Congratulations! You guessed the correct number!");
		document.getElementById("counter").innerHTML =
			`You guessed the number in ${counter} attempts!`;
	} else if (userGuess === null || userGuess === 0) {
		alert("Goodbye!");
		document.getElementById("counter").innerHTML =
			`You didn't guess the number. The correct number was ${number}.`;
	} else if (userGuess < number) {
		alert("Too low! Try again.");
		counter++;
		machineGuess();
	} else if (userGuess > number) {
		alert("Too high! Try again.");
		counter++;
		machineGuess();
	}
};

function changeBackgroundColor() {
	const colors = ["#FCEBF6", "#E8FBE1", "#ECE3FC", "#FAF8DF", "#BDB2FF", "url('./images/pastel.jpg')"];
	const randomColor = colors[Math.floor(Math.random() * colors.length)];
	if (randomColor.startsWith("url")) {
		document.body.style.backgroundImage = randomColor;
		document.body.style.backgroundColor = "";
	} else {
		document.body.style.backgroundColor = randomColor;
        document.body.style.backgroundImage = "";
        document.body.style.backgroundSize = "cover";
	}
}
