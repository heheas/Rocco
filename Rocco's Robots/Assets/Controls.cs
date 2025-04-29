using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Rocco {
public class Controls : MonoBehaviour
{
    public GameObject gameBoard;
    public GameObject toCreate;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void Click() {
        gameBoard.GetComponent<GameState>().AddPathTile(0,0);
    }
}

}