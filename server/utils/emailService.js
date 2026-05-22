const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (email, token, type = 'user') => {
  const verifyUrl = `${process.env.CLIENT_URL}/${type === 'staff' ? 'staff' : ''}/verify/${token}`;

  await transporter.sendMail({
    from: `"The Rising Bharat" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your email - The Rising Bharat',
    html: `
      <div style="max-width:600px;margin:0 auto;padding:30px;background:#f6ebe5;font-family:Arial,sans-serif;border-radius:12px;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#1a1a1a;font-size:28px;margin:0;">The Rising Bharat</h1>
          <p style="color:#666;font-size:14px;">News & Updates Platform</p>
        </div>
        <div style="background:#ffffff;border-radius:12px;padding:30px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
          <h2 style="color:#1a1a1a;font-size:22px;margin:0 0 15px;">Email Verification</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;">Thank you for registering with The Rising Bharat. Please verify your email address by clicking the button below.</p>
          <div style="text-align:center;margin:25px 0;">
            <a href="${verifyUrl}" style="display:inline-block;padding:14px 36px;background:#1a1a1a;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;">Verify Email</a>
          </div>
          <p style="color:#999;font-size:13px;">If you did not create an account, please ignore this email. The link will expire in 24 hours.</p>
        </div>
        <div style="text-align:center;margin-top:20px;">
          <p style="color:#999;font-size:12px;">&copy; ${new Date().getFullYear()} The Rising Bharat. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (email, token, type = 'user') => {
  const resetUrl = `${process.env.CLIENT_URL}/${type === 'staff' ? 'staff' : ''}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"The Rising Bharat" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your password - The Rising Bharat',
    html: `
      <div style="max-width:600px;margin:0 auto;padding:30px;background:#f6ebe5;font-family:Arial,sans-serif;border-radius:12px;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#1a1a1a;font-size:28px;margin:0;">The Rising Bharat</h1>
          <p style="color:#666;font-size:14px;">News & Updates Platform</p>
        </div>
        <div style="background:#ffffff;border-radius:12px;padding:30px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
          <h2 style="color:#1a1a1a;font-size:22px;margin:0 0 15px;">Password Reset Request</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;">You have requested to reset your password. Click the button below to set a new password.</p>
          <div style="text-align:center;margin:25px 0;">
            <a href="${resetUrl}" style="display:inline-block;padding:14px 36px;background:#1a1a1a;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;">Reset Password</a>
          </div>
          <p style="color:#999;font-size:13px;">If you did not request this, please ignore this email. The link will expire in 1 hour.</p>
        </div>
        <div style="text-align:center;margin-top:20px;">
          <p style="color:#999;font-size:12px;">&copy; ${new Date().getFullYear()} The Rising Bharat. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

const sendSubscriptionConfirmation = async (email) => {
  await transporter.sendMail({
    from: `"The Rising Bharat" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Subscription Confirmed - The Rising Bharat',
    html: `
      <div style="max-width:600px;margin:0 auto;padding:30px;background:#f6ebe5;font-family:Arial,sans-serif;border-radius:12px;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#1a1a1a;font-size:28px;margin:0;">The Rising Bharat</h1>
          <p style="color:#666;font-size:14px;">News & Updates Platform</p>
        </div>
        <div style="background:#ffffff;border-radius:12px;padding:30px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
          <h2 style="color:#1a1a1a;font-size:22px;margin:0 0 15px;">You're Subscribed!</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;">Thank you for subscribing to The Rising Bharat newsletter. You will now receive the latest news, updates, and exclusive content directly to your inbox.</p>
          <p style="color:#555;font-size:15px;line-height:1.6;">Stay tuned for informative articles on technology, business, lifestyle, sports, and more.</p>
        </div>
        <div style="text-align:center;margin-top:20px;">
          <p style="color:#999;font-size:12px;">&copy; ${new Date().getFullYear()} The Rising Bharat. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendSubscriptionConfirmation };
