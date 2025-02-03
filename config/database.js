const mongoose = require("mongoose");
require("dotenv").config();

exports.DBconnect = () => {
    mongoose
        .connect(process.env.DATABASE_URl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("DB connection successfull");
        })
        .catch((err) => {
            console.error(err);
            console.log("Error while connecting to the database");
            process.exit(1);
        });
};