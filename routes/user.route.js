const expres = require("express"); // import the express
const router = expres.Router(); // import the express Router

const { login, signup } = require("../controllers/AuthController"); // importing the signup handler from the controllers

// the controllers (route handlers) mapper with the specific url
router.post("/login", login);
router.post("/signup", signup);

// exporting the router
module.exports = router;
