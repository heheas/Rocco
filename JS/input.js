var xPos = 0;
var yPos = 0;
var isRunning = false;
var lastTimestamp = 0;

$(document).ready(function() {
   
   // Start the game loop
  start();
      
   /*$('#myCanvas').addEventListener('mousemove', function() {
      xPos = evt.pageX - $('#element').offset().left;
      yPos = evt.pageY - $('#element').offset().top;
   });*/
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
 // This would be where you update your game state
 console.log(`Frame time: ${deltaTime.toFixed(3)} seconds`);
}
