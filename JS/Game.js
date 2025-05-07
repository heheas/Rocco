class Game {
  homeLocations = [{x:6, y:0},{x:1, y:5},{x:11, y:5}, {x:1, y:16},{x:11, y:16},{x:6, y:20}];
  resourceLocations = [];
  tileLocations = [];

  board;

  constructor() {
    this.initGame();
  }

  getBoardState() {
    return this.board;
  }

  getTile(x,y) {
    return this.board.get("[" + x + "," + y + "]");
  }
  
  initGame() {
    console.log("Initialize Board");
    this.board = new Map([]);
    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 7; x++) {
        if (this.homeLocations.some(home => home.x == x && home.y == y)) {
          this.board.set("[" + x + "," + y + "]", new Tile(x,y, TileType.HOME));
        } else if (this.resourceLocations.some(resource => resource.x == x && resource.y == y)) {
          this.board.set("[" + x + "," + y + "]", new Tile(x,y, TileType.RESOURCE));
        } else if (this.tileLocations.some(tile => tile.x == x && tile.y == y)) {
          this.board.set("[" + x + "," + y + "]", new Tile(x,y, TileType.EMPTY));
        } else {
          this.board.set("[" + x + "," + y + "]", new Tile(x,y, TileType.INVALID));
        }
      }
    }
  }
}
