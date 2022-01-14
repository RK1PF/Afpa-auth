//jshint esversion:6
require('dotenv').config();
const cors = require('cors');
// Mongoose core
const MongoDBClient = require("./mongoClient");

// Express core
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 987;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
// Routes
app.get("/", (req, res) => {
    res.render("home");
});
app.get("/logout", (req,res) =>{
    console.log("logged out");
    res.render("home");
})


// API rest
const User = require("./controllers/UserController");

app.get("/api/middleware", User.authenticateToken, (req,res)=>{

})
// test du token
app.get('/api/orders', User.authenticateToken , function(req, res) {
    console.log("OK TU PASSES!!");
      res.send('ok');
})
app
    .route("/admin")
    .get(User.getAdmin)
    .post(User.postAdmin)
    .delete(User.deleteAdmin)

app
    .route("/register")
    .get(User.getRegister)
    .post(User.postRegister)

app
    .route("/login")
    .get(User.getLogin)
    .post(User.postLogin)

// Server
app.listen(PORT, () => {
    console.log(`Server up on http://localhost:${PORT}`);
    MongoDBClient.init();
});
