import React from 'react';

const LoginForm: React.FC = () => {
  return (
    <form>
      <h2>Login</h2>
      {/* Input fields for email and password */}
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      {/* Submit button */}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
