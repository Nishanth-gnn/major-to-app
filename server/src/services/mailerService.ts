import nodemailer from 'nodemailer';

export interface DynamicSmtpCredentials {
  smtpUser: string;
  smtpAppPassword: string;
}

/**
 * Creates a dynamic Nodemailer transporter using the guardian's custom Gmail SMTP credentials.
 */

export function createDynamicTransporter(creds: DynamicSmtpCredentials) {
  const { smtpUser, smtpAppPassword } = creds;

  if (!smtpUser || !smtpAppPassword) {
    throw new Error('Guardian Gmail SMTP credentials (user & app password) are required.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpAppPassword,
    },
  });
}

/**
 * Dispatches a 6-digit OTP verification code using the guardian's dynamic SMTP configuration.
 */
export async function sendGuardianOtpEmail(
  toEmail: string,
  otp: string,
  creds: DynamicSmtpCredentials
): Promise<boolean> {
  const transporter = createDynamicTransporter(creds);

  const mailOptions = {
    from: `"Personal Guardian Verification" <${creds.smtpUser}>`,
    to: toEmail,
    subject: 'Personal Guardian Verification Code',
    text: `Hello,

Someone has added this email address as their Personal Guardian in the Smart Airport Assistance app.

Your 6-digit verification code is:

${otp}

This code will expire in 5 minutes.

If you did not expect this email, you can safely ignore it.

Regards,
Personal Guardian System`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Mailer] OTP email sent dynamically to %s, messageId: %s', toEmail, info.messageId);
    return true;
  } catch (err: any) {
    console.error('[Mailer] Dynamic OTP email dispatch failed:', err?.message || err);
    throw new Error(`Gmail SMTP Authentication Failed: ${err?.message || 'Invalid App Password'}`);
  }
}

/**
 * Dispatches notification/progress updates using the guardian's dynamic SMTP configuration.
 */
export async function sendGuardianNotificationEmail(
  toEmail: string,
  subject: string,
  text: string,
  creds: DynamicSmtpCredentials
): Promise<boolean> {
  const transporter = createDynamicTransporter(creds);

  const mailOptions = {
    from: `"Airport Assistance Navigation" <${creds.smtpUser}>`,
    to: toEmail,
    subject,
    text: `Hello,

${text}

Regards,
Smart Airport Navigation System`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Mailer] Dynamic notification email sent successfully to %s, messageId: %s', toEmail, info.messageId);
    return true;
  } catch (err: any) {
    console.error('[Mailer] Dynamic notification dispatch failed:', err?.message || err);
    throw err;
  }
}
