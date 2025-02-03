const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// const DBconnect = require("./config/database");
// DBconnect();

// We can use the upper one also but this one is more short
require("./config/database").DBconnect();

const user = require("./routes/user.route");
app.use("/api/v1", user);

app.listen(PORT, () => {
    console.log("App is listing at PORT NO : " + PORT);
});

app.get("/",(req,res)=>{
    res.send(`<h1>good</h1>`)
})