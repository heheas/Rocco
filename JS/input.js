//Rendering Variables
var xPos = 0;
var yPos = 0;
var scale = 1;

var dragging = false;
var ctrlDown = false;
var mouseDown = false;
var dragXStart = 0;
var dragYStart = 0;
var itemOrigX = 0;
var itemOrigY = 0;

var canvas;
var ctx;

//selected item variables
var selectedBoxSize = 50;

//Game Variables
var gameX = 0;
var gameY = 0;
var isRunning = false;
var lastTimestamp = 0;
var game;

//Image Variables
var gameboardIMG, labIMG;
var straightIMG,splitIMG,tridentIMG,uturnIMG,sixwayIMG;
var robot1HomeIMG,robot2HomeIMG,robot3HomeIMG,robot4HomeIMG,robot5HomeIMG,robot6HomeIMG;
var crystalIMG,nebulaCrystalIMG,faunaIMG,nutrientPodsIMG,plasmaNodeIMG,magneticOreIMG;

//Initialize the Game
$(document).ready(function() {
   canvas = document.getElementById('myCanvas');
   ctx = canvas.getContext('2d');
   loadImages();
   initTesting();
   initListeners();
   
   // Start the game loop
   start();
});

//Testing Function
let testingVal = 1;
let testingVal2 = 0;
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

function initListeners() {

   $( "#myCanvas" ).on( "mousemove", function( event ) {
      xPos = event.pageX - $('#myCanvas').offset().left;
      yPos = event.pageY - $('#myCanvas').offset().top;

      console.log("Ctrl: " + ctrlDown + ", MouseDown: " + mouseDown);
      if (dragging) {
         console.log("dragging");
         gameX = itemOrigX + (xPos - dragXStart);
         gameY = itemOrigY + (yPos - dragYStart);
      }
   });
   
  this.canvas.addEventListener('wheel', function(event){
      if (event.deltaY < 0) {
         scale += 0.1;
      } else if (event.deltaY > 0) {
         scale -= 0.1;
      }
       event.preventDefault();
   });

   $("body").on("keydown", function ( event ) {
      ctrlDown = true;
      if (!dragging && mouseDown) {
         dragXStart = xPos;
         dragYStart = yPos;
         itemOrigX = gameX;
         itemOrigY = gameY;
         dragging = true;
      }
   });
   $("body").on("keyup", function (event) {
      ctrlDown = false;
      dragging = false;
   });
   $("body").on("mousedown", function ( event ) {
      mouseDown = true;
      if (!dragging && ctrlDown) {
         dragXStart = xPos;
         dragYStart = yPos;
         itemOrigX = gameX;
         itemOrigY = gameY;
         dragging = true;
      }
   });
   $("body").on("mouseup", function (event) {
      mouseDown = false;
      dragging = false;
   });
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

  drawBoard(gameX + canvas.width/2,gameY + canvas.height/2, 45*scale);
  drawSelectedItem();
   
  ctx.font = Math.floor(16 * scale) + "px serif";
   ctx.fillStyle = "black";
  ctx.fillText(xPos + ", " + yPos, xPos + 16, yPos);
}


/*
* RENDERING FUNCTIONS
*/
function drawBoard(xPos, yPos, hexRadius) {

   var spacing = hexRadius*0.05/45;
   var totalSizeW = (6*hexRadius*(1.5+spacing));
   var totalSizeH = (20*hexRadius*(1+spacing)/2*Math.sqrt(3)/2);
   
   //drawbackground
   var labSize = hexRadius/1.5;
   ctx.drawImage(labIMG, xPos - labSize/2, yPos - labSize/2, labSize, labSize);
     
   for (let y = 0; y < 22; y++) {
     for (let x = 0; x < 9; x++) {
         let tile = game.getTile(x,y);
         if (tile != undefined && tile.type != TileType.INVALID) {
            let hexIMG;
            if (tile.type === TileType.HOME) {
               ctx.fillStyle = "yellow";
            } else if (tile.type === TileType.RESOURCE) {
               ctx.fillStyle = "purple";
            } else {
               hexIMG = straightIMG;
               ctx.fillStyle = "black";
            }
            let oddfset = y % 2 == 0 ? 0 : hexRadius/2;
            let hexX = xPos + (x*hexRadius*(1.5+spacing)) + oddfset*(1.5+spacing) - totalSizeW/2;
            let hexY = yPos + (y*hexRadius*(1+spacing)/2*Math.sqrt(3)/2) - totalSizeH/2;
            drawHexagon(
               hexX,
               hexY,
               hexRadius
            );
            if (hexIMG) {
               ctx.save();
               ctx.clip();
               ctx.translate(hexX, hexY);
               ctx.rotate(-35*Math.PI/180*tile.direction);
               ctx.drawImage(straightIMG,-hexRadius/2, -hexRadius/2, hexRadius, hexRadius);
               ctx.restore();
            } else {
               ctx.fill();
            }
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
}

function drawSelectedItem() {
   console.log(JSON.stringify(game.selectedItem));
   if (game.selectedItem) {
      if (game.selectedItem instanceof Tile) {
         console.log("IS DEF- Tile");
         ctx.beginPath();
         ctx.fillStyle = "white";
         ctx.strokeStyle = "black";
         ctx.drawRect(canvas.width - selectedBoxSize, 0, selectedBoxSize, selectedBoxSize);
         ctx.fill();
         ctx.stroke();
      } else {
         console.log("Totally Not Tile");
      }
   }
}

function loadImages() {
   gameboardIMG = new Image();
   gameboardIMG.src = "./Art/Gameboard.png";
   straightIMG = new Image();
   straightIMG.src = "./Art/Tiles/Straight.png";
   labIMG = new Image();
   labIMG.src = "./Art/Tiles/cog.png";
}
