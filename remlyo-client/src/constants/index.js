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
  
  
  export { LS_KEYS, UserFlowStatus };
  