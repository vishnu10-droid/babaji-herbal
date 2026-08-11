import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    phone: {
      type: String,
      default: "",
    },
    
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},

    // Store hashed OTP
    otp: {
      type: String,
      default: null,
    },

    // OTP expiry time
    otpExpires: {
      type: Date,
      default: null,
    },

    // Email verification status
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;