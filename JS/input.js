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

var viewingPlayerBoard = false;
var playerBoardTabSize = 50;
var playerBoardX = 0, playerBoardY = 50, playerBoardWidth = 825, playerBoardHeight = 500;

//selected item variables
var selectedBoxSize = 150;
var selectedBoardX;
var selectedBoardY;
var currentClickX = 0;
var currentClickY = 0;
var movingTile = false;
var addingTile = false;
var selectDash = 0;
var selectDashSize = 15;
var updateTime = 0;

//pathing variables
var pathColor = "blue";
var pathLineWidth = 1.33;
var pathDash = [5, 7];

var otherX;
var otherY;

//Game Variables
var gameX = 0;
var gameY = 0;
var isRunning = false;
var lastTimestamp = 0;
var game;
var boardHexSize = 45;

//Image Variables
var gameboardIMG, labIMG;
var straightIMG, splitIMG, tridentIMG, uturnIMG, sixwayIMG, cornerIMG, debrisIMG, pitfallIMG;
var c_straightIMG, c_splitIMG, c_tridentIMG, c_uturnIMG, c_sixwayIMG, c_cornerIMG;
var robot1IMG, robot2IMG, robot3IMG, robot4HIMG, robot5IMG, robot6IMG;
var crystalIMG, nebulaCrystalIMG, faunaIMG, nutrientPodsIMG, plasmaNodeIMG, magneticOreIMG;

//Initialize the Game
$(document).ready(function () {
   canvas = document.getElementById('myCanvas');
   ctx = canvas.getContext('2d');
   gameX = canvas.width / 2;
   gameY = canvas.height / 2;

   if (viewingPlayerBoard) {
      playerBoardX = 0;
   } else {
      playerBoardX = -playerBoardWidth;
   }

   loadImages();
   initListeners();

   // Start the game loop
   start();
});

