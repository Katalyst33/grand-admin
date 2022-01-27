/**
 * Mailer
 */
import { sendMailViaSmtp } from "@techie04/xpresser-mailer/providers/SmtpProvider";
import { mjmlToHtmlConverter } from "../exports";
import User from "../models/User";
import config from "../../backend/configs/config";

export = {
  namespace: "mailer",

  /**
   * The `index` method is called by default.
   * it also inherits namespace as name.
   */
  async onRegistration(user: any) {
    const template = mjmlToHtmlConverter("welcome");
    await sendMailViaSmtp({
      to: user.email,
      subject: `Welcome to Grand Eagle`,
      html: template,
    });

    // Your Code
    console.log("user just registered !!", user);
  },

  async forgotPassword(user: User) {
    console.log("user forgot password", user);
    if (!user.data.passwordReset) return;

    const template = mjmlToHtmlConverter("resetPassword", {
      website: config.url,
      code: user.data.passwordReset.code,
      companyName: config.name,
    });

    await sendMailViaSmtp({
      //currently using deafault mail address you can also change it from here
      from: "noreply@getravelandtours.com",
      to: user.data.email,
      subject: "Reset your Grand Eagle password",
      html: template,
    });
  },
  async contactForm(body: any) {
    // Your Code
    try {
      console.log("Awaiting contact form !!");
      await sendMailViaSmtp({
        to: "enquiry@getravelandtours",
        subject: body.subject,
        html: `<p>Welcome to grand Eagle for all your future destinations,</p>\
      <p>Email: ${body.email}</p>
      <p>Phone: ${body.phone}</p>
      <p>Message: ${body.message}</p>      
`,
      });
      console.log("contact form sent !!", body);

      return {
        status: true,
        message: "Thank you for contacting us. We will get back to you soon.",
      };
    } catch (e) {
      console.log("contact form error !!", e);

      return {
        status: false,
        message: "Something went wrong. Please try again later.",
      };
    }
  },
};
