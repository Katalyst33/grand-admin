import { ControllerClass } from "xpresser";
import { Http } from "xpresser/types/http";
import Profile from "../../models/Profile";
import { $ } from "../../exports";
import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs/ILovePDFApi";
import slugify from "slugify";
import moment from "moment";
import { CompressPdf, ImageToPdf } from "../utilities";
import { type } from "os";

// declarations
const today = moment().format("DD-MM-YYYY");
const env = require("../../configs/env");
const uploadsFolder = $.path.storage("uploads");
const instance = new ILovePDFApi(env.pdfPublicKey, env.pdfSecretKey);

const fileTypes = {
  image: ["png", "jpg", "jpeg"],
  doc: ["pdf", "docx"],
};
const labels = {
  passport: "Passport",
  "bank-statement": "Bank Statement",
  "nepa-bill": "Nepa Bill",
};
/**
 * ProfileController
 */
class ProfileController extends ControllerClass {
  /**
   * Example controller action.
   * @param {Http} http
   */

  async profile(http: Http) {
    const userReference = http.params.referenceId;

    let profile = await Profile.findOne({ "user.reference": userReference });

    if (!profile) {
      return http.res.send({ error: "Profile not Found" });
    }
    return http.send(profile);
  }

  async update(http: Http) {
    const profileId = http.params.dealId;
    const newProfile = http.$body.all();
    let profile = await Profile.findOne({ uuid: profileId });
    if (!profile) {
      return http.res.send({ error: "Profile not Found" });
    }

    await profile.update(newProfile);

    return http.toApi({ newDeal: newProfile, message: "Profile was Edited" });
  }

  async uploadDoc(http: Http) {
    // Get File
    const file = await http.file("image", {
      size: 10, // size in megabyte
      // extensions: ["png", "jpg", "gif", "svg", "pdf"],
      includeBody: true,
      // mimetype: 'image',
    });

    // Check for error
    if (file.error()) {
      return http.res.send(file.error());
    }

    // Save File
    await file.saveTo($.path.storage(""), {
      // name: `new-doc`,
      name: slugify(`passport-${moment().format()}`, {
        replacement: "-",
        remove: undefined,
        lower: false,
        strict: true,
        locale: "vi",
        trim: true,
      }),

      prependExtension: true,
      overwrite: true,
    });

    // check for save error()
    if (!file.isSaved()) {
      return http.res.send(file.saveError());
    }
    if (file.isSaved()) {
      //*********************** start ilove pdf

      // await ImageToPdf(file);

      await CompressPdf(file);
      //******************** start ilove pdf

      return http.res.send({
        file: file,
        msg: "File uploaded successfully!.",
      });
    }

    // return response.
  }

  /* async uploadDocs(http: Http) {
    const userReference = http.params.referenceId;

    const profile = await Profile.findOne({ "user.reference": userReference });
    if (!profile) {
      return http.res.send({ error: "Profile  not Found" });
    }
    const images = await http.files(
      ["passport", "bank-statement", "nepa-bill"],
      {
        files: 5,
        size: 1,
        mimetype: "image",
      }
    );

    // Or save files to specific folder using conditions by passing a function

    await images.saveFiles(
      (file) => {
        console.log(file);
        return `${uploadsFolder}/${today}/${file.input}`;
      },
      (file) => {
        return {
          name: `${profile.data.user.uuid}`,
          prependExtension: true,
        };
      }
    );

    images.filesWithoutError().forEach((i) => {
      profile.set(`images.${i.input}`, i.path.replace(uploadsFolder, ""));
      profile.set(`docs.${i.input}`, false);
    });

    await profile.save();
    // check errors
    const errorMessage: string[] = [];

    if (images.hasFilesWithErrors()) {
      const filesWithErrors = images.filesWithError();

      // Do something with filesWithErrors

      for (const f of filesWithErrors) {
        // @ts-ignore
        const input = labels[f.input];
        const error = f.error()!;
        if (error.type === "mimetype") {
          errorMessage.push(
            `${input} format not supported, upload image with (.png, .jpg,jpeg)`
          );
        } else if (error.type === "size") {
          errorMessage.push(`${input} is too large`);
        }
      }
    }

    // return response
    return http.send({
      errorMessage,
      message: `${
        images.filesWithoutError().length
      } files has been uploaded successfully!.`,
    });
  }*/
  async uploadDocs(http: Http) {
    const userReference = http.params.referenceId;

    const profile = await Profile.findOne({ "user.reference": userReference });
    if (!profile) {
      return http.res.send({ error: "Profile  not Found" });
    }

    const images = await http.files(
      ["passport", "bank-statement", "nepa-bill"],
      {
        files: 5,
        size: 1,
        mimetype: "image",
        customErrors: {
          field: (err) => `field not found: ${err.field}`,
          file: (err) => `No file found for field: ${err.field}`,
          size: "File is too large", // can also be plain string.
          mimetype: (err) =>
            `${err.filename}--${err.field} mimetype does not match the expected mimetype: ${err.received}`,
          extension: (err) => `${err.filename} has unsupported file extension`,
        },
      }
    );
    if (images.hasFilesWithErrors()) {
      return images.errorMessages(); // [ 'File size is too large.']
    }

    console.log("hhhh");
    return http.send("done!!");
  }
}

export = ProfileController;

/*  if (file.dotExtension() === ".jpg") {
    return `${uploadsFolder}/${file.extension()}`;
  }
  if (file.dotExtension() === ".pdf") {
    return $.path.storage("pdf");
  }
  // console.log(file.name, file.path);
  return $.path.storage("/uploads") + file.dotExtension();*/
