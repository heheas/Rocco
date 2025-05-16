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
  EMPTY: "empty"
}

const HomeType = {
  ROBOT1: "robot1",
  ROBOT2: "robot2",
  ROBOT3: "robot3",
  ROBOT4: "robot4",
  ROBOT5: "robot5",
  ROBOT6: "robot6",
}

const ResourceType = {
  CRYSTAL: "crystal",
  FAUNA: "fauna",
  MAGNETIC_ORE: "magnetic_ore",
  NEBULA_CRYSTAL: "nebula_crystal",
  NUTRIENT_PODS: "nutrient_pods",
  PLASMA_NODE: "plasma_node"
}

class Tile extends GameObject {
  type = TileType.EMPTY;
  isDebris = true;
  direction = 1; //1-6 directions
  homeType = -1; //1-6
  resourceType = -1; //1-6

  constructor(x, y, type = TileType.EMPTY, isDebris = true) {
    super(x,y);
    this.type = type;
    this.isDebris = isDebris;
    this.direction = Math.floor(Math.random()*6)+1; //TODO: Remove
    this.type = switch(Math.floor(Math.random()*7)) { //TODO: Remove
      case 0:
        return TileType.EMPTY;
      case 1:
        return TileType.STRAIGHT;
      case 2:
        return TileType.SPLIT;
      case 3:
        return TileType.TRIDENT;
      case 4:
        return TileType.SIXWAY;
      case 5:
        return TileType.UTURN;
      case 6:
        return TileType.CORNER;
    }
  }
}
