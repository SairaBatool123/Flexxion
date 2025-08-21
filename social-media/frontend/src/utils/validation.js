export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.length >= 2;
};

export const validateSignupForm = (formData) => {
  const errors = {};

  if (!formData.name || !validateName(formData.name)) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password || !validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
