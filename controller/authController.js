const User = require("../model/user");
const cookieToken = require("../util/cookieToken");
// const path = require("path")

module.exports = {
  siginup: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!email || !password || !name)
        return res.status(400).json({ error: "Enter Email/Password/name" });

      const newUser = await new User({
        name,
        email,
        password,
      });

      //resume upload
      if (req.file) {
        const resumePath = __dirname+req.file.path
        newUser.resume =resumePath ;
      }
      console.log(newUser);
      await newUser.save()

      cookieToken(newUser, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error:"Internal Server Error"  });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email);
      if (!email || !password)
        return res.status(400).json({ error: "Enter Email/Password" });

      const userFound = await User.findOne({ email }).select("+password");

      if (!userFound)
        return res.status(400).json({ error: "Invalid Email/Password" });

      const isValidpassword = await userFound.isValidpassword(password);

      if (!isValidpassword)
        return res.status(400).json({ error: "Invalid Email/Password" });

      cookieToken(userFound, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
