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
  flipped = false;
  isDebris = true;
  direction = 1; //1-6 directions
  homeType = -1; //1-6
  resourceType = -1; //1-6

  constructor(x, y, flipped = false, type = TileType.EMPTY, isDebris = true) {
    super(x,y);
    this.flipped = flipped;
    this.type = type;
    this.isDebris = isDebris;
    this.direction = Math.floor(Math.random()*6)+1; //TODO: Remove
    if (this.type == TileType.EMPTY) {
       switch(Math.floor(Math.random()*7)) { //TODO: Remove
           case 0:
             this.type = TileType.EMPTY;
             break;
          case 1:
            this.type = TileType.STRAIGHT;
            this.flipped = Math.random() < 0.5;
            this.isDebris = Math.random() < 0.5;
             break;
          case 2:
            this.type = TileType.SPLIT;
            this.flipped = Math.random() < 0.5;
            this.isDebris = Math.random() < 0.5;
             break;
          case 3:
            this.type = TileType.TRIDENT;
            this.flipped = Math.random() < 0.5;
            this.isDebris = Math.random() < 0.5;
             break;
          case 4:
            this.type = TileType.SIXWAY;
            this.flipped = Math.random() < 0.5;
            this.isDebris = Math.random() < 0.5;
             break;
          case 5:
            this.type = TileType.UTURN;
            this.flipped = Math.random() < 0.5;
            this.isDebris = Math.random() < 0.5;
             break;
          case 6:
            this.type = TileType.CORNER;
            this.flipped = Math.random() < 0.5;
            this.isDebris = Math.random() < 0.5;
             break;
        }
    }
  }
}
