// ========================================
// REGISTER VALIDATION
// ========================================

export const validateRegister = (data) => {
  const errors = {};

  const {
    name = "",
    email = "",
    phone = "",
    password = "",
  } = data;

  // ==============================
  // NAME
  // ==============================

  if (!name.trim()) {
    errors.name = "Full name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
    errors.name = "Name can contain only letters and spaces";
  }

  // ==============================
  // EMAIL
  // ==============================

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    errors.email = "Please enter a valid email address";
  }

  // ==============================
  // PHONE
  // ==============================

  if (phone && !/^[0-9]{10}$/.test(phone.trim())) {
    errors.phone = "Phone number must be exactly 10 digits";
  }

  // ==============================
  // PASSWORD
  // ==============================

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};


// ========================================
// LOGIN VALIDATION
// ========================================

export const validateLogin = (data) => {
  const errors = {};

  const {
    email = "",
    password = "",
  } = data;

  // Email
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    errors.email = "Please enter a valid email address";
  }

  // Password
  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

// ========================================
// ADMIN LOGIN VALIDATION
// ========================================

// Admin authentication has the same required credentials as a normal login.
// Keeping it as a named validator lets the admin route use the same validation
// contract without importing a function that does not exist.
export const validateAdminLogin = (data) => validateLogin(data);

// ========================================
// PROFILE UPDATE VALIDATION
// ========================================

export const validateUpdateProfile = (data = {}) => {
  const errors = {};
  const { name = "", email = "", phone = "" } = data;

  if (typeof name !== "string" || !name.trim()) {
    errors.name = "Full name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
    errors.name = "Name can contain only letters and spaces";
  }

  if (typeof email !== "string" || !email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (phone && (typeof phone !== "string" || !/^[0-9]{10}$/.test(phone.trim()))) {
    errors.phone = "Phone number must be exactly 10 digits";
  }

  return errors;
};
