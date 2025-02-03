const mongoose = require("mongoose"); // import the mongoose
require("dotenv").config(); // import the dotenv config by which it loads all the data in the .env into the process object

// the function which connect the database. Here i am using exports directly by which no need of module.exports
exports.DBconnect = () => {
    mongoose
        .connect(process.env.DATABASE_URl, { // url of the database
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

// export the function
// module.exports = DBconnect;
