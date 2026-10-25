import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";

import jwt from "jsonwebtoken";


//
//
// -----------------------------------------------------------------------------
// ==| REGISTER USER |==========================================================
// -----------------------------------------------------------------------------
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, avatar } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Name, email and password are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "An user with this email already exists");
  }

  // Creating User 
  const user = await User.create({
    name,
    email,
    password,
    phone,
    avatar,
    role: role || "attendee",
  });

  const token = user.generateToken();

  res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token,
      },
      "User registered successfully",
    ),
  );
});

//
//
// --------------------------------------------------------------------------
// ==| LOGIN USER |==========================================================
// --------------------------------------------------------------------------

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  const token = user.generateToken();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token,
      },
      "Logged in successfully",
    ),
  );
});
