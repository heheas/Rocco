class Game {
  homeLocations = [{x:3, y:0},{x:0, y:5},{x:5, y:5}, {x:0, y:15},{x:5, y:15},{x:3, y:21}];
  resourceLocations = [{x:1, y:1},{x:4, y:1},{x:1, y:11},{x:4, y:11},{x:0, y:6},{x:6, y:6}];
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
    {x:1, y:10},{x:2, y:10},{x:3, y:10},{x:4, y:10},{x:5, y:10},
    {x:0, y:11},{x:1, y:11},{x:2, y:11},{x:3, y:11},{x:4, y:11},{x:5, y:11},
    {x:1, y:12},{x:2, y:12},{x:3, y:12},{x:4, y:12},{x:5, y:12},
    {x:0, y:13},{x:1, y:13},{x:2, y:13},{x:3, y:13},{x:4, y:13},{x:5, y:13},
    {x:1, y:14},{x:2, y:14},{x:3, y:14},{x:4, y:14},{x:5, y:14},
    {x:1, y:15},{x:2, y:15},{x:3, y:15},{x:4, y:15},
    {x:1, y:16},{x:2, y:16},{x:3, y:16},{x:4, y:16},{x:5, y:16},
    {x:2, y:17},{x:3, y:17},{x:4, y:17},{x:5, y:17},
    {x:2, y:18},{x:3, y:18},{x:4, y:18},
  ];

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
    for (let y = 0; y < 22; y++) {
      for (let x = 0; x < 9; x++) {
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
