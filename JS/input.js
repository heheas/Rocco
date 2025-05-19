//Rendering Variables
var xPos = 0;
var yPos = 0;
var scale = 2;

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
var movingTile = false;
var selectDash = 0;
var selectDashSize = 15;
var updateTime = 0;

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
var straightIMG,splitIMG,tridentIMG,uturnIMG,sixwayIMG,cornerIMG,debrisIMG,pitfallIMG;
var c_straightIMG,c_splitIMG,c_tridentIMG,c_uturnIMG,c_sixwayIMG,c_cornerIMG;
var robot1IMG,robot2IMG,robot3IMG,robot4HIMG,robot5IMG,robot6IMG;
var crystalIMG,nebulaCrystalIMG,faunaIMG,nutrientPodsIMG,plasmaNodeIMG,magneticOreIMG;

//Initialize the Game
$(document).ready(function() {
   canvas = document.getElementById('myCanvas');
   ctx = canvas.getContext('2d');
   gameX = canvas.width/2;
   gameY = canvas.height/2;
   loadImages();
   initListeners();
   
   // Start the game loop
   start();
});

function initListeners() {

   $("#myCanvas").on("mouseup", clickFunc);
   $("#myCanvas").on("touchend", clickFunc);
   
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

function getHexSize() {
   return boardHexSize*scale;
}

function clickFunc(event) {
      currentClickX = event.pageX - $('#myCanvas').offset().left;
      currentClickY = event.pageY - $('#myCanvas').offset().top;

      horizontalSpacing = (scale*(1.5*getHexSize()+2*spacing))/2;
      verticalSpacing = (scale*(((getHexSize()+spacing)/2)*(Math.sqrt(3)/2)));

      var boardClickX = scale * (currentClickX - gameX + (totalBoardWidth/2)) + horizontalSpacing/2; //offset the hex being drawn from the center
      var boardClickY = scale * (currentClickY - gameY + (totalBoardHeight/2));

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
   //drawBackground
   ctx.beginPath();
   ctx.fillStyle = "rgb(239, 104, 75)";
   ctx.fillRect(0,0,canvas.width,canvas.height);
   ctx.fill();
   
 // This would be where you update your game state
 //console.log(`Frame time: ${deltaTime.toFixed(3)} seconds`);

if (movingTile && (this.lastTimestamp - updateTime > 125)) {
   selectDash = selectDash < selectDashSize ? selectDash + 1 : 0;
   updateTime = this.lastTimestamp;
}
   
  drawBoard(gameX,gameY, boardHexSize);
  drawSelectedItem();
}

function calcDistance(x1,y1,x2,y2) {
    return Math.sqrt(Math.abs(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2)));
}

function pullNewTile() {

}

function rotateSelectedTile(rotateClockwise = true) {
   game.rotateSelectedTile(rotateClockwise);
}

function flipSelectedTile() {
   game.flipSelectedTile();
}

function moveTile() {
   movingTile = !movingTile;
}





/* =====================================================================================================
* RENDERING FUNCTIONS
===================================================================================================== */
function drawBoard(xPos, yPos, hexRadius) {

   radius = getHexSize();
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
            

            //border and highlight if selected
            ctx.lineWidth = 3;
            if (tile == game.selectedItem) {
               ctx.strokeStyle = "green";
               if (movingTile) {
                  
                  ctx.lineDashOffset = 0;
                  ctx.setLineDash([selectDash, 2*selectDashSize-selectDash]);
                  drawHexagon(hexX, hexY, radius, null);
                  ctx.stroke();
                  
                  ctx.lineDashOffset = 2*selectDashSize-selectDash;
                  ctx.strokeStyle = "blue";
                  ctx.setLineDash([selectDash, 2*selectDashSize-selectDash]);
                  drawHexagon(hexX, hexY, radius-5, null);
                  ctx.stroke();
                  
                  ctx.setLineDash([]);
               } else {
                  drawHexagon(hexX, hexY, radius, null);
                  ctx.stroke();
               }
            } else {
               ctx.strokeStyle = "black";
               drawHexagon(hexX, hexY, radius, null);
               ctx.stroke();
            }
            
            //ctx.fillStyle = "black";

            //draw hex coords
           /*ctx.font = Math.floor(10 * scale) + "px serif";
            ctx.fillStyle = "white";
           ctx.fillText(x + "," + y, hexX, hexY);*/
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
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      let hexIMG;
      if (tile.flipped) {
         if (tile.isDebris) {
            hexIMG = debrisIMG;
         } else {
            hexIMG = pitfallIMG;
         }
      } else {
         switch(tile.type) {
            case TileType.HOME:
               ctx.fillStyle = "black";
               ctx.fillStyle = "yellow";
               break;
            case TileType.RESOURCE:
               ctx.fillStyle = "black";
               ctx.fillStyle = "purple";
               break;
            case TileType.STRAIGHT:
               hexIMG = tile.isDebris ? straightIMG : c_straightIMG;
               break;
            case TileType.SPLIT:
               hexIMG = tile.isDebris ? splitIMG : c_splitIMG;
               break;
            case TileType.TRIDENT:
               hexIMG = tile.isDebris ? tridentIMG : c_tridentIMG;
               break;
            case TileType.SIXWAY:
               hexIMG = tile.isDebris ? sixwayIMG : c_sixwayIMG;
               break;
            case TileType.UTURN:
               hexIMG = tile.isDebris ? uturnIMG : c_uturnIMG;
               break;
            case TileType.CORNER:
               hexIMG = tile.isDebris ? cornerIMG : c_cornerIMG;
               break;
            case TileType.EMPTY:
               ctx.strokeStyle = "black";
               break;
            default:
               hexIMG = null;
               ctx.fillStyle = "black";
               break;
         }
      }
   
      if (hexIMG) {
         ctx.save();
         ctx.clip();
         ctx.translate(x, y);
         ctx.rotate((-35+(tile.direction*60))*Math.PI/180);
         ctx.drawImage(hexIMG,-radius/2, -radius/2, radius, radius);
         ctx.restore();
      } else {
         ctx.fill();
         ctx.stroke();
      }
}

