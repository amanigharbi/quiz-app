// utils/mailer.js
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: "amanigharbi9@gmail.com",
    pass: "lsoj mrfv veau jujd",
  },
});

exports.sendResetPasswordEmail = async (email, resetLink) => {
  const mailOptions = {
    from: "no-reply@example.com",
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour procéder :</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Réinitialiser mon mot de passe
        </a>
        <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.</p>
        <p style="font-size: 12px; color: #777;">Ce lien expirera dans 15 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
