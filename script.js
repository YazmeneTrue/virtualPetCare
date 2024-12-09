// //user select species from collection and enter name //
// petImages = {
//     cat
// }

'use strict';

//Pet image objects 
let petIdleImage = {
    cat: 'images/catIdle.jpg',
    dog: 'images/dogIdle.jpg',
    hamster: 'images/hamsterIdle.jpg'
};
let petSleepImage = {
    cat: 'images/catSleeping.jpg',
    dog: 'images/dogSleeping.jpg',
    hamster: 'images/hamsterSleeping.jpg'
};
let petPlayImage = {
    cat: 'images/catPlaying.jpg',
    dog: 'images/dogPlaying.jpg',
    hamster: 'images/hamsterPlaying.jpg'
};
let petEatImage = {
    cat: 'images/catEating.jpg',
    dog: 'images/dogEating.jpg',
    hamster: 'images/hamsterEating.jpg'
};
//
let petType = "";  // This will hold the pet type, e.g., "cat", "dog", "hamster"
let funFacts = []; // Array to hold the fun facts
let currentFactIndex = 0; // Index to track which fact to display

// Handle the response when AJAX request is successful
function handleAjaxResponse(evnt) {
    // Check if the request was successful (status 200)
    if (evnt.target.status !== 200) {
        console.error(evnt.target.statusText);
        console.error(evnt.target.status);
        return;
    }

    // Get the response data
    let loadedData = evnt.target.response;
    let funFactsContainer = document.getElementById('fun-facts');  // This will hold the fun facts
    funFactsContainer.innerHTML = `<h3>Fun Facts about ${petType.charAt(0).toUpperCase() + petType.slice(1)}s</h3>`;  // Display pet type

    // Check if the loaded data has fun facts for the selected pet type
    if (loadedData[petType] && loadedData[petType].funFacts) {
        // Store the fun facts in an array
        funFacts = loadedData[petType].funFacts;

        // Display the first fact
        displayFunFact();
    } else {
        funFactsContainer.innerHTML += `<p>No fun facts available for this pet type.</p>`;  // If no facts available, show a message
    }
}

// Display one fun fact at a time
function displayFunFact() {
    let funFactsContainer = document.getElementById('fun-facts');
    
    // Check if there are fun facts
    if (funFacts.length > 0) {
        funFactsContainer.innerHTML += `<p>${funFacts[currentFactIndex]}</p>`; // Display the current fact
    }

    // If we've reached the end of the list, loop back to the beginning
    currentFactIndex = (currentFactIndex + 1) % funFacts.length;
}
// global vars

let stats = {};
// make random stats
function generateRandomStat(){
    let stats = {
        health: Math.floor(Math.random()* 101),
        happiness: Math.floor(Math.random()* 101),
        energy: Math.floor(Math.random()* 101),
    }
    return stats;
}
function displayStats(stats) {
    document.getElementById('pet-health').textContent = stats.health;
    document.getElementById('pet-happiness').textContent = stats.happiness;
    document.getElementById('pet-energy').textContent = stats.energy;
}
function getLowestStat(stats){
    let lowestStat = 'health';
    let lowestValue = 101;

    for (let stat in stats){
        if (stats[stat] < lowestValue){
            lowestValue = stats[stat];
            lowestStat = stat;
        }
    }
    // Remove any previous highlights from the stat elements
    document.getElementById('pet-health').classList.remove('highlight');
    document.getElementById('pet-happiness').classList.remove('highlight');
    document.getElementById('pet-energy').classList.remove('highlight');

    // Highlight the stat with the lowest value
    document.getElementById(`pet-${lowestStat}`).classList.add('highlight');
    return lowestStat;
}

function showHint(lowestStat) {
    const hints = {
        health: "I am so hungry! Please feed me!",
        happiness: "Let's have some fun. I want to play!",
        energy: "I am very tired. I need rest!",
        default: "I'm feeling great!"
    };

    // Get the appropriate hint message, fall back to 'default' if not found
    let hintMessage = hints[lowestStat] || hints.default;

    // Update the hint element with the message
    document.getElementById('pet-hint').textContent = hintMessage;
    return hintMessage;
}


function resetPetStatus() {
    let petImgElement = document.getElementById('pet-photo').querySelector('img');
    petImgElement.src = petIdleImage[petType];
    stats = generateRandomStat();
    displayStats(stats);
    let lowestStat = getLowestStat(stats);
    showHint(lowestStat);
}
function checkIfStats100() {
    // Check if all stats are at 100
    if (stats.health === 100 && stats.happiness === 100 && stats.energy === 100) {
        showHint('default');
        setTimeout(resetPetStatus, 2000); // Wait 2 seconds before reset
    }
}

