class Game {
  players = []; //array of PlayerObjects
  tileObjects = []; //array of Tiles
  boardTiles = new Map();  //map of IDs
  tileBag = [];  //array of IDs
  activePlayerID = -1;
  selectedItemID = -1;
  holdingItemID = -1;
  
  currentPathGraphPlayerID = -1;
  currentPathsGraph = [];
  itemOrigX = 3;
  itemOrigY = 5;
  latestID = 0;
  
  
  constructor() {
    this.initGame();
  }
  
  getNextID() {
	  return this.latestID++;
  }

  getPlayers() {
    return this.players;
  }

  addNewPlayer(name, homeLocation, robot) {
    if (name != undefined && homeLocation != undefined && robot != undefined) {
      var position = this.getHomeLocation(homeLocation);
      var homeTile = this.getTile(position.x, position.y);
      if (homeTile) {
         homeTile.setHome(homeLocation, robot);
         //homeTile.setDirection(homeLocation);
      }

      var newPlayer = new Player(this.getNextID(), position.x, position.y, name, homeLocation, robot);
      this.addPlayer(newPlayer);
    }
  }
  
  addPlayer(player) {
	if (this.activePlayerID == -1) {
		this.activePlayerID = player.id;
	}
    this.players.push(player);
  }

  getActivePlayer() {
    return this.players.find((player) => player.id == this.activePlayerID);
  }
  
  getPlayerAt(x,y) {
	  return this.players.find((player) => player.x == x && player.y == y);
  }

  playerCount = () => {return this.players.length};

  nextTurn() {
	  if (this.players.length > 1) {
		  let playerIndex = this.players.findIndex((player) => player.id == this.activePlayerID);
		  playerIndex = playerIndex < this.players.length-1 ? playerIndex + 1 : 0;
		  this.activePlayerID = this.players[playerIndex].id;
	  }
  }

  getHomeLocation(val) {
    return InitVals.homeLocations[val-1];
  }
  
  getObjectByID(id) {
	  //console.log("getObject by id: " + id);
	  var obj = [...this.players, ...this.tileObjects].find((object) => object.id == id);
	  return obj ? obj : null;
  }
  
  getObjectByXY(x,y) {
	  //console.log("id: " + this.selectedItemID);
	  var obj = [...this.players, ...this.tileObjects].find((object) => object.x == x && object.y == y);
	  //console.log("Found in here");
	  return obj ? obj : null;
  }
  

  // copyTile(tile2Copy) {
    // var tileClone = new Tile(tile2Copy.id, tile2Copy.x, tile2Copy.y, tile2Copy.flipped, tile2Copy.type, tile2Copy.isDebris, tile2Copy.direction);
    // tileClone.setHome(tile2Copy.homeLocation, tile2Copy.homeType);
    // return tileClone;
  // }
  
  initGame() {
    console.log("Initialize Board");
    this.setSelectedItem(null);
    this.boardTiles = new Map();
	//this.boardSet = [];

   //init path tilebag
   this.initPathTileBag();
	  
    //init players
    this.players = [];
    this.activePlayer = 0;
    
    //init board
    for (let y = 0; y < 22; y++) {
      for (let x = 0; x < 9; x++) {
		var tile;
		//id, x, y, flipped = false, type = TileType.EMPTY, isDebris = true, direction = 0, origin = TileOrigins.TILEBAG
        if (InitVals.homeLocations.some(home => home.x == x && home.y == y)) {
			tile = new Tile(this.getNextID(), x,y, false, TileType.HOME);
        } else if (InitVals.resourceLocations.some(resource => resource.x == x && resource.y == y)) {
			tile = new Tile(this.getNextID(), x,y, false, TileType.RESOURCE);
        } else if (InitVals.tileLocations.some(tile => tile.x == x && tile.y == y)) {
			tile = new Tile(this.getNextID(), x,y, false, TileType.EMPTY);
        } else if (InitVals.labLocation.some(tile => tile.x == x && tile.y == y)) {
			tile = new Tile(this.getNextID(), x,y, false, TileType.LAB);
		} else {
          tile = new Tile(this.getNextID(), x,y, false, TileType.INVALID);
        }
		if (tile) {
			this.tileObjects.push(tile);
			this.setBoardID(x,y, tile.id);
		}
      }
    }

  }

initPathTileBag() {
	this.tileBag = [];
	InitVals.pathBagSetup.forEach((pathType) => {
		//generate Debris Tiles
		for (var i = 0; i < pathType.debrisCount; i++) {
			var debrisTile = new Tile(this.getNextID(),  -1,-1, false, pathType.type, true, 0, TileOrigins.TILEBAG);
			debrisTile.source = this.tileBag;
			this.tileBag.push(debrisTile.id);
			this.tileObjects.push(debrisTile);
		}
		//generate Pitfall Tiles
		for (var i = 0; i < pathType.pitfallCount; i++) {
			var pitfallTile = new Tile(this.getNextID(),  -1,-1, false, pathType.type, true, 0, TileOrigins.TILEBAG);
			pitfallTile.source = this.tileBag;
			this.tileBag.push(pitfallTile.id);
			this.tileObjects.push(pitfallTile);
		}
		//generate Directional Tiles
		//for (var i = 0; i < type.debrisCount; i++) {
		//	this.tileBag.push(new Tile(-1,-1, false, true, 0);
		//}
	});
}

//lastDrawnItems = [];
pullPathTile() {
	if (this.tileBag.length > 0) {
		//game.setSelectedItem(null);
		// if (this.lastDrawnItems.length > 0) {
			// console.log("Last Drawn Items: " + this.lastDrawnItems.length);
			// return this.lastDrawnItems.pop();
		// }
		// console.log("Pull from bag");
		var pullID = this.tileBag[Math.floor(Math.random() * this.tileBag.length)];
		//this.tileBag.splice(pullID, 1);
		this.selectedItemID = pullID;
		this.holdingItemID = pullID;
		//return tile;
	}
}

cancelPullPathTile() {
	if (this.selectedItemID) {
		//console.log("Adding to last drawn");
		//this.lastDrawnItems.push(this.selectedItem);
		if (this.removeSelectedTileFromBoard(this.tileBag)) {
			this.holdingItemID = -1;
			this.selectedItemID = -1;
		}
	}
}

holdSelectedItem() {
	if (this.getSelectedItem()) {
		itemOrigX = this.getSelectedItem().x;
		itemOrigY = this.getSelectedItem().y;
		this.holdingItemID = this.getSelectedItem().id;
	}
}

holdItem(item) {
	if (item) {
		this.setSelectedItem(item);
		this.holdSelectedItem();
	}
}

getHoldingItem() {
	var item = this.getObjectByID(this.holdingItemID);
	return item;
}

releaseItem(x, y) {
	if (x == undefined) {
		x = itemOrigX;
	}
	if (y == undefined) {
		y = itemOrigY;
	}
	var item = this.getHoldingItem();
	if (item instanceof Tile) {
		this.setTile(x,y, item);
		this.setSelectedItem(item.id);
	} else if (item instanceof Player) {
		item.x = x;
		item.y = y;
	}
	
	this.holdingItemID = -1;
	this.selectedItemID = -1;
}

