const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
let wordsToType = [];
let totalCorrectChars = 0;
let totalTypedChars = 0;
let timerInterval = null;
let timeLeft = 30;
let isTestActive = false;
let isTestComplete = false;


const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy"); 
const charsElement =  document.getElementById("chars");
const restartButton = document.getElementById("restart-button");
const timeOptions = document.querySelectorAll(".time-option");



// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};



// Create spans for each letter of the word
const createLetterSpans = (word,wordIndex) =>{
    const wordSpan = document.createElement("span");
    wordSpan.id = `word-${wordIndex}`;
    wordSpan.className = "word";
    wordSpan.dataset.word = word;


    // Create a span for each letter
    for(let i = 0; i < word.length; i ++){
        const letterSpan = document.createElement("span");
        letterSpan.className = "letter";
        letterSpan.textContent = word[i];
        letterSpan.dataset.correctLetter = word[i];
        wordSpan.appendChild(letterSpan);
    }


    // Add a space after the word
    const spaceSpan = document.createElement("span");
    spaceSpan.className = "letter space";
    spaceSpan.textContent = " ";
    wordSpan.appendChild(spaceSpan);

    return wordSpan;

} ;

// Initialize the typing test
const startTest = (wordCount = 100) => {
    wordsToType = [];
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    totalCorrectChars = 0;
    totalTypedChars = 0;
    isTestComplete = false;


    // Hide retry button
    restartButton.style.display = "none";

    // Reset metrics
    wpmElement.textContent = "0";
    accuracyElement.textContent = "100%";
    charsElement.textContent = "0/0";

    // Reset the timer
    clearInterval(timerInterval);
    timerElement.textContent = timeLeft;

    // Generate random words
    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    //  Display words
    wordsToType.forEach((word, index) => {
        const wordSpan = createLetterSpans(word, index);
        wordDisplay.appendChild(wordSpan);
    });

    // Highlight the first word
    const firstWord = document.getElementById("word-0");
    if (firstWord) {
        firstWord.classList.add("current");
    }


    // Activate and focus on input field
    inputField.value = "";
    inputField.disabled = false;
    inputField.focus();
    isTestActive = false
    startTime = null;
};

// Start countdown
const startTimer = () => {
    if (!isTestActive){ 
        isTestActive = true;
        startTime = Date.now();

        timerInterval = setInterval(() =>{
            timeLeft--;
            timerElement.textContent = timeLeft;


            updateStats();

            if (timeLeft <= 0){
                endTest();
            } 

        }, 1000);
    }
};


// End test
const endTest = () => {
    clearInterval(timerInterval);
    isTestComplete = true;
    inputField.disabled = true;

    updateStats(true);

    restartButton.style.display = "block";
};


// Calculate and return WPM & accuracy
const calculateAccuracy = (expectedWord, typedWord) => {
    let correctChars = 0;
    const minLength = Math.min(expectedWord.length, typedWord.length);

    for(let i=0; i<minLength;i++){
        if (expectedWord[i] === typedWord[i]) {
            correctChars++;
        }
    }
    return correctChars;
}

  // Highlight characters while typing
  const highlightCharacters = () => {
    const currentWord = document.getElementById(`word-${currentWordIndex}`);
    if (!currentWord) return;

    const typedValue = inputField.value;
    const letters = currentWord.querySelectorAll(".letter:not(.space)");
    const word = wordsToType[currentWordIndex];

    //Reset all letter styles
    letters.forEach(letter => {
        letter.classList.remove("correct", "incorrect");
    });

    // Check each letter typed
    for (let i = 0; i < typedValue.length; i++) {
        if (i < letters.length) {
            if (typedValue[i] === word[i]) {
                letters[i].classList.add("correct");
            } else {
                letters[i].classList.add("incorrect");
            }
        } else {
            // Managing additional characters
            let extraSpan = currentWord.querySelector(`.extra-${i}`);
            if (!extraSpan) {
                extraSpan = document.createElement("span");
                extraSpan.className = `letter extra extra-${i}`;
                extraSpan.textContent = typedValue[i];
                currentWord.appendChild(extraSpan);
            }
        }
    }

    // Delete extra characters that are no longer typed
    const extraLetters = currentWord.querySelectorAll(".letter.extra");
    extraLetters.forEach((el, index) => {
        if (index >= typedValue.length - word.length) {
            el.remove();
        }
    });
};

