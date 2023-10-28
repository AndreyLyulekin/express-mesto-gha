const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/cards", auth, getCards);
router.post("/cards", auth, createCard);
router.delete("/cards", auth, deleteCard);
router.put("/cards", auth, likeCard);
router.delete("/cards", auth, dislikeCard);

module.exports = router;
