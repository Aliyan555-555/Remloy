const LS_KEYS = {
  USER: "currentUser",
  AUTH_TOKEN: "token",
  SIGNUP_EMAIL: "signupEmail",
};

const UserFlowStatus = {
  LOGGED_OUT: "LOGGED_OUT",
  LOGGED_IN: "LOGGED_IN",
  EMAIL_UNVERIFIED: "EMAIL_UNVERIFIED",
  PROFILE_INCOMPLETE: "PROFILE_INCOMPLETE",
  SUBSCRIPTION_REQUIRED: "SUBSCRIPTION_REQUIRED",
  COMPLETE: "COMPLETE",
};

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export { LS_KEYS, UserFlowStatus, ALLOWED_FILE_TYPES, MAX_FILE_SIZE };
