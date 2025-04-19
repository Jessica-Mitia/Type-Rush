const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry", "peach", "melon", "kiwi", "plum", "lime", 
           "lemon", "pear", "berry", "mango", "fig", "date", "fruit", "sweet", "tasty", "juicy"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery", "computer", "laptop", "tablet", 
             "speaker", "headset", "wireless", "memory", "storage", "screen", "display", "camera", 
             "router", "network", "software", "hardware"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception", "sophisticated", 
           "revolutionary", "extraordinary", "philosophical", "collaboration", "fundamental", "perspective", 
           "architecture", "civilization", "phenomenon", "comprehensive", "contemporary", "inspiration", 
           "vulnerability", "determination"]
};

// Performance tracking data
let performanceData = {
    wpmHistory: [],
    accuracyHistory: [],
    timePoints: []
};

let startTime = null;
let currentWordIndex = 0;
let wordsToType = [];
let totalCorrectChars = 0;
let totalTypedChars = 0;
let timerInterval = null;
let timeLeft = 30;
let isTestActive = false;
let isTestComplete = false;
let currentTypedText = "";
let currentDifficulty = "easy";
let updateInterval = null;
let chartInstance = null;

// DOM Elements
const testStatistics = document.getElementById("test-statistics");
const finalWpm = document.getElementById("final-wpm");
const finalAccuracy = document.getElementById("final-accuracy");
const finalChars = document.getElementById("final-chars");
const difficultyButtons = document.querySelectorAll('.difficulty-option');
const wordDisplay = document.getElementById("word-display");
const timerElement = document.getElementById("timer");
const restartButton = document.getElementById("restart-button");
const timeOptions = document.querySelectorAll(".time-option");
const performanceChartContainer = document.getElementById("performance-chart-container");
const typingIndicator = document.querySelector(".typing-indicator");

// Initialize Chart
function initChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Destroy previous chart if exists
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: performanceData.timePoints,
            datasets: [
                {
                    label: 'WPM',
                    data: performanceData.wpmHistory,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.3,
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: 'Accuracy %',
                    data: performanceData.accuracyHistory,
                    borderColor: '#f1c40f',
                    backgroundColor: 'rgba(241, 196, 15, 0.1)',
                    tension: 0.3,
                    borderWidth: 2,
                    fill: true,
                    hidden: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#d1d0c5',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 31, 33, 0.9)',
                    titleColor: '#d1d0c5',
                    bodyColor: '#d1d0c5',
                    borderColor: '#646669',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (label.includes('Accuracy')) {
                                    label += context.parsed.y.toFixed(1) + '%';
                                } else {
                                    label += context.parsed.y.toFixed(1);
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (seconds)',
                        color: '#646669'
                    },
                    ticks: {
                        color: '#646669'
                    },
                    grid: {
                        color: 'rgba(100, 102, 105, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value',
                        color: '#646669'
                    },
                    ticks: {
                        color: '#646669'
                    },
                    grid: {
                        color: 'rgba(100, 102, 105, 0.1)'
                    }
                }
            }
        }
    });
}

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Create spans for each letter of the word
const createLetterSpans = (word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.id = `word-${wordIndex}`;
    wordSpan.className = "word";
    wordSpan.dataset.word = word;

    // Create a span for each letter
    for(let i = 0; i < word.length; i++) {
        const letterSpan = document.createElement("span");
        letterSpan.className = "letter";
        letterSpan.textContent = word[i];
        letterSpan.dataset.correctLetter = word[i];
        wordSpan.appendChild(letterSpan);
    }

    // Add a space after the word
    const spaceSpan = document.createElement("span");
    spaceSpan.className = "letter space";
    spaceSpan.textContent = "";
    wordSpan.appendChild(spaceSpan);

    return wordSpan;
};

// Initialize the typing test
const startTest = (wordCount = 50) => {
    // Reset performance data
    performanceData = {
        wpmHistory: [],
        accuracyHistory: [],
        timePoints: []
    };
    
    // Hide chart container
    performanceChartContainer.style.display = "none";
    
    wordsToType = [];
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    totalCorrectChars = 0;
    totalTypedChars = 0;
    isTestComplete = false;
    currentTypedText = "";

    // Hide retry button
    restartButton.style.display = "none";
    testStatistics.style.display = "none"

    // Reset the timer
    clearInterval(timerInterval);
    clearInterval(updateInterval);
    timerElement.textContent = timeLeft;

    // Generate random words based on the selected difficulty
    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(currentDifficulty));
    }

    // Display words
    wordsToType.forEach((word, index) => {
        const wordSpan = createLetterSpans(word, index);
        wordDisplay.appendChild(wordSpan);
    });

    // Highlight the first word
    const firstWord = document.getElementById("word-0");
    if (firstWord) {
        firstWord.classList.add("current");
    }

    isTestActive = false;
    startTime = null;
    
    // Show typing indicator
    if (typingIndicator) {
        typingIndicator.textContent = "Start typing anywhere to begin!";
        typingIndicator.style.display = "block";
    }
};

