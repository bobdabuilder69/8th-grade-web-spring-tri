let answers = [
	"It is certain.",
	"It is decidedly so.",
	"Without a doubt.",
	"Nope on a rope.",
	"You may rely on it.",
	"You should not count on it.",
	"Use your brain",
	"Most likely.",
	"Outlook good.",
	"Yes.",
	"Signs point to yes.",
	"Reply hazy, try again.",
];

function askQuestion() {
	const questionInput = document.querySelector(".question");
	const question = questionInput.value.trim();

	if (question === "") {
		alert("Please enter a question!");
		return;
	}

	const randomIndex = Math.floor(Math.random() * answers.length);
	const answer = answers[randomIndex];

	const answerBox = document.getElementById("answer");
	answerBox.textContent = answer;

	addToHistory(question, answer);

	questionInput.value = "";
}

function addToHistory(question, answer) {
	const historyDiv = document.getElementById("history");

	const historyItem = document.createElement("div");
	historyItem.className = "historyItem";

	const questionDiv = document.createElement("div");
	questionDiv.className = "historyQuestion";
	questionDiv.textContent = "Q: " + question;

	const answerDiv = document.createElement("div");
	answerDiv.className = "historyAnswer";
	answerDiv.textContent = "A: " + answer;

	historyItem.appendChild(questionDiv);
	historyItem.appendChild(answerDiv);

	historyDiv.insertBefore(historyItem, historyDiv.firstChild);
}

function handleKeyPress(event) {
	if (event.key === "Enter") {
		askQuestion();
	}
}
function addAnswer() {
    const newAnswerInput = document.getElementById("newAnswer");
    const newAnswer = newAnswerInput.value.trim();

    if (newAnswer === "") {
        alert("Please enter a response!");
        return;
    }

    answers.push(newAnswer);
    newAnswerInput.value = "";
    alert("Response added successfully!");
}
