

var background
var rocket1
var rocket2
var meteor
var meteorImg
var canvas;
var backgroundImg, rocket1_img, rocket2_img
var database, gameState;
var form, player, playerCount;
var allPlayers
var rocket = [],fuels,obstacles,meteors;
var explosion
var lifeimg,fuelimg
var powercoins,powercoinImage
var track , trackImg


function preload()
{
	backgroundImg = loadImage("./assets/background.jpg")
	rocket1_img = loadImage("./assets/rocket1.png")
	rocket2_img= loadImage("./assets/rocket2.png")
	fuelimg = loadImage("./assets/fuel.png")
	lifeimg =loadImage("./assets/life.png")
	powercoinImage = loadImage("./assets/goldCoin.png")
	meteorImg = loadImage("./assets/meteor_speed1.gif")
	explosion = loadImage("./assets/explosion.jpg")
	trackImg = loadImage("./assets/track.jpg")
	
}

function setup() {
canvas = createCanvas(windowWidth , windowHeight);
database = firebase.database()
game = new Game()
game.getState();
game.start()
  
}


function draw() {
  rectMode(CENTER);
  background(backgroundImg);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
  
}
  



function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
  }
