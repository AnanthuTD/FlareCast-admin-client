export const passwordRules = [
  { required: true, message: 'Please input your password!' },
  { min: 6, message: 'Password must be at least 6 characters long!' },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^_.])[A-Za-z\d@$!%*?&#^_.]{6,}$/,
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!',
  },
];
