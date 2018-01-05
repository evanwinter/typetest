document.addEventListener("DOMContentLoaded", function(event) {

	const input = document.getElementById('input-field');
	const fullText = 'Glamour cannot exist without personal social envy being a common and widespread emotion. The industrial society which has moved towards democracy and then stopped half way is the ideal society for generating such an emotion. The pursuit of individual happiness has been acknowledged as a universal right. Yet the existing social condition make the individual feel powerless. He lives in the contradiction between what he is and what he would like to be. Either he then becomes fully conscious of the contradiction and its causes, and so joins the political struggle for a full democracy which entails, amongst other things, the overthrow of capitalism; or else he lives, continually subject to an envy which, compounded with his sense of powerlessness, dissolves into recurrent day-dreams.'
	const tokenizedText = fullText.split(' ');
	let start = 0,
			end = 19
			current = 0;

	function startTimer() {
		const timer = document.getElementById('timer');
		let seconds_left = 30;
		let interval = setInterval(() => {
			timer.innerHTML = --seconds_left;
			if (seconds_left <= 10) {
				timer.style.color = "red";
			}
			if (seconds_left <= 0) {
				timer.innerHTML = "Time's up!";
				clearInterval(interval);
				timeUp();
			}
		}, 300);
	}

	function enableInput(input) {
		input.disabled = false;
		input.style.backgroundColor = '#fff';
	}


	function beginTest() {
		console.log('Beginning test.');

		// Show test content.
		updateDemoText();


		// Enable input.
		input.disabled = false;
		input.style.backgroundColor = "white";
		input.classList.remove('disabled');
		input.focus();


		// Start timer.
		startTimer();

		// Until timer displays 0, Collect user input and keep score.
		getUserInput();
	}

	function updateDemoText() {

		// Update the current word.
		let currentWord = '<span id="current">' + tokenizedText[current] + '</span> ';
		
		// Update the words preceding the current word.
		let beforeSlice = tokenizedText.slice(0, current);
		let beforeString = '';
		for (let i = 0; i < beforeSlice.length; i++)
			beforeString += beforeSlice[i] + ' ';
		
		// Update the words following the current word.
		let afterSlice = tokenizedText.slice(current+1, tokenizedText.size);
		let afterString = '';
		for (let i = 0; i < afterSlice.length; i++)
			afterString += afterSlice[i] + ' ';

		// Clear the template and display the new range of words.
		const textToType = document.getElementById('template');
		textToType.innerHTML = beforeString + currentWord + afterString;

		// Increment indexes.
		start++;
		end++;
		current++;
	}

	function getUserInput() {
		input.addEventListener('keydown', function(event) {
			// When space bar is pressed, record input and clear the input field.
			if (event.which === 32) {
				let word = input.value.trim();
				if (word !== '') {
					updateDemoText();
				}
				input.value = '';
			}
		})
	}

	function timeUp() {

		// When timer displays 0, disable input.
		input.disabled = true;
		input.style.backgroundColor = "#eee";
		input.classList.add('disabled');

		// Display output.
		document.getElementById('results').innerHTML = 'Here are your results!';
	}

	// function updateScore() {
	// 	let penalty = getLevDist();

	// }

	// function getLevDist(index) {
	// 	let user
	// }

	const startButton = document.getElementById('start-button');
	startButton.addEventListener('click', function() {
		beginTest()
	});









})