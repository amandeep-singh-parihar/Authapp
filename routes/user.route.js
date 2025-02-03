const expres = require("express"); // import the express
const router = expres.Router(); // import the express Router

const { login, signup } = require("../controllers/AuthController"); // importing the signup handler from the controllers
const { auth, isStudent, isAdmin } = require("../middlewares/auth");

// the controllers (route handlers) mapper with the specific url
router.post("/login", login);
router.post("/signup", signup);

//test route for auth
router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message: "Welcoming to the Testing route",
    });
});

// Protected route for student
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route",
    });
});

// Protected route for admin
router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route",
    });
});

// exporting the router
module.exports = router;
