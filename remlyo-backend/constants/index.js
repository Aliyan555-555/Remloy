// Constants
const AUTH_CONSTANTS = {
  MAX_RESET_REQUESTS: 5,
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
  TOKEN_EXPIRY: 30 * 60 * 1000, // 30 minutes
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    DEFAULT_PAGE: 1,
  },
};

// Error Messages
const ERROR_MESSAGES = {
  INVALID_TOKEN: "Invalid or expired token",
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_IN_USE: "Email already in use try with different email",
  USER_NOT_FOUND: "User not found",
  EMAIL_VERIFIED: "Your email already verified",
  TOO_MANY_REQUESTS: "Too many requests. Try again after 1 hour",
  INTERNAL_ERROR: "Internal server error",
  INVALID_USER_ID: "Invalid user ID format",
  TOKEN_REQUIRED: "Token and new password are required",
  INVALID_TOKEN_FORMAT: "Invalid token format",
  MISSING_ID_TOKEN: "Missing ID token",
  NO_EMAIL_FOUND: "No email found in Firebase token.",
};

// Success Messages
const SUCCESS_MESSAGES = {
  REGISTRATION: "Registration successful. Please verify your email.",
  LOGIN: "Login successful",
  LOGOUT: "Logout successful",
  EMAIL_VERIFICATION_SENT: "Email verification send successfully",
  PASSWORD_RESET_SENT:
    "If an account exists, a reset link has been sent to your email.",
  PASSWORD_RESET: "Password has been reset successfully",
  TOKEN_VALID: "Reset token is valid",
  USERS_FETCHED: "Successfully fetched users",
  USER_FETCHED: "Successfully fetched user",
};

const AlimentCategories = [
  "Digestive Health",
  "Mental Health",
  "Respiratory Health",
  "Skin & Dermatology",
  "Cardiovascular Health",
  "Women's Health",
  "Men's Health",
  "Immune System",
  "Muscle & Joint",
  "Sleep & Energy",
  "Hair & Scalp",
  "Allergies & Sensitivities",
  "Urinary & Kidney",
  "Endocrine & Hormones",
  "Oral & Dental",
  "Liver & Detox",
  "Eye & Vision",
  "Ear, Nose & Throat",
  "Neurological",
  "General Wellness",
  "Neurological Health",
  "Skin Health",
  "Immune Health",
  "Reproductive Health",
  "Oral Health",
];

export { AlimentCategories, SUCCESS_MESSAGES, ERROR_MESSAGES, AUTH_CONSTANTS };
