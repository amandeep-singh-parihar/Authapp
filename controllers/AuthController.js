const User = require("../models/user.model"); // import the User model
const bcrypt = require("bcrypt"); // import the bcrypt library for the encryption
const jwt = require("jsonwebtoken"); // import the json web token
require("dotenv").config(); // import the dotenv, which will load all the data from .env into process object

// Signup handler, this will invoke when anyone hit the route it is mapped with
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // retriving name, email, password, role from the body
        const existing_user = await User.findOne({ email }); // finding on the basis of email using findOne function
        /* 
            Model.findOne(query, [projection], [options], [callback])
            -> query: The search condition (e.g., { email: "test@example.com" }).
            -> projection (optional): Specifies which fields to return ({ name: 1, email: 1 } returns only name and email).
            -> options (optional): Additional settings like sorting ({ sort: { createdAt: -1 } }).
            -> callback (optional): A function to handle the result ((err, doc) => {}).
        */
        if (existing_user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        // Make the password hashed using the bcrypt library.
        let hashed_Password;
        try {
            hashed_Password = await bcrypt.hash(password, 10);
            // here password is the plain text that needs to be hashed. And 10 is the salt rounds.
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing the password",
            });
        }

        // Now all checks have passed now we can create the user with the given data
        const user = await User.create({
            name,
            email,
            password: hashed_Password, // we put the value of password as hashed password
            role,
        });

        res.status(200).json({
            success: true,
            // data: user,
            message: "User created successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error while signup",
        });
    }
};

// login handler, this will invoke when anyone hit the route it is mapped with
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; // extracting the email and password from the req body
        if (!email || !password) {
            // if the email and password dosn't exist
            return res.status(400).json({
                success: false,
                message: "Please fill all the details !",
            });
        }
        // check for registered user on the basis of email
        let user = await User.findOne({ email });
        // if the user is not registered
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered",
            });
        }

        // The payload typically contains user-related data, but you can include any information that makes sense for your application.
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };

        // verify password & generate a JWT token using the compare function of bcrypt library
        // the compare function take the (password) field that user will put and the (user.password) which is in the database
        if (await bcrypt.compare(password, user.password)) { // password matched

            /*
            The jwt.sign() function in Node.js (from the jsonwebtoken package) creates a JSON Web Token (JWT) based on the given payload, secret key, and options.
            jwt.sign(payload, secretOrPrivateKey, [options], [callback])
            */
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            // Convert user to plain object
            let userObj = user.toObject();
            userObj.token = token;
            userObj.password = undefined; // Remove password for security purpose

            // user.token = token; // can't be done because Mongoose documents have special behavior that prevents new properties from being added dynamically unless they are defined in the schema.
            // user.password = undefined; // it is possible as password is defined in the schema

            const options = {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Expires in 3 days
                httpOnly: true, // Cookie cannot be accessed by JavaScript
            };

            /*
            Creates a cookie named "token" and assigns it the JWT token value.
            Uses the options object to configure expiration and security settings.
            res.cookie(name, value, options) <syntax>
            */
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user: userObj,
                message: "User Logged in successfully",
            });
            
        } else {
            // password do not matched
            return res.status(403).json({
                success: false,
                message: "Password Incorrect",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error while login",
        });
    }
};
