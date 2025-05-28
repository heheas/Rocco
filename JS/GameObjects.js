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
  LAB: "lab",
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
  ROBOT1: "rgb(159 131 70)",
  ROBOT2: "rgb(44 62 107)",
  ROBOT3: "rgb(59 56 96)",
  ROBOT4: "rgb(137 66 58)",
  ROBOT5: "rgb(39 81 55)",
  ROBOT6: "rgb(122 79 41)",
  NOTSET: "yellow",
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
  direction = 0; //0-5 directions
  homeType = RobotType.NOTSET;
  resourceType = ResourceType.NOTSET;

  constructor(x, y, flipped = false, type = TileType.EMPTY, isDebris = true, direction = 0) {
    super(x,y);
    this.flipped = flipped;
    this.type = type;
    this.isDebris = isDebris;
    this.direction = direction;
	this.homeLocation = 0;
  }

  setHome(homeLocation, homeType) {
    this.homeLocation = homeLocation;
	this.homeType = homeType;
  }

  setDirection(direction) {
    this.direction = direction;
  }
  
  rotateDirection(rotateClockwise) {
	  if (this.direction == 0 && !rotateClockwise) {
		  this.direction = 5;
	  } else if (this.direction == 5 && rotateClockwise) {
		  this.direction = 0;
	  } else {
		  this.direction += !rotateClockwise ? -1 : 1;
	  }
  }
  
  normHomePoint(pt) {
	return pt + (this.homeLocation-1) > 5 ? pt + (this.homeLocation-1) - 6 : pt + (this.homeLocation-1);
  }
  getPathPoints() { //returns pathPoints relative to the current tile position
	  //x is if y is odd check same  x     for left, x + 1 for right
	  //        y is even check same x - 1 for left, x     for right
	  var xMod = this.y % 2 == 0 ? 0 : 1;
	  //directionPoints are the points around 
	  //the tile starting with directly above and moving clockwise
	  var directionPoints = [
	  {x:this.x,y:this.y-2}, //good
	  {x:this.x+xMod,y:this.y-1}, //good
	  {x:this.x+xMod, y:this.y+1}, //good
	  {x:this.x,y:this.y+2}, //good
	  {x:this.x-1+xMod,y:this.y+1},
	  {x:this.x-1+xMod,y:this.y-1}
	  ];
	  
	  var pathPoints = [];
	  if (!this.flipped) {
		  switch(this.type) {
			  case TileType.STRAIGHT:
				pathPoints = [0,3];
				break;
			  case TileType.CORNER:
				pathPoints = [1,3];
				break;
			  case TileType.SPLIT:
				pathPoints = [1,3,5];
				break;
			  case TileType.TRIDENT:
				pathPoints = [0,1,3,5];
				break;
			  case TileType.UTURN:
				pathPoints = [3,4];
				break;
			  case TileType.SIXWAY:
			  case TileType.LAB:
				pathPoints = [0,1,2,3,4,5,6];
				break;
			  case TileType.HOME:
				pathPoints = [this.normHomePoint(2), this.normHomePoint(3), this.normHomePoint(4)];
				break;
			  default:
				pathPoints = [];
				break;
		  }
	  } else {
		  if (this.isDebris) {
			pathPoints = [0,1,2,3,4,5,6];
		  }
	  }
	  
	  var points = Array.from(pathPoints.map((id) => directionPoints[id + this.direction > 5 ? id + this.direction - 6 : id + this.direction]));
	  return points;
  }
}
