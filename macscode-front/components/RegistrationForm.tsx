import React from 'react';

const RegistrationForm: React.FC = () => {
  return (
    <form>
      <h2>Register</h2>
      {/* Input fields for username, email, and password */}
      <input type="text" placeholder="Username" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      {/* Submit button */}
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
