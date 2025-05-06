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
  INVALID: "invalid"
}
class Tile extends GameObject {
  let type = TileType.INVALID;
  let isDebris = true;
  constructor(x, y, type = TileType.INVALID, isDebris = true) {
    super(x,y);
    this.type = type;
    this.isDebris = isDebris;
  }
}
