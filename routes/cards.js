const router = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/cards", getCards);
router.post("/cards", createCard);
router.delete("/cards", deleteCard);
router.put("/cards", likeCard);
router.delete("/cards", dislikeCard);

module.exports = router;
