const express = require("express");
const app = express();
const { PORT = 3000, BASE_PATH } = process.env;
const mongoose = require("mongoose");
const dbUrl = "mongodb://localhost:27017/mestodb";
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
