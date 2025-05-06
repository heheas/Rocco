var xPos = 0;
var yPos = 0;
var scale = 1;
var isRunning = false;
var lastTimestamp = 0;
var canvas;
var ctx;

$(document).ready(function() {
   canvas = document.getElementById('myCanvas');
   ctx = canvas.getContext('2d');
   // Start the game loop
  start();
      
   $( "#myCanvas" ).on( "mousemove", function( event ) {
      xPos = event.pageX - $('#myCanvas').offset().left;
      yPos = event.pageY - $('#myCanvas').offset().top;
   }).addEventListener('wheel', function(event) {
     if (event.deltaY < 0) {
       // Scrolled up
       scale++;
     } else {
       // Scrolled down or no vertical scroll
       scale = scale > 1 ? scale - 1 : 1;
     }
   });
});

// Start the game loop
function start() {
 if (!this.isRunning) {
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
 console.log(`Frame time: ${deltaTime.toFixed(3)} seconds`);
  ctx.font = Math.floor(10 * scale) + "px serif";
  ctx.fillText(xPos, xPos, yPos);
  ctx.fillText(", " + yPos, xPos + 10, yPos);

   drawHexagon(xPos, yPos, 20 * scale);
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
