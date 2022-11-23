import sgMail from "@sendgrid/mail";
import "dotenv/config";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export const sendActiveAccountEmail = async (email: string, activationString: string) => {
  const message = {
    from: "flashwolf@outlook.com.vn",
    to: email,
    subject: "Activation your account now!",
    text: "please click to link to activate account",
    html: `<h1>THANKS FOR JOIN WITH US</h1>
        <h2>Your code: ${activationString}</h2>`,
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
