import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role || "user",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const createToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

export const register = async (req, res) => {
  try {
    const { name, email, password, phone = "" } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      phone: phone.trim(),
      role: "user",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: publicUser(user),
      token: createToken(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email?.trim().toLowerCase(),
    });

    if (
      !user ||
      !password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: publicUser(user),
      token: createToken(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admins use a separate endpoint so the admin portal never creates a session
// for a customer account by mistake.
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email?.trim().toLowerCase(),
    });

    if (
      !user ||
      user.role !== "admin" ||
      !password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: publicUser(user),
      token: createToken(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) =>
  res.status(200).json({
    success: true,
    data: publicUser(req.user),
  });

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name?.trim() || !normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const duplicate = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use",
      });
    }

    req.user.name = name.trim();
    req.user.email = normalizedEmail;
    req.user.phone = phone?.trim() || "";

    // Don't change req.user.role here
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: publicUser(req.user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users.map(publicUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) =>
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
