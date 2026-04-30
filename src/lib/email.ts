import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const LOGO_URL = 'https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg';
const PRIMARY_COLOR = '#0d9488'; // Teal-600

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  const mailOptions = {
    from: `"Cedar Centre" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="background-color: #f8fafc; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #334155; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <img src="${LOGO_URL}" alt="Cedar Centre Logo" style="height: 60px; margin-bottom: 20px;">
            </div>
            <div style="background-color: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <style>
                .button {
                  display: inline-block;
                  padding: 14px 28px;
                  background-color: ${PRIMARY_COLOR};
                  color: #ffffff !important;
                  text-decoration: none;
                  border-radius: 12px;
                  font-weight: bold;
                  margin-top: 25px;
                }
                .divider {
                  height: 1px;
                  background-color: #e2e8f0;
                  margin: 30px 0;
                }
              </style>
              ${html}
            </div>
            <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #94a3b8;">
              <p>&copy; ${new Date().getFullYear()} Cedar Centre STAIR Platform. All rights reserved.</p>
              <p>Trauma-Informed Healing & Support</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
};
