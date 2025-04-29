
using UnityEngine;

namespace Rocco {
    public class ResourceTask {
        private ResourceType _resourceTask;
        private GameObject resource;
        public ResourceTask(ResourceType resourceTask) {
            setResourceTask(resourceTask);
        }

        private void setResourceTask(ResourceType resourceTask) {
            this._resourceTask = resourceTask;
        }

        public ResourceType getResourceTask() {
            return this._resourceTask;
        }

        public bool isTaskComplete() {
            //if (resource != null && resource.GetComponent<>().type == getResourceTask()) {
             //   return true;
            //} else {
                return false;
            //}
        }
    }
}