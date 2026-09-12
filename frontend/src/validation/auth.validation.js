export const validateRegisterForm = (formData) => {
  const errors = {};

  // ==============================
  // NAME
  // ==============================

  if (!formData.name.trim()) {
    errors.name = "Full name is required";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
    errors.name = "Name can contain only letters and spaces";
  }

  // ==============================
  // EMAIL
  // ==============================

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
  ) {
    errors.email = "Please enter a valid email address";
  }

  // ==============================
  // PHONE
  // ==============================

  if (formData.phone.trim()) {
    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      errors.phone = "Phone number must be exactly 10 digits";
    }
  }

  // ==============================
  // PASSWORD
  // ==============================

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};