function drawSelectedItem() {
   if (game.selectedItem) {
      //box outline
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.fillRect(canvas.width - selectedBoxSize, 0, selectedBoxSize, selectedBoxSize);
      ctx.fill();
      
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.strokeRect(canvas.width - selectedBoxSize, 0, selectedBoxSize, selectedBoxSize);
      ctx.stroke();
      
      if (game.selectedItem instanceof Tile) {
         drawHexagon(canvas.width - selectedBoxSize/2, selectedBoxSize/2, 100, game.selectedItem);
      } else {
         
      }
   }
}

function loadImages() {
   //tiles
   gameboardIMG = new Image();
   gameboardIMG.loading = "lazy";
   gameboardIMG.src = "./Art/Gameboard.png";
   straightIMG = new Image();
   straightIMG.src = "./Art/Tiles/Straight.png";
   splitIMG = new Image();
   splitIMG.src = "./Art/Tiles/Split.png";
   tridentIMG = new Image();
   tridentIMG.src = "./Art/Tiles/Trident.png";
   sixwayIMG = new Image();
   sixwayIMG.src = "./Art/Tiles/6Way.png";
   uturnIMG = new Image();
   uturnIMG.src = "./Art/Tiles/UTurn.png";
   cornerIMG = new Image();
   cornerIMG.src = "./Art/Tiles/Corner.png";
   labIMG = new Image();
   labIMG.src = "./Art/Tiles/cog.png";
   //tile with crystal
   c_straightIMG = new Image();
   c_straightIMG.src = "./Art/Tiles/Straight_Crystal.png";
   c_splitIMG = new Image();
   c_splitIMG.src = "./Art/Tiles/Split_Crystal.png";
   c_tridentIMG = new Image();
   c_tridentIMG.src = "./Art/Tiles/Trident_Crystal.png";
   c_sixwayIMG = new Image();
   c_sixwayIMG.src = "./Art/Tiles/6Way_Crystal.png";
   c_uturnIMG = new Image();
   c_uturnIMG.src = "./Art/Tiles/UTurn_Crystal.png";
   c_cornerIMG = new Image();
   c_cornerIMG.src = "./Art/Tiles/Corner_Crystal.png";

   debrisIMG = new Image();
   debrisIMG.src = "./Art/Tiles/Debris.png";
   pitfallIMG = new Image();
   pitfallIMG.src = "./Art/Tiles/Pitfall.png";
   
   //home tiles
   robot1IMG = new Image();
   robot1IMG.src = "./Art/Robots/Robot1.png";
   robot2IMG = new Image();
   robot2IMG.src = "./Art/Robots/Robot2Blue.png";
   robot3IMG = new Image();
   robot3IMG.src = "./Art/Robots/Robot3.png";
   robot4HIMG = new Image();
   robot4HIMG.src = "./Art/Robots/Robot4.png";
   robot5IMG = new Image();
   robot5IMG.src = "./Art/Robots/Robot5.png";
   robot6IMG = new Image();
   robot6IMG.src = "./Art/Robots/Robot6.png";
}
