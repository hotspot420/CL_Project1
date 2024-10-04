let cards = {};
let questions = [];
let scores = {
    communityComfort: { total: 0, count: 0 },
    rigidity: { total: 0, count: 0 },
    controversy: { total: 0, count: 0 },
    relationships: { total: 0, count: 0 },
    emotions: { total: 0, count: 0 },
    interests: { total: 0, count: 0 }
};

let totalQuestions = 51; // Total number of questions
let questionIndex = 2;

// Load cards and questions
Promise.all([
    fetch('cards.json').then(response => response.json()),
    fetch('questions.json').then(response => response.json())
]).then(data => {
    cards = data[0];
    questions = data[1];
    console.log("Cards Loaded:", cards);
    initializeQuiz();
});

// New average ranges for each Vantiro
const vantiroRanges = {
    "Vantiro-1": {
        // Shishiq 5. Industrialists. Highly community-oriented. Moderately flexible structures of belief. Moderately high tendency towards controversial or potentially offensive conversations. High relational value. Not very emotionally secure; more volatile. Less curious about new things. 
        communityComfort: { min: 1.0, max: 2.0 },
        rigidity: { min: 3.0, max: 4.0 },
        controversy: { min: 3.0, max: 4.0 },
        relationships: { min: 4.0, max: 5.0 },
        emotions: { min: 1.0, max: 2.0 },
        interests: { min: 1.0, max: 2.0 }
    },
    "Vantiro-2": {
        // Shishiq 3. Gamblers. Low need for community comfort. Moderately low rigidity of beliefs. High interest in controversy. High emphasis on relationships. Moderately-high emotional stability. Very diverse interests. 
        communityComfort: { min: 3.0, max: 4.0 },
        rigidity: { min: 1.5, max: 2.5 },
        controversy: { min: 4.0, max: 5.0 },
        relationships: { min: 3.5, max: 4.5 },
        emotions: { min: 3.0, max: 4.0 },
        interests: { min: 4.0, max: 5.0 }
    },
    "Vantiro-3": {
        communityComfort: { min: 2.0, max: 3.0 },
        rigidity: { min: 2.5, max: 4.0 },
        controversy: { min: 3.0, max: 4.5 },
        relationships: { min: 2.0, max: 3.0 },
        emotions: { min: 2.5, max: 4.0 },
        interests: { min: 3.0, max: 5.0 }
    },
    "Vantiro-4": {
        // Shishiq 4. Strategists. Moderately preferential to familiar community. Moderate rigidity in beliefs. Low interest in controversy. Moderate relational ties. High emotional security. Moderate breadth of interests. 
        communityComfort: { min: 2.5, max: 3.5 },
        rigidity: { min: 2.5, max: 3.5 },
        controversy: { min: 1.5, max: 2.5 },
        relationships: { min: 2.5, max: 3.5 },
        emotions: { min: 4.0, max: 5.0 },
        interests: { min: 3.0, max: 4.0 }
    },
    "Vantiro-5": {
        // Shishiq 3. Individualists. Not interested in being in the middle of everyone else's shit. Prefer more isolation and closely-knit small groups. Strong desire for familiar community. Moderately high rigidity. Very low controversy. Moderately low relational priority. Low emotional security. Low flexibility of interest. 
        communityComfort: { min: 4.0, max: 5.0 },
        rigidity: { min: 3.5, max: 4.5 },
        controversy: { min: 1.0, max: 2.5 },
        relationships: { min: 3.5, max: 4.5 },
        emotions: { min: 2.0, max: 3.0 },
        interests: { min: 1.0, max: 2.0 }
    },
    "Vantiro-6": {
        // Shishiq 3. Idealists. High desire for familiarity and comfort. Moderate rigidity. Low desire for controversy. Low emphasis on relationships. Low-moderate emotional stability. Very high interest diversity. 
        communityComfort: { min: 1.5, max: 2.5 },
        rigidity: { min: 2.5, max: 4.0 },
        controversy: { min: 1.0, max: 2.0 },
        relationships: { min: 2.0, max: 3.0 },
        emotions: { min: 2.5, max: 3.5 },
        interests: { min: 4.0, max: 5.0 }
    },
    "Vantiro-7": {
        // Shishiq 2. Investigators. Very low need for community comfort. Extremely low rigidity. Low interest in controversy. Highly relationally-oriented and sociable. Moderately high emotional stability. Significant flexibility in interests. 
        communityComfort: { min: 4.0, max: 5.0 },
        rigidity: { min: 1.0, max: 2.0 },
        controversy: { min: 2.0, max: 3.0 },
        relationships: { min: 4.0, max: 5.0 },
        emotions: { min: 3.5, max: 4.5 },
        interests: { min: 4.0, max: 5.0 }
    },
    "Vantiro-8": {
        // Shishiq 3. 
        communityComfort: { min: 2.0, max: 3.0 },
        rigidity: { min: 2.5, max: 4.0 },
        controversy: { min: 3.0, max: 4.5 },
        relationships: { min: 2.0, max: 3.0 },
        emotions: { min: 2.5, max: 4.0 },
        interests: { min: 3.0, max: 5.0 }
    },
    "Vantiro-9": {
        // Shishiq 9. Technologists. Highest need for community comfort; mistrusting of outsiders. High rigidity. High interest in controversy. Lower focus on relationships. Moderate emotional stability. Low-moderate diversity of interests. 
        communityComfort: { min: 1.0, max: 2.0 },
        rigidity: { min: 4.0, max: 5.0 },
        controversy: { min: 4.0, max: 5.0 },
        relationships: { min: 2.0, max: 3.0 },
        emotions: { min: 2.5, max: 4 },
        interests: { min: 2.5, max: 3.5 }
    },
    "Vantiro-10": {
        communityComfort: { min: 2.0, max: 3.0 },
        rigidity: { min: 2.5, max: 4.0 },
        controversy: { min: 3.0, max: 4.5 },
        relationships: { min: 2.0, max: 3.0 },
        emotions: { min: 2.5, max: 4.0 },
        interests: { min: 3.0, max: 5.0 }
    },
    "Vantiro-11": {
        // Shishiq 2. Negotiators. Highly socially-oriented and loosely-organized communities with a strong desire to learn and understand other cultures. Comfortable discussing many topics related to The Zenith's political charge. Generally motivated to participate in and mediate conversation, bridge gaps, and expand horizons, but predominantly from a place of intrigue and not emotion. Minimal emphasis placed on individual relationships, instead strongly prioritizing ecosystem relationships. Low desire for familiar community. Low rigidity. High interest in controversy. Low interest in relationships. High emotional stability. High diversity of interests. 
        communityComfort: { min: 4.0, max: 5.0 },
        rigidity: { min: 1.5, max: 2.5 },
        controversy: { min: 4.0, max: 5.0 },
        relationships: { min: 1.0, max: 2.0 },
        emotions: { min: 3.5, max: 5.0 },
        interests: { min: 3.5, max: 4.5 }
    },
    "Vantiro-12": {
        // Shishiq 5. Imagineers. Cultural priorities include positive adaptation to adversity and coming up with creative solutions. Not inclined towards political involvement ("the bad outpaces the good"). Shy, curious, and gentle. Moderate preference for familiar community. Moderate rigidity in beliefs. Very low tolerance for controversy. Moderate emphasis on relationships. Moderate emotional stability. High interest in trying new things. 
        communityComfort: { min: 3.5, max: 4.5 },
        rigidity: { min: 2.5, max: 3.5 },
        controversy: { min: 1.0, max: 1.5 },
        relationships: { min: 2.5, max: 3.5 },
        emotions: { min: 2.5, max: 3.5 },
        interests: { min: 4.0, max: 5.0 }
    },
};

