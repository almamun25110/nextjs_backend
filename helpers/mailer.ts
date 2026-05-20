const nodemailer = require("nodemailer");
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
     const hashedUserId = await bcrypt.hash(userId.toString(), 10);
     if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, { verificationToken: hashedUserId, verificationTokenExpiry: Date.now() + 3600000 });
     } else if (emailType === "Reset your password") {
      await User.findByIdAndUpdate(userId, { forgotPasswordToken: hashedUserId, forgotPasswordExpiry: Date.now() + 3600000 });
     }

    var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
  }
});
    const info = await transport.sendMail({
    from: 'abdullah@example.com',
    to: email,
    subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
    html: `<p>Click <a href='${process.env.DOMAIN}/verify-email?token=${hashedUserId}'>here</a> to ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"}</p>`,
  });
    return info;

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}