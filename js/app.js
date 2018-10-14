/*
 * Card Matching Game by Tom Stephenson
 */

// Creating arrays to store the open (turned) card ID's and the matched card ID's
var openCards = [];
var matchedCards = [];

var moves = 0; // Move counter
var movesText = "Moves"; //a variable to display "move" when 1 move is made

// Create the rating system: 
var stars = document.getElementById("stars"); // Storing the lines of code that displays the stars at the top of the page to be removed later. 
var rating = 3; // When a player loses a star, this value is also subtracted from, and is referred to in the modal to show their star rating once the game is completed.

// Creating the timer content at the top of the page
var clock; // The clock variable - will be referred to later to start when the first card is clicked in clickedCard().
var mm = 0; // Minutes
var ss = 0; // Seconds
var leadingZero = "0" // ensures that any time under 10 seconds has a "0" in front of it.


// An array with all 16 card classes:
var allCards = ["anchor", "anchor", "bicycle", "bicycle", "bolt", "bolt", "bomb", "bomb", "cube", "cube", "diamond", "diamond", "leaf", "leaf", "paper-plane-o", "paper-plane-o"];


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// This randomises the cards using the shuffle function, then creates the HTML that ready to be added to the page when a new game begins.
function dealCards() {
    shuffle(allCards);
    var deck = "";
    for (i = 0; i < 16; i++) {
        deck = deck +
            '<li id="' +
            i +
            '" onclick="clickCard(' +
            i +
            ')" class="card"><i id="card' +
            i +
            '" class="fa fa-' +
            allCards[i] +
            '"></i></li>';
    }
    return deck;

}

//This function is run when the page initially loads, the reset button is clicked on the page, or the "Play again" button is clicked on the modal window.
function newGame(i) {

    // Clear any cards from the openCards and matchCards array before a new game begins
    openCards = [];
    matchedCards = [];

    // Create a variable that contains the page div where the cards need to be dealt to be replaced with the newly randomised cards from the dealCards() function.
    var x = document.querySelector('.deck');
    x.innerHTML = dealCards();

    // Reset the moves + rating counter and restore the stars to 3.
    moves = 0;
    document.querySelector('.moves').innerText = "0 Moves";
    var starsHTML = '<ul id="stars" class="stars"><li id = "star"><i class="fa fa-star"></i></li><li id = "star"><i class="fa fa-star"></i></li><li id = "star"><i class="fa fa-star"></i></li></ul>';
    document.getElementById("stars").outerHTML = starsHTML;

    // Reset the timer, making sure to clear the timer before restarting it, otherwise the timer count in multiple increments if the reset button is clicked.
    mm = 0;
    ss = 0;
    document.getElementById('time').innerText = "0:00";
    clearInterval(clock);
    clock = setInterval(timer, 1000)

}

// Creates a function that turns the cards over when clicked
function clickCard(i) {
    if (openCards.length < 2) { // this ensures that no more than 2 cards can be 'open' at once
        document.getElementById(i).classList.add("open", "show"); // adds the css styling that reveals the cards.
        pushCard(i); // adds cards that have been 'opened' into a new array
        checkMatch(i); // check if the cards that are open are a match
    }
}


// A function that pushes the card with the ID of i into an 'open card' array
function pushCard(i) {
    openCards.push(i);
}


// A function that checks if the 2 open cards stored in the array are a match.
function checkMatch(i) {

    if (openCards.length == 2) { // only invokes the code if there are 2 ID's stored in the openCards array.
        addMove(); // Adds a move to the move counter	
        removeStars(); // Runs the removeStars() function which will remove a star after a certain amount of total moves have been made.
        if (openCards[0] === openCards[1]) {
            openCards.pop(); // If the exact same card is clicked twice, one of the values is removed from the openCards array, so that it doesn't count as a move, and the player can click another card that hasn't been turned over.
        } else {
            if (allCards[openCards[0]] == allCards[openCards[1]]) { // This takes the ID of the first card stored in the array, and looks up what value that is from the allCards array (this will be a value like "bomb" or "cube"). If those 2 values match, the ID's are passed to the "match" function.
                match(i);
            } else {
                let x = openCards[0]; // Stores the ID of the first card
                let y = openCards[1]; // Stores the ID of the second card
                setTimeout(noMatch, 600); // Sets a timeout so that the cards aren't turned over instantly when they're not a match, and the player can see them.
                document.getElementById(x).classList.add("shake-horizontal", "no-match"); // Adds a CSS shake animation and a change of BG colour to both cards.
                document.getElementById(y).classList.add("shake-horizontal", "no-match"); // This happens when the cards don't match.

            }
        }
    }
    if (matchedCards.length == 16) {
        gameCompleted(); // If all the cards are matched, run the game completed code.
    }
}

