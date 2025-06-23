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

const CATEGORIES = [
  "Pain Relief",
  "Respiratory",
  "Digestive",
  "Immune Support",
  "Sleep Aid",
  "Skin Care",
];

const REMEDY_TYPES = {
  PHARMACEUTICAL: "pharmaceutical",
  ALTERNATIVE: "alternative",
  COMMUNITY: "community",
};

const TABS = {
  GENERAL: "general",
  INGREDIENTS: "ingredients",
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


const AilmentInitialState = {
  name: "",
  description: "",
  category: "",
  slug:"",
  symptoms: [],
  causesAndRisks: [],
  preventionTips: [],
  severity: "",
  isCommon: false,
  isContagious: false,
  requiresMedicalAttention: false,
};

const AilmentSeverityOptions = ["mild", "moderate", "severe"];

export {
  AilmentInitialState,
  AilmentSeverityOptions,
  TABS,
  MAX_FILE_SIZE,
  LS_KEYS,
  UserFlowStatus,
  ALLOWED_FILE_TYPES,
  CATEGORIES,
  REMEDY_TYPES,
  AilmentCategories,
};