// Start countdown
const startTimer = () => {
    if (!isTestActive) { 
        isTestActive = true;
        startTime = Date.now();
        
        // Hide typing indicator
        if (typingIndicator) {
            typingIndicator.style.display = "none";
        }

        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;

            // Store performance data every 3 seconds or at the end
            if (timeLeft % 3 === 0 || timeLeft === 0) {
                storePerformanceData();
            }

            if (timeLeft <= 0) {
                endTest();
            } 
        }, 1000);
    }
};

// Store performance data for chart
const storePerformanceData = () => {
    if (!startTime) return;
    
    const elapsedTime = (Date.now() - startTime) / 1000;
    const minutes = elapsedTime / 60;
    
    // Calculate WPM
    const wpm = totalTypedChars / 5 / minutes;
    
    // Calculate accuracy
    const accuracy = totalTypedChars > 0 ? (totalCorrectChars / totalTypedChars) * 100 : 100;
    
    // Push data to arrays
    performanceData.wpmHistory.push(Math.round(wpm * 10) / 10);
    performanceData.accuracyHistory.push(Math.round(accuracy * 10) / 10);
    performanceData.timePoints.push(Math.round(elapsedTime));
};

// End test
const endTest = () => {
    clearInterval(timerInterval);
    clearInterval(updateInterval);
    isTestComplete = true;

    // Store final performance data
    storePerformanceData();
    updateFinalStats();
    // Show restart button
    restartButton.style.display = "block";
    
    // Display performance chart
    performanceChartContainer.style.display = "block";
    initChart();
    
    // Reset the timer display
    timerElement.textContent = "0";
    
    // Update typing indicator
    if (typingIndicator) {
        typingIndicator.textContent = "Test complete! Check your performance below.";
        typingIndicator.style.display = "block";
    }
};

// Calculate accuracy between expected and typed word
const calculateAccuracy = (expectedWord, typedWord) => {
    let correctChars = 0;
    const minLength = Math.min(expectedWord.length, typedWord.length);

    for(let i = 0; i < minLength; i++) {
        if (expectedWord[i] === typedWord[i]) {
            correctChars++;
        }
    }
    return correctChars;
};

// Highlight characters while typing
const highlightCharacters = () => {
    const currentWord = document.getElementById(`word-${currentWordIndex}`);
    if (!currentWord) return;

    const typedValue = currentTypedText;
    const letters = currentWord.querySelectorAll(".letter:not(.space)");
    const word = wordsToType[currentWordIndex];

    // Reset all letter styles
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
    const typedWord = currentTypedText.trim();
    const currentWord = wordsToType[currentWordIndex];
    const wordElement = document.getElementById(`word-${currentWordIndex}`);

    // Calculate the correct characters
    const correctChars = calculateAccuracy(currentWord, typedWord);
    totalCorrectChars += correctChars;
    totalTypedChars += typedWord.length;

    // Mark word as completed
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
        currentTypedText = "";
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

// Set active difficulty
const setDifficulty = (difficulty) => {
    currentDifficulty = difficulty;
    
    // Update active class for difficulty buttons
    difficultyButtons.forEach(button => {
        if (button.dataset.difficulty === difficulty) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Restart test with new difficulty
    startTest();
};

// Event Listeners
document.addEventListener("keydown", (event) => {
    // If test is complete, ignore keypress except for restart shortcuts
    if (isTestComplete) {
        // Optionally add a shortcut to restart, like pressing 'R'
        if (event.key.toLowerCase() === 'r') {
            restartTest();
        }
        return;
    }

    // Start timer on first keystroke
    if (!isTestActive && event.key.length === 1) {
        startTimer();
    }
    
    // Handle special keys
    if (event.key === "Backspace") {
        currentTypedText = currentTypedText.slice(0, -1);
        highlightCharacters();
        return;
    } 
    
    if (event.key === " ") {
        event.preventDefault(); // Prevent page scroll
        if (currentTypedText.trim() !== "") {
            checkWord();
        }
        return;
    }
    
    // Ignore control keys, tab, etc.
    if (event.key.length !== 1 || event.ctrlKey || event.altKey || event.metaKey) {
        return;
    }
    
    // Add character to current typed text
    currentTypedText += event.key;
    highlightCharacters();
});

// Difficulty button click handlers
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        setDifficulty(button.dataset.difficulty);
    });
});

// Managing the retry button
restartButton.addEventListener("click", restartTest);

// Restart test function
function restartTest() {
    timeLeft = parseInt(document.querySelector(".time-option.active").dataset.time);
    startTest();
}

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

// Update final statistics
const updateFinalStats = () => {
    if (!startTime) return;
    
    const elapsedTime = (Date.now() - startTime) / 1000;
    const minutes = elapsedTime / 60;
    
    // Calculate WPM
    const wpm = totalTypedChars / 5 / minutes;
    
    // Calculate accuracy
    const accuracy = totalTypedChars > 0 ? (totalCorrectChars / totalTypedChars) * 100 : 100;
    
    // Update stats display
    finalWpm.textContent = Math.round(wpm);
    finalAccuracy.textContent = Math.round(accuracy) + '%';
    finalChars.textContent = `${totalCorrectChars}/${totalTypedChars}`;
    
    // Show statistics
    testStatistics.style.display = "flex";
}