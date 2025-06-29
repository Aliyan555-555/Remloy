// Constants
const AUTH_CONSTANTS = {
  MAX_RESET_REQUESTS: 5,
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
  TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
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
  USER_PROFILE_NOT_FOUND: "User profile not found",
  REMEDY_NOT_FOUND: "Remedy not found",
  INVALID_JSON_RESPONSE: "AI response did not contain valid JSON",
  INVALID_JSON_IN_CODE_BLOCK: "AI response contained code block but JSON was invalid",
  INVALID_JSON_CONTENT: "AI response contained JSON-like content but was invalid",
  MISSING_PARAMETERS: "remedyId and userId are required parameters"
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

const AilmentCategories = [
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

const SORT_FIELDS = {
  CREATED_AT: "createdAt",
  UPVOTE_COUNT: "upvoteCount",
  REPORT_COUNT: "reportCount",
  STATUS: "status",
};

const SORT_ORDERS = {
  ASC: "asc",
  DESC: "desc",
};

const REMEDY_TYPES={
  AI:"ai",
  COMMUNITY:"community",
  ALTERNATIVE:"alternative",
  PHARMACEUTICAL:"pharmaceutical"
}

const STATUS_TYPES = {
  APPROVED: "approved",
  REJECTED: "rejected",
  PENDING: "pending",
};


/**
 * MIME type mapping for common image extensions
 */
const MIME_TYPE_MAP = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
};


/**
 * Pixabay API configuration constants
 */
const PIXABAY_CONFIG = {
  BASE_URL: 'https://pixabay.com/api/',
  IMAGE_TYPE: 'photo',
  SAFE_SEARCH: true,
  TIMEOUT_MS: 10000, // 10 seconds
};

export {
  PIXABAY_CONFIG,
  MIME_TYPE_MAP,
  REMEDY_TYPES,
  AilmentCategories,
  SORT_FIELDS,
  SORT_ORDERS,
  STATUS_TYPES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  AUTH_CONSTANTS,
};
