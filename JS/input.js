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
var currentClickX = 0;
var currentClickY = 0;

var canvas;
var ctx;

//selected item variables
var selectedBoxSize = 150;
var selectedBoardX;
var selectedBoardY;
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

//blah
var blahX, blahY, blahWidth, blahHeight;
var inX1, inY1, inX2, inY2, mX, mY, clX, clY;

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

      /*
            let hexX = xPos + (x*(1.5*radius+2*spacing)) + oddfset - totalBoardWidth/2;
            let hexY = yPos + (y*(((radius+spacing)/2)*(Math.sqrt(3)/2))) - totalBoardHeight/2;
      */
      
      var clickX = currentClickX - gameX + (totalBoardWidth/2) + boardHexSize/2;
      var clickY = currentClickY - gameY + (totalBoardHeight/2) + boardHexSize/2;

      var horizontalSpacing = (scale*(1.5*radius+2*spacing))/2;
      var verticalSpacing = (scale*(((radius+spacing)/2)*(Math.sqrt(3)/2)));

      var leftX = Math.floor(clickX / horizontalSpacing);
      var topY = Math.floor(clickY / verticalSpacing);

      var posX = clickX % horizontalSpacing;
      var posY = clickY % verticalSpacing;
      var checkLeft = posX < horizontalSpacing/2;

      var checkMiddle;
      if (leftX % 2 == 0) { //even col
         if (topY%2 == 0) { //even row
            //check corners;
            otherX = "corners";
            checkMiddle = true;
         } else { //odd row
            //check middles
            otherX = "middles";
            checkMiddle = true;
         }
      } else { //odd col
         if (topY%2 == 0) { //even row
            //check middles
            otherX = "middles";
            checkMiddle = true;
         } else { //odd row
            //check corners;
            otherX = "corners";
            checkMiddle = false;
         }
      }


      blahX = gameX + (horizontalSpacing * leftX) - totalBoardWidth/2 ;
      blahY = gameY + (verticalSpacing * topY) - totalBoardHeight/2;
      blahWidth = horizontalSpacing;
      blahHeight = verticalSpacing;
      
      //var isLeftTile = checkingLeft ? calcDistance()
      var tileCoords = findTileCoords(posX, posY, leftX, topY, horizontalSpacing, verticalSpacing, checkLeft, checkMiddle);
      selectedBoardX = Math.floor(tileCoords.x/2);
      selectedBoardY = tileCoords.x%2 == 0 && tileCoords.y%2 == 0 ? Math.floor(tileCoords.y/2)*2 : Math.floor(0.5 + (tileCoords.y/2))*2;
      /*if (isLeft && isTop || !isLeft && !isTop) {//check top left and bottom right
            if (calcDistance(0, 0, posX, posY) < calcDistance(posX, posY, horizontalSpacing, verticalSpacing)) { //Closer to the Left
               selectedBoardX = isTop ? leftX + 1 : leftX;
               selectedBoardY = isTop ? topY : topY;
            } else { //closer to the Right
               selectedBoardX = isTop ? leftX+1 : leftX;
               selectedBoardY = topY + 1;
            }
      } else { //check bottom left and top right
         if (calcDistance(0, verticalSpacing, posX, posY) < calcDistance(posX, posY, horizontalSpacing, 0)) { //closer to the left
            selectedBoardX = isTop ? leftX : leftX+1;
            selectedBoardY = isTop ? topY + 1 : topY;
         } else { //closer to the right
            selectedBoardX = isTop ? leftX : leftX - 2;
            selectedBoardY = topY;
         }
      }*/
      
      //game.selectTile(selectedBoardX, selectBoardY);
   }

   function findTileCoords(cX, cY, leftX, topY, w, h, checkLeft, checkMiddle) {
      clX = gameX - totalBoardWidth/2 + cX;
      clY = gameY - totalBoardHeight/2 + cY;
      if (checkLeft) {
         inX1 = gameX - totalBoardWidth/2 + leftX -w;
         inY1 =  gameY - totalBoardHeight/2 + topY-h;
         inX2 =  gameX - totalBoardWidth/2 + leftX;
         inY2 = gameY - totalBoardHeight/2 + topY;
         mX = gameX - totalBoardWidth/2 + cX - w/2;
         mY = gameY - totalBoardHeight/2 + cY;
         var closer2Left = calcDistance(-w, -h, cX - w/2, cY) < calcDistance(cX-w/2, cY, 0, 0);
         return closer2Left ? {x: leftX -w, y: topY -h + (checkMiddle ? 1:0)} : {x: leftX, y: topY};
      } else {
         inX1 =  gameX - totalBoardWidth/2 + leftX + w;
         inY1 = gameY - totalBoardHeight/2 + topY + h;
         inX2 =  gameX - totalBoardWidth/2 + leftX;
         inY2 = gameY - totalBoardHeight/2 + topY;
         mX = gameX - totalBoardWidth/2 + cX - w/2;
         mY = gameY - totalBoardHeight/2 + cY;
         var closer2Left = calcDistance(cX - w/2, cY, w, h) < calcDistance(0, 0, cX-w/2, cY);
         return closer2Left ? {x: leftX + w, y: topY - h + (checkMiddle ? 1:0)} : {x: leftX, y: topY};
      }
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
   
  ctx.beginPath();
  ctx.fillRect(blahX, blahY, blahWidth, blahHeight);
  ctx.fill();

   ctx.beginPath();
   ctx.fillStyle = "red";
   ctx.arc(inX1 -1.5 -1.5, inY1, 3, 0, 2*Math.PI);
   ctx.fill();
   
   ctx.beginPath();
   ctx.fillStyle = "green";
   ctx.arc(inX2 -1.5, inY2 -1.5, 3, 0, 2*Math.PI);
   ctx.fill();
   
   ctx.beginPath();
   ctx.fillStyle = "black";
   ctx.arc(mX -1.5, mY -1.5, 3, 0, 2*Math.PI);
   ctx.fill();

   ctx.beginPath();
   ctx.strokeStyle = "black";
   ctx.moveTo(mX, mY);
   ctx.lineTo(clX, clY);
   ctx.stroke();
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
   
   /* diagonal between hexes
   ctx.beginPath();
   ctx.moveTo(xPos, yPos);
   ctx.lineTo(xPos + (scale*boardHexSize*(1.5+spacing))/2, yPos + (scale*boardHexSize*(1+spacing)*Math.sqrt(3)/4));
   ctx.closePath();
   ctx.stroke();
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
            ctx.fillStyle = "black";
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
   renderHexagon(x, y, radius, tile);
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
      if (tile == game.selectedItem) {
         var prevStyle = ctx.fillStyle;
          ctx.beginPath();
          ctx.fillStyle = "red";
         ctx.fillRect(x, y, radius/4, radius/4);
          ctx.fill();
         ctx.fillStyle = prevStyle;
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
