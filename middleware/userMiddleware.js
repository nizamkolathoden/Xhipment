const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.isloggedIn = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Login first" });

    const decode = jwt.verify(token, process.env.JWT_SECERT);

    req.user = await User.findById(decode.id);
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({error:"Internal Server Error"})
  }
};
