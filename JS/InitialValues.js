class InitVals {
  static homeLocations = [{x:3, y:0},{x:5, y:5},{x:5, y:15},{x:3, y:20},{x:0, y:15},{x:0, y:5}];
  static resourceLocations = [{x:1, y:1},{x:4, y:1},{x:1, y:19},{x:4, y:19},{x:0, y:10},{x:6, y:10}];
  static pathTileTypes = [TileType.CORNER, TileType.STRAIGHT, TileType.SIXWAY, TileType.SPLIT, TileType.UTURN, TileType.TRIDENT];
  static tileLocations = [
    {x:2, y:1},{x:3, y:1},
    {x:2, y:2},{x:3, y:2},{x:4, y:2},
    {x:1, y:3},{x:2, y:3},{x:3, y:3},{x:4, y:3},
    {x:1, y:4},{x:2, y:4},{x:3, y:4},{x:4, y:4},{x:5, y:4},
    {x:1, y:5},{x:2, y:5},{x:3, y:5},{x:4, y:5},
    {x:1, y:6},{x:2, y:6},{x:3, y:6},{x:4, y:6},{x:5, y:6},
    {x:0, y:7},{x:1, y:7},{x:2, y:7},{x:3, y:7},{x:4, y:7},{x:5, y:7},
    {x:1, y:8},{x:2, y:8},{x:3, y:8},{x:4, y:8},{x:5, y:8},
    {x:0, y:9},{x:1, y:9},{x:2, y:9},{x:3, y:9},{x:4, y:9},{x:5, y:9},
    {x:1, y:10},{x:2, y:10},{x:4, y:10},{x:5, y:10},
    {x:0, y:11},{x:1, y:11},{x:2, y:11},{x:3, y:11},{x:4, y:11},{x:5, y:11},
    {x:1, y:12},{x:2, y:12},{x:3, y:12},{x:4, y:12},{x:5, y:12},
    {x:0, y:13},{x:1, y:13},{x:2, y:13},{x:3, y:13},{x:4, y:13},{x:5, y:13},
    {x:1, y:14},{x:2, y:14},{x:3, y:14},{x:4, y:14},{x:5, y:14},
    {x:1, y:15},{x:2, y:15},{x:3, y:15},{x:4, y:15},
    {x:1, y:16},{x:2, y:16},{x:3, y:16},{x:4, y:16},{x:5, y:16},
    {x:1, y:17},{x:2, y:17},{x:3, y:17},{x:4, y:17},
    {x:2, y:18},{x:3, y:18},{x:4, y:18},
    {x:2, y:19},{x:3, y:19},
  ];
  static pathBagSetup = [
    { 
      type: TileType.CORNER,
      debrisCount: 12,
      pitfallCount: 7,
      directional: 3
    },
    {
      type: TileType.STRAIGHT,
      debrisCount: 11,
      pitfallCount: 6,
      directional: 4
    },
    { 
      type:  TileType.SIXWAY,
      debrisCount: 4,
      pitfallCount: 5,
      directional: 0
    },
    { 
      type:  TileType.SPLIT,
      debrisCount: 16,
      pitfallCount: 8,
      directional: 3
    },
    { 
      type:  TileType.UTURN,
      debrisCount: 10,
      pitfallCount: 5,
      directional: 0
    },
    { 
      type:  TileType.TRIDENT
      debrisCount: 10,
      pitfallCount: 5,
      directional: 3
    }
  ];
}
