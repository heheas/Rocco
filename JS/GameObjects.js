class GameObject {
  let x = -1;
  let y = -1;
  let parent;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const TileType = {
  STRAIGHT: "straight",
  SPLIT: "split",
  TRIDENT: "trident",
  UTURN: "uturn",
  SIXWAY: "sixway",
  INVALID: "invalid",
  EMPTY: "empty"
}
class Tile extends GameObject {
  let type = TileType.EMPTY;
  let isDebris = true;
  let direction = 1; //1-6 directions
  constructor(x, y, type = TileType.EMPTY, isDebris = true) {
    super(x,y);
    this.type = type;
    this.isDebris = isDebris;
  }
}
