// sounds
var win = new Audio('assets/audio/crikey.wav');
var lose = new Audio('assets/audio/no_worries.wav');
var start = new Audio('assets/audio/have_a_go.wav');
var leave = new Audio('assets/audio/see_ya_later.wav');
var guess = new Audio('assets/audio/look_at_that.wav');
// Game object
var Game;

// Flag to verify if character exists in word
var letterExists = 0;

// Creates object
function Gameinfo(wordList, guesses) {
	this.wordList = wordList;
	this.word = "";
	this.characters = 0;
	this.Win = 0;
	this.Lose = 0;
	this.guessedLetters = "";
	this.guessesLeft = guesses;
	this.guessedKey = "";
	this.lettersLeft = 0;
};

// Start game by assigning values and creating divs
function startgame(){

	//create object with list of words and allowed amount of gusses
	Game = new Gameinfo(
		["stingray","crocodile","crikey","beautiful","terri","hunter","snake","shela","australia","venomous","poisonous","bite","sting", "gooday","size", "strike"],
		4
	);

	start.play();

	// Removes div children, created by previousgame, within div containing the gameboard class 
	$(".character").remove();
	
	$(".body").css("visibility", "hidden");
	// Randomly sets the game word from the array
	Game.word = Game.wordList[Math.floor(Math.random() * (Game.wordList.length -1))];
	
	// Holds the number of characters in the selected word 
	Game.characters = Game.word.length;
	
	//counter to track how many of the letters have been guessed
	Game.lettersLeft = Game.characters;

	// display the number of gusses
	$(".remaining").text(Game.guessesLeft);

	//clear the letters that were gussed in previous game
	$(".guessed").text(Game.guessedLetters);

	// Loop through the number of characters in the selected word to create divs within the gameboard class div
	for(i = 0; i < Game.characters; i++){
		
		var newDiv = $("<div>");
		newDiv.addClass("character font");
		$(".gameboard").append(newDiv);
	}
}

//called when round ends
function endGame(endStatement){

	//Display if win or lose and increase win or lose counter;
	if(endStatement == "Win"){
		alert("You Win!!!");
		win.play();
		$(".wins").text(++Game.Win);
	}else if(endStatement == "Lose"){
		lose.play('assets/audio/no_worries.wav');
		alert("Game Over!");
		$(".losses").text(++Game.Lose);
	}
	
	//ask if player wants to play again
	if(confirm("Play again?")){
		startgame();
	}else{
		leave.play();
	}
}

//start the game
startgame();

//resets display of guessed letters and number of guesses left 
$(".guessed").text(Game.guessedLetters);
$(".remaining").text(Game.guessesLeft);

$(document).keyup(function(guessedKey){
	console.log(Game);
	Game.guessedKey = guessedKey.key.toLowerCase();

	// checks if key pressed is a letter
	if(guessedKey.keyCode > 64 && guessedKey.keyCode < 91){

		// loop through word to see if the letter guess is in the word and gets position and adds it to correct position in game or lowers guesses remaining
		for (var i = 0; i < Game.characters; i++) {
			
			// if letter is in the word and was not already guessed display the letter in the correct position in the game
			if(Game.word[i] == Game.guessedKey && Game.guessedLetters.indexOf(Game.guessedKey) == -1){
				
				guess.play();
				$(".character").eq(i).text(Game.word[i]);

				//as each letters is gussed subttract by 1. IF 0 end game with win and end the parent function
				if((--Game.lettersLeft) == 0){
					
					endGame("Win");
					return;
				}
			}

			//if letter guessed matches letter in the word then set variable to 1
			if(Game.word[i] == Game.guessedKey){
				letterExists = 1;
			}
		}

		//if letter was not in word then lettersExists remains 0 and proccesses lose events
		if(letterExists == 0){

			//subtract guesses by 1 and update gusses left display

			$(".body").eq(--Game.guessesLeft).css("visibility", "visible");
			
			//if gusses left = 0 then call endGame function with lose status and end game
			if(Game.guessesLeft == 0){
			
				endGame("Lose");
				return;
		
			}
		}
		
		//reset variable to 0 for next keyup event
		letterExists = 0;

		//if guessed letter does not exist in the list of gussed letters
		if(Game.guessedLetters.indexOf(Game.guessedKey) == -1){
			
			// Add letter to the existing list
			Game.guessedLetters += Game.guessedKey + " ";
			
			//output updated list
			$(".guessed").text(Game.guessedLetters);
		}

	}else{
		//if key press is not a letter display error
		alert("Invalid key pressed");
	}
});