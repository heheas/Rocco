class Player extends GameObject {
  robot = RobotType.NOTSET;
  homeLocation = "";
  skillLevels = {move:2, build:2, alter:2, remove:2};
  handCards = [];
  draftedCards = {p1:null, p2:null, extra:null};
  storage = {resources: [], tiles: []};
  isMoving = true
  energy = 1;

  constructor(id = "", x, y, name = "", homeLocation, robot) {
    super(id, x,y);
    this.name = name;
    this.homeLocation = homeLocation;
    this.robot = robot;
  }

  changeName(name) {
    this.name = name;
  }
  
  getRobot() {
    return this.robot;
  }
  
  getMovement() {
	  return this.energy * this.skillLevels.move;
  }
  
  addEnergy(val) {
	  console.log("adding energy");
	  this.energy += val;
  }
  
  //Skill Upgrades
  upgradeMove() {
    skillLevels.move++;
  }
  downgradeMove() {
    skillLevels.move--;
  }

  upgradeBuild() {
    skillLevels.build++;
  }
  downgradeBuild() {
    skillLevels.build--;
  }

  upgradeAlter() {
    skillLevels.alter++;
  }
  downgradeAlter() {
    skillLevels.alter--;
  }

  upgradeRemove() {
    skillLevels.remove++;
  }
  downgradeRemove() {
    skillLevels.remove--;
  }
}
