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
var selectedBoxSize = 150;
var selectedBoardX;
var selectedBoardY;
var currentClickX = 0;
var currentClickY = 0;
var horizontalSpacing = 0;
var verticalSpacing = 0;

var otherX;
var otherY;

//Game Variables
var gameX = 0;
var gameY = 0;
var isRunning = false;
var lastTimestamp = 0;
var game;
var boardHexSize = 45;
var spacing = 10;
var totalBoardWidth = 0;
var totalBoardHeight = 0;

//Image Variables
var gameboardIMG, labIMG;
var straightIMG,splitIMG,tridentIMG,uturnIMG,sixwayIMG;
var robot1HomeIMG,robot2HomeIMG,robot3HomeIMG,robot4HomeIMG,robot5HomeIMG,robot6HomeIMG;
var crystalIMG,nebulaCrystalIMG,faunaIMG,nutrientPodsIMG,plasmaNodeIMG,magneticOreIMG;

//Initialize the Game
$(document).ready(function() {
   canvas = document.getElementById('myCanvas');
   ctx = canvas.getContext('2d');
   gameX = canvas.width/2;
   gameY = canvas.height/2;
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

      //console.log("Ctrl: " + ctrlDown + ", MouseDown: " + mouseDown);
      if (dragging) {
         //console.log("dragging");
         gameX = itemOrigX + (xPos - dragXStart);
         gameY = itemOrigY + (yPos - dragYStart);
      }
   });

   $("#myCanvas").on("mouseup", clickFunc);
      $("#myCanvas").on("touchend", clickFunc);
   
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

function clickFunc( event) {
      currentClickX = event.pageX - $('#myCanvas').offset().left;
      currentClickY = event.pageY - $('#myCanvas').offset().top;

      horizontalSpacing = (scale*(1.5*radius+2*spacing))/2;
      verticalSpacing = (scale*(((radius+spacing)/2)*(Math.sqrt(3)/2)));

      var boardClickX = currentClickX - gameX + (totalBoardWidth/2) + horizontalSpacing/2; //offset the hex being drawn from the center
      var boardClickY = currentClickY - gameY + (totalBoardHeight/2);

      var leftX = Math.floor(boardClickX / horizontalSpacing);
      var topY = Math.floor(boardClickY / verticalSpacing);
      var isMirror = leftX % 2 == 0;
      var isFlipped = topY % 2 == 0;
      var modifier = isMirror ^ isFlipped ? 1 : 0;
      game.selectTile(Math.floor(leftX/2),(topY + modifier));
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

  drawBoard(gameX,gameY, boardHexSize);
  drawSelectedItem();
   
  ctx.font = Math.floor(16 * scale) + "px serif";
   ctx.fillStyle = "black";
  ctx.fillText(selectedBoardX + ", " + selectedBoardY, canvas.width/2, 100);
  ctx.fillText(otherX, canvas.width/2, 80);
   
   /*
   //draw ruler
   ctx.strokeStyle = "black";
   ctx.beginPath();
   ctx.moveTo(xPos + 5, yPos - 10);
   ctx.lineTo(xPos + 5, yPos - 10);
   ctx.lineTo(xPos + 55, yPos - 10);
   ctx.closePath();
   ctx.stroke();
   
   ctx.beginPath();
   ctx.moveTo(xPos + 5, yPos - 15);
   ctx.lineTo(xPos + 5, yPos - 5);
   ctx.closePath();
   ctx.stroke();
   
   ctx.beginPath();
   ctx.moveTo(xPos + 15, yPos - 15);
   ctx.lineTo(xPos + 15, yPos - 5);
   ctx.closePath();
   ctx.stroke();
   
   ctx.beginPath();
   ctx.moveTo(xPos + 25, yPos - 15);
   ctx.lineTo(xPos + 25, yPos - 5);
   ctx.closePath();
   ctx.stroke();
   
   ctx.beginPath();
   ctx.moveTo(xPos + 35, yPos - 15);
   ctx.lineTo(xPos + 35, yPos - 5);
   ctx.closePath();
   ctx.stroke();
   
   ctx.beginPath();
   ctx.moveTo(xPos + 45, yPos - 15);
   ctx.lineTo(xPos + 45, yPos - 5);
   ctx.closePath();
   ctx.stroke();
   
   ctx.beginPath();
   ctx.moveTo(xPos + 55, yPos - 15);
   ctx.lineTo(xPos + 55, yPos - 5);
   ctx.closePath();
   ctx.stroke();

   ctx.font = Math.floor(9) + "px serif";
   ctx.fillText("10", xPos + 15, yPos - 18);
   ctx.fillText("20", xPos + 25, yPos - 18);
   ctx.fillText("30", xPos + 35, yPos - 18);
   ctx.fillText("40", xPos + 45, yPos - 18);
   ctx.fillText("50", xPos + 55, yPos - 18);
   */
}

