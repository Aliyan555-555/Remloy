import { UAParser } from "ua-parser-js";
import Session from "../models/session.model.js";
import UserProfile from "../models/user_profile.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Creates a new session for a user
 * @param {Object} user - The user object
 * @param {string} token - The authentication token
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} The created session
 * @throws {Error} If session creation fails
 */
const createSession = async (user, token, req) => {
  try {
    const { browser, os, deviceType } = getClientInfo(req.headers["user-agent"]);
    return await Session.create({
      userId: user._id,
      ipAddress: getClientIP(req),
      userAgent: req.headers["user-agent"],
      deviceType,
      sessionToken: token,
      metadata: { browser, os },
      isActive: true,
      createdAt: new Date()
    });
  } catch (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }
};

/**
 * Sets authentication cookie in the response
 * @param {Object} res - Express response object
 * @param {string} token - The authentication token
 * @param {boolean} rememberMe - Whether to set a long-lived cookie
 */
const setAuthCookie = (res, token, rememberMe = false) => {
  const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined;
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge,
    path: "/"
  });
};

/**
 * Determines the redirect path based on user status and role
 * @param {Object} user - The user object
 * @returns {Promise<string>} The redirect path
 */
const getRedirectPath = async (user) => {
  try {
    const userHealthProfile = await UserProfile.findOne({ userId: user._id });

    if (!user.emailVerified) return "/verify-email";
    if (!userHealthProfile) return "/health-profile";

    const accessLevel = user.accessLevel?.trim().toLowerCase() || "user";
    const redirectMap = {
      admin: "/admin/dashboard",
      user: "/dashboard",
      writer: "/writer/dashboard",
      moderator: "/moderator/dashboard"
    };

    return redirectMap[accessLevel] || "/signin";
  } catch (error) {
    console.error("Error determining redirect path:", error);
    return "/signin";
  }
};

/**
 * Generates a secure hashed password
 * @param {string} password - The password to hash
 * @returns {Promise<string>} The hashed password
 * @throws {Error} If hashing fails
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
};

/**
 * Generates a JWT token for user authentication
 * @param {Object} user - The user object
 * @returns {string} The generated JWT token
 * @throws {Error} If JWT_SECRET is not defined or token generation fails
 */
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.accessLevel,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

/**
 * Gets the client's IP address from the request
 * @param {Object} req - Express request object
 * @returns {string} The client's IP address
 */
const getClientIP = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : req.connection.remoteAddress;
  return ip || "0.0.0.0";
};

/**
 * Parses user agent string to get client information
 * @param {string} userAgent - The user agent string
 * @returns {Object} Object containing browser, OS, and device information
 */
const getClientInfo = (userAgent) => {
  try {
    const parser = new UAParser(userAgent);
    const ua = parser.getResult();
    return {
      browser: ua.browser.name || "Unknown",
      os: ua.os.name || "Unknown",
      deviceType: ua.device.type || "Desktop",
      browserVersion: ua.browser.version || "Unknown",
      osVersion: ua.os.version || "Unknown"
    };
  } catch (error) {
    console.error("Error parsing user agent:", error);
    return {
      browser: "Unknown",
      os: "Unknown",
      deviceType: "Desktop",
      browserVersion: "Unknown",
      osVersion: "Unknown"
    };
  }
};

export {
  createSession,
  setAuthCookie,
  getRedirectPath,
  hashPassword,
  generateToken,
  getClientIP,
  getClientInfo
};
