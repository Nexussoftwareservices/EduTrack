import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"EduTrack" <${process.env.EMAIL_SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent successfully:", info.messageId);
  } catch (error: any) {
    console.error("❌ Nodemailer Error Detail:", error);
    throw {
      statusCode: 500,
      message: error.message || "Failed to send email",
    };
  }
};
