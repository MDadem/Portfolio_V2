import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendResetEmail(toEmail, resetLink) {
  const mailer = getTransporter();

  const fromEmail = process.env.SMTP_FROM || 'miladiadem58@gmail.com';
  const mailOptions = {
    from: `"Portfolio Panel" <${fromEmail}>`,
    to: toEmail,
    subject: 'Password Reset — Portfolio Panel',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0b0f; border-radius: 16px; overflow: hidden; border: 1px solid #1e2028;">
        <div style="padding: 40px 32px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0 0 8px;">Password Reset</h1>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; line-height: 1.5;">
            You requested a password reset for your Portfolio Panel account.
          </p>
          <a href="${resetLink}" 
             style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 14px; font-weight: 600; letter-spacing: 0.02em;">
            Reset Password
          </a>
          <p style="color: #4b5563; font-size: 12px; margin: 28px 0 0; line-height: 1.6;">
            This link expires in 15 minutes.<br/>
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        <div style="background: #12141a; padding: 16px 32px; text-align: center; border-top: 1px solid #1e2028;">
          <span style="color: #374151; font-size: 11px;">Portfolio Panel &mdash; Secure Access</span>
        </div>
      </div>
    `,
  };

  return mailer.sendMail(mailOptions);
}

