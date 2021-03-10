const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {
  MongoClient
} = require("mongodb");
const bcrypt = require("bcryptjs");
const app = express();
const User = require("./models/register");
const jwt = require("jsonwebtoken");
const verify = require("./routes/verifyToken");
const Allergy = require('./models/allergy');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

const client = new MongoClient(
  "XXXX", {
    useUnifiedTopology: true
  }
);


//route for checking if server is live or not
app.get("/", (req, res) => {
  res.status(200).json({
    message: 'Palatio server is running....'
  });
});


//route for verifying JWT token
app.get("/api/jwtCheck", verify, (req, res, next) => {
  res.status(200).json({
    token: "verified Token"
  });
});

//route for registering new user
app.post("/api/auth/register", async (req, res) => {
  const query = {
    email: req.body.email
  };
  const exist = await client
    .db("palatio")
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

  const result = client.db("palatio").collection("userDetails").insertOne(user);
  res.send({
    User: user._id,
    Name: user.name
  });
});

//route for login
app.post("/api/auth/login", async (req, res) => {
  const query = {
    email: req.body.email
  };
  const user = await client
    .db("palatio")
    .collection("userDetails")
    .findOne(query);
  if (!user) return res.status(400).send("Email or password might be wrong");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  const token = jwt.sign({
      username: user.name,
      useremail: user.email,
      user_id: user._id
    },
    "thisTokenIsSecretForPalatio", {
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

//route for getting allergies of a particular user
app.get("/api/allergies/:user_uid", verify, async (req, res) => {
  const filter = {
    user_uid: req.params.user_uid
  }
  console.log("id", filter)
  const exist = await client
    .db("palatio")
    .collection("allergies")
    .findOne(filter);
  if (exist) res.status(200).send(exist);
  else res.status(404).send({
    message: "no allergies fond for particular user"
  });

});

//route for getting all alergies
app.get("/api/allergies", verify, async (req, res) => {
  const exist = await client
    .db("palatio")
    .collection("allergies")
    .find({}).toArray(function (err, result) {
      if (err) {
        res.send(err);
      } else {

        res.send(result);
      }
    })

});

//route for adding new allergies
app.post("/api/allergies", verify, async (req, res) => {
  const allergies = new Allergy({
    user_uid: req.body.user_uid,
    allergy: req.body.allergies
  });
  const result = client.db("palatio").collection("allergies").insertOne(allergies);
  res.status(200).send({
    result,
    message: "allergies added successfull"
  })
});

//route for updating existing allergies
app.put("/api/allergies", verify, async (req, res) => {
  const filter = {
    user_uid: req.body.user_uid
  }
  const updateDoc = {
    $set: {
      allergy: req.body.allergies
    }
  }
  const result = client.db("palatio").collection("allergies").updateOne(filter, updateDoc);
  res.status(200).send({
    result,
    message: "allergies updated successfull"
  })
});

//mongoDB colletion
client.connect(() => console.log("connected to db"));

//app listen on a port
port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});