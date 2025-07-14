//Rendering Variables
var xPos = 0;
var yPos = 0;
var scale = 1;

var ViewState = {PLAYERBOARD: "playerboard", MAP: "map"};
var InputState = {
	NONE: "none",
	ADDING_TILE: "addingTile", 
	MOUSE_DOWN: "mouseDown", 
	CTRL_DOWN: "ctrlDown",
	DRAGGING: "dragging", 
	MOVING_PLAYER: "movingPlayer",
	SELECTING_TILE_TO_MOVE: "selectingTileToMove",
	SELECTING_TILE_TO_ALTER: "selectingTileToAlter",
	MOVING_TILE: "movingTile",
	ALTERING_TILE: "alteringTile",
	ADDING_AND_ALTERING_TILE: "addingAndAlteringTile",
	};
var currentViewState = ViewState.MAP;
var currentInputState = InputState.NONE;
var prevInputState = InputState.NONE;

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

var moveTileStarted = false;
var movingTile = false;

var movingPlayer = false;
var movingPlayerX = 0;
var movingPlayerY = 0;
var playerOrigX = 0;
var playerOrigY = 0;

var alteringTile = false;
var alterOptionScale = 5;
var alterOptions = [
	{
		title: "Rotate Left",
		icon: "LEFT",
		callback: rotateSelectedTileLeft,
		sectionID: 0
	},
	{
		title: "Flip",
		icon: "FLIP",
		callback: flipSelectedTile,
		sectionID: 1
	},
	{
		title: "Rotate Right",
		icon: "RIGHT",
		callback: rotateSelectedTileRight,
		sectionID: 2
	},
	{
		title: "Cancel",
		icon: "X",
		callback: cancelAlterSelectedTile,
		sectionID: 5
	},
	{
		title: "Confirm",
		icon: "CHECK",
		callback: alterSelectedTileConfirm,
		sectionID: 3
	}
];

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

var lockDown = false;

//Image Variables
var gameboardIMG, labIMG;
var straightIMG, splitIMG, tridentIMG, uturnIMG, sixwayIMG, cornerIMG, debrisIMG, pitfallIMG;
var c_straightIMG, c_splitIMG, c_tridentIMG, c_uturnIMG, c_sixwayIMG, c_cornerIMG;
var robot1IMG, robot2IMG, robot3IMG, robot4HIMG, robot5IMG, robot6IMG;
var crystalIMG, nebulaCrystalIMG, faunaIMG, nutrientPodsIMG, plasmaNodeIMG, magneticOreIMG;

//UI Text Variables
var feedbackText = "";

