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
  CORNER: "corner",
  HOME: "home",
  RESOURCE: "resource",
  INVALID: "invalid",
  EMPTY: "empty",
}

const HomeType = {
  ROBOT1: "robot1",
  ROBOT2: "robot2",
  ROBOT3: "robot3",
  ROBOT4: "robot4",
  ROBOT5: "robot5",
  ROBOT6: "robot6",
  NOTSET: "not_set",
}

const ResourceType = {
  CRYSTAL: "crystal",
  FAUNA: "fauna",
  MAGNETIC_ORE: "magnetic_ore",
  NEBULA_CRYSTAL: "nebula_crystal",
  NUTRIENT_PODS: "nutrient_pods",
  PLASMA_NODE: "plasma_node",
  NOTSET: "not_set",
}

class Tile extends GameObject {
  type = TileType.EMPTY;
  flipped = false;
  isDebris = true;
  direction = 1; //1-6 directions
  homeType = HomeType.NOTSET;
  resourceType = ResourceType.NOTSET;

  constructor(x, y, flipped = false, type = TileType.EMPTY, isDebris = true) {
    super(x,y);
    this.flipped = flipped;
    this.type = type;
    this.isDebris = isDebris;
    this.direction = 1;
  }

  setHomeType(homeType) {
    console.log("New Home Tile: " + JSON.stringify(this));
    this.homeType = homeType;
  }
}
