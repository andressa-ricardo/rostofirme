import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.EMAIL_PORT || "587", 10),
  secure: false,
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  requireTLS: true,
  connectionTimeout: 20000,
  logger: false,
  debug: true,
});

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  replacements: Record<string, string>
) => {
  try {
    const templatePath = path.join(
      __dirname,
      `../template/${templateName}.html`
    );
    let html = fs.readFileSync(templatePath, "utf-8");

    Object.keys(replacements).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      html = html.replace(regex, replacements[key]);
    });

    const mailOptions = {
      from:
        process.env.EMAIL_FROM || '"Rosto Firme" <noreply@rostofirme.com.br>',
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ E-mail enviado com sucesso para", to);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
  }
};
