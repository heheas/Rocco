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

const RobotType = {
  ROBOT1: "robot1",
  ROBOT2: "robot2",
  ROBOT3: "robot3",
  ROBOT4: "robot4",
  ROBOT5: "robot5",
  ROBOT6: "robot6",
  NOTSET: "not_set",
}

const RobotColor = {
  ROBOT1: "yellow",
  ROBOT2: "red",
  ROBOT3: "green",
  ROBOT4: "orange",
  ROBOT5: "blue",
  ROBOT6: "purple",
  NOTSET: "black",
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
  homeType = RobotType.NOTSET;
  resourceType = ResourceType.NOTSET;

  constructor(x, y, flipped = false, type = TileType.EMPTY, isDebris = true) {
    super(x,y);
    this.flipped = flipped;
    this.type = type;
    this.isDebris = isDebris;
    this.direction = 1;
  }

  setHomeType(homeType) {
    this.homeType = homeType;
  }

  setDirection(direction) {
    this.direction = direction;
  }
}
