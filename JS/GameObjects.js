class GameObject {
  x = -1;
  y = -1;
  parent;

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
  HOME: "home",
  RESOURCE: "resource",
  INVALID: "invalid",
  EMPTY: "empty"
}

class Tile extends GameObject {
  type = TileType.EMPTY;
  isDebris = true;
  direction = 1; //1-6 directions

  constructor(x, y, type = TileType.EMPTY, isDebris = true) {
    super(x,y);
    this.type = type;
    this.isDebris = isDebris;
  }
}