// The function that runs when the 2 selected cards are a match.
function match(i) {
    matchedCards = matchedCards.concat(openCards); // This takes the value of the matchedCards array and adds the values of the openCards to the end (Concatenates). This ensures that any future matches are added to the end of the matchedCards array, and doesn't overwrite what's currently in it.
    let x = openCards[0]; // Stores the ID of the first card
    let y = openCards[1]; // Stores the ID of the second card
    document.getElementById(x).classList.add("match", "pulsate-fwd"); // Adds a CSS pulsate animation and a change of BG colour to both cards.
    document.getElementById(y).classList.add("match", "pulsate-fwd"); // This happens when both cards are a match.
    openCards = []; // Now that the values have been passed to the matchedCards array, the openCards array is cleared ready fo the next move.
}



function noMatch(i) {
    let x = openCards[0]; // Stores the ID of the first card
    let y = openCards[1]; // Stores the ID of the second card
    document.getElementById(x).classList.remove("open", "show", "shake-horizontal", "no-match"); // Removes all of the CSS classes
    document.getElementById(y).classList.remove("open", "show", "shake-horizontal", "no-match"); // for both cards
    openCards = []; // The openCards array is cleared ready fo the next move.
}

// This function removes a star from the scoreboard, and lowers the players rating numebr
function removeStars() {
    if (moves === 11 || moves === 21 || moves === 31) { // A 3-star rating happens if the came is completed in 10 moves or less, meaning the removal of a star happens at move 11. A star is removed after another 10, so this code will trigger at 19 and 29 moves.
        var star = document.getElementById("star"); // Grabs the ID of the block of code that houses the 3 stars in the scoreboard
        star.parentNode.removeChild(star); // Removes one of the child nodes - in this case, this like of code: "<li id = "star"><i class="fa fa-star"></i></li>"
        rating--; // Subtracts one from the rating of 3
    }
}

// This function adds a move every time 2 open cards are in the array.
function addMove() {
    moves++; // Adds an increment of 1 to the move counter
    if (moves === 1) {
        movesText = "Move" // If the player has made one move, change the text next to it to say "Move" instead of "Moves"
    } else movesText = "Moves" // otherwise the text is always "Moves"
    document.querySelector('.moves').innerText = moves + " " + movesText; // Ensures that the text that shows the moves in the scoreboard is updated after every move.
}

// This function runs when the game is completed.
function gameCompleted() {
    clearInterval(clock); // Stops the clock
    let mmS = "s" // mmS is an "s" that displays if there are multiple minutes on the clock.
    let ssS = "s" // ssS is an "s" that displays if there are multiple seconds on the clock.
    if (mm == 1) { mmS = "" }; // If there is 1 minute on the clock, don't display an "s"
    if (ss == 1) { ssS = "" }; // If there is 1 minute on the clock, don't display an "s"

    //The below code displays the modal when the game is complete, and displays the winning time, moves and rating using our variables established earlier.
    window.location.href = '#modalWindow';
    document.getElementById('modalText').innerHTML = "Congratulations! You beat the game in " + moves + " moves, with a time of " + mm + " minute" + mmS + " and " + ss + " second" + ssS + ". You have a " + rating + "-star rating";
}

// This function runs the timer.
function timer() {
    ss++ // Adds 1 second every time the function is run.
    if (ss <= 9) {
        leadingZero = "0"; // If the number of seconrd is equal to 9, this adds a leading zero  - e.g. 0:01
    } else {
        leadingZero = "" // Otherwise, if the number of seconds is above 9, it will remove the leading zero, so it doesn't say "0:010"
    }
    if (ss >= 60) {
        ss = 0; // resets the number of seconds once it hits 60 seconds
        leadingZero = "0"; // Adds the leading zero back
        mm++; // Adds a minute to the timer

    }
    // Updates the inner text of the timer at the top of the page
    document.getElementById('time').innerText = mm + ':' + leadingZero + ss;
}


//Function that resets the board and removes the modal
function playAgain() {
    window.location.href = '#close'; // Removes the modal
    newGame(); // Starts a new game
}