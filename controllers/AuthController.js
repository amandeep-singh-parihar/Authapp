const User = require("../models/user.model"); // import the User model
const bcrypt = require("bcrypt"); // import the bcrypt library for the encryption

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

        // Now all checks have passed now we can create the user with the give data
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