//Initialize the Game
$(document).ready(function () {
   canvas = document.getElementById('myCanvas');
   ctx = canvas.getContext('2d');
   gameX = canvas.width / 2;
   gameY = canvas.height / 2;

   //if (viewingPlayerBoard) {
   if (currentViewState == ViewState.PLAYERBOARD) {
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
   document.addEventListener('keyup', (event) => {
	   if (event.key === 'z') {
		   this.btnPullNewTile();
	   }
   });

   $("#myCanvas").on("mousemove", function (event) {
      xPos = event.pageX - $('#myCanvas').offset().left;
      yPos = event.pageY - $('#myCanvas').offset().top;

      //if (dragging) {
      if (currentInputState == InputState.DRAGGING) {
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
      if (currentInputState == InputState.MOUSE_DOWN) {
         dragXStart = xPos;
         dragYStart = yPos;
         itemOrigX = gameX;
         itemOrigY = gameY;
         dragging = true;
		 currentInputState = InputState.DRAGGING;
      }
   });
   $("body").on("keyup", function (event) {
      ctrlDown = false;
      dragging = false;
	  if (currentInputState == InputState.DRAGGING) {
		  currentInputState = InputState.NONE;
	  }
   });
   $("body").on("mousedown", function (event) {
      mouseDown = true;
      if (currentInputState == InputState.CTRL_DOWN) {
         dragXStart = xPos;
         dragYStart = yPos;
         itemOrigX = gameX;
         itemOrigY = gameY;
         dragging = true;
		 currentInputState = InputState.DRAGGING;
      }
   });
   $("body").on("mouseup", function (event) {
      mouseDown = false;
      dragging = false;
	  if (currentInputState == InputState.DRAGGING) {
		  currentInputState = InputState.NONE;
	  }
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
   if (currentViewState == ViewState.MAP) {
      if (currentClickX < playerBoardTabSize) {
         if (currentClickY >= playerBoardY && currentClickY <= playerBoardY + playerBoardTabSize) {
            //viewingPlayerBoard = true;
			currentViewState = ViewState.PLAYERBOARD;
            playerBoardX = 0;
            return;
         }
      }

		var click = worldToBoardCoords(currentClickX, currentClickY);
		$('#xy').text(click.x + "," + click.y);
		 //movingTile = !game.moveSelectedTile(selection.x, selection.y);
		//if (moveTileStarted) {
		switch (currentInputState) {
			// case InputState.SELECTING_TILE_TO_MOVE:
				// game.selectTile(click.x, click.y);
				// moveTile(click.x, click.y);
				// break;
			case InputState.MOVING_PLAYER:
				movePlayer(click.x, click.y);
				break;
			case InputState.ADDING_TILE:
				if (game.isValidTilePlacement(click.x, click.y)) {
					//addingTile = !game.moveSelectedTile(selection.x, selection.y);
					game.releaseItem(click.x, click.y);
					game.setSelectedItemXY(click.x, click.y);
					//addingTile = false;
					//alteringTile = true;
					currentInputState = InputState.ADDING_AND_ALTERING_TILE;
				}
				break;
			case InputState.SELECTING_TILE_TO_ALTER:
				if (!game.getSelectedItem()) {
					game.setSelectedItemXY(click.x, click.y);
					currentInputState = InputState.ALTERING_TILE;
				}
				//alterSelectedTile();
				break;
			case InputState.ADDING_AND_ALTERING_TILE:
			case InputState.ALTERING_TILE:
				alterSelectedTile();
				break;
			default:
				break;
		}
   } else if (currentViewState == ViewState.PLAYERBOARD) {
   //} else if (viewingPlayerBoard) {
      if (currentClickX >= playerBoardWidth && currentClickX <= playerBoardWidth + playerBoardTabSize) {
         if (currentClickY >= playerBoardY && currentClickY <= playerBoardY + playerBoardTabSize) {
            // viewingPlayerBoard = false;
			 currentViewState = ViewState.MAP;
            playerBoardX = -playerBoardWidth;
            return;
         }
      }
   }
}

//pass variable name in an array
function clearFlags(exceptions = []) {
	var flagsToClear = ["addingTile", "moveTileStarted", "movingTile", "alteringTile", "viewingPlayerBoard"];
	flagsToClear.forEach((flag) => {
		if (!exceptions.includes(flag)) {
			window[flag] = false;
		}
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
	   if (this.prevInputState != this.currentInputState) {
			this.prevInputState = this.currentInputState;
	   }
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

   // if (movingTile && (this.lastTimestamp - updateTime > 125)) {
      // selectDash = selectDash < selectDashSize ? selectDash + 1 : 0;
      // updateTime = this.lastTimestamp;
   // }

   drawBoard(gameX, gameY);
   //drawSelectedItem(); //Removed box display in corner. Now intuitive
   drawPlayerBoard();
   drawSelectionBorder();
   drawContextMenu();
   drawFeedbackUI();
}

function calcDistance(x1, y1, x2, y2) {
	//console.log("Calcing: " +x1+","+y1+","+x2+","+y2);
   return Math.sqrt(Math.abs(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)));
}

function btnPullNewTile() {
	if (currentInputState == InputState.NONE) {
	//clearFlags();
	//movingTile = false;
	//movingTileStarted = false;
	//alteringTile = false;
	//viewingPlayerBoard = false;
		game.setSelectedItem(null);
		pullNewTile();
	}
}

function pullNewTile() {
	if (!game.holdingItem && currentInputState == InputState.NONE) {
		currentInputState = InputState.ADDING_TILE;
		//addingTile = true;
		game.pullPathTile();
		game.holdSelectedItem();
		//console.log(game.getHoldingItem());
	}
}

function rotateSelectedTileLeft() {
	//console.log("Rotating Left");
	rotateSelectedTile(false);
}
function rotateSelectedTileRight() {
	//console.log("Rotating Right");
	rotateSelectedTile(true);
}

function rotateSelectedTile(rotateClockwise = true) {
	if (game) {
		game.rotateSelectedTile(rotateClockwise);
	}
}

function flipSelectedTile() {
	if (game) {
		game.flipSelectedTile();
	}
}

function btnMoveTile() {
	//clearFlags();
	//if (moveTileStarted) {
	if (currentInputState == InputState.SELECTING_TILE_TO_MOVE) {
		 feedbackText = "";
		//movingTile = false;
		//moveTileStarted = false;
		currentInputState == InputState.NONE;
		game.releaseItem();
	} else {
		game.setSelectedItem(null);
		feedbackText = "Select a Tile to Move";
		//moveTileStarted = true;
		currentInputState = InputState.SELECTING_TILE_TO_MOVE;
	}
}

function moveTile(x, y) {
	//if (moveTileStarted) {
	if (currentInputState == InputState.SELECTING_TILE_TO_MOVE) {
		if (game.getSelectedItem() instanceof Tile) {
		   if (game.holdingItem) {
				game.releaseItem(x, y);
				//movingTile = false;
				//moveTileStarted = false;
				game.selectTile(x,y);
				 feedbackText = "";
				 currentInputState = InputState.NONE;
		   } else {
				game.holdSelectedItem();
				//movingTile = true;
				currentInputState = InputState.MOVING_TILE;
		   }
		}
	}
}

function btnAlterSelectedTile() {
	//clearFlags(["alteringTile"]);
	game.setSelectedItem(null);
	currentInputState = InputState.SELECTING_TILE_TO_ALTER;
	alterSelectedTile();
}

function alterSelectedTile() {
	if (game) {
		var tile = game.getSelectedItem();
		if (tile && tile instanceof Tile && InitVals.pathTileTypes.includes(tile.type)) {
			feedbackText = "";
			console.log(tile);
			const worldCoords = boardToWorldCoords(tile.x, tile.y);
			hexagonClickAction(worldCoords.x, worldCoords.y, getHexSize()*alterOptionScale, xPos, yPos, [
				(selection) => {
					alterOptions.find((a) => a.sectionID == 0)?.callback();
				},
				(selection) => {
					alterOptions.find((a) => a.sectionID == 1)?.callback();
				},
				(selection) => {
					alterOptions.find((a) => a.sectionID == 2)?.callback();
				},
				(selection) => {
					alterOptions.find((a) => a.sectionID == 3)?.callback();
				},
				(selection) => {
					alterOptions.find((a) => a.sectionID == 4)?.callback();
				},
				(selection) => {
					alterOptions.find((a) => a.sectionID == 5)?.callback();
				},
			
			]);
		} else {
			currentInputState = InputState.SELECTING_TILE_TO_ALTER;
			//alteringTile = true;
			feedbackText = "Select a Tile to Alter";
		}
	}
}

function cancelAlterSelectedTile() {
	console.log("Cancel");
	//alteringTile = false;
	//if (addingTile) {
	if (currentInputState == InputState.ADDING_AND_ALTERING_TILE) {
		//addingTile = false;
		game.cancelPullPathTile(game.getSelectedItem());
	}
	game.setSelectedItem(null);
	currentInputState = InputState.NONE;
}
function alterSelectedTileConfirm() {
	game.selectedItemID = -1;
	currentInputState = InputState.NONE;
}

function btnRemoveSelectedTile() {
	//clearFlags();
	removeSelectedTile();
	currentInputState = InputState.NONE;
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
	game.selectActivePlayer();
}

function btnMovePlayer() {
	game.selectActivePlayer();
   //if (movingPlayer) {
   if (currentInputState == InputState.MOVING_PLAYER) {
	   game.releaseItem();
	   //movingPlayer = false;
	   currentInputState = InputState.NONE;
		$('#btnMovePlayer').val("Move Player");
   } else {
	   //movingPlayer = true;
	   currentInputState = InputState.MOVING_PLAYER;
	   movePlayer();
	  $('#btnMovePlayer').val("Cancel");
   }
}

function movePlayer(x, y) {
	if (game.getCurrentPathsGraph() && game.getCurrentPathsGraph().length) {
	   if (game.getHoldingItem() && !game.getPlayerAt(movingPlayerX, movingPlayerY)) {
		    //var player = game.holdingItem;
			game.releaseItem(movingPlayerX, movingPlayerY);
			//movingPlayer = false;
			currentInputState = InputState.NONE;
			$('#btnMovePlayer').val("Move Player");
	   } else {
		   currentInputState = InputState.MOVING_PLAYER;
			game.holdSelectedItem();
	   }
	}
}

function btnNextTurn() {
	game.nextTurn();
	$('#energy').text(game.getSelectedItem().energy);
}

function energy(val) {
	if (game.getSelectedItem() instanceof Player) {
		game.getSelectedItem().addEnergy(val);
		game.loadPathGraph();
		$('#energy').text(game.getSelectedItem().energy);
	}
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

function pointInTriangleBarycentric(p, a, b, c) {
    /**
     * Determine if point p is inside triangle abc using barycentric coordinates.
     * 
     * @param {Object} p - Point to test {x, y}
     * @param {Object} a - Triangle vertex A {x, y}
     * @param {Object} b - Triangle vertex B {x, y}
     * @param {Object} c - Triangle vertex C {x, y}
     * @returns {boolean} True if point is inside triangle, false otherwise
     */
    
    // Calculate vectors
    const v0 = { x: c.x - a.x, y: c.y - a.y }; // AC
    const v1 = { x: b.x - a.x, y: b.y - a.y }; // AB
    const v2 = { x: p.x - a.x, y: p.y - a.y }; // AP
    
    // Calculate dot products
    const dot00 = v0.x * v0.x + v0.y * v0.y; // AC · AC
    const dot01 = v0.x * v1.x + v0.y * v1.y; // AC · AB
    const dot02 = v0.x * v2.x + v0.y * v2.y; // AC · AP
    const dot11 = v1.x * v1.x + v1.y * v1.y; // AB · AB
    const dot12 = v1.x * v2.x + v1.y * v2.y; // AB · AP
    
    // Calculate barycentric coordinates
    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    
    // Check if point is in triangle
    return (u >= 0) && (v >= 0) && (u + v <= 1);
}

function hexagonClickAction(hexX, hexY, hexWidth, pointX, pointY, functions = []) {
	//functions is an array starting from top left and going clockwise
	
	if (calcDistance(hexX, hexY, pointX, pointY) < hexWidth/2) {
			var p1,p2,p3,p4;
			var isTop = false;
			if (pointY < hexY) {
				//top
				p1 = {x:hexX-hexWidth/2, y:hexY};
				p2 = {x:hexX - hexWidth/4, y:hexY-((hexWidth/2)*(Math.sqrt(3)/2))};
				p3 = {x:hexX + hexWidth/4, y:hexY-((hexWidth/2)*(Math.sqrt(3)/2))};
				p4 = {x:hexX+hexWidth/2, y:hexY};
				isTop = true; 
			} else {
				//bottom
				p1 = {x:hexX-hexWidth/2, y:hexY};
				p2 = {x:hexX - hexWidth/4, y:hexY+((hexWidth/2)*(Math.sqrt(3)/2))};
				p3 = {x:hexX + hexWidth/4, y:hexY+((hexWidth/2)*(Math.sqrt(3)/2))};
				p4 = {x:hexX+hexWidth/2, y:hexY};
			}
			
			var hexPoint = {x:hexX, y:hexY};
			var point = {x:pointX, y:pointY};
			
			//Left
			if (pointInTriangleBarycentric(point, hexPoint, p1, p2)) {
				if (functions.length) {
					functions[isTop ? 0 : 5]({coord1: hexPoint, coord2: p1, coord3: p2});
				}
			}
			//Center
			if (pointInTriangleBarycentric(point, hexPoint, p2, p3)) {
				if (functions.length) {
					functions[isTop ? 1 : 4]({coord1: hexPoint, coord2: p2, coord3: p3});
				}
			}
			//Right
			if (pointInTriangleBarycentric(point, hexPoint, p3, p4)) {
				if (functions.length) {
					functions[isTop ? 2 : 3]({coord1: hexPoint, coord2: p3, coord3: p4});
				}
			}
			
	}
}

/* =====================================================================================================
* RENDERING FUNCTIONS
===================================================================================================== */
function drawBoard(worldX, worldY) {


   //draw lab
   var labSize = getHexSize() / 1.5;
   ctx.drawImage(labIMG, worldX - labSize / 2, worldY - labSize / 2, labSize, labSize);

   //draw board
   
   game.getBoardIDs().forEach((tileID) => {
		let tile = game.getTileByID(tileID);
		if (tile != undefined && tile.type != TileType.INVALID && tile.type != TileType.LAB) {
			//console.log(tile.id);
			var coords = boardToWorldCoords(tile.x,tile.y);
			//if (tile != game.selectedItem || !movingTile) {
				drawHexagon(
				   coords.x,
				   coords.y,
				   getHexSize(),
				   tile
				);
			//}

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
	game.getPlayers().forEach((player) => {
		  var coords = boardToWorldCoords(player.x,player.y);
		  drawPlayerPath(player);
		  drawPlayerToken(coords.x, coords.y, getHexSize(), player);
		  if (currentInputState != InputState.MOVING_PLAYER && player.id == game.getActivePlayer().id) {
			drawPlayerHighlight(coords.x, coords.y, getHexSize());
		  }
		// if (player.id != game.getHoldingItem()) {
			// //drawPlayerToken(coords.x, coords.y, getHexSize(), player);
		// }
	});
	
}

function drawPlayerToken(hexX, hexY, radius, player) {
	  
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

function drawPlayerHighlight(hexX, hexY, radius) {
	  //var coords = boardToWorldCoords(game.getSelectedItem().x, game.getSelectedItem().y);
	 //highlightActivePlayer
	  ctx.beginPath();
	  ctx.lineWidth = 3.25;
	  ctx.strokeStyle = "#0049B7";
		ctx.arc(hexX, hexY, radius / 2.8, 0, 2 * Math.PI);
		//ctx.arc(coords.x, coords.y, getHexSize() / 2.8, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.closePath();
}

function drawPlayerPath(player) {
	if (player && game.getSelectedItem()) {
	   if (player == game.getSelectedItem() && player.isMoving) {
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
            ctx.rotate(((tile.direction * 60)) * Math.PI / 180);
            ctx.drawImage(robotIMG, -3 * radius / 8, -3 * radius / 8, 3 * radius / 4, 3 * radius / 4);
            ctx.restore();
         }
      }
   }
}

function drawSelectedItem() {
   if (game.getSelectedItem()) {
      //box outline
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.fillRect(canvas.width - selectedBoxSize, 0, selectedBoxSize, selectedBoxSize);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.strokeRect(canvas.width - selectedBoxSize, 0, selectedBoxSize, selectedBoxSize);
      ctx.stroke();

      if (game.getSelectedItem() instanceof Tile) {
         if ([TileType.CORNER, TileType.STRAIGHT, TileType.RESOURCE, TileType.SIXWAY, TileType.SPLIT, TileType.UTURN, TileType.TRIDENT].includes(game.getSelectedItem().type)) {
            drawHexagon(canvas.width - selectedBoxSize / 2, selectedBoxSize / 2, 100, game.getSelectedItem());
         }
      }
   }
}


function drawSelectionBorder() {
	ctx.beginPath();
	ctx.lineWidth = 3.25;
	ctx.strokeStyle = "green";
	if (game.getSelectedItem()) {
		if (game.getSelectedItem() instanceof Tile && game.getSelectedItem().x != -1 && game.getSelectedItem().y != -1) {
			if ([TileType.CORNER, TileType.STRAIGHT, TileType.RESOURCE, TileType.SIXWAY, TileType.SPLIT, TileType.UTURN, TileType.TRIDENT].includes(game.getSelectedItem().type)) {
				if (!game.holdingItem) {
					var coords = boardToWorldCoords(game.getSelectedItem().x, game.getSelectedItem().y);
				  // ctx.lineDashOffset = 2 * selectDash;
				  // ctx.setLineDash([selectDashSize, selectDashSize]);
				  // drawHexagon(coords.x, coords.y, getHexSize(), null);
				  // ctx.stroke();

				  // ctx.setLineDash([]);
			   // } else {
				  drawHexagon(coords.x, coords.y, getHexSize(), null);
				  ctx.stroke();
			   }
			}
		}
	} else if ([InputState.SELECTING_TILE_TO_ALTER].includes(currentInputState)) {
		const clickToBoard = worldToBoardCoords(xPos, yPos);
		const currentTile = game.getTile(clickToBoard.x, clickToBoard.y);
		if (currentTile && ![TileType.INVALID, TileType.HOME, TileType.EMPTY, TileType.LAB, TileType.RESOURCE].includes(currentTile.type)) {
			var coords = boardToWorldCoords(clickToBoard.x, clickToBoard.y);
		  drawHexagon(coords.x, coords.y, getHexSize(), null);
		  ctx.stroke();
		}
	}
	ctx.closePath();
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
	var boardCoords = worldToBoardCoords(xPos, yPos);
	//if (alteringTile) {
	const selectedItem = game.getSelectedItem();
	if (selectedItem && selectedItem instanceof Tile && [InputState.ALTERING_TILE, InputState.ADDING_AND_ALTERING_TILE].includes(currentInputState)) {
		boardCoords = {x:selectedItem.x, y:selectedItem.y};
	}
	var coords = boardToWorldCoords(boardCoords.x, boardCoords.y);
	//if (addingTile || movingTile || alteringTile) {
	if ([InputState.ADDING_TILE, InputState.MOVING_TILE, InputState.ALTERING_TILE, InputState.ADDING_AND_ALTERING_TILE].includes(currentInputState)) {
		if (selectedItem && selectedItem instanceof Tile) {
			if (InitVals.tileLocations.some(tile => tile.x == boardCoords.x && tile.y == boardCoords.y)) {
				if (game.getTile(boardCoords.x, boardCoords.y).type == TileType.EMPTY || (selectedItem.x == boardCoords.x && selectedItem.y == boardCoords.y)) {
					ctx.save();
					
					var offset = (currentInputState == InputState.ALTERING_TILE) ? 0 : 10;
					
					drawTileContextMenu(coords.x + offset/2, coords.y - offset);
					
					//draw shadow
					ctx.fillStyle = "rgb(0 0 0 0.2)";
					drawHexagon(coords.x + offset/2, coords.y - offset/2, getHexSize(), null);
					ctx.fill();
					
					//tile
					drawHexagon(coords.x + offset, coords.y - offset, getHexSize(), selectedItem);
					
					//draw tile border
					ctx.strokeStyle = "black";
					drawHexagon(coords.x + offset, coords.y - offset, getHexSize(), null);
					ctx.stroke();
					
					ctx.restore();
					
				}
			}
		}
	//} else if (movingPlayer) {
	} else if (currentInputState == InputState.MOVING_PLAYER) { //Draw player token on path
		if (game.getSelectedItem() instanceof Player) {
			if (game.getCurrentPathsGraph().length > 0) {
				var smallest = game.getCurrentPathsGraph().at(0).at(0);
				var	smallestWorldPoint = boardToWorldCoords(smallest.x, smallest.y);
				game.getCurrentPathsGraph().forEach((connection) => {
					connection.forEach((point) => {
						var pathWorldPoint = boardToWorldCoords(point.x, point.y);
						var dist = calcDistance(xPos, yPos, pathWorldPoint.x, pathWorldPoint.y);
						
						smallestWorldPoint = boardToWorldCoords(smallest.x, smallest.y);
						var smallestDist = calcDistance(xPos, yPos, smallestWorldPoint.x, smallestWorldPoint.y);
						//console.log(dist + " vs " + smallestDist);
						if (dist < smallestDist) {
							smallest = point;
						}
					});
				});
				movingPlayerX = smallest.x;
				movingPlayerY = smallest.y;
				smallestWorldPoint = boardToWorldCoords(smallest.x, smallest.y);
				drawPlayerToken(smallestWorldPoint.x, smallestWorldPoint.y, getHexSize(), game.getSelectedItem());
				drawPlayerHighlight(smallestWorldPoint.x, smallestWorldPoint.y, getHexSize());
			}
		}
	}
}

function drawTileContextMenu(worldX, worldY) {
	var mousePoint = {x:xPos, y:yPos};
	var worldPoint = {x:worldX, y:worldY};
	//draw gradiant
	// if (alteringTile) {
	if ([InputState.ALTERING_TILE, InputState.ADDING_AND_ALTERING_TILE].includes(this.currentInputState)) {
		const gradWidth = getHexSize()*alterOptionScale;
		const gradient = ctx.createRadialGradient(worldX, worldY, getHexSize()/(alterOptionScale/2), worldX, worldY, getHexSize()*(alterOptionScale/2));

		// Add three color stops
		gradient.addColorStop(0, "blue");
		gradient.addColorStop(0.20, "rgba(0, 0, 255, 0.65)");
		gradient.addColorStop(0.60, "rgba(0, 0, 255, 0.45)");
		gradient.addColorStop(0.90, "rgba(0, 0, 255, 0.1)");
		gradient.addColorStop(1, "rgba(0, 0, 255, 0)");

		ctx.beginPath();
		ctx.fillStyle = gradient;
		//ctx.arc(worldX, worldY, getHexSize()*5, 0, 2*Math.PI);
		drawHexagon(worldX, worldY, gradWidth, null);
		ctx.closePath();
		ctx.fill();
		
		//draw highlight
		const highlightGradiant = ctx.createRadialGradient(worldX, worldY, getHexSize()/2.5, worldX, worldY, getHexSize()*(alterOptionScale/2));
		highlightGradiant.addColorStop(0, "rgba(255,255,255, 0.3)");
		highlightGradiant.addColorStop(0.75, "rgba(255,255,255, 0.08)");
		highlightGradiant.addColorStop(0.95, "rgba(255,255,255, 0)");
		
		var highlightVerts = [];
		hexagonClickAction(worldX, worldY, gradWidth, xPos, yPos, [
			(section) => {
				if (alterOptions.find((a) => a.sectionID === 0)) {
					highlightVerts.push(section.coord1);
					highlightVerts.push(section.coord2);
					highlightVerts.push(section.coord3);
				}
			},
			(section) => {
				if (alterOptions.find((a) => a.sectionID === 1)) {
					highlightVerts.push(section.coord1);
					highlightVerts.push(section.coord2);
					highlightVerts.push(section.coord3);
				}
			},
			(section) => {
				if (alterOptions.find((a) =>  a.sectionID === 2)) {
					highlightVerts.push(section.coord1);
					highlightVerts.push(section.coord2);
					highlightVerts.push(section.coord3);
				}
			},
			(section) => {
				if (alterOptions.find((a) => a.sectionID === 3)) {
					highlightVerts.push(section.coord1);
					highlightVerts.push(section.coord2);
					highlightVerts.push(section.coord3);
				}
			},
			(section) => {
				if (alterOptions.find((a) => a.sectionID === 4)) {
					highlightVerts.push(section.coord1);
					highlightVerts.push(section.coord2);
					highlightVerts.push(section.coord3);
				}
			},
			(section) => {
				if (alterOptions.find((a) => a.sectionID === 5)) {
					highlightVerts.push(section.coord1);
					highlightVerts.push(section.coord2);
					highlightVerts.push(section.coord3);
				}
			},
		]);
		
			ctx.beginPath();
			ctx.fillStyle = highlightGradiant;
			ctx.moveTo(worldX, worldY);
			highlightVerts.forEach((vert) => {
				ctx.lineTo(vert.x, vert.y);
			});
			ctx.closePath();
			ctx.fill();
		
		
		//draw altering options
		alterOptions.forEach((alterOption) => {
			var midPoint = getSectionMidPoint(worldX, worldY, gradWidth, alterOption.sectionID);
			ctx.fillStyle = "black";
			drawIcon(alterOption.icon, midPoint.x, midPoint.y);
		});
		
	}
}

function getSectionMidPoint(worldX, worldY, hexWidth, sectionID) {
	let vertex1 = {x:worldX, y:worldY}, vertex2 = {}, vertex3= {};
	switch(sectionID) {
		case 0:
		vertex2 = {x:worldX-hexWidth/2, y:worldY};
		vertex3 = {x:worldX - hexWidth/4, y:worldY-((hexWidth/2)*(Math.sqrt(3)/2))};
		break;
		case 1:
		vertex2 = {x:worldX - hexWidth/4, y:worldY-((hexWidth/2)*(Math.sqrt(3)/2))};
		vertex3 = {x:worldX + hexWidth/4, y:worldY-((hexWidth/2)*(Math.sqrt(3)/2))};
		break;
		case 2:
		vertex2 = {x:worldX + hexWidth/4, y:worldY-((hexWidth/2)*(Math.sqrt(3)/2))};
		vertex3 = {x:worldX+hexWidth/2, y:worldY};
		break;
		case 3:
		vertex2 = {x:worldX+hexWidth/2, y:worldY};
		vertex3 = {x:worldX + hexWidth/4, y:worldY+((hexWidth/2)*(Math.sqrt(3)/2))};
		break;
		case 4:
		vertex2 = {x:worldX + hexWidth/4, y:worldY+((hexWidth/2)*(Math.sqrt(3)/2))};
		vertex3 = {x:worldX - hexWidth/4, y:worldY+((hexWidth/2)*(Math.sqrt(3)/2))};
		break;
		case 5:
		vertex2 = {x:worldX - hexWidth/4, y:worldY+((hexWidth/2)*(Math.sqrt(3)/2))};
		vertex3 = {x:worldX-hexWidth/2, y:worldY};
		break;
		default:
		break;
	}
	
  const cx = (vertex1.x + vertex2.x + vertex3.x) / 3;
  const cy = (vertex1.y + vertex2.y + vertex3.y) / 3;
  return { x: cx, y: cy };
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

   //if (!viewingPlayerBoard) {
   if (currentViewState == ViewState.MAP) {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "black";
      ctx.moveTo(playerBoardX + playerBoardWidth + playerBoardTabSize / 4, playerBoardY + playerBoardTabSize / 2);
      ctx.lineTo(playerBoardX + playerBoardWidth + 3 * playerBoardTabSize / 4, playerBoardY + playerBoardTabSize / 2);
      ctx.lineTo(playerBoardX + playerBoardWidth + 2.5 * playerBoardTabSize / 4, playerBoardY + playerBoardTabSize / 4);
      ctx.lineTo(playerBoardX + playerBoardWidth + 3 * playerBoardTabSize / 4, playerBoardY + playerBoardTabSize / 2);
      ctx.lineTo(playerBoardX + playerBoardWidth + 2.5 * playerBoardTabSize / 4, playerBoardY + 3 * playerBoardTabSize / 4);
      ctx.stroke();
   } else if (currentViewState == ViewState.PLAYERBOARD) {
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

function drawFeedbackUI() {
	ctx.save();
	ctx.font = "24px serif";
	ctx.textAlign = "center";
	ctx.fillStyle = "rgb(228 182 86)";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;
	ctx.strokeText(feedbackText, canvas.width/2, 50);
	ctx.fillText(feedbackText, canvas.width/2, 50);
	ctx.restore();
}

function drawIcon(icon, worldX, worldY) {
	ctx.lineWidth=1.5;
	switch(icon) {
		case "LEFT":
			ctx.fillStyle="white";
			ctx.strokeStyle="black";
			drawArrow(worldX-20, worldY, 40, 20, true);
			ctx.fill();
			ctx.stroke();
			break;
		case "RIGHT":
			ctx.fillStyle="white";
			ctx.strokeStyle="black";
			drawArrow(worldX-20, worldY, 40, 20, false);
			ctx.fill();
			ctx.stroke();
			break;
		case "FLIP":
			ctx.fillStyle="white";
			ctx.strokeStyle="black";
			drawArrow(worldX-10, worldY-10, 20, 10, false);
			ctx.fill();
			ctx.stroke();
			ctx.save();
			ctx.translate(worldX, worldY);
			ctx.rotate(2*Math.PI/2);
			drawArrow(-10, -10, 20, 10, false);
			ctx.restore();
			ctx.fill();
			ctx.stroke();
			break;
		case "CHECK":
			ctx.fillStyle="rgb(102, 255, 0)";
			ctx.strokeStyle="black";
			drawCheck(worldX, worldY, 45, 25);
			ctx.fill();
			ctx.stroke();
			break;
		case "X":
			ctx.fillStyle="rgb(255, 20, 0)";
			ctx.strokeStyle="black";
			drawX(worldX, worldY,30, 30);
			ctx.fill();
			ctx.stroke();
			break;
	}
}

function drawArrow(x, y, width, height, left) {
	var drawingWidth = 325;
	var drawingHeight = 200;
	
	ctx.save();
	var xoff = 2*(-drawingWidth/2);
	var yoff = 2*(-drawingHeight/2);
	ctx.beginPath();
	ctx.translate(x + width/2, y);
	
	ctx.scale((left ? 1 : -1)*width/drawingWidth, height/drawingHeight);
	ctx.moveTo(485 + xoff, 131 + yoff);
	ctx.bezierCurveTo(312 + xoff, 130 + yoff, 247 + xoff, 178 + yoff, 209 + xoff, 239 + yoff);
	ctx.bezierCurveTo(201 + xoff, 252 + yoff, 189 + xoff, 175 + yoff, 170 + xoff, 160 + yoff);
	ctx.bezierCurveTo(149 + xoff, 143 + yoff, 136 + xoff, 359 + yoff, 140 + xoff, 357 + yoff);
	ctx.bezierCurveTo(153 + xoff, 350 + yoff, 240 + xoff, 376 + yoff, 295 + xoff, 365 + yoff);
	ctx.bezierCurveTo(322 + xoff, 360 + yoff, 220 + xoff, 304 + yoff, 226 + xoff, 290 + yoff);
	ctx.bezierCurveTo(253 + xoff, 231 + yoff, 353 + xoff, 208 + yoff, 462 + xoff, 196 + yoff);
	ctx.bezierCurveTo(472 + xoff, 195 + yoff, 422 + xoff, 181 + yoff, 398 + xoff, 185 + yoff);
	ctx.bezierCurveTo(383 + xoff, 187 + yoff, 477 + xoff, 159 + yoff, 454 + xoff, 162 + yoff);
	ctx.bezierCurveTo(439 + xoff, 164 + yoff, 426 + xoff, 154 + yoff, 416 + xoff, 155 + yoff);
	ctx.bezierCurveTo(401 + xoff, 156 + yoff, 443 + xoff, 134 + yoff, 485 + xoff, 133 + yoff);
	ctx.closePath();
	ctx.restore();
}

function drawCheck(x, y, width, height) {
	var drawingWidth = 290;
	var drawingHeight = 220;
	
	ctx.save();
	var xoff = (-drawingWidth/2);
	var yoff = (-drawingHeight/2);
	ctx.beginPath();
	ctx.translate(x, y);
	
	ctx.scale(width/drawingWidth, height/drawingHeight);
	ctx.moveTo(208 + xoff, 10 + yoff);
	ctx.bezierCurveTo(141 + xoff, 121 + yoff, 108 + xoff, 143 + yoff, 101 + xoff, 156 + yoff);
	ctx.bezierCurveTo(94 + xoff, 169 + yoff, 71 + xoff, 111 + yoff, 72 + xoff, 109 + yoff);
	ctx.bezierCurveTo(74 + xoff, 105 + yoff, 23 + xoff, 100 + yoff, 16 + xoff, 87 + yoff);
	ctx.bezierCurveTo(9 + xoff, 74 + yoff, 83 + xoff, 228 + yoff, 92 + xoff, 215 + yoff);
	ctx.bezierCurveTo(139 + xoff, 147 + yoff, 257 + xoff, 37 + yoff, 286 + xoff, 8 + yoff);
	ctx.bezierCurveTo(297 + xoff, -3 + yoff, 252 + xoff, 33 + yoff, 231 + xoff, 37 + yoff);
	ctx.bezierCurveTo(216 + xoff, 40 + yoff, 239 + xoff, 13 + yoff, 231 + xoff, 18 + yoff);
	ctx.bezierCurveTo(218 + xoff, 26 + yoff, 211 + xoff, 25 + yoff, 210 + xoff, 40 + yoff);
	ctx.bezierCurveTo(209 + xoff, 55 + yoff, 208 + xoff, -6 + yoff, 207 + xoff, 9 + yoff);
	ctx.closePath();
	ctx.restore();
}

function drawX(x,y,width,height) {
	var drawingWidth = 270;
	var drawingHeight = 320;
	
	ctx.save();
	var xoff = (-drawingWidth/2);
	var yoff = (-drawingHeight/2);
	ctx.beginPath();
	ctx.translate(x, y);
	
	ctx.scale(width/drawingWidth, height/drawingHeight);
  ctx.moveTo(6 + xoff, 41 + yoff);
  ctx.bezierCurveTo(-7 + xoff, 34 + yoff, 27 + xoff, 16 + yoff, 38 + xoff, 27 + yoff);
  ctx.bezierCurveTo(91 + xoff, 80 + yoff, 33 + xoff, -2 + yoff, 49 + xoff, 3 + yoff);
  ctx.bezierCurveTo(63 + xoff, 7 + yoff, 149 + xoff, 141 + yoff, 139 + xoff, 152 + yoff);
  ctx.bezierCurveTo(129 + xoff, 163 + yoff, 215 + xoff, 16 + yoff, 201 + xoff, 10 + yoff);
  ctx.bezierCurveTo(187 + xoff, 4 + yoff, 224 + xoff, 47 + yoff, 211 + xoff, 54 + yoff);
  ctx.bezierCurveTo(198 + xoff, 61 + yoff, 292 + xoff, -11 + yoff, 262 + xoff, 10 + yoff);
  ctx.bezierCurveTo(250 + xoff, 19 + yoff, 163 + xoff, 199 + yoff, 154 + xoff, 187 + yoff);
  ctx.bezierCurveTo(145 + xoff, 175 + yoff, 277 + xoff, 283 + yoff, 227 + xoff, 258 + yoff);
  ctx.bezierCurveTo(214 + xoff, 251 + yoff, 262 + xoff, 310 + yoff, 253 + xoff, 298 + yoff);
  ctx.bezierCurveTo(242 + xoff, 284 + yoff, 196 + xoff, 245 + yoff, 219 + xoff, 275 + yoff);
  ctx.bezierCurveTo(228 + xoff, 287 + yoff, 250 + xoff, 327 + yoff, 239 + xoff, 316 + yoff);
  ctx.bezierCurveTo(228 + xoff, 305 + yoff, 193 + xoff, 282 + yoff, 200 + xoff, 295 + yoff);
  ctx.bezierCurveTo(215 + xoff, 324 + yoff, 126 + xoff, 154 + yoff, 126 + xoff, 201 + yoff);
  ctx.bezierCurveTo(126 + xoff, 216 + yoff, 73 + xoff, 301 + yoff, 58 + xoff, 302 + yoff);
  ctx.bezierCurveTo(43 + xoff, 303 + yoff, 64 + xoff, 293 + yoff, 51 + xoff, 285 + yoff);
  ctx.bezierCurveTo(38 + xoff, 277 + yoff, 32 + xoff, 290 + yoff, 21 + xoff, 300 + yoff);
  ctx.bezierCurveTo(10 + xoff, 310 + yoff, 52 + xoff, 262 + yoff, 15 + xoff, 275 + yoff);
  ctx.bezierCurveTo(1 + xoff, 280 + yoff, 129 + xoff, 167 + yoff, 123 + xoff, 181 + yoff);
  ctx.bezierCurveTo(117 + xoff, 195 + yoff, 13 + xoff, 32 + yoff, 7 + xoff, 46 + yoff);
  ctx.closePath();
  ctx.restore();
}
