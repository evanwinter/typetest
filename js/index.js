// Initialize globals.
let totalCharCount = 0,
		totalPenalties = 0,
		totalWordCount = 0;
		percentAccuracy = 0;

// Array of possible texts on which user will be tested.
const sampleTexts = [
	"Glamour cannot exist without personal social envy being a common and widespread emotion. The industrial society which has moved towards democracy and then stopped half way is the ideal society for generating such an emotion. The pursuit of individual happiness has been acknowledged as a universal right. Yet the existing social condition make the individual feel powerless. He lives in the contradiction between what he is and what he would like to be. Either he then becomes fully conscious of the contradiction and its causes, and so joins the political struggle for a full democracy which entails, amongst other things, the overthrow of capitalism; or else he lives, continually subject to an envy which, compounded with his sense of powerlessness, dissolves into recurrent day-dreams.",
	"We believe that we can change the things around us in accordance with our desires. We believe it because otherwise we can see no favourable outcome. We do not think of the outcome which generally comes to pass and is also favourable: we do not succeed in changing things in accordance with our desires, but gradually our desires change. The situation that we hoped to change because it was intolerable becomes unimportant to us. We have failed to surmount the obstacle, as we were absolutely determined to do, but life has taken us round it, led us beyond it, and then if we turn round to gaze into the distance of the past, we can barely see it, so imperceptible has it become.",
	"The most important things are the hardest to say. They are the things you get ashamed of, because words diminish them. Words shrink things that seemed limitless when they were in your head to no more than living size when they're brought out. But it's more than that, isn't it? The most important things lie too close to wherever your secret heart is buried, like landmarks to a treasure your enemies would love to steal away. And you may make revelations that cost you dearly only to have people look at you in a funny way, not understanding what you've said at all, or why you thought it was so important that you almost cried while you were saying it. That's the worst, I think. When the secret stays locked within not for want of a teller but for want of an understanding ear.",
	"If you're going to try, go all the way. Otherwise, don't even start. This could mean losing girlfriends, wives, relatives and maybe even your mind. It could mean not eating for three or four days. It could mean freezing on a park bench. It could mean jail. It could mean derision. It could mean mockery, isolation. Isolation is the gift. All the others are a test of your endurance, of how much you really want to do it. And, you'll do it, despite rejection and the worst odds. And it will be better than anything else you can imagine. If you're going to try, go all the way. There is no other feeling like that. You will be alone with the gods, and the nights will flame with fire. You will ride life straight to perfect laughter. It's the only good fight there is."
];

const timer = document.getElementById('timer'),
			inputField = document.getElementById('input-field'),
			sampleTextEl = document.getElementById('template'),
			results = document.getElementById('results'),
			startButton = document.getElementById('start-button'),
			text = sampleTexts[getRandomInt(0, sampleTexts.length)],
			splitText = text.split(' ');

