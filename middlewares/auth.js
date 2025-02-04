const jwt = require("jsonwebtoken"); // import the json web token
require("dotenv").config(); // import the dotenv config , which load all the data from the .env into the process object

// auth middleware for the authentication
exports.auth = (req, res, next) => {
    try {
        // console.log("cookie",req.cookies.token);
        // console.log("body",req.body.token);
        // console.log("header",req.header("Authorization"));

        // req.body.token-> extract JWT token from the body as we send it there in the body
        // req.cookies.token -> extract the tooken from the cookie using cookieParser
        // req.header("Authorization").replace("Bearer ","") -> key value pair where in the key I write Authorization and in value I write Bearer <token>
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");

        // if the body does not contain the token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing !",
            });
        }

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            /* The jwt.verify() function is used to decode and validate a JWT (JSON Web Token). It ensures that the token:
            1. Has not been tampered with (signature is valid).
            2. Has not expired (if expiresIn was set).


            syntax <   jwt.verify(<the jwt token you want to verify>,<The secret key used to sign the token (must match the one used in jwt.sign()>)    >
            
            */

            // console.log(decode);

            req.user = decode; // decode contains user details (e.g., id, email, role).
            // Attaching it to req.user allows other middlewares and route handlers to access the authenticated user without decoding the token again.
        } catch (err) {
            return res.status(401).json({ // code 401 -> Unauthorized
                success: false,
                message: "token is invalid",
            });
        }

        next(); // Moves to the next middleware or route
    } catch (error) {
        return res.status(401).json({ // code 401 -> Unauthorized
            success: false,
            error: "Something went wrong, while verifying the token",
        });
    }
};

// isStudent middleware for authorization
exports.isStudent = (req, res, next) => {
    try {
        // Now req.user contains the decoded token
        if (req.user.role != "Student") {
            return res.status(401).json({ // 401 Unauthorized
                success: false,
                message: "This is a protected route for students",
            });
        }
        next(); // Move to the next middleware or route handler
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User Role is not matching",
        });
    }
};


// isAdmin middleware for authorization
exports.isAdmin = (req, res, next) => {
    try {
        // Now req.user contains the decoded token
        if (req.user.role != "Admin") {
            return res.status(401).json({ // 401 Unauthorized
                success: false,
                message: "This is a protected route for admin",
            });
        }
        next(); // Move to the next middleware or route handler
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User Role is not matching",
        });
    }
};
