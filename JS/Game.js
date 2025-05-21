class Game {
  board;
  selectedItem;
  homeLocations = [{x:3, y:0},{x:5, y:5},{x:5, y:15},{x:3, y:20},{x:0, y:15},{x:0, y:5}];
  resourceLocations = [{x:1, y:1},{x:4, y:1},{x:1, y:19},{x:4, y:19},{x:0, y:10},{x:6, y:10}];
  pathTileTypes = [TileType.CORNER, TileType.STRAIGHT, TileType.SIXWAY, TileType.SPLIT, TileType.UTURN, TileType.TRIDENT];
  tileLocations = [
    {x:2, y:1},{x:3, y:1},
    {x:2, y:2},{x:3, y:2},{x:4, y:2},
    {x:1, y:3},{x:2, y:3},{x:3, y:3},{x:4, y:3},
    {x:1, y:4},{x:2, y:4},{x:3, y:4},{x:4, y:4},{x:5, y:4},
    {x:1, y:5},{x:2, y:5},{x:3, y:5},{x:4, y:5},
    {x:1, y:6},{x:2, y:6},{x:3, y:6},{x:4, y:6},{x:5, y:6},
    {x:0, y:7},{x:1, y:7},{x:2, y:7},{x:3, y:7},{x:4, y:7},{x:5, y:7},
    {x:1, y:8},{x:2, y:8},{x:3, y:8},{x:4, y:8},{x:5, y:8},
    {x:0, y:9},{x:1, y:9},{x:2, y:9},{x:3, y:9},{x:4, y:9},{x:5, y:9},
    {x:1, y:10},{x:2, y:10},{x:4, y:10},{x:5, y:10},
    {x:0, y:11},{x:1, y:11},{x:2, y:11},{x:3, y:11},{x:4, y:11},{x:5, y:11},
    {x:1, y:12},{x:2, y:12},{x:3, y:12},{x:4, y:12},{x:5, y:12},
    {x:0, y:13},{x:1, y:13},{x:2, y:13},{x:3, y:13},{x:4, y:13},{x:5, y:13},
    {x:1, y:14},{x:2, y:14},{x:3, y:14},{x:4, y:14},{x:5, y:14},
    {x:1, y:15},{x:2, y:15},{x:3, y:15},{x:4, y:15},
    {x:1, y:16},{x:2, y:16},{x:3, y:16},{x:4, y:16},{x:5, y:16},
    {x:1, y:17},{x:2, y:17},{x:3, y:17},{x:4, y:17},
    {x:2, y:18},{x:3, y:18},{x:4, y:18},
    {x:2, y:19},{x:3, y:19},
  ];
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
         homeTile.setHomeType(robot);
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
    return this.homeLocations[val-1];
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
    tileClone.setHomeType(tile2Copy.homeType);
    return tileClone;
  }
  
  initGame() {
    console.log("Initialize Board");
    this.selectedItem = null;
    this.board = new Map([]);
    //init players
    this.players = [];
    this.activePlayer = 0;
    
    //init board
    for (let y = 0; y < 22; y++) {
      for (let x = 0; x < 9; x++) {
        if (this.homeLocations.some(home => home.x == x && home.y == y)) {
          this.setTile(x,y, new Tile(x,y, false, TileType.HOME));
        } else if (this.resourceLocations.some(resource => resource.x == x && resource.y == y)) {
          this.setTile(x,y, new Tile(x,y, false, TileType.RESOURCE));
        } else if (this.tileLocations.some(tile => tile.x == x && tile.y == y)) {
          this.setTile(x,y, new Tile(x,y, false, TileType.EMPTY));
        } else {
          this.setTile(x,y, new Tile(x,y, false, TileType.INVALID));
        }
      }
    }

    //temp for testing
    this.addNewPlayer("TEST", 1, RobotType.ROBOT1);
    this.setTile(3,2, new Tile(3,2, false, TileType.CORNER, true, 3));
    this.setTile(3,3, new Tile(3,3, false, TileType.SIXWAY, true, 3));
    this.setTile(2,3, new Tile(2,3, false, TileType.CORNER, true, 6));
    this.setTile(2,4, new Tile(2,4, false, TileType.SPLIT, true, 6));
    this.setTile(2,5, new Tile(2,5, false, TileType.TRIDENT, true, 6));
    this.setTile(3,4, new Tile(3,4, false, TileType.UTURN, true, 6));
    this.setTile(3,6, new Tile(3,6, false, TileType.STRAIGHT, true, 6));
    this.setTile(2,7, new Tile(2,7, false, TileType.CORNER, true, 3));

  }

  setSelectedItem(item) {
    if (item != null) {
      if (item instanceof Tile) {
        this.selectedItem = (this.pathTileTypes.includes(item.type)) ? item : null;
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
      if (this.pathTileTypes.includes(this.selectedItem.type)) {
        this.selectedItem.direction += rotateClockwise ? 1 : -1;
      }
    }
  }

  flipSelectedTile() {
    if (this.selectedItem && this.selectedItem instanceof Tile) {
      if (this.pathTileTypes.includes(this.selectedItem.type)) {
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

  getCurrentPathsTrace() {
    loadCurrentPaths();
    return this.currentPathsTrace;
  }

  loadCurrentPaths() {
    this.currentPathsTrace = [[{x:4,y:5},{x:8,y:9}]];
    if (this.selectedItem && this.selectedItem instanceof Player && this.selectedItem.isMoving) {
      console.log("Moving Player");
    }
  }
}