function getRandomInt(min, max) {
	min = Math.ceil(min),
	max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function enableInput(inputField) {
	inputField.disabled = false;
	inputField.style.backgroundColor = "white";
	inputField.classList.remove('disabled');
	inputField.focus();
}

function displayText(splitText) {
	let sampleText = '<span id="current">' + splitText[0] + '</span> ';
	for (let i = 1; i < 20; i++)
		sampleText += (splitText[i] + ' ');
	sampleTextEl.innerHTML = sampleText;
}

function startTimer() {
	let seconds_left = 60,
			interval = setInterval(() => {
				timer.innerHTML = --seconds_left;
				if (seconds_left <= 30)
					timer.style.color = "orange";
				if (seconds_left <= 10)
					timer.style.color = "red";
				if (seconds_left <= 0) {
					timer.innerHTML = "";
					clearInterval(interval);
					timeUp();
				}
			}, 100);
}

function timeUp() {
	disableInput();
	calculateScores();
	outputScore();

	document.getElementById('start-button').style.display = "none";
	document.getElementById('reset-button').innerHTML = "Try Again";
}

function disableInput() {
	inputField.disabled = true;
	inputField.style.backgroundColor = "#eee";
	inputField.classList.add('disabled');
}

function getUserInput(currentIndex, inputField, splitText) {
	inputField.addEventListener('keydown', function(event) {
		if (event.which === 32) {
			let thisWord = inputField.value.trim();
			if (thisWord !== '') {
				// Update total character and word counts.
				totalCharCount += thisWord.length;
				totalWordCount++;
				// Update the user's total score.
				totalPenalties += getWordPenalty(currentIndex, splitText, thisWord);
				// Highlight the next word to be typed.
				updateSampleText(++currentIndex, splitText);
				inputField.value = '';
			}
		}
	});

}

function createCompundString(words) {
	let compoundString = '';
	for (let i = 0; i < words.length; i++)
		compoundString += (words[i] + ' ');
	return compoundString;
}

function updateSampleText(currentIndex, splitText) {
	// Wrap the current word in a span for highlighting.
	let currentWord = splitText[currentIndex],
			current = '<span id="current">' + currentWord + '</span> ';

	// Create string containing all words preceding the current word.
	let wordsBeforeCurrent = '';
	let before = '';
	if (currentIndex < 5) {
		wordsBeforeCurrent = splitText.slice(0, currentIndex);
	} else {
		wordsBeforeCurrent = splitText.slice(currentIndex-5, currentIndex);
	}
	before = createCompundString(wordsBeforeCurrent);
	// Create string containing all words (the next n words) following the current word.
	let wordsAfterCurrent = '';
	let after = '';
	if (currentIndex < 5) {
		wordsAfterCurrent = splitText.slice(currentIndex+1, 20);
	} else {
		wordsAfterCurrent = splitText.slice(currentIndex+1, currentIndex+15);
	}
	after = createCompundString(wordsAfterCurrent);
	// Display the sample text with the new current word highlighted.
	let sampleText = before + current + after;
	sampleTextEl.innerHTML = sampleText;

}

function getWordPenalty(currentIndex, splitText, thisWord) {
	
	let userWord = thisWord,
			actualWord = splitText[currentIndex];

	if (userWord.length === 0 || actualWord.length === 0) return 0;

	// Calculate the Levenshtein distance between what the user typed and what they should've typed.
	let matrix = [];
	for (let i = 0; i <= actualWord.length; i++) // increment along the first column of each row
		matrix[i] = [i];
	for (let j = 0; j <= userWord.length; j++) // increment each column in the first row
  	matrix[0][j] = j;
	// Fill in the rest of the matrix
	for (i = 1; i <= actualWord.length; i++) {
    for (j = 1; j <= userWord.length; j++) {
    	if (actualWord.charAt(i-1) === userWord.charAt(j-1))
      	matrix[i][j] = matrix[i-1][j-1];
    	else {
      	matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                          Math.min(matrix[i][j-1] + 1, // insertion
			                           matrix[i-1][j] + 1)); // deletion
  		}	
  	}
  }
	let levenshteinDist = matrix[actualWord.length][userWord.length];
	return levenshteinDist;
}

function calculateScores() {
	percentAccuracy = Math.round(((totalCharCount - totalPenalties) / totalCharCount) * 100);
}

function outputScore() {
	results.innerHTML = `
		<ul>
			<li id="speed">Speed: <strong>${totalWordCount} words per minute</strong></li>
			<li id="accuracy">Accuracy: <strong>${percentAccuracy} percent</strong></li>
		</ul>`;
}

/*
*		Main function
*/

document.addEventListener("DOMContentLoaded", function(event) {
	
	let currentIndex = 0;
	
	startButton.focus();
	// When user clicks Start, begin the test.
	startButton.addEventListener('click', function() {
		enableInput(inputField);
		displayText(splitText);
		startTimer();
		// While time remains, collect user input and keep track of score.
		getUserInput(currentIndex, inputField, splitText);
	});
});