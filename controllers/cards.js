const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() =>
      res.status(400).send({ message: "Переданы некорректные данные" })
    );
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.likeCard = (req, res) => {
  try {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
      (err, card) => {
        if (err) {
          throw new Error("Ошибка при лайке карточки");
        }
        res.status(200).send(card);
      }
    );
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports.dislikeCard = (req, res) => {
  try {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
      (err, card) => {
        if (err) {
          throw new Error("Ошибка при дизлайке карточки");
        }
        res.status(200).send(card);
      }
    );
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
