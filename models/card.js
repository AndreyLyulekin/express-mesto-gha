// Одна из особенностей нереляционных баз данных — отсутствие схемы.
// Схема — набор требований к данным: сколько полей у записи,
// какой длины может быть значение каждого поля, какие символы в нём допустимы.
// Схема накладывает ограничения на данные, которые записаны в базу.
// Иногда это удобно, иногда нет. Современные NoSQL базы позволяют использовать
// схемы выборочно.
// В MongoDB нет поддержки схем по умолчанию, но мы можем добавить их через Mongoose.
//  Это нужно, чтобы проверять, соответствует ли документ схеме,
// прежде чем записывать его в БД. Фактически, мы сможем валидировать данные
// перед записью.
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  likes: {
    type: [ObjectId],
    required: true,
  },
  createdAt: {
    type: { type: Date, default: Date.now },
  },
});
module.exports = mongoose.model("card", cardSchema);

// const mongoose = require("mongoose");

// const { ObjectId } = mongoose.Schema.Types;

// const cardSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     minlength: 2,
//     maxlength: 30,
//   },
//   link: {
//     type: String,
//     required: true,
//   },
//   owner: {
//     type: ObjectId,
//     required: true,
//   },
//   likes: {
//     type: [ObjectId],
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("card", cardSchema);
