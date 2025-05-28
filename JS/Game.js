class Game {
  board;
  selectedItem;
  tileBag = [];
  players = [];
  activePlayer = 0;
  currentPathsTrace = [];


  constructor() {
    this.initGame();
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

      var newPlayer = new Player(position.x, position.y, name, homeLocation, robot);
      this.addPlayer(newPlayer);
    }
  }
  
  addPlayer(player) {
    this.players.push(player);
  }

  getActivePlayer() {
    return this.players[this.activePlayer];
  }

  playerCount = () => {return this.players.length};
  
  getBoardState() {
    return this.board;
  }

  getHomeLocation(val) {
    return InitVals.homeLocations[val-1];
  }
  
  getTile(x,y) {
    return this.board.get("[" + x + "," + y + "]");
  }

  setTile(x, y, newTile) {
    newTile.x = x;
    newTile.y = y;
    this.board.set("[" + x + "," + y + "]", newTile);
  }

  copyTile(tile2Copy) {
    var tileClone = new Tile(tile2Copy.x, tile2Copy.y, tile2Copy.flipped, tile2Copy.type, tile2Copy.isDebris);
    tileClone.setHome(tile2Copy.homeLocation, tile2Copy.homeType);
    return tileClone;
  }
  
  initGame() {
    console.log("Initialize Board");
    this.selectedItem = null;
    this.board = new Map([]);

   //init path tilebag
   this.initPathTileBag();
	  
    //init players
    this.players = [];
    this.activePlayer = 0;
    
    //init board
    for (let y = 0; y < 22; y++) {
      for (let x = 0; x < 9; x++) {
        if (InitVals.homeLocations.some(home => home.x == x && home.y == y)) {
          this.setTile(x,y, new Tile(x,y, false, TileType.HOME));
        } else if (InitVals.resourceLocations.some(resource => resource.x == x && resource.y == y)) {
          this.setTile(x,y, new Tile(x,y, false, TileType.RESOURCE));
        } else if (InitVals.tileLocations.some(tile => tile.x == x && tile.y == y)) {
          this.setTile(x,y, new Tile(x,y, false, TileType.EMPTY));
        } else if (InitVals.labLocation.some(tile => tile.x == x && tile.y == y)) {
          this.setTile(x,y, new Tile(x,y, false, TileType.LAB));
		} else {
          this.setTile(x,y, new Tile(x,y, false, TileType.INVALID));
        }
      }
    }

    //temp for testing
    //this.addNewPlayer("TEST", 5, RobotType.ROBOT1);
    // this.pullPathTile(1,11);
    // this.pullPathTile(1,9);
    // this.pullPathTile(3,2);
    // this.pullPathTile(3,3);
    // this.pullPathTile(2,3);
    // this.pullPathTile(2,4);
    // this.pullPathTile(2,5);
    // this.pullPathTile(3,4);
    // this.pullPathTile(3,6);
    // this.pullPathTile(2,7);

  }

initPathTileBag() {
	this.tileBag = [];
	InitVals.pathBagSetup.forEach((pathType) => {
		//generate Debris Tiles
		for (var i = 0; i < pathType.debrisCount; i++) {
			this.tileBag.push(new Tile(-1,-1, false, pathType.type, true, true, 0));
		}
		//generate Pitfall Tiles
		for (var i = 0; i < pathType.pitfallCount; i++) {
			this.tileBag.push(new Tile(-1,-1, false, pathType.type, false, true, 0));
		}
		//generate Directional Tiles
		//for (var i = 0; i < type.debrisCount; i++) {
		//	this.tileBag.push(new Tile(-1,-1, false, true, 0);
		//}
	});
}

pullPathTile() {
	if (this.tileBag.length > 0) {
		var pullID = Math.floor(Math.random() * this.tileBag.length);
		var tile = this.tileBag[pullID];
		this.tileBag.splice(pullID, 1);
		return tile;
	}
	console.log(this.tileBag.length-1);
}

putPathTileBack(tile) {
	if (tile) {
		this.tileBag.push(tile);
	}
}

  setSelectedItem(item) {
    if (item != null) {
      if (item instanceof Tile) {
        this.selectedItem = (InitVals.pathTileTypes.includes(item.type)) ? item : null;
      } else {
        this.selectedItem = item;
      }
    } else {    
      this.selectedItem = null;
    }
  }

  selectTile(x, y) {
    var player = this.players.find((player) => player.x == x && player.y == y);
    if (player) {
      this.setSelectedItem(player);
		this.loadPathGraph();
    } else {
      this.setSelectedItem(this.getTile(x,y)); 
    }
  }

  moveSelectedTile(newX, newY) {
    if ((!this.players.some((player) => player.x == newX && player.y == newY)) && (this.selectedItem && this.selectedItem instanceof Tile)) {
      var origTile = this.copyTile(this.selectedItem);
      var replacedTile = this.copyTile(this.getTile(newX, newY));
      if (replacedTile.type == TileType.EMPTY) {
        this.setTile(newX, newY, origTile);
        this.setTile(this.selectedItem.x, this.selectedItem.y, replacedTile);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  
  rotateSelectedTile(rotateClockwise = true) {
    if (this.selectedItem && this.selectedItem instanceof Tile) {
      if (InitVals.pathTileTypes.includes(this.selectedItem.type)) {
        this.selectedItem.rotateDirection(rotateClockwise);
      }
    }
  }

  flipSelectedTile() {
    if (this.selectedItem && this.selectedItem instanceof Tile) {
      if (InitVals.pathTileTypes.includes(this.selectedItem.type)) {
        this.selectedItem.flipped = !this.selectedItem.flipped;
      }
    }
  }

  removeSelectedTile() {
    if (this.selectedItem && this.selectedItem instanceof Tile) {
      this.tileBag.push(this.getTile(this.selectedItem.x, this.selectedItem.y));
      this.setTile(this.selectedItem.x, this.selectedItem.y, new Tile(this.selectedItem.x, this.selectedItem.y, false, TileType.EMPTY, true));
      this.selectedItem = null;
    }
  }

  getCurrentPathsGraph() {
    return this.currentPathsGraph;
  }

  loadPathGraph() {
    var pathsTrace = [];
    if (this.selectedItem && this.selectedItem instanceof Player && this.selectedItem.isMoving) {
		var connections = [];
		this.getTileGraphPoints(connections, {x:this.selectedItem.x, y:this.selectedItem.y});
		this.currentPathsGraph = connections;
		console.log(JSON.stringify(this.currentPathsGraph));
    }
  }

	getTileGraphPoints(connections, tilePoint) {
		var tile = this.getTile(tilePoint.x,tilePoint.y); //CURRENT TILE
		if (tile && tile.type != TileType.EMPTY) {
			var tilePathPoints = tile.getPathPoints(); // LIST OF TILES TO CHECK FOR CONNECTION
			tilePathPoints.forEach((newTilePoint) => {
				var newTile = this.getTile(newTilePoint.x, newTilePoint.y);
				if (newTile && newTile.type != TileType.EMPTY) {
					var newTilePathPoints = newTile.getPathPoints();
					var connectionID = newTilePathPoints.findIndex((point) => JSON.stringify(tilePoint) === JSON.stringify(point));
					if (connectionID != -1) {
						if (this.addUniqueConnection(connections, [tilePoint,newTilePoint])) {
							this.getTileGraphPoints(connections, newTilePoint);
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
