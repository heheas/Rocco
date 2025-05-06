public class Game {
  let homeLocations = [{x:1, y:2}];
  let resourceLocations = [{x:1, y:2}];
  let tileLocations = [{x:1, y:2}];

  let board = [];
  constructor() {
    initGame();
  }

  initGame() {
    for (let y = 0; x < 11; x++) {
      board[y] = [];
      for (let x = 0; y < 11; y++) {
        if (homeLocations.some(home => home.x == x && home.y == y)) {

        } else if (resourceLocations.some(resource => resource.x == x && resource.y == y) {

        } else if (tileLocations.some(tile => tile.x == x && tile.y == y)) {

        } else {
          
        }
      }
    }
  }
}