  setSelectedItem(item) {
	  if (item) {
		  //pick a path tile or Player
		  switch (item.constructor.name) {
			case "Tile":
				if (InitVals.pathTileTypes.includes(item.type)) {
					this.selectedItemID = item ? item.id : -1;
				}
				break;
			case "Player":
				this.selectedItemID = item ? item.id : -1;
				break;
			default:
				break;
		  }
	  } else {
		  this.selectedItemID = -1;
	  }
  }
  
  setSelectedItemXY(x,y) {
	  var obj = this.getObjectByXY(x,y);
	  this.setSelectedItem(obj);
  }
  
  getSelectedItem() {
	  if (this.selectedItemID != -1) {
		  //console.log("id: " + this.selectedItemID);
		  var item = [ ...this.players,...this.tileObjects].find((item) => item.id == this.selectedItemID);
		  return item ? item : null;
	  }
	  return null; 
  }


  selectActivePlayer() {
		this.setSelectedItem(this.getActivePlayer());
		this.loadPathGraph();
  }

	setBoardID(x,y,id) {
	 this.boardTiles.set(`${x},${y}`, id);
	}
	
    getBoardID(x,y) {
		this.boardTiles.get(`${x},${y}`);
	}
	
  getBoardIDs() {
	  return Array.from(this.boardTiles).map(([name, value]) => value);
  }

  selectTile(x, y) {
	  //console.log("Selecting Tile");
    //var player = this.players.find((player) => player.x == x && player.y == y);
    //if (player) {
    //  this.setSelectedItem(player);
	//	this.loadPathGraph();
    //} else {
      this.setSelectedItem(this.getValidTile(x,y)); 
    //}
  }

  // moveSelectedTile(oldX, oldY, newX, newY) {
    // if ((!this.players.some((player) => player.x == newX && player.y == newY)) && (this.getSelectedItem() && this.getSelectedItem() instanceof Tile)) {
      // var origTile = this.getSelectedItem();
      // var replacedTile = this.getTile(newX, newY);
	 // this.board.set("[" + oldX + "," + oldY + "]", replacedTile);
	 // this.board.set("[" + newX + "," + newY + "]", origTile);
      // // if (replacedTile.type == TileType.EMPTY) {
        // // this.setTile(newX, newY, origTile);
        // // this.setTile(this.selectedItem.x, this.selectedItem.y, replacedTile);
		// // this.setSelectedItem(origTile);
         // return true;
      // // } else {
        // // return false;
      // // }
    // } else {
      // return false;
    // }
  // }
  
  getValidTile(x,y) {
	  const tile = this.getTile(x,y);
	  return (tile && !(tile instanceof Player)&& tile.type != TileType.INVALID && tile.type != TileType.EMPTY) ? tile : null;
  }
  
  getTile(x,y) {
	  return this.tileObjects.find((tile) => tile.x == x && tile.y == y);
    //return this.board.get("[" + x + "," + y + "]");
  }
  
