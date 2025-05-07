var xPos = 0;
var yPos = 0;
var scale = 1;
var isRunning = false;
var lastTimestamp = 0;
var canvas;
var ctx;
var game;

$(document).ready(function() {
   canvas = document.getElementById('myCanvas');
   ctx = canvas.getContext('2d');
   // Start the game loop
  start();
      
   $( "#myCanvas" ).on( "mousemove", function( event ) {
      xPos = event.pageX - $('#myCanvas').offset().left;
      yPos = event.pageY - $('#myCanvas').offset().top;
   });
});

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
  ctx.font = Math.floor(10 * scale) + "px serif";
  ctx.fillText(xPos, xPos, yPos);
  ctx.fillText(", " + yPos, xPos + 10, yPos);

  drawBoard(canvas.width/2, canvas.height/2, 5);
}

function drawBoard(xPos, yPos, side) {
   for (let y = 0; y < 11; y++) {
     for (let x = 0; x < 13; x++) {
         let tile = game.getTile(x,y);
         if (tile != undefined && tile.type != TileType.INVALID) {
            let oddfset = y % 2 == 0 ? 0 : 5;
            drawHexagon(((oddfset*1.5) + xPos - side/2) + (x*10), ((oddfset*1.5) + yPos - side/2) + (y*10), 10);
         }
     }
   }
}

function drawHexagon(x, y, radius) {
   console.log("Drawing Hexagon @: " + x + "," + y + " w/ Radius: " + radius);
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
