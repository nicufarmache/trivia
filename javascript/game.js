exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function() {
  var players = [],

      questions = {
        pop: [],
        science: [],
        sports: [],
        rock: []
      },

      currentPlayer = 0;

  for(var i = 0; i < 50; i++){
    questions.pop.push("Pop Question "+i);
    questions.science.push("Science Question "+i);
    questions.sports.push("Sports Question "+i);
    questions.rock.push("Rock Question "+i);
  };

  var didPlayerWin = function(player){
    return (player.purse == 6)
  };

  var currentCategory = function(){
    switch (players[currentPlayer].place) {
      case 0:
      case 4:
      case 8:
        return 'pop';
      case 1:
      case 5:
      case 9:
        return 'science';
      case 2:
      case 6:
      case 10:
        return 'sports';
      default:
        return 'rock';
    }
  };

  this.isPlayable = function(){
    return players.length >= 2;
  };

  this.add = function(playerName){
    players.push({
      name: playerName,
      place: 0,
      purse: 0,
      inPenaltyBox: false,
      isGettingOutOfPenaltyBox: false
    });

    console.log(playerName + " was added");
    console.log("They are player number " + players.length);
  };


  var askQuestion = function(){
    console.log(questions[currentCategory()].shift());
  };

  this.roll = function(roll){
    var player = players[currentPlayer];
    console.log(player.name + " is the current player");
    console.log("They have rolled a " + roll);

    if(player.inPenaltyBox){
      if(roll % 2 != 0){
        player.isGettingOutOfPenaltyBox = true;
        console.log(player.name + " is getting out of the penalty box");
      }else{
        player.isGettingOutOfPenaltyBox = false;
        console.log(player.name + " is not getting out of the penalty box");
        return;
      }
    }

    player.place = (player.place + roll) % 12;
    console.log(player.name + "'s new location is " + player.place);
    console.log("The category is " + currentCategory());
    askQuestion();
  };

  this.wasCorrectlyAnswered = function(){
    var player = players[currentPlayer];

    if (!player.inPenaltyBox || player.isGettingOutOfPenaltyBox){
      player.purse += 1;
      player.inPenaltyBox = false;
      console.log('Answer was correct!!!!');
      console.log(player.name + " now has " + player.purse + " Gold Coins.");
    }

    currentPlayer = (currentPlayer + 1) % players.length;
    return didPlayerWin(player);
  };

  this.wrongAnswer = function(){
    var player = players[currentPlayer];

    console.log('Question was incorrectly answered');
    console.log(player.name + " was sent to the penalty box");
    player.inPenaltyBox = true;

    currentPlayer = (currentPlayer + 1) % players.length;
    return false;
  };
};

var winner = false;

var game = new Game();

game.add('Chet');
game.add('Pat');
game.add('Sue');

do{

  game.roll(Math.floor(Math.random()*6) + 1);

  if(Math.random()*100 < 10){
    winner = game.wrongAnswer();
  }else{
    winner = game.wasCorrectlyAnswered();
  }

}while(!winner);
