const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const app = express();
const User = require("./models/register");
const jwt = require("jsonwebtoken");
const verify = require("./routes/verifyToken");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client = new MongoClient(
  "mongodb+srv://arpit:iluvmuma@arpit-xcm5n.gcp.mongodb.net/test?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/ ", verify, (req, res, next) => {
  res.status(200).json({ token: "verified Token" });
});

app.post("/api/auth/reg2", verify, async (req, res) => {
  const query = { email: req.body.email };
  const exist = await client
    .db("users")
    .collection("userDetails")
    .findOne(query);
  if (exist) return res.status(400).send("Email ALready  exist");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  const result = client.db("users").collection("userDetails").insertOne(user);
  res.send({ User: user._id, Name: user.name });
});

app.post("/api/login", async (req, res) => {
  const query = { email: req.body.email };
  const user = await client
    .db("users")
    .collection("userDetails")
    .findOne(query);
  if (!user) return res.status(400).send("Email or password might be wrong");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  const token = jwt.sign(
    { username: user.name, useremail: user.email, user_id: user._id },
    "thisTokenIsSecretForPalatio",
    {
      expiresIn: "10m",
    }
  );
  res.status(200).send({
    username: user.name,
    useremail: user.email,
    user_id: user._id,
    token,
  });
  //   res.header("auth-token", token).send(token);
});

client.connect(() => console.log("connected to db"));

port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
