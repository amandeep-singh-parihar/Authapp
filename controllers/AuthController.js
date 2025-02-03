const User = require("../models/user.model");
const bcrypt = require("bcrypt");

// signup handler
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existing_user = await User.findOne({ email });
        if (existing_user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        //secure password
        let hashed_Password;
        try {
            hashed_Password = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing the password",
            });
        }

        //create entry  for user
        const user = await User.create({
            name,
            email,
            password: hashed_Password,
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
