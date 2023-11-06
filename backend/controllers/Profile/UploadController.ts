import { Controller, Http } from "xpresser/types/http";

import slugify from "slugify";
import moment from "moment";
import { CompressPdf } from "../utilities";
import Profile from "../../models/Profile";
import { $ } from "../../instance";
const uploadsFolder = $.path.storage("uploads");
const today = moment().format("DD-MM-YYYY");
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
 * UploadController
 */
export = <Controller.Object>{
  // Controller Name
  name: "UploadController",

  // Controller Default Error Handler.
  e: (http: Http, error: string) => http.status(401).json({ error }),

  /**
   * Example Action.
   * @param http - Current Http Instance
   */
  async upload(http: Http) {
    const file = await http.file("document", {
      size: 2,
      extensions: ["pdf", "doc", "docx", "png", "jpeg", "jpg"],
      includeBody: true,
    });

    //check for errors
    if (file.error()) {
      return http.status(400).send(file.saveError());
    }

    //save file
    await file.saveTo($.path.storage("uploads/trash"));
    //check for save error(s)
    if (!file.isSaved()) {
      return http.send(file.saveError());
    }
    //return response
    return http.send({
      file: file,
      msg: "File uploaded successfully!.",
    });
  },

  async uploadDoc(http: Http) {
    const userReference = http.params.referenceId;

    console.log(userReference, "userReference");
    const label = http.$body.all();

    /*   const profile = await Profile.findOne({ reference: userReference });
        if (!profile) {
          return http.res.send({ error: "Profile  not Found ?????" });
        }*/
    // Get File
    const document = await http.file("document", {
      size: 10, // size in megabyte
      extensions: ["png", "jpg", "jpeg", "pdf"],
      includeBody: true,
    });
    console.log(document, "document");

    // Check for error
    if (document.error()) {
      return http.res.send(document.error());
    }

    // Save File
    await document.saveTo(uploadsFolder, {
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
    if (!document.isSaved()) {
      return http.res.send(document.saveError());
    }
    if (document.isSaved()) {
      //*********************** start ilove pdf

      // await ImageToPdf(file);

      await CompressPdf(document);
      //!******************** start ilove pdf

      return http.res.send({
        file: document,
        msg: "File uploaded successfully!.",
      });
    }

    // return response.
  },

  async uploadDocs(http: Http) {
    const userReference = http.params.referenceId;

    const profile = await Profile.findOne({ reference: userReference });
    if (!profile) {
      return http.res.send({ error: "Profile  not Found" });
    }
    const images = await http.files(
      ["passport", "bank-statement", "nepa-bill"],
      {
        files: 5,
        size: 1,
        mimetype: "image",
      },
    );

    // Or save files to specific folder using conditions by passing a function

    await images.saveFiles(
      (file) => {
        return `${uploadsFolder}/${today}/${file.field!}`;
      },
      (file) => {
        return {
          name: `${profile.data.ownerId}`,
          prependExtension: true,
        };
      },
    );

    images.filesWithoutError().forEach((i) => {
      profile.set(`images.${i.field}`, i.path!.replace(uploadsFolder, ""));
      profile.set(`docs.${i.field}`, false);
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
            `${input} format not supported, upload image with (.png, .jpg, .jpeg)`,
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
  },
};
