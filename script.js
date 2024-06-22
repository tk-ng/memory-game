const gameContainer = document.getElementById("game");
let noClicking = false;
const btnContainer = document.getElementById("buttons");
const startBtn = document.querySelector("button");
const restartBtn = document.querySelector("button#restart");
const guesses = document.querySelector("div#guesses");
const guessNum = document.querySelector("#guesses > span");
const bestScore = document.querySelector("div#bestScore");
const bestScoreNum = document.querySelector("#bestScore > span");
let counter = 0;

const COLORS = [
	"red",
	"blue",
	"green",
	"orange",
	"purple",
	"red",
	"blue",
	"green",
	"orange",
	"purple",
];

if (localStorage.getItem("lowestScore")) {
	bestScoreNum.innerText = localStorage.getItem("lowestScore");
} else {
	bestScore.style.visibility = "hidden";
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement("div");

		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener("click", handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
}

// TODO: Implement this function!
function handleCardClick(event) {
	// you can use event.target to see which element was clicked
	if (noClicking) return;
	let cardsSelected = {};
	if (!event.target.classList.contains("matched")) {
		event.target.classList.toggle("selected");
		cardsSelected = document.querySelectorAll(".selected");
		// console.log("you just clicked", event.target, arr);
		if (cardsSelected.length === 2) {
			noClicking = true;
			counter++;
			guessNum.innerText = counter;
			const cardOne = JSON.stringify(cardsSelected[0].getAttribute("class"));
			const cardTwo = JSON.stringify(cardsSelected[1].getAttribute("class"));
			if (cardOne === cardTwo) {
				console.log("MATCHED");
				for (let i = cardsSelected.length - 1; i >= 0; i--) {
					cardsSelected[i].classList.add("matched");
					cardsSelected[i].classList.remove("selected");
					noClicking = false;
				}
				cardsSelected = {};
			} else if (cardOne !== cardTwo) {
				setTimeout(function () {
					cardsSelected = document.querySelectorAll(".selected");
					cardsSelected[0].classList.remove("selected");
					cardsSelected[1].classList.remove("selected");
					cardsSelected = {};
					noClicking = false;
				}, 1000);
			}
		}
	}
	matchedCards = document.querySelectorAll(".matched").length;
	if (matchedCards === COLORS.length) {
		alert(`game over! Your count is ${counter}`);
		restartBtn.style.visibility = "visible";

		if (localStorage.getItem("lowestScore")) {
			if (counter < localStorage.getItem("lowestScore")) {
				localStorage.setItem("lowestScore", counter);
				bestScoreNum.innerText = localStorage.getItem("lowestScore");
			}
		} else {
			localStorage.setItem("lowestScore", counter);
		}
		counter = 0;
	}
}

// when the DOM loads
startBtn.addEventListener("click", function (event) {
	// event.preventDefault();
	createDivsForColors(shuffledColors);
	startBtn.style.visibility = "hidden";
	guesses.style.visibility = "visible";
	if (localStorage.getItem("lowestScore")) {
		bestScore.style.visibility = "visible";
		bestScoreNum.innerText = localStorage.getItem("lowestScore");
	} else {
		bestScore.style.visibility = "hidden";
	}
});

restartBtn.addEventListener("click", function (event) {
	// event.preventDefault();
	gameContainer.innerHTML = "";
	restartBtn.style.visibility = "hidden";
	startBtn.style.visibility = "visible";
	guesses.style.visibility = "hidden";
	guessNum.innerText = counter;
	if (localStorage.getItem("lowestScore")) {
		bestScoreNum.innerText = localStorage.getItem("lowestScore");
	}
});
