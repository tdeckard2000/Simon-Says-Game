// track user level
var level = 0;

// store user clicks
var userClickedPattern = [];

// store randomly selected colors
var gamePattern = [];

// possible button colors
var buttonColors = ["red", "blue", "green", "yellow"];

// track user high score
var highScore = 0

// start game or continue to next level
function nextSequence() {
  $(".btn").removeClass("game-over"); // removes 'game over' red border from buttons
  addNextColor(); // add a new color to gamePattern array
  updateLevelCount();
  playColorAnimations(gamePattern, 0, gamePattern.length); // play colors stored in gamePattern array, then wait for click
}

// play colors stored in gamePattern array (uses workaround for setTimeout)
function playColorAnimations(gamePattern, i, numColors) {
  setTimeout(function () {
    if (i < numColors) {
      console.log(level);
      $("#" + gamePattern[i]).fadeOut(100).fadeIn(200);
      playSound(gamePattern[i]);
      i++
      playColorAnimations(gamePattern, i, numColors);
    } else {
      $(".btn").removeClass("cantClick"); // after animation completes, allow user to select buttons
    }
  }, 400)
}

// add new color to gamePattern array
function addNextColor(){
  var randomNumber = Math.round((Math.random() * 10) / 3);
  var randomChosenColor = buttonColors[randomNumber]; // stores randomly selected color
  gamePattern.push(randomChosenColor); // append randomly selected color to gamePattern
}

// update the level number
function updateLevelCount(){
  $("#level-title span").remove();
  $("<span>").text(level).appendTo($("#level-title")).hide().fadeIn(500); // animate incrementing levels
}

// detect user button click - initiates game sequence after start
$(".btn").on("click", function (evt) {
  var userChosenColor = (evt.target.id);
  userClickedPattern.push(userChosenColor);
  checkUserClick();
})

// play sound for given color
function playSound(name) {
  var soundBite = new Audio("sounds/" + name + ".mp3");
  soundBite.play()
}

// animate user clicks
function animatePressed(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

// start the game when 'start' is clicked
$("#level-under").on("click", function () {
  if (level <= 0) {
    $("#level-under").addClass("hideMe") // hide the play again button
    level++
    $("#level-title").text("Level ");
    nextSequence();
    
    
  }
});

// check that the user's selection is correct
function checkUserClick() {
  var a = (userClickedPattern.length) - 1;
  var b = (gamePattern.length) - 1;
  if (userClickedPattern[a] === gamePattern[a]) { // check if each user's click is correct
    playSound(userClickedPattern[a]);
    animatePressed(userClickedPattern[a]);
  } else {
    restartGame(userClickedPattern[a]); // if user clicks wrong button, end game
    return;
  }

  if (a === b) { // checks if user completed the sequence.
    userClickedPattern = [];
    level++
    $(".btn").addClass("cantClick"); // prevent user from clicking buttons before next level
    setTimeout(function () {
      nextSequence();
    }, 500); //after delay, go to next level
  } else {
    return;
  }
}

// restart the game
function restartGame(badColor) {
  $(".btn").addClass("cantClick"); // prevents user from clicking buttons during 'game over'
  playSound("wrong"); // plays the 'game over' audio

  if (level > highScore) { // keeps the high score updated
    highScore = level;
  }
  $(".highScore").text("High Score: " + highScore).removeClass("hideMe"); // display the high score
  $("#" + badColor).addClass("game-over"); // highlight the user's error
  $("#level-under").removeClass("hideMe").text("Game Over. Again? "); // display 'game over' text

  //reset game variables
  userClickedPattern = [];
  gamePattern = [];
  level = 0
}
