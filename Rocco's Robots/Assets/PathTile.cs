using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Rocco {
    enum PathType
    {
        STRAIGHT, UTURN, NINETY, SPLIT, FORK, SIXWAY
    }

    enum PathBack {
        DEBRIS, PITFALL
    }

    public class PathTile
    {
        public GameObject tile;
        PathType type = PathType.STRAIGHT;
        PathBack back = PathBack.DEBRIS;
        int orientation = 1;
        
    }
}