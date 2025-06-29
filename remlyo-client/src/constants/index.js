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
  slug: "",
  symptoms: [],
  causesAndRisks: [],
  preventionTips: [],
  severity: "",
  isCommon: false,
  isContagious: false,
  requiresMedicalAttention: false,
};

const AilmentSeverityOptions = ["mild", "moderate", "severe"];


const COUNTRIES = [
  { name: "Australia", code: "AU", currency: "AUD", symbol: "$" },
  { name: "Austria", code: "AT", currency: "EUR", symbol: "€" },
  { name: "Belgium", code: "BE", currency: "EUR", symbol: "€" },
  { name: "Brazil", code: "BR", currency: "BRL", symbol: "R$" },
  { name: "Bulgaria", code: "BG", currency: "BGN", symbol: "лв" },
  { name: "Canada", code: "CA", currency: "CAD", symbol: "$" },
  { name: "Croatia", code: "HR", currency: "EUR", symbol: "€" },
  { name: "Cyprus", code: "CY", currency: "EUR", symbol: "€" },
  { name: "Czech Republic (Czechia)", code: "CZ", currency: "CZK", symbol: "Kč" },
  { name: "Denmark", code: "DK", currency: "DKK", symbol: "kr" },
  { name: "Estonia", code: "EE", currency: "EUR", symbol: "€" },
  { name: "Finland", code: "FI", currency: "EUR", symbol: "€" },
  { name: "France", code: "FR", currency: "EUR", symbol: "€" },
  { name: "Germany", code: "DE", currency: "EUR", symbol: "€" },
  { name: "Gibraltar", code: "GI", currency: "GIP", symbol: "£" },
  { name: "Greece", code: "GR", currency: "EUR", symbol: "€" },
  { name: "Hong Kong", code: "HK", currency: "HKD", symbol: "$" },
  { name: "Hungary", code: "HU", currency: "HUF", symbol: "Ft" },
  { name: "India", code: "IN", currency: "INR", symbol: "₹" },
  { name: "Indonesia", code: "ID", currency: "IDR", symbol: "Rp" },
  { name: "Ireland", code: "IE", currency: "EUR", symbol: "€" },
  { name: "Italy", code: "IT", currency: "EUR", symbol: "€" },
  { name: "Japan", code: "JP", currency: "JPY", symbol: "¥" },
  { name: "Kenya", code: "KE", currency: "KES", symbol: "KSh" },
  { name: "Latvia", code: "LV", currency: "EUR", symbol: "€" },
  { name: "Liechtenstein", code: "LI", currency: "CHF", symbol: "Fr" },
  { name: "Lithuania", code: "LT", currency: "EUR", symbol: "€" },
  { name: "Luxembourg", code: "LU", currency: "EUR", symbol: "€" },
  { name: "Malaysia", code: "MY", currency: "MYR", symbol: "RM" },
  { name: "Malta", code: "MT", currency: "EUR", symbol: "€" },
  { name: "Mexico", code: "MX", currency: "MXN", symbol: "$" },
  { name: "Netherlands", code: "NL", currency: "EUR", symbol: "€" },
  { name: "New Zealand", code: "NZ", currency: "NZD", symbol: "$" },
  { name: "Nigeria", code: "NG", currency: "NGN", symbol: "₦" },
  { name: "Norway", code: "NO", currency: "NOK", symbol: "kr" },
  { name: "Poland", code: "PL", currency: "PLN", symbol: "zł" },
  { name: "Portugal", code: "PT", currency: "EUR", symbol: "€" },
  { name: "Romania", code: "RO", currency: "RON", symbol: "lei" },
  { name: "Singapore", code: "SG", currency: "SGD", symbol: "$" },
  { name: "Slovakia", code: "SK", currency: "EUR", symbol: "€" },
  { name: "Slovenia", code: "SI", currency: "EUR", symbol: "€" },
  { name: "South Africa", code: "ZA", currency: "ZAR", symbol: "R" },
  { name: "Spain", code: "ES", currency: "EUR", symbol: "€" },
  { name: "Sweden", code: "SE", currency: "SEK", symbol: "kr" },
  { name: "Switzerland", code: "CH", currency: "CHF", symbol: "Fr" },
  { name: "Thailand", code: "TH", currency: "THB", symbol: "฿" },
  { name: "United Arab Emirates", code: "AE", currency: "AED", symbol: "د.إ" },
  { name: "United Kingdom", code: "GB", currency: "GBP", symbol: "£" },
  { name: "United States of America", code: "US", currency: "USD", symbol: "$" }
];


export {
  AilmentInitialState,
  AilmentSeverityOptions,
  COUNTRIES,
  TABS,
  MAX_FILE_SIZE,
  LS_KEYS,
  UserFlowStatus,
  ALLOWED_FILE_TYPES,
  CATEGORIES,
  REMEDY_TYPES,
  AilmentCategories,
};