  getTileByID(id) {
	  if (id) {
		return this.tileObjects.find((tile) => tile.id == id);
	  }
  }
  
  setTile(x,y, tile) {
	if (tile) {
		tile.x = x;
		tile.y = y;
	  const index = this.tileObjects.findIndex((t) => t.x == x && t.y == y);
	  if (index) {
		  if (tile.origin == TileOrigins.TILEBAG) {
			  this.tileBag = this.tileBag.filter((tileInBag) => tileInBag.id != tile.id);
		  }
		  this.tileObjects[index] = tile;
		  this.setBoardID(x,y,tile.id);
	  }
	}
	  // var tileLocationID = this.getBoardID(x,y);
	  // if (tileLocationID == -1 || tileLocationID == undefined) {
		  // if (tile) {
			  // //console.log("{" + x + "," + y + "} " + tile);
			  // //if (tile.source != destination) {
				// tile.x = x;
				// tile.y = y;
				// this.setBoardID(x,y,tile.id);
				// //tile.origin
				// //this.transferObject(tile.source, destination, tile);
			 // // }
		  // }
	  // }
  }
 
  
  setEmptyTile(x,y) {
	const tile = new Tile(this.getNextID(), x,y, false, TileType.EMPTY);
	this.tileObjects.push(tile);
	this.setTile(x,y, tile);
  }
  
  isValidTilePlacement(x,y) {
	  const tile = this.getTile(x,y);
	  return tile && tile.type == TileType.EMPTY;
  }
  
  rotateSelectedTile(rotateClockwise = true) {
    if (this.getSelectedItem() && this.getSelectedItem() instanceof Tile) {
      if (InitVals.pathTileTypes.includes(this.getSelectedItem().type)) { //is of a rotateable tile type
        this.getSelectedItem().rotateDirection(rotateClockwise);
      }
    }
  }

  flipSelectedTile() {
    if (this.getSelectedItem() && this.getSelectedItem() instanceof Tile) {
      if (InitVals.pathTileTypes.includes(this.getSelectedItem().type)) { //is of a flippable tile type
        this.getSelectedItem().flipped = !this.getSelectedItem().flipped;
      }
    }
  }

  removeSelectedTileFromBoard() {
	if (this.getSelectedItem() instanceof Tile) {
		this.setEmptyTile(this.getSelectedItem().x, this.getSelectedItem().y);
		//return this.transferObject(this.boardSet, this.tileBag, this.getSelectedItem().id);
	} else {
		return false;
	}
  }
  
  // transferObject(origin, destination, object) {
	// if (origin && destination) {
		// const index = origin.indexOf(object);
		// if (index > -1) {
			// const removedObject = origin.splice(index, 1)[0];
			// removedObject.source = destination;
			// return true;
		// }
	// }
	// return false;
  // }

  getCurrentPathsGraph() {
	if (this.activePlayerID != -1 && this.activePlayerID != this.currentPathGraphPlayerID) {
		this.currentPathGraphPlayerID = this.activePlayerID;
		this.selectActivePlayer();
		this.loadPathGraph();
	}
    return this.currentPathsGraph;
  }

  loadPathGraph() {
    var pathsTrace = [];
	var selected = this.getSelectedItem();
    if (selected && selected instanceof Player) {
		var connections = [];
		this.getTileGraphPoints(connections, {x:selected.x, y:selected.y}, 0, selected.getMovement());
		this.currentPathsGraph = connections;
    }
  }

	getTileGraphPoints(connections, tilePoint, depth, maxDepth) {
		if (maxDepth == 0 || depth == maxDepth) {
			return;
		}
		var tile = this.getTile(tilePoint.x,tilePoint.y); //CURRENT TILE
		if (tile && tile.type != TileType.EMPTY) {
			var tilePathPoints = tile.getPathPoints(); // LIST OF TILES TO CHECK FOR CONNECTION
			tilePathPoints.forEach((newTilePoint) => {
				var newTile = this.getTile(newTilePoint.x, newTilePoint.y);
				if (newTile && newTile.type != TileType.EMPTY && depth != maxDepth) {
					var newTilePathPoints = newTile.getPathPoints();
					var connectionID = newTilePathPoints.findIndex((point) => JSON.stringify(tilePoint) === JSON.stringify(point));
					if (connectionID != -1) {
						if (this.addUniqueConnection(connections, [tilePoint,newTilePoint])) {
							this.getTileGraphPoints(connections, newTilePoint, depth + 1, maxDepth);
						}
					}
				}
			});
		}
	}
	
	addUniqueConnection(connections, newConnection) {
		if (!connections.find((estConn) => this.isMatchingConnection(estConn, newConnection))) {
			connections.push(newConnection);
			return true;
		} else {
			return false;
		}
	}
	
	isMatchingConnection(item1, item2) {
		var item1Sorted = item1.map(obj => JSON.stringify(obj)).sort();
		var item2Sorted = item2.map(obj => JSON.stringify(obj)).sort();
	//console.log(JSON.stringify(item1Sorted) + " | " + JSON.stringify(item2Sorted));
		return JSON.stringify(item1Sorted) === JSON.stringify(item2Sorted);
	}
	
}
