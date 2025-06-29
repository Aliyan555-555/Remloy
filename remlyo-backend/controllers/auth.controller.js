import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation.js";
import {
  getClientInfo,
  generateToken,
  hashPassword,
  createSession,
  setAuthCookie,
  getRedirectPath,
} from "../utils/index.js";
import Session from "../models/session.model.js";
import crypto from "crypto";
import { sendMail } from "./../services/sendMail.service.js";
import UserProfile from "./../models/user_profile.model.js";
import admin from "./../config/firebase.config.js";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  AUTH_CONSTANTS,
} from "../constants/index.js";

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object
 */
const register = async (req, res) => {
  try {
    // Validate request body
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        success: false,
      });
    }

    const { password, email } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: ERROR_MESSAGES.EMAIL_IN_USE,
        success: false,
      });
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      ...req.body,
      emailVerified: true,
      password: hashedPassword,
    });

    // Generate token and set up session
    const authToken = generateToken(user);
    setAuthCookie(res, authToken);
    await createSession(user, authToken, req);

    // Get redirect path and prepare response
    const redirect = await getRedirectPath(user);
    const { password: _, ...userData } = user.toObject();

    return res.status(201).json({
      message: SUCCESS_MESSAGES.REGISTRATION,
      success: true,
      token: authToken,
      user: userData,
      redirect,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      success: false,
    });
  }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object
 */
const login = async (req, res) => {
  try {
    // Validate request body
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        success: false,
      });
    }

    const { email, password, rememberMe } = req.body;

    // Find and validate user
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        success: false,
      });
    }

    // Update last login and generate token
    user.lastLogin = new Date();
    await user.save();
    const token = generateToken(user);

    // Set up session and cookie
    setAuthCookie(res, token, rememberMe);
    await createSession(user, token, req);

    if (user?.activeSubscription) {
      await user.populate([
        {
          path: "activeSubscription",
          populate: {
            path: "plan",
          },
        },
        {
          path: "saveRemedies.remedy",
        },
      ]);
    }

    // Get redirect path and prepare response
    const redirect = await getRedirectPath(user);
    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({
      message: SUCCESS_MESSAGES.LOGIN,
      user: userData,
      token,
      success: true,
      redirect,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: err.message,
      success: false,
    });
  }
};

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object
 */
const logout = async (req, res) => {
  try {
    const token = req.token;

    // Clear the auth cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Invalidate session in database
    await Session.updateOne(
      { sessionToken: token, isActive: true },
      {
        isActive: false,
        logoutTime: new Date(),
      }
    );

    return res.status(200).json({
      message: SUCCESS_MESSAGES.LOGOUT,
      success: true,
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: err.message,
      success: false,
    });
  }
};

/**
 * Verify authentication token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object
 */
const verifyAuth = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_TOKEN,
      });
    }

    // Get fresh user data without password
    const userData = await User.findById(user.id).select("-password");
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    return res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_TOKEN,
    });
  }
};

/**
 * Get all users with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object
 */
const getAllUsers = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(
        parseInt(req.query.l) || AUTH_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
        1
      ),
      AUTH_CONSTANTS.PAGINATION.MAX_LIMIT
    );
    const page = Math.max(
      parseInt(req.query.p) || AUTH_CONSTANTS.PAGINATION.DEFAULT_PAGE,
      1
    );
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find({}, "-password").skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      message: SUCCESS_MESSAGES.USERS_FETCHED,
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    });
  }
};
/**
 * Verify authentication token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object
 */
const validatedEmailToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token || token.length < 32) {
      return res
        .status(400)
        .json({ message: "Invalid token format", success: false });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token", token, success: false });
    }

    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.emailVerified = true;
    user.lastLogin = new Date();
    user.save();

    const authToken = generateToken(user);

    res.cookie("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Extract client info
    const { browser, os, deviceType } = getClientInfo(
      req.headers["user-agent"]
    );

    // Log session
    await Session.create({
      userId: user._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
      deviceType,
      sessionToken: authToken,
      metadata: { browser, os },
    });
    const userHealthProfile = await UserProfile.findOne({ userId: user._id });

    let redirect = null;
    if (!userHealthProfile) {
      redirect = "/health-profile";
    } else {
      switch (user.accessLevel.trim().toLowerCase()) {
        case "admin":
          redirect = "/admin/dashboard";
          break;
        case "user":
          redirect = "/dashboard";
          break;
        default:
          redirect = "/signin";
          break;
      }
    }

    // Prepare safe user data

    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({
      message: "Valid token",
      success: true,
      token: authToken,
      user: userData,
      redirect,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const MAX_RESET_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hours


const sendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    if (user.emailVerified) {
      return res
        .status(400)
        .json({ message: "Your email already verified", success: false });
    }

    const now = Date.now();

    if (
      user.emailVerificationTimestamp &&
      now - user.emailVerificationTimestamp < WINDOW_MS
    ) {
      if (user.emailVerificationRequestCount >= MAX_RESET_REQUESTS) {
        return res.status(429).json({
          success: false,
          message: "Too many requests. Try again after  1 hour",
        });
      }
      user.emailVerificationRequestCount += 1;
    } else {
      user.emailVerificationRequestCount = 1;
      user.emailVerificationTimestamp = now;
    }
    const emailToken = crypto.randomBytes(32).toString("hex");
    const emailTokenHash = crypto
      .createHash("sha256")
      .update(emailToken)
      .digest("hex");

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${emailTokenHash}`;
    user.emailVerificationToken = emailTokenHash;
    user.emailVerificationExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    await sendMail({
      to: user.email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to Our Platform!</h2>
          <p style="color: #666; line-height: 1.6;">Hello ${user.username},</p>
          <p style="color: #666; line-height: 1.6;">Thank you for registering with us. To complete your registration and access all features, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p style="color: #666; line-height: 1.6;"><strong>Important:</strong> This verification link will expire in 30 minutes.</p>
         
        </div>
      `,
    });

    return res.status(200).json({
      message: "Email verification send successfully",
      success: true,
    });
  } catch (error) {
    console.error("Send email verification error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: ERROR_MESSAGES.INVALID_USER_ID,
        success: false,
      });
    }

    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({
        message: ERROR_MESSAGES.USER_NOT_FOUND,
        success: false,
      });
    }

    return res.status(200).json({
      message: SUCCESS_MESSAGES.USER_FETCHED,
      user,
      success: true,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    return res.status(500).json({
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
      success: false,
    });
  }
};

