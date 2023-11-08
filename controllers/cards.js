const mongoose = require("mongoose");
const httpConstants = require("http2").constants;

const Card = require("../models/card");
const BadRequestError = require("../errors/BadRequest");
const NotFoundError = require("../errors/NotFound");
const ForbiddenError = require("../errors/Forbidden");

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка не найдена");
      }

      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError("Нет доступа для удаления карточки");
      }
      Card.deleteOne(card)
        .then(() => {
          res
            .status(httpConstants.HTTP_STATUS_OK)
            .send({ message: "Карточка удалена" });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError("Карточка не найдена"));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof TypeError) {
        next(new NotFoundError("Карточка не найдена"));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(httpConstants.HTTP_STATUS_OK).send(cards))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError("Карточка не найдена"));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError("Карточка не найдена"));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};
