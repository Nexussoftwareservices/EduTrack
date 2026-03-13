export const resetPasswordTemplate = (resetUrl: string) => {
  return `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click the button below to reset it:</p>
        <a href="${resetUrl}" 
           style="display:inline-block;
                  padding:10px 20px;
                  background:#007bff;
                  color:white;
                  text-decoration:none;
                  border-radius:5px;">
           Reset Password
        </a>
        <p>This link will expire in 15 minutes.</p>
      </div>
    `;
};