/**
 * Send password reset email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object
 */
const resetPasswordSendMail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: ERROR_MESSAGES.USER_NOT_FOUND,
        success: false,
      });
    }

    const now = Date.now();
    if (
      user.resetRequestTimestamp &&
      now - user.resetRequestTimestamp < AUTH_CONSTANTS.WINDOW_MS
    ) {
      if (user.resetRequestCount >= AUTH_CONSTANTS.MAX_RESET_REQUESTS) {
        return res.status(429).json({
          success: false,
          message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
        });
      }
      user.resetRequestCount += 1;
    } else {
      user.resetRequestCount = 1;
      user.resetRequestTimestamp = now;
    }

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = now + AUTH_CONSTANTS.TOKEN_EXPIRY;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p style="color: #666;">Hello ${user.username || "User"},</p>
          <p style="color: #666;">Click the button below to reset your password. This link will expire in 30 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #666;"><strong>Note:</strong> If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.PASSWORD_RESET_SENT,
    });
  } catch (error) {
    console.error("Password reset email error:", error);
    return res.status(500).json({
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
      success: false,
    });
  }
};

/**
 * Verify password reset token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object
 */
const resetPasswordVerifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token || token.length < 32) {
      return res.status(400).json({
        message: ERROR_MESSAGES.INVALID_TOKEN_FORMAT,
        success: false,
      });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: ERROR_MESSAGES.INVALID_TOKEN,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.TOKEN_VALID,
    });
  } catch (error) {
    console.error("Verify reset token error:", error);
    return res.status(500).json({
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
      success: false,
    });
  }
};

/**
 * Change password using reset token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object
 */
const resetPasswordChangePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: ERROR_MESSAGES.TOKEN_REQUIRED,
        success: false,
      });
    }

    if (!token || token.length < 32) {
      return res.status(400).json({
        message: ERROR_MESSAGES.INVALID_TOKEN_FORMAT,
        success: false,
      });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_TOKEN,
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Invalidate all active sessions
    await Session.deleteMany({ userId: user._id, isActive: true });

    return res.status(200).json({
      message: SUCCESS_MESSAGES.PASSWORD_RESET,
      success: true,
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
      success: false,
    });
  }
};

/**
 * Social authentication handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object
 */
const socialAuth = async (req, res) => {
  const { token: idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({
      message: ERROR_MESSAGES.MISSING_ID_TOKEN,
      success: false,
    });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const {
      email,
      name,
      uid,
      email_verified,
      firebase: { sign_in_provider } = {},
    } = decoded;

    if (!email) {
      return res.status(400).json({
        message: ERROR_MESSAGES.NO_EMAIL_FOUND,
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        emailVerified: email_verified,
        isActive: true,
        username: name || email.split("@")[0],
        password: await hashPassword(uid),
        geographicRegion: "global",
      });

      await user.save();
    }

    const token = generateToken(user);
    user.lastLogin = new Date();
    await user.save();

    setAuthCookie(res, token);
    await createSession(user, token, req);

    const { password: _, ...userData } = user.toObject();
    const redirect = await getRedirectPath(user);

    return res.status(200).json({
      message: SUCCESS_MESSAGES.LOGIN,
      user: userData,
      token,
      success: true,
      redirect,
    });
  } catch (error) {
    console.error("Social auth failed:", error);
    return res.status(401).json({
      message: "Social authentication failed",
      error: error.message || "Unable to verify identity",
      success: false,
    });
  }
};

const refreshUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: "activeSubscription",
      populate: {
        path: "plan",
      },
    });

    await user.populate("saveRemedies.remedy");

    res.status(200).json({
      message: "User data refreshed successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("refreshUser error:", error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export {
  refreshUser,
  register,
  login,
  getAllUsers,
  getUserById,
  logout,
  resetPasswordSendMail,
  resetPasswordVerifyResetToken,
  resetPasswordChangePassword,
  validatedEmailToken,
  sendEmailVerification,
  socialAuth,
  verifyAuth,
};
