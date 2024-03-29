import JobHelper from "xpresser/src/Console/JobHelper";
import { sendMailViaSmtp } from "@techie04/xpresser-mailer/providers/SmtpProvider";
import { mjmlToHtmlConverter } from "../exports";

/**
 *  Job: Mailer
 */
export = {
  // Job Handler
  async handler(args: string[], job: JobHelper): Promise<any> {
    // Your Job Here

    try {
      const template = mjmlToHtmlConverter("welcome", {
        name: "John Doe",
        email: "john@gmail.com",
      });
      const data = await sendMailViaSmtp({
        from: "noreply@getravelandtours.com",
        to: "kats.com.ng@gmail.com",
        subject: `Grand eagle travels`,
        html: template,
      });
      console.log(data);
      // console.log(template, $.path.views("layouts/welcome.mjml"), "mjml?");
    } catch (e) {
      console.log(e, "error sending mail??");
    }
  },
};
