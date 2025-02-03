const mongoose = require("mongoose"); // import the mongoose

// define the userSchema as this is a signup page
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["Admin", "Student", "Visitor"], // by this the role only take 3 values
        },
    },
    { timestamps: true }
);

// exports the model by the name "User"
module.exports = mongoose.model("User", userSchema);
