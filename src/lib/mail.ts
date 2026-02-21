import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export const sendPasswordResetEmail = async (to: string, resetLink: string, userName: string) => {
    const mailOptions = {
        from: `"Keysprint Security" <${process.env.EMAIL_FROM}>`,
        to,
        subject: "Reset Your Keysprint Password",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #0f172a;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                    color: #f8fafc;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .logo {
                    font-size: 32px;
                    font-weight: 900;
                    color: #ffffff;
                    text-decoration: none;
                    letter-spacing: -1px;
                }
                .accent {
                    color: #0ea5e9;
                }
                .card {
                    background-color: #1e293b;
                    border: 1px solid #334155;
                    border-radius: 24px;
                    padding: 40px 32px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                h1 {
                    font-size: 24px;
                    font-weight: 800;
                    margin-top: 0;
                    margin-bottom: 16px;
                    color: #ffffff;
                }
                p {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #94a3b8;
                    margin-bottom: 24px;
                }
                .button {
                    display: inline-block;
                    background-color: #0ea5e9;
                    color: #ffffff !important;
                    font-weight: 700;
                    font-size: 16px;
                    text-decoration: none;
                    padding: 16px 32px;
                    border-radius: 12px;
                    margin-top: 8px;
                    margin-bottom: 24px;
                    text-align: center;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    font-size: 13px;
                    color: #64748b;
                }
                .footer-link {
                    color: #94a3b8;
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Key<span class="accent">sprint</span></div>
                </div>
                <div class="card">
                    <h1>Reset your password</h1>
                    <p>Hello ${userName},</p>
                    <p>We received a request to reset the password for your Keysprint account. Click the button below to choose a new password. This link will expire in 1 hour.</p>
                    <div style="text-align: center;">
                        <a href="${resetLink}" class="button">Reset Password</a>
                    </div>
                    <p style="margin-bottom: 0px; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>
                </div>
                <div class="footer">
                    <p style="margin-bottom: 8px;">© ${new Date().getFullYear()} Keysprint. All rights reserved.</p>
                    <p style="font-size: 12px;">You're receiving this email because a password reset was requested for this account.</p>
                </div>
            </div>
        </body>
        </html>
        `
    };

    await transporter.sendMail(mailOptions);
};
