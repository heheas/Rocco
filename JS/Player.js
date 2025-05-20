public Player {
  name = "";
  homeLocation = "";
  skillLevels = {move:2, build:2, alter:2, remove:2};
  handCards = [];
  draftedCards = {p1:null, p2:null, extra:null};
  storage = {resources: [], tiles: []};

  constructor(name, homeLocation) {
    this.name = name;
    this.homeLocation = homeLocation;
  }

  changeName(name) {
    this.name = name;
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
