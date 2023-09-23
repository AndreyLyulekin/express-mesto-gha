const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
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
  const objectID = req.params.cardId;
  const validationRegExp = new RegExp(/\w{24}/gm);
  const isValidate = validationRegExp.test(objectID);
  if (!isValidate) {
    return res.status(400).send({ message: "Переданы некорректные данные" });
  }
  Card.findByIdAndRemove(objectID)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      res.send({ data: card });
    })
    .catch(() =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      res.send({ data: card });
    })
    .catch(() => res.status(400).send({ message: "Произошла ошибка" }));

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      res.send({ data: card });
    })
    .catch(() => res.status(400).send({ message: "Произошла ошибка" }));
