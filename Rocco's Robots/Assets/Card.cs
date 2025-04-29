namespace Rocco {
    public enum CardCategory {
        ACTION, PERK, UPGRADE, SPECIAL_ACTION
    }
    public enum CardType {
        Card1, Card2
    }
    public enum DraftStatus {
        INHAND, DRAFTING, ACTIVE
    }

    public class Card {
        private CardType _type = CardType.Card1;
        private CardCategory _category = CardCategory.ACTION;
        private DraftStatus _draftStatus = DraftStatus.INHAND;

        public Card(CardType type, CardCategory category) {
            initializeCard(type, category);
        }

        private void initializeCard(CardType type, CardCategory category) {
            setType(type);
            setCategory(category);
        }

        /* Getters and Setters */
        public void setType(CardType type) {
            this._type = type;
        }
        public CardType getType() {
            return this._type;
        }
        public void setCategory(CardCategory category) {
            this._category = category;
        }
        public CardCategory getCategory() {
            return this._category;
        }

        /* Card Processing */
        public void processCard<T>(ref T obj) {
            switch(this._type) {
                case CardType.Card1:
                break;
                case CardType.Card2:
                break;
                default:
                break;
            }
        }
    }
}