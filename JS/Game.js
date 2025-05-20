class Game {
  board;
  selectedItem;
  homeLocations = [{x:3, y:0},{x:5, y:5},{x:5, y:15},{x:3, y:20},{x:0, y:15},{x:0, y:5}];
  resourceLocations = [{x:1, y:1},{x:4, y:1},{x:1, y:19},{x:4, y:19},{x:0, y:10},{x:6, y:10}];
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


  constructor() {
    this.initGame();
  }

  getPlayers() {
    return this.players;
  }

  addNewPlayer(name, homeLocation, robot) {
    var newPlayer = new Player(name, homeLocation, robot);
    this.addPlayer(newPlayer);
  }
  
  addPlayer(player) {
    this.players.push(player);
  }
  
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
    return tileClone;
  }
  
  initGame() {
    console.log("Initialize Board");
    this.board = new Map([]);
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
    this.setTile(4,4, new Tile(4,4, false, TileType.CORNER, true));
  }

  setSelectedItem(item) {
    if (item != null) {
      if (item instanceof Tile) {
        this.selectedItem = item.type != TileType.INVALID ? item : null;
      } else {
        this.selectedItem = item;
      }
    } else {    
      this.selectedItem = null;
    }
  }

  selectTile(x, y) {
    this.setSelectedItem(this.getTile(x,y)); 
  }

  moveSelectedTile(newX, newY) {
    if (this.selectedItem && this.selectedItem instanceof Tile) {
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
      if ([TileType.CORNER, TileType.STRAIGHT, TileType.RESOURCE, TileType.SIXWAY, TileType.SPLIT, TileType.UTURN, TileType.TRIDENT].includes(this.selectedItem.type)) {
        this.selectedItem.direction += rotateClockwise ? 1 : -1;
      }
    }
  }

  flipSelectedTile() {
    if (this.selectedItem && this.selectedItem instanceof Tile) {
      if ([TileType.CORNER, TileType.STRAIGHT, TileType.RESOURCE, TileType.SIXWAY, TileType.SPLIT, TileType.UTURN, TileType.TRIDENT].includes(this.selectedItem.type)) {
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
}
