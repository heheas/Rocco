using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Rocco {
    public class GameState : MonoBehaviour
    {
        //84 Total Tile Spots
        //6 Home Tile Spots
        //6 Resource Spots
        public GameObject HexTile;
        public float multiplier = 0.1094f;
        public float offsetX = -2;
        public float offsetZ = 10;

        public float normalizationValue = 1;

        private Vector3 size;
        private PathTile[,] pathTiles = new PathTile[11,11];
        // Start is called before the first frame update
        void Start()
        {
            AddPathTile(1,1);
            // size = GetComponent<MeshRenderer>().bounds.size;

            // for (float level = 2; level < 12; level++) {
            //     for (float i = 0; i < level; i++) {
            //         GameObject newTile = Instantiate(HexTile);
            //         Vector3 tileSize = newTile.GetComponent<MeshRenderer>().bounds.size;
            //         newTile.transform.position = new Vector3(transform.position.x + (offsetX*(tileSize.x/2)) + (i*tileSize.x*2), transform.position.y + size.y/2, transform.position.z + (offsetZ*(tileSize.z/2)) );
            //     }
            // }
        }

        // Update is called once per frame
        void Update()
        {

        }

        public bool AddPathTile(int x, int z) {
            if (pathTiles[x,z] != null) {
                return false;
            } else {
                GameObject newTile = Instantiate(HexTile);
                     Vector3 tileSize = newTile.GetComponent<MeshRenderer>().bounds.size;
                     newTile.transform.position = new Vector3(normalizationValue*(transform.position.x + tileSize.x*x - tileSize.x/4), (transform.position.y + GetComponent<MeshRenderer>().bounds.size.y/2), normalizationValue*(transform.position.z + tileSize.z*z - tileSize.z/4));
            //         newTile.transform.position = new Vector3(transform.position.x + (offsetX*(tileSize.x/2)) + (i*tileSize.x*2), transform.position.y + size.y/2, transform.position.z + (offsetZ*(tileSize.z/2)) );
                pathTiles[x,z] = new PathTile {
                    tile = newTile
                };
                return true;
            }
        }
    }
}