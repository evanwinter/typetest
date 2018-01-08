document.addEventListener("DOMContentLoaded", function(event) {

	async function getRandomInt() {
		let min = 1;
		let max = 9;
		min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}

	function startTimer() {
		const timer = document.getElementById('timer');
		let seconds_left = 60;
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
		}, 1000);
	}

	function beginTest() {

		// Show test content.
		initializeDemoText(0, 19, 0);

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

	function getUserInput() {
		let start = 0,
				end = 19
				current = 0;

		input.addEventListener('keydown', function(event) {
			// When space bar is pressed, record input and clear the input field.
			if (event.which === 32) {
				let word = input.value.trim();
				if (word !== '') {
					updateScore(current, word);
					updateCharCount(word);
					totalWordCount++;
					updateDemoText(++start, ++end, ++current);
				}
				input.value = '';
			}
		});
	}

	function initializeDemoText(start, end, current) {
		let currentWord = '<span id="current">' + tokenizedText[current] + '</span> '
		let after = '';
		let afterSlice = tokenizedText.slice(current+1, current+20);
		for (let i = 0; i < afterSlice.length; i++)
				after += afterSlice[i] + ' ';
		// Clear the template and display the new range of words.
		const textToType = document.getElementById('template');
		textToType.innerHTML = currentWord + after;
	}

	function updateDemoText(start, end, current) {

		// Update the current word.
		let currentWord = '<span id="current">' + tokenizedText[current] + '</span> ';
		let before = '';
		let after = '';

		if (current < 5) {
			// Create a string containing all words preceding current word.
			let beforeSlice = tokenizedText.slice(0, current);
			for (let i = 0; i < beforeSlice.length; i++)
				before += beforeSlice[i] + ' ';
			// Create a string containing the ten words following the current word.
			let afterSlice = tokenizedText.slice(current+1, current+20);
			for (let i = 0; i < afterSlice.length; i++)
				after += afterSlice[i] + ' ';
		} 

		else {
			// Create a string containing the four words preceding the current word.
			let beforeSlice = tokenizedText.slice(current-4, current);
			for (let i = 0; i < beforeSlice.length; i++)
				before += beforeSlice[i] + ' ';
			// Create a string containing the ten words following the current word.
			let afterSlice = tokenizedText.slice(current+1, current+20);
			for (let i = 0; i < afterSlice.length; i++)
				after += afterSlice[i] + ' ';
		}

		// Clear the template and display the new range of words.
		const textToType = document.getElementById('template');
		textToType.innerHTML = before + currentWord + after;

	}

	function timeUp() {
		// When timer displays 0, disable input.
		input.disabled = true;
		input.style.backgroundColor = "#eee";
		input.classList.add('disabled');

		let finalScorePercent = calculateFinalScore();
		let wpm = calculateWPM();

		// Display output.
		document.getElementById('results').innerHTML = `You typed ${wpm} per minute with ${finalScorePercent} percent accuracy`;
	}

	function updateScore(current, word) {
		totalPenalties += getLevDist(current, word);
	}

	function updateCharCount(word) {
		totalCharCount += word.length;
	}

	function getLevDist(current, word) {
		let userWord = word;
		let actualWord = tokenizedText[current];

		if (userWord.length === 0) return actualWord.length; 
		if (actualWord.length === 0) return userWord.length; 

		let matrix = [];

		// increment along the first column of each row
		for (let i = 0; i <= actualWord.length; i++)
			matrix[i] = [i];

		// increment each column in the first row
		for (let j = 0; j <= userWord.length; j++)
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

		let levDist = matrix[actualWord.length][userWord.length];
		return levDist;
	}

	function calculateFinalScore() {
		let finalScore = (totalCharCount-totalPenalties) / totalCharCount;
		let finalScorePercent;
		if (isNaN(finalScore)) {
			finalScorePercent = "ZERO";
		} else {
			finalScorePercent = Math.round(finalScore * 100);
		}

		return finalScorePercent
	}

	function calculateWPM() {
		return totalWordCount;
	}

	async function getText() {
		// await getNYT();
		// await getHN();

		const filename = 'sample_texts.json';
		let res = await fetch(filename);
		let data = await res.json();
		console.log(data);


		testIsReady();
	}

	// async function getHN() {
	// 	let url = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
	// 	let req = new Request(url, {
	// 		method: 'GET'
	// 	});
	// 	let res = await fetch(req);
	// 	let data = await res.json();
	// 	let rand = await getRandomInt();
	// 	let story = data[rand];
		
	// 	url = `https://hacker-news.firebaseio.com/v0/item/${story}.json?print=pretty`
	// 	req = new Request(url, {
	// 		method: 'GET'
	// 	});
	// 	res = await fetch(req);
	// 	data = await res.json();
	// }

	async function getNYT() {
		const url = "https://cors-anywhere.herokuapp.com/https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=f187a46ff70742b38ee1fa75062dc1f2";
		let req = new Request(url, {
			method: 'GET'
		});
		let res = await fetch(req);
		let data = await res.json();
		console.log(data);
		let rand = await getRandomInt();
		let text = data.response.docs[rand-1].snippet + ' ' + data.response.docs[rand].snippet + ' ' + data.response.docs[rand+1].snippet;
		tokenizedText = text.split(' ')
	}

	function testIsReady() {
		document.getElementById('template').innerHTML = 'Press space or enter to begin!';
		const startButton = document.getElementById('start-button');
		startButton.addEventListener('click', function() {
			beginTest()
		});

		startButton.focus();
	}

	// Initialize globals.
	let totalCharCount = 0;
	let totalPenalties = 0;
	let totalWordCount = 0;
	
	// Initialize text on which the user will be tested.
	let tokenizedText;
	getText();
	
	const input = document.getElementById('input-field');

})