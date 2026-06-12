const validatePassword = (password) => {
  const rules = [
    [password.length >= 12, 'at least 12 characters'],
    [/[A-Z]/.test(password), 'an uppercase letter'],
    [/[a-z]/.test(password), 'a lowercase letter'],
    [/\d/.test(password), 'a number'],
    [/[@$!%*?&]/.test(password), 'a special character (@$!%*?&)']
  ];

  const failed = rules.filter(([valid]) => !valid).map(([, msg]) => msg);
  if (failed.length) {
    return {
      valid: false,
      message: `Password must contain: ${failed.join(', ')}`
    };
  }
  return { valid: true };
};

module.exports = {
  validatePassword,
  BCRYPT_ROUNDS: 12
};