function initializeQuiz() {
    displayQuestion();
}

function displayQuestion() {
    if (questionIndex >= totalQuestions) {
        displayResult();
        return; // Exit if all questions are answered
    }

    const currentQuestion = questions[questionIndex];
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = ''; // Clear previous question

    const questionText = document.createElement('p');
    questionText.innerText = currentQuestion.question;

    const sliderContainer = document.createElement('div');
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 1;
    slider.max = 5;
    slider.value = 3; // Default value
    slider.style.width = '100%'; // Make slider full width

    const labelsContainer = document.createElement('div');
    labelsContainer.className = 'label-container'; // Add class for styling

    const labels = ["1", "2", "3", "4", "5"];
    labels.forEach(label => {
        const labelElement = document.createElement('span');
        labelElement.innerText = label;
        labelsContainer.appendChild(labelElement);
    });

    labelsContainer.style.display = 'flex';

    sliderContainer.appendChild(slider);
    questionContainer.appendChild(questionText);
    questionContainer.appendChild(sliderContainer);
    questionContainer.appendChild(labelsContainer);

    const nextButton = document.getElementById('next-button');
    nextButton.onclick = () => {
        const selectedValue = parseInt(slider.value);
        updateScores(currentQuestion.category, selectedValue);
        updateProgress();
        questionIndex++;

        if (questionIndex >= totalQuestions) {
            nextButton.innerText = 'Submit';
        }

        displayQuestion(); // Display next question
    };
}

