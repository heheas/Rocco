namespace Rocco {
    public enum ResourceType {
        ENERGY_CRYSTAL, PLASMA_NODE, MAGNETIC_ORE, FAUNA, NEBULA_CRYSTAL, NUTRIENT_PODS
    }
    public class Resource {
        private ResourceType _type = ResourceType.ENERGY_CRYSTAL;

        public Resource(ResourceType type) {
            setType(type);  
        }

        public void setType(ResourceType type) {
            this._type = type;
        }
        public ResourceType getType() {
            return this._type;
        }
    }
}