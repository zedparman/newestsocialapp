const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    
    //save user and respond
    const user = await newUser.save();
     res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  console.log(req.body.email)
  try {
    const user = await User.findOne({ email: req.body.email });
    if(!user){
        return res.status(404).json("user not found");
    }
    // console.log(res.body)
    
    
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword){
       return res.status(400).json("wrong password")
    }
    // console.log(res.body)
     
    
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {expiresIn:"3d"}
    );
      
      // console.log(accessToken)
      
      const { password, ...others } = user._doc;
      
      
      return res.status(200).json({...others, accessToken})
    } catch (err) {
      res.status(500).json(err)
      console.log(err)
  }
});

module.exports = router;
