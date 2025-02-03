const express = require("express"); // import the express
const app = express(); // use the express application

require("dotenv").config(); // import the dotenv config which load all the data in .env into process object
const PORT = process.env.PORT || 3000;

app.use(express.json());

// const DBconnect = require("./config/database");
// DBconnect();

// We can use the upper one also but this one is more short
require("./config/database").DBconnect();

const user = require("./routes/user.route"); // importing the routes
app.use("/api/v1", user); // mounts the routes with the /api/v1 url

app.listen(PORT, () => {
    console.log("App is listing at PORT NO : " + PORT);
});

// default route
app.get("/",(req,res)=>{
    res.send(`<h1>good</h1>`)
})