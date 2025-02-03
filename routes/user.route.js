const expres = require("express");
const router = expres.Router();

const { login, signup } = require("../controllers/AuthController");

// router.post("/login", login);
router.post("/signup", signup);

module.exports = router;
