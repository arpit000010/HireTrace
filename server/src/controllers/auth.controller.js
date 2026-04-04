import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

// ─── Token Helpers ────────────────────────────────────────────────
const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ─── Email Helper ─────────────────────────────────────────────────
const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  let transporter;

  // Use real credentials if provided, otherwise use a fake testing account (Ethereal)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    console.log("⚠️ Using Ethereal Email for testing (No real credentials found in .env)");
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER ? `"HireTrace" <${process.env.EMAIL_USER}>` : '"HireTrace" <test@ethereal.email>',
    to: email,
    subject: "Verify your HireTrace account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #6366f1;">Welcome to HireTrace 🎉</h2>
        <p>Click the button below to verify your email address:</p>
        <a href="${verifyUrl}" style="display:inline-block; padding:12px 24px; background:#6366f1; color:#fff; border-radius:8px; text-decoration:none; font-weight:bold;">
          Verify Email
        </a>
        <p style="color:#888; margin-top:16px;">This link expires in 24 hours.</p>
      </div>
    `,
  });

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("🔗 Preview your email here: " + nodemailer.getTestMessageUrl(info));
  }
};

// ─── @route POST /api/auth/register ──────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json(new ApiResponse(400, "All fields are required"));

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json(new ApiResponse(400, "Email already registered"));

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // Run email verification in the background without awaiting it.
    // Render free tier blocks outbound SMTP. If we await this, the request will hang indefinitely.
    sendVerificationEmail(email, verificationToken).catch((err) =>
      console.error("Background email failed (Render SMTP block):", err.message)
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Registration successful! Please check your email to verify your account.",
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      ),
    );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route GET /api/auth/verify-email/:token ────────────────────
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json(new ApiResponse(400, "Invalid or expired verification link"));

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Email verified! You can now log in."));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route POST /api/auth/login ─────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json(new ApiResponse(400, "Email and password are required"));

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json(new ApiResponse(401, "Invalid credentials"));

    // [PORTFOLIO FIX]: Render free tier blocks outbound SMTP ports, meaning emails will hang and users can't verify.
    // We bypass this check so recruiters and guests can successfully log in immediately!
    /*
    if (!user.isVerified)
      return res
        .status(403)
        .json(
          new ApiResponse(403, "Please verify your email before logging in"),
        );
    */

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json(new ApiResponse(401, "Invalid credentials"));

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    setRefreshCookie(res, refreshToken);

    return res.status(200).json(
      new ApiResponse(200, "Login successful", {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
      }),
    );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route POST /api/auth/refresh ───────────────────────────────
const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token)
      return res.status(401).json(new ApiResponse(401, "No refresh token"));

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token)
      return res
        .status(403)
        .json(new ApiResponse(403, "Invalid refresh token"));

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    setRefreshCookie(res, newRefreshToken);

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Token refreshed", {
          accessToken: newAccessToken,
        }),
      );
  } catch (error) {
    return res
      .status(403)
      .json(new ApiResponse(403, "Invalid or expired refresh token"));
  }
};

// ─── @route POST /api/auth/logout ────────────────────────────────
const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json(new ApiResponse(200, "Logged out successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route GET /api/auth/me ──────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -refreshToken")
      .populate("bookmarks", "company role difficulty createdAt")
      .populate("createdExperiences", "company role difficulty createdAt");

    return res.status(200).json(new ApiResponse(200, "User fetched", user));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

export { register, verifyEmail, login, refreshAccessToken, logout, getMe };
