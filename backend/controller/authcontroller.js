const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  try {
    const body = req.body;

    const existingUser = await User.findOne({ email: body.email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;
    const user = await User.create(body);
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      },
    );

    body._id = user._id;
    body.token = token;
    delete body.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: body,
    });
  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}





async function login(req, res) {
  console.log("Login Request:", req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const userData = user.toObject();

    console.log("Logged In User:", user);
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name:user.name
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    userData.token = token;
    delete userData.password;

    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: userData,
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
module.exports = {
  register,
  login,
};