// Check the word and move on to the next
const checkWord = () => {
    const typedWord = inputField.value.trim();
    const currentWord = wordsToType[currentWordIndex];
    const wordElement = document.getElementById(`word-${currentWordIndex}`);

    // Calculate the correct characters
    const correctChars = calculateAccuracy(currentWord, typedWord);
    totalCorrectChars += correctChars;
    totalTypedChars += typedWord.length;

    // Update statistics
    updateStats();

    //  Mark word as completed
    wordElement.classList.remove("current");
    wordElement.classList.add("completed");

    // Mark whether the word was correct or incorrect
    if (typedWord === currentWord) {
        wordElement.classList.add("correct");
    } else {
        wordElement.classList.add("incorrect");
    }

    // Go to next word
    currentWordIndex++;

    // Skip to next word if test not completed
    if (!isTestComplete) {
        highlightNextWord();
        inputField.value = "";
    }
};

// Highlight the following word
const highlightNextWord = () => {
    const currentWord = document.getElementById(`word-${currentWordIndex}`);
    if (currentWord) {
        currentWord.classList.add("current");

        // Scroll to make sure the current word is visible
        const container = wordDisplay;
        const wordTop = currentWord.offsetTop;
        const containerHeight = container.clientHeight;

        if (wordTop > container.scrollTop + containerHeight * 0.7) {
            container.scrollTop = wordTop - containerHeight * 0.3;
        }
    }
};

// Update statistics
const updateStats = (isFinal = false) => {
    if (!startTime) return;

    const elapsedTime = (Date.now() - startTime) / 1000;  // en secondes
    const minutes = elapsedTime / 60;

    // Calculate WPM (words per minute) where 1 word = 5 characters
    const wpm = totalTypedChars / 5 / minutes;

    // Calculate precision
    const accuracy = totalTypedChars > 0 ? (totalCorrectChars / totalTypedChars) * 100 : 100;

    // Update display
    wpmElement.textContent = Math.round(wpm);
    accuracyElement.textContent = `${accuracy.toFixed(1)}%`;
    charsElement.textContent = `${totalCorrectChars}/${totalTypedChars}`;

    // Final display
    if (isFinal) {
        wpmElement.textContent = Math.round(wpm);
        accuracyElement.textContent = `${accuracy.toFixed(1)}%`;
    }
};

// Event managers
inputField.addEventListener("input", () => {
    startTimer();
    highlightCharacters();
});

inputField.addEventListener("keydown", (event) => {
    // Check space to move to next word
    if (event.key === " ") {
        event.preventDefault();  // Prevent spaces from being added
        if (inputField.value.trim() !== "") {
            checkWord();
        }
    }
});

// Change difficulty mode
modeSelect.addEventListener("change", () => {
    startTest();
});

// Managing the retry button
restartButton.addEventListener("click", () => {
    timeLeft = parseInt(document.querySelector(".time-option.active").dataset.time);
    startTest();
});

// Manage time options
timeOptions.forEach(option => {
    option.addEventListener("click", () => {
        // Update active class
        timeOptions.forEach(opt => opt.classList.remove("active"));
        option.classList.add("active");

        // Update time
        timeLeft = parseInt(option.dataset.time);
        timerElement.textContent = timeLeft;

        // Restart test
        startTest();
    });
});

// Start test on page load
window.addEventListener("load", () => {
    startTest();
});

// Prevent loss of focus on the input field
document.addEventListener("click", () => {
    if (!isTestComplete) {
        inputField.focus();
    }
});