//

 // Make buttons 
function handlePlayButton(){
    if (stats.happiness < 100){
        let stepUp = 100 - stats.happiness;// num needed to reach 100
        stats.happiness = Math.min(100,stats.happiness + stepUp);
    }
    // change image to play image
    let petImgElement = document.getElementById('pet-photo').querySelector('img');
    petImgElement.src = petPlayImage[petType];
    displayStats(stats);
    let lowestStat= getLowestStat(stats);
    showHint(lowestStat);
    checkIfStats100();
    
}

function handleEatButton(){
    if(stats.health < 100){
        let stepUp = 100 - stats.health;
        stats.health = Math.min(100, stats.health +stepUp);
    }
    let petImgElement = document.getElementById('pet-photo').querySelector('img');
    petImgElement.src = petEatImage[petType];
    displayStats(stats);
    let lowestStat= getLowestStat(stats);
    showHint(lowestStat);
    checkIfStats100();
}

function handleRestButton(){
    if(stats.energy < 100){
        let stepUp = 100 - stats.energy;
        stats.energy = Math.min(100, stats.energy +stepUp);
    }
    let petImgElement = document.getElementById('pet-photo').querySelector('img');
    petImgElement.src = petSleepImage[petType];
    displayStats(stats);
    let lowestStat= getLowestStat(stats);
    showHint(lowestStat);
    checkIfStats100();
    
}

function addButtonListeners(event){
    document.getElementById('play-button').addEventListener('click',handlePlayButton);
    document.getElementById('rest-button').addEventListener('click',handleRestButton);
    document.getElementById('eat-button').addEventListener('click',handleEatButton);
}
//
function fetchFunFacts() {
    let request = new XMLHttpRequest();
    request.open('GET', 'funFacts.json'); 
    request.responseType = 'json';
    request.send();

    request.addEventListener('load', handleAjaxResponse);  // Handle the response

    request.addEventListener('error', function(evnt) {
        console.error('Request Failed');
        console.error(evnt);
    });
}

// Handle the AJAX response and display fun facts
function handleAjaxResponse(evnt) {
    if (evnt.target.status !== 200) {
        console.error(evnt.target.statusText);
        console.error(evnt.target.status);
        return;
    }

    let loadedData = evnt.target.response;
    let funFactsContainer = document.getElementById('fun-facts');
    funFactsContainer.innerHTML = `<h3>Fun Facts about ${petType.charAt(0).toUpperCase() + petType.slice(1)}s</h3>`;

    if (loadedData[petType] && loadedData[petType].funFacts) {
        let unorderedList = document.createElement('ul');
        loadedData[petType].funFacts.forEach(fact => {
            let listItem = document.createElement('li');
            listItem.textContent = fact;
            unorderedList.appendChild(listItem);
        });
        funFactsContainer.appendChild(unorderedList);
    } else {
        funFactsContainer.innerHTML += `<p>No fun facts available for this pet type.</p>`;
    }
}
//

function handleSubmit(event) {
    event.preventDefault();
    petType = document.querySelector('#pet-type').value;
    let petName = document.querySelector('#pet-name').value;

    if (!petType || !petName) {
        alert("Please choose a pet type and enter a name!");
        return;
    }
    // access to pet photo div 
    document.getElementById('pet-form').style.display = 'none'; // hide form after submission
    // displays the pets name
    let petDiv = document.getElementById('pet-photo');
    let petNameElement = document.createElement('h1');
    let petNameText = document.createTextNode(`${petName}`);
    petNameElement.appendChild(petNameText);
    petDiv.appendChild(petNameElement);
    // create img element with idle pet photo
    let petImgElement = document.createElement('img');
    petImgElement.alt = petType;
    petImgElement.className = 'pet-image';
    petImgElement.src = petIdleImage[petType];
    petDiv.appendChild(petImgElement);
    // Init pet stats and display
    stats = generateRandomStat();
    displayStats(stats);
    getLowestStat(stats);
    let lowestStat = getLowestStat(stats);
    showHint(lowestStat);
    fetchFunFacts();
    addButtonListeners();

}
// main()
document.getElementById('pet-form').addEventListener('submit', handleSubmit);
// window.addEventListener('DOMContentLoaded', main);