function calcDistance(x1,y1,x2,y2) {
    return Math.sqrt(Math.abs(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2)));
}

/*
* RENDERING FUNCTIONS
*/
function drawBoard(xPos, yPos, hexRadius) {

   radius = scale*hexRadius;
   spacing = scale*hexRadius*5/45;
   
   totalBoardWidth = (6*(1.5*radius+2*spacing));
   totalBoardHeight = (20*(radius/2+spacing/2)*(Math.sqrt(3)/2));
   
   //draw lab
   var labSize = radius/1.5;
   ctx.drawImage(labIMG, xPos - labSize/2, yPos - labSize/2, labSize, labSize);
   
   //draw tiles
   for (let y = 0; y < 22; y++) {
     for (let x = 0; x < 9; x++) {
         let tile = game.getTile(x,y);
         if (tile != undefined && tile.type != TileType.INVALID) {
            let oddfset = y % 2 == 0 ? 0 : 0.75*radius + spacing;
            let hexX = xPos + (x*(1.5*radius+2*spacing)) + oddfset - totalBoardWidth/2;
            let hexY = yPos + (y*(((radius+spacing)/2)*(Math.sqrt(3)/2))) - totalBoardHeight/2;
            drawHexagon(
               hexX,
               hexY,
               radius,
               tile
            );
            
           ctx.font = Math.floor(10 * scale) + "px serif";
            ctx.fillStyle = "white";
           ctx.fillText(x + "," + y, hexX, hexY);

            //highlight if selected
            if (tile == game.selectedItem) {
                ctx.strokeStyle = "green";
                ctx.lineWeight = 6;
               drawHexagon(hexX, hexY, radius, null);
                ctx.stroke();
               
               //ctx.fillStyle = "black";
            }
         }
     }
   }

}

function drawHexagon(x, y, radius, tile) {
   ctx.beginPath();
   ctx.moveTo(x + radius/2, y);
   ctx.lineTo(x + radius/4, y - (radius/2)*Math.sqrt(3)/2);
   ctx.lineTo(x - radius/4, y - (radius/2)*Math.sqrt(3)/2);
   ctx.lineTo(x - radius/2, y);
   ctx.lineTo(x - radius/4, y + (radius/2)*Math.sqrt(3)/2);
   ctx.lineTo(x + radius/4, y + (radius/2)*Math.sqrt(3)/2);
   ctx.lineTo(x + radius/2, y);
   ctx.closePath();
   
   if (tile) {
      renderHexagon(x, y, radius, tile);
   }
}

function renderHexagon(x, y, radius, tile) {
      let hexIMG;
      if (tile.type === TileType.HOME) {
         ctx.fillStyle = "yellow";
      } else if (tile.type === TileType.RESOURCE) {
         ctx.fillStyle = "purple";
      } else {
         hexIMG = straightIMG;
         ctx.fillStyle = "black";
      }
      if (hexIMG) {
         ctx.save();
         ctx.clip();
         ctx.translate(x, y);
         ctx.rotate((-35+(tile.direction*60))*Math.PI/180);
         ctx.drawImage(straightIMG,-radius/2, -radius/2, radius, radius);
         ctx.restore();
      } else {
         ctx.fill();
      }
}

function drawSelectedItem() {
   if (game.selectedItem) {
      //box outline
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.fillRect(canvas.width - selectedBoxSize, 0, selectedBoxSize, selectedBoxSize);
      ctx.strokeStyle = "black";
      ctx.fill();
      ctx.strokeRect(canvas.width - selectedBoxSize, 0, selectedBoxSize, selectedBoxSize);
      ctx.stroke();
      
      if (game.selectedItem instanceof Tile) {
         drawHexagon(canvas.width - selectedBoxSize/2, selectedBoxSize/2, 100, game.selectedItem);
      } else {
         
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
