import sgMail from "@sendgrid/mail";
import "dotenv/config";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export const sendInvitationGroupEmail = async (email: string, link: string, inviterName: string, groupName: string) => {
  const message = {
    from: "flashwolf@outlook.com.vn",
    to: email,
    subject: "INVITATION EMAIL",
    text: "Please click to link to activate account",
    html: `<h1>${inviterName} invite you to join group ${groupName}</h1>
    <p>Please click to link to join group <a href="${link}"> JOIN GROUP</a></p>`,
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