function updateScores(category, value) {
    scores[category].total += value;
    scores[category].count++;
}

function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.value = questionIndex; // Update based on questions answered
    document.getElementById('progress-text').innerText = `${progressBar.value}/${totalQuestions}`;
}

function calculateScores() {
    let averages = {};
    for (const category in scores) {
        if (scores[category].count > 0) {
            averages[category] = scores[category].total / scores[category].count;
        } else {
            averages[category] = 0; // Default to 0 if no answers
        }
    }
    console.log("Averages:", averages); // Log the averages for debugging
    return averages;
}

function evaluateScores(averages) {
    const matchScores = {};

    for (const vantiro in vantiroRanges) {
        let matchScore = 0;

        for (const category in averages) {
            const range = vantiroRanges[vantiro][category];

            if (averages[category] >= range.min && averages[category] <= range.max) {
                matchScore += 1; // Increment match score for each matched category
            }
        }

        if (matchScore > 0) {
            matchScores[vantiro] = matchScore; // Store the match score only if there are matches
        }
    }

    return matchScores;
}

function getBestMatchingVantiro(matchScores) {
    let bestMatch = null;
    let highestScore = -1; // Initialize to -1 to ensure any valid score is higher

    for (const vantiro in matchScores) {
        if (matchScores[vantiro] > highestScore) {
            highestScore = matchScores[vantiro];
            bestMatch = vantiro;
        }
    }

    return bestMatch;
}


function getRandomImage(vantiro) {
    return fetch(`${vantiro}/list.json`) // Load the specific JSON file
        .then(response => response.json()) // Parse the JSON
        .then(images => {
            const randomIndex = Math.floor(Math.random() * images.length); // Get a random index
            const imagePath = `${vantiro}/${images[randomIndex]}`; // Construct the image path
            console.log("Generated Image Path:", imagePath); // Log for debugging
            return imagePath; // Return the image path
        });
}

function displayResult() {
    const averages = calculateScores();
    const matchScores = evaluateScores(averages);
    const selectedVantiro = getBestMatchingVantiro(matchScores);

    console.log("Selected Vantiro:", selectedVantiro);
    console.log("Available Vantiro keys:", Object.keys(cards));


    if (!selectedVantiro) {
        console.error("No valid Vantiro selected.");
        return; // Exit if no valid Vantiro is found
    }

    // First, set the description
    const description = cards[selectedVantiro]?.description;
    const shishiq = cards[selectedVantiro]?.shishiq; // Get the shishiq number
    const cardDescription = document.getElementById('card-description');
    cardDescription.innerText = description;
    console.log("Selected Vantiro Description:", description);


    // Then, get the image and set it
    getRandomImage(selectedVantiro)
        .then(imagePath => {
            const tarotCard = document.getElementById('tarot-card');
            tarotCard.src = imagePath;
            tarotCard.style.display = 'block'; // Show image
            document.getElementById('shishiq-header').innerText = `Shishiq ${shishiq}`;
        })
        .catch(error => {
            console.error("Error fetching image:", error);
        });

    // Load gallery images if needed
    loadGalleryImages(selectedVantiro);
}

function loadGalleryImages(selectedVantiro) {
    fetch(`${selectedVantiro}/list.json`)
        .then(response => response.json())
        .then(images => {
            const randomIndex = Math.floor(Math.random() * images.length);
            const galleryImage = `${selectedVantiro}/${images[randomIndex]}`;
            document.getElementById('gallery-img').src = galleryImage; // Set gallery image
        })
        .catch(error => {
            console.error("Error fetching gallery images:", error);
        });
}