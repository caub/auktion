const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const users = require('./routes/users');
const config = require('./config/database');

mongoose.connect(config.database);

mongoose.connection.on("error", (err) => {
  console.log("Database error: "+err);
})
// app setup


const app = express();

const port = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

app.use("/users", users);

require("./config/passport")(passport);

app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req,res) =>{
  res.send("Invalid Endpoint")
})

app.get("*", (req,res) => {
  res.sendFile(path.join(__dirname, "public/index.html"))
})

app.listen(port, () => {
  console.log("Server started on port "+ port);
})
