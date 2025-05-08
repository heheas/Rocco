//Rendering Variables
var xPos = 0;
var yPos = 0;
var scale = 1;

var canvas;
var ctx;

//Game Variables
var isRunning = false;
var lastTimestamp = 0;
var game;

//Image Variables
var gameboardIMG;
var straightIMG,splitIMG,tridentIMG,uturnIMG,sixwayIMG;
var robot1HomeIMG,robot2HomeIMG,robot3HomeIMG,robot4HomeIMG,robot5HomeIMG,robot6HomeIMG;
var crystalIMG,nebulaCrystalIMG,faunaIMG,nutrientPodsIMG,plasmaNodeIMG,magneticOreIMG;

//Initialize the Game
$(document).ready(function() {
   canvas = document.getElementById('myCanvas');
   ctx = canvas.getContext('2d');
   loadImages();
   initTesting();
   
   // Start the game loop
   start();
      
   $( "#myCanvas" ).on( "mousemove", function( event ) {
      xPos = event.pageX - $('#myCanvas').offset().left;
      yPos = event.pageY - $('#myCanvas').offset().top;
   });
});

//Testing Function
let testingVal = 0.8;
let testingVal2 = 9;
function initTesting() {
   var val = $('#testVal').val(testingVal);
   var val = $('#testVal2').val(testingVal2);
}

function testFunc() {
   var val = $('#testVal').val();
   testingVal = val;
}
function test2Func() {
   var val = $('#testVal2').val();
   testingVal2 = val;
}

// Start the game loop
function start() {
 if (!this.isRunning) {
    game = new Game();
   this.isRunning = true;
   requestAnimationFrame(this.loop);
   console.log('Game loop started');
 }
}

// Stop the game loop
function stop() {
 this.isRunning = false;
 console.log('Game loop stopped');
}

// The main loop
function loop(timestamp) {
 // Calculate delta time (time since last frame) in seconds
 const deltaTime = (timestamp - this.lastTimestamp) / 1000;
 this.lastTimestamp = timestamp;
 
 if (this.isRunning) {
   // Update game state
   this.update(deltaTime);
   
   // Request the next frame
   requestAnimationFrame(this.loop);
 }
}

// Update game state - override this method in your implementation
function update(deltaTime) {
   //clear canvas
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   
 // This would be where you update your game state
 //console.log(`Frame time: ${deltaTime.toFixed(3)} seconds`);

  drawBoard(canvas.width/4, canvas.height/4, 45);
   
  ctx.font = Math.floor(16 * scale) + "px serif";
   ctx.fillStyle = "black";
  ctx.fillText(xPos + ", " + yPos, xPos + 16, yPos);
}


/*
* RENDERING FUNCTIONS
*/
function drawBoard(xPos, yPos, hexRadius) {
   //drawbackground
   this.drawBackground(xPos, yPos, hexRadius);

   var totalSize = (11.5*hexRadius*Math.sqrt(3)*testingVal) + hexRadius;   
   for (let y = 0; y < 22; y++) {
     for (let x = 0; x < 9; x++) {
         let tile = game.getTile(x,y);
         if (tile != undefined && tile.type != TileType.INVALID) {
            if (tile.type === TileType.HOME) {
               ctx.fillStyle = "yellow";
            } else if (tile.type === TileType.RESOURCE) {
               ctx.fillStyle = "purple";
            } else {
               ctx.fillStyle = "black";
            }
            let oddfset = y % 2 == 0 ? 0 : hexRadius;
            ctx.beginPath();
            ctx.arc(xPos, yPos, hexRadius, 0, 2 * Math.PI);
            ctx.stroke();
            drawHexagon(xPos + (oddfset*Math.sqrt(3)/2)*testingVal + (x*hexRadius*Math.sqrt(3)*testingVal) + hexRadius, yPos + (y*hexRadius/2)*testingVal + hexRadius, hexRadius);
         }
     }
   }
}

function drawHexagon(x, y, radius) {
   ctx.beginPath();
   ctx.moveTo(x + radius/2, y);
   ctx.lineTo(x + radius/4, y - (radius/2)*Math.sqrt(3)/2);
   ctx.lineTo(x - radius/4, y - (radius/2)*Math.sqrt(3)/2);
   ctx.lineTo(x - radius/2, y);
   ctx.lineTo(x - radius/4, y + (radius/2)*Math.sqrt(3)/2);
   ctx.lineTo(x + radius/4, y + (radius/2)*Math.sqrt(3)/2);
   ctx.lineTo(x + radius/2, y);
   ctx.closePath();
   ctx.fill();
}

function drawBackground(x,y, hexSize) {
   var boardSize = hexSize * 12;
   ctx.drawImage(gameboardIMG, x, y, boardSize, boardSize);
}

function loadImages() {
   gameboardIMG = new Image();
   gameboardIMG.src = "./Art/Gameboard.png";
   straightIMG = new Image();
   straightIMG.src = "./Art/Tiles/Straight.png";
}
