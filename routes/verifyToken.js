const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  if (typeof req.headers.authorization !== "undefined") {
    let token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    if (!token) return res.status(401).send("Access Denied");
    jwt.verify(
      token,
      "thisTokenIsSecretForPalatio",
      { algorithm: "HS256" },
      (err, user) => {
        if (err) {
          res.status(200).json({ error: "not Authorized" });
        } else {
          req.user = true;
          next();
        }
      }
    );
  } else {
    res.status(403).send(json({ error: "Not Authorized" }));
  }
};