function initListeners() {

   $("#myCanvas").on("mouseup", clickFunc);
   $("#myCanvas").on("touchend", clickFunc);

   $("#myCanvas").on("mousemove", function (event) {
      xPos = event.pageX - $('#myCanvas').offset().left;
      yPos = event.pageY - $('#myCanvas').offset().top;

      if (dragging) {
         gameX = itemOrigX + (xPos - dragXStart);
         gameY = itemOrigY + (yPos - dragYStart);
      }
   });

   this.canvas.addEventListener('wheel', function (event) {
      if (event.deltaY < 0) {
         if (scale < 3.5) {
            scale += 0.1;
         }
      } else if (event.deltaY > 0) {
         if (scale > 0.7) {
            scale -= 0.1;
         }
      }
      event.preventDefault();
   });
   $("body").on("keydown", function (event) {
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
   $("body").on("mousedown", function (event) {
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

function getHexSize() { //full hex width
   return boardHexSize * scale;
}

function getSpacing() { //space between tiles
	return getHexSize() * 5 / 45;
}

function getBoardWidth() {
	return (6 * (1.5 * getHexSize() + 2*getSpacing()));
}
function getBoardHeight() {
	return (20 * (getHexSize() / 2 + getSpacing() / 2) * (Math.sqrt(3) / 2));
}
function getHorizontalSpacing() {
   return (1.5 * getHexSize() + 2*getSpacing());
}
function getVerticalSpacing() {
	return ((((getHexSize() + getSpacing()) / 2) * (Math.sqrt(3) / 2)));
}

function clickFunc(event) {
   currentClickX = event.pageX - $('#myCanvas').offset().left;
   currentClickY = event.pageY - $('#myCanvas').offset().top;
   if (!viewingPlayerBoard) {
      if (currentClickX < playerBoardTabSize) {
         if (currentClickY >= playerBoardY && currentClickY <= playerBoardY + playerBoardTabSize) {
            viewingPlayerBoard = true;
            playerBoardX = 0;
            return;
         }
      }

      var selection = worldToBoardCoords(currentClickX, currentClickY);
	  $('#xy').text(selection.x + "," + selection.y);
      if (movingTile) {
         movingTile = !game.moveSelectedTile(selection.x, selection.y);
         if (movingTile) {
            $('#btnMove').val("Cancel");
         } else {
            $('#btnMove').val("Move");
         }
      } else if (addingTile) {
         addingTile = !game.moveSelectedTile(selection.x, selection.y);
      }
      game.selectTile(selection.x, selection.y);
   } else if (viewingPlayerBoard) {
      if (currentClickX >= playerBoardWidth && currentClickX <= playerBoardWidth + playerBoardTabSize) {
         if (currentClickY >= playerBoardY && currentClickY <= playerBoardY + playerBoardTabSize) {
            viewingPlayerBoard = false;
            playerBoardX = -playerBoardWidth;
            return;
         }
      }
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
   //drawBackground
   ctx.beginPath();
   ctx.fillStyle = "rgb(239, 104, 75)";
   ctx.fillRect(0, 0, canvas.width, canvas.height);
   ctx.fill();

   // This would be where you update your game state
   //console.log(`Frame time: ${deltaTime.toFixed(3)} seconds`);

   if (movingTile && (this.lastTimestamp - updateTime > 125)) {
      selectDash = selectDash < selectDashSize ? selectDash + 1 : 0;
      updateTime = this.lastTimestamp;
   }

   drawBoard(gameX, gameY);
   drawSelectedItem();
   drawPlayerBoard();
   drawContextMenu();
}

function calcDistance(x1, y1, x2, y2) {
   return Math.sqrt(Math.abs(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)));
}

function pullNewTile() {
	addingTile = true;
	game.setSelectedItem(game.pullPathTile());
}

function rotateSelectedTile(rotateClockwise = true) {
   game.rotateSelectedTile(rotateClockwise);
}

function flipSelectedTile() {
   game.flipSelectedTile();
}

function moveTile() {
   movingTile = !movingTile;
   if (movingTile) {
      $('#btnMove').val("Cancel");
   } else {
      $('#btnMove').val("Move");
   }
}

function removeSelectedTile() {
   game.removeSelectedTile();
}

function addPlayer() {
   var playerName = $('#txtPlayerName').val();
   var homeLocation = $("#selAssignHome").val();
   var robot = $('#selRobot').val();

   //setup home tile
   if (homeLocation) {
      $("#selAssignHome option[value='" + homeLocation + "']").remove();
   }

   if (robot) {
      $("#selRobot option[value='" + robot + "']").remove();
   }

   game.addNewPlayer(playerName, homeLocation, RobotType[robot]);
}

function worldToBoardCoords(worldX, worldY) {

   var boardClickX = Math.floor((worldX - gameX + getBoardWidth()/2 + getHexSize()/2)/(getHorizontalSpacing()/2));
   var boardClickY = Math.floor((worldY - gameY + getBoardHeight()/2)/getVerticalSpacing());
 
   var isMirror = boardClickX % 2 == 0;
   var isFlipped = boardClickY % 2 == 0;
   var modifier = isMirror ^ isFlipped ? 1 : 0;
   
return { x: Math.floor(boardClickX/2), y: boardClickY + modifier };
}

function boardToWorldCoords(x,y) { //this is the center of the tile
   
   var colEven = x % 2 == 0;
   var rowEven = y % 2 == 0;
   var modifier = rowEven ? 0 : 1;
   
   var worldX = (x*2 + modifier)*getHorizontalSpacing()/2 + gameX - getBoardWidth()/2;
   var worldY = y*getVerticalSpacing()+gameY - getBoardHeight()/2;
   
	return {x: worldX, y: worldY};
}

/* =====================================================================================================
* RENDERING FUNCTIONS
===================================================================================================== */
function drawBoard(worldX, worldY) {


   //draw lab
   var labSize = getHexSize() / 1.5;
   ctx.drawImage(labIMG, worldX - labSize / 2, worldY - labSize / 2, labSize, labSize);

   //draw board
   
   [...InitVals.tileLocations, ...InitVals.homeLocations, ...InitVals.resourceLocations].forEach((tileLocation) => {
		let tile = game.getTile(tileLocation.x, tileLocation.y);
		if (tile != undefined && tile.type != TileType.INVALID) {
			var coords = boardToWorldCoords(tile.x,tile.y);
			drawHexagon(
			   coords.x,
			   coords.y,
			   getHexSize(),
			   tile
			);

			//draw border
			ctx.strokeStyle = "black";
			drawHexagon(coords.x, coords.y, getHexSize(), null);
			ctx.stroke();
			
			// //draw path points
			// tile.getPathPoints().forEach((point) => {
				// var pointCoords = boardToWorldCoords(point.x,point.y);
				// ctx.strokeStyle="red";
				// ctx.beginPath();
				// ctx.moveTo(coords.x, coords.y);
				// ctx.lineTo(pointCoords.x, pointCoords.y);
				// ctx.closePath();
				// ctx.stroke();
			// });

		}
   });
   
   //draw player tokens
   for (let y = 0; y < 22; y++) {
      for (let x = 0; x < 9; x++) {
		  var coords = boardToWorldCoords(x,y);

            //draw player token
            var player = game.getPlayers().find(player => (player.x == x && player.y == y));
			if (player) {
				drawPlayerPath(player);
				drawPlayerToken(coords.x, coords.y, getHexSize(), player);
			}
            //border and highlight if selected
            drawSelectionBorder();
	  }
   }
}

function drawPlayerToken(hexX, hexY, radius, player) {
   if (player) {
	  
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.fillStyle = getRobotColor(player.getRobot());
      ctx.arc(hexX, hexY, radius / 2.8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      switch (player.robot) {
         case RobotType.ROBOT1:
            ctx.save();
            ctx.clip();
            ctx.translate(hexX, hexY);
            //ctx.rotate((-60+(tile.direction*60))*Math.PI/180);
            ctx.drawImage(robot1IMG, -radius / 1.1, -2 * radius / 8, 3 * radius / 2, 3 * radius / 2);
            ctx.restore();
            break;
         case RobotType.ROBOT2:
            ctx.save();
            ctx.clip();
            ctx.translate(hexX, hexY);
            //ctx.rotate((-60+(tile.direction*60))*Math.PI/180);
            ctx.drawImage(robot2IMG, -radius / 1.25, -3.5 * radius / 8, 3 * radius / 2, 3 * radius / 2);
            ctx.restore();
            break;
         case RobotType.ROBOT3:
            ctx.save();
            ctx.clip();
            ctx.translate(hexX, hexY);
            //ctx.rotate((-60+(tile.direction*60))*Math.PI/180);
            ctx.drawImage(robot3IMG, -radius / 1.45, -1.75 * radius / 8, 3 * radius / 2, 3 * radius / 2);
            ctx.restore();
            break;
         case RobotType.ROBOT4:
            ctx.save();
            ctx.clip();
            ctx.translate(hexX, hexY);
            //ctx.rotate((-60+(tile.direction*60))*Math.PI/180);
            ctx.drawImage(robot4IMG, -radius / 1.35, -3.5 * radius / 8, 3 * radius / 2, 3 * radius / 2);
            ctx.restore();
            break;
         case RobotType.ROBOT5:
            ctx.save();
            ctx.clip();
            ctx.translate(hexX, hexY);
            //ctx.rotate((-60+(tile.direction*60))*Math.PI/180);
            ctx.drawImage(robot5IMG, -radius / 1.75, -1.5 * radius / 8, 2.5 * radius / 2, 2.5 * radius / 2);
            ctx.restore();
            break;
         case RobotType.ROBOT6:
            ctx.save();
            ctx.clip();
            ctx.translate(hexX, hexY);
            //ctx.rotate((-60+(tile.direction*60))*Math.PI/180);
            ctx.drawImage(robot6IMG, -radius / 1.45, -2.75 * radius / 8, 2.5 * radius / 2, 2.5 * radius / 2);
            ctx.restore();
            break;
      }
   }
}

function drawPlayerPath(player) {
	if (player && game.selectedItem) {
	   if (player == game.selectedItem && player.isMoving) {
		  var pathConnections = game.getCurrentPathsGraph() ?? [];
		  pathConnections.forEach((connection) => {
			 var conn1 = boardToWorldCoords(connection[0].x, connection[0].y);
			 var conn2 = boardToWorldCoords(connection[1].x, connection[1].y);
			 ctx.save();
			 ctx.beginPath();
			 ctx.strokeStyle = pathColor;
			 ctx.setLineDash(pathDash);
			 ctx.lineWidth = pathLineWidth;
			 ctx.moveTo(conn1.x, conn1.y);
			 ctx.lineTo(conn2.x, conn2.y);
			 ctx.closePath();
			 ctx.stroke();
			 ctx.restore();
		  });
	   }
	}
}

function drawHexagon(x, y, radius, tile) {
   ctx.beginPath();
   ctx.moveTo(x + radius / 2, y);
   ctx.lineTo(x + radius / 4, y - (radius / 2) * Math.sqrt(3) / 2);
   ctx.lineTo(x - radius / 4, y - (radius / 2) * Math.sqrt(3) / 2);
   ctx.lineTo(x - radius / 2, y);
   ctx.lineTo(x - radius / 4, y + (radius / 2) * Math.sqrt(3) / 2);
   ctx.lineTo(x + radius / 4, y + (radius / 2) * Math.sqrt(3) / 2);
   ctx.lineTo(x + radius / 2, y);
   ctx.closePath();

   if (tile) {
      renderHexagon(x, y, radius, tile);
   }
}

function renderHexagon(x, y, radius, tile) {
   ctx.fillStyle = "rgba(0, 0, 0, 0)";
   ctx.lineWidth = 3;
   let hexIMG;
   if (tile.flipped) {
      if (tile.isDebris) {
         hexIMG = debrisIMG;
      } else {
         hexIMG = pitfallIMG;
      }
   } else {
      switch (tile.type) {
         case TileType.HOME:
            ctx.strokeStyle = "black";
            ctx.fillStyle = getRobotColor(tile.homeType);
            ctx.fill();
            ctx.stroke();
            break;
         case TileType.RESOURCE:
            ctx.strokeStyle = "black";
            ctx.fillStyle = "purple";
            ctx.fill();
            ctx.stroke();
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
            ctx.stroke();
            break;
         default:
            hexIMG = null;
            ctx.fillStyle = "black";
            ctx.fill();
            break;
      }
   }

   if (hexIMG) {
      ctx.save();
      ctx.clip();
      ctx.translate(x, y);
      ctx.rotate((-35 + ((tile.direction) * 60)) * Math.PI / 180);
      ctx.drawImage(hexIMG, -radius / 2, -radius / 2, radius, radius);
      ctx.restore();
   } else {

      //draw home tiles
      if (tile.type == TileType.HOME && tile.homeType != RobotType.NOTSET) {
         var robotIMG;
         switch (tile.homeType) {
            case RobotType.ROBOT1:
               robotIMG = robot1IMG;
               break;
            case RobotType.ROBOT2:
               robotIMG = robot2IMG;
               break;
            case RobotType.ROBOT3:
               robotIMG = robot3IMG;
               break;
            case RobotType.ROBOT4:
               robotIMG = robot4IMG;
               break;
            case RobotType.ROBOT5:
               robotIMG = robot5IMG;
               break;
            case RobotType.ROBOT6:
               robotIMG = robot6IMG;
               break;
         }

         if (robotIMG) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((-60 + (tile.direction * 60)) * Math.PI / 180);
            ctx.drawImage(robotIMG, -3 * radius / 8, -3 * radius / 8, 3 * radius / 4, 3 * radius / 4);
            ctx.restore();
         }
      }
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
         if ([TileType.CORNER, TileType.STRAIGHT, TileType.RESOURCE, TileType.SIXWAY, TileType.SPLIT, TileType.UTURN, TileType.TRIDENT].includes(game.selectedItem.type)) {
            drawHexagon(canvas.width - selectedBoxSize / 2, selectedBoxSize / 2, 100, game.selectedItem);
         }
      } else if (game.selectedItem instanceof Player) {
         drawPlayerToken(canvas.width - selectedBoxSize / 2, selectedBoxSize / 2, selectedBoxSize / 1.5, game.selectedItem);
      }
   }
}


function drawSelectionBorder() {
   if (game.selectedItem) {
	  var coords = boardToWorldCoords(game.selectedItem.x, game.selectedItem.y);
	  ctx.beginPath();
      ctx.lineWidth = 3.25;
      ctx.strokeStyle = "green";
	 if (game.selectedItem instanceof Tile && game.selectedItem.x != -1 && game.selectedItem.y != -1) {
		if ([TileType.CORNER, TileType.STRAIGHT, TileType.RESOURCE, TileType.SIXWAY, TileType.SPLIT, TileType.UTURN, TileType.TRIDENT].includes(game.selectedItem.type)) {
		   if (movingTile) {
			  ctx.lineDashOffset = 2 * selectDash;
			  ctx.setLineDash([selectDashSize, selectDashSize]);
			  drawHexagon(coords.x, coords.y, getHexSize(), null);
			  ctx.stroke();

			  ctx.setLineDash([]);
		   } else {
			  drawHexagon(coords.x, coords.y, getHexSize(), null);
			  ctx.stroke();
		   }
		}
	 } else if (game.selectedItem instanceof Player) {
		ctx.arc(coords.x, coords.y, getHexSize() / 2.8, 0, 2 * Math.PI);
		ctx.stroke();
	 }
	 ctx.closePath();
   }
}

function getRobotColor(robot) {
   var color;
   switch (robot) {
      case RobotType.ROBOT1:
         color = RobotColor.ROBOT1;
         break;
      case RobotType.ROBOT2:
         color = RobotColor.ROBOT2;
         break;
      case RobotType.ROBOT3:
         color = RobotColor.ROBOT3;
         break;
      case RobotType.ROBOT4:
         color = RobotColor.ROBOT4;
         break;
      case RobotType.ROBOT5:
         color = RobotColor.ROBOT5;
         break;
      case RobotType.ROBOT6:
         color = RobotColor.ROBOT6;
         break;
      default:
         color = RobotColor.NOTSET;
         break;
   }
   return color;
}

function drawContextMenu() {

}

function drawPlayerBoard() {
   //background
   ctx.beginPath();
   ctx.lineWidth = 5;
   ctx.strokeStyle = "black";
   ctx.fillStyle = "rgb(75,65,77)";
   ctx.moveTo(playerBoardX, playerBoardY);
   ctx.lineTo(playerBoardX + playerBoardWidth + playerBoardTabSize, playerBoardY);
   ctx.lineTo(playerBoardX + playerBoardWidth + playerBoardTabSize, playerBoardY + playerBoardTabSize);
   ctx.lineTo(playerBoardX + playerBoardWidth, playerBoardY + playerBoardTabSize);
   ctx.lineTo(playerBoardX + playerBoardWidth, playerBoardY + playerBoardHeight);
   ctx.lineTo(playerBoardX, playerBoardY + playerBoardHeight);
   ctx.stroke();
   ctx.fill();

   ctx.drawImage(playerBoardIMG, playerBoardX + 10, playerBoardY + 10, playerBoardWidth - 20, playerBoardHeight - 20);

   if (!viewingPlayerBoard) {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "black";
      ctx.moveTo(playerBoardX + playerBoardWidth + playerBoardTabSize / 4, playerBoardY + playerBoardTabSize / 2);
      ctx.lineTo(playerBoardX + playerBoardWidth + 3 * playerBoardTabSize / 4, playerBoardY + playerBoardTabSize / 2);
      ctx.lineTo(playerBoardX + playerBoardWidth + 2.5 * playerBoardTabSize / 4, playerBoardY + playerBoardTabSize / 4);
      ctx.lineTo(playerBoardX + playerBoardWidth + 3 * playerBoardTabSize / 4, playerBoardY + playerBoardTabSize / 2);
      ctx.lineTo(playerBoardX + playerBoardWidth + 2.5 * playerBoardTabSize / 4, playerBoardY + 3 * playerBoardTabSize / 4);
      ctx.stroke();
   } else {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "black";
      ctx.moveTo(playerBoardX + playerBoardWidth + 3 * playerBoardTabSize / 4, playerBoardY + playerBoardTabSize / 2);
      ctx.lineTo(playerBoardX + playerBoardWidth + playerBoardTabSize / 4, playerBoardY + playerBoardTabSize / 2);
      ctx.lineTo(playerBoardX + playerBoardWidth + 1.5 * playerBoardTabSize / 4, playerBoardY + playerBoardTabSize / 4);
      ctx.lineTo(playerBoardX + playerBoardWidth + playerBoardTabSize / 4, playerBoardY + playerBoardTabSize / 2);
      ctx.lineTo(playerBoardX + playerBoardWidth + 1.5 * playerBoardTabSize / 4, playerBoardY + 3 * playerBoardTabSize / 4);
      ctx.stroke();
   }

   if (game.playerCount > 0) {
      //draw character
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgb(90,73,94)";
      ctx.strokeStyle = "black";
      ctx.fillRect(playerBoardX + 37, playerBoardY + 165, 183, 228);
      ctx.fill();

      var robotIMG;
      switch (game.getActivePlayer().robot) {
         case RobotType.ROBOT1:
            robotIMG = robot1IMG;
            break;
         case RobotType.ROBOT2:
            robotIMG = robot2IMG;
            break;
         case RobotType.ROBOT3:
            robotIMG = robot3IMG;
            break;
         case RobotType.ROBOT4:
            robotIMG = robot4IMG;
            break;
         case RobotType.ROBOT5:
            robotIMG = robot5IMG;
            break;
         case RobotType.ROBOT6:
            robotIMG = robot6IMG;
            break;
      }
      if (robotIMG) {
         ctx.drawImage(robot1IMG, playerBoardX + 35, playerBoardY + 170, 180, 225);
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
   robot4IMG = new Image();
   robot4IMG.src = "./Art/Robots/Robot4.png";
   robot5IMG = new Image();
   robot5IMG.src = "./Art/Robots/Robot5.png";
   robot6IMG = new Image();
   robot6IMG.src = "./Art/Robots/Robot6.png";

   playerBoardIMG = new Image();
   playerBoardIMG.src = "./Art/PlayerBoard1.png";
}
