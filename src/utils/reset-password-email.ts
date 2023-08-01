import sgMail from "@sendgrid/mail";
import "dotenv/config";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export const sendResetPasswordEmail = async (email: string, url: string) => {
  const message = {
    from: "flashwolf@outlook.com.vn",
    to: email,
    subject: "RESET YOUR PASSWORD!",
    text: "Please click to link to reset your password",
    html: `<h1>THANKS FOR JOIN WITH US</h1>
        <h2>Click here to reset your password: <a href="${url}">RESET</a></h2>`,
  };
  try {
    await sgMail.send(message);
    console.log("Sent email");
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
