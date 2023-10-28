const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
} = require("../controllers/users");

router.get("/users", auth, getUsers);
router.get("/users/:userId", auth, getUser);
router.post("/signup", createUser);
router.post("/signin", login);
router.patch("/users/me", auth, updateUser);
router.patch("/users/me/avatar", auth, updateUserAvatar);

module.exports = router;
