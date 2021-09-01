import { ControllerClass } from "xpresser";
import { Http } from "xpresser/types/http";
import Profile from "../../models/Profile";
import { $ } from "../../exports";

import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs/ILovePDFApi";
import ImagePdfTask from "@ilovepdf/ilovepdf-js-core/tasks/ImagePdfTask";
import ILovePDFFile from "@ilovepdf/ilovepdf-js-core/utils/ILovePDFFile";
import ILovePDFFIle from "@ilovepdf/ilovepdf-js/ILovePDFFile";
import CompressTask from "@ilovepdf/ilovepdf-js-core/tasks/CompressTask";
import slugify from "slugify";
import moment from "moment";
import fs from "fs";
import { CompressPdf, ImageToPdf } from "../utilities";
import Deal from "../../models/Deal";
const env = require("../../configs/env");

const uploadsFolder = $.path.storage("uploads");

const instance = new ILovePDFApi(env.pdfPublicKey, env.pdfSecretKey);

/**
 * ProfileController
 */
class ProfileController extends ControllerClass {
  /**
   * Example controller action.
   * @param {Http} http
   */

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

    console.log("file path", $.path.storage("uploads/"));

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
      const pdfPrams = {
        rotate: 90,
        password: "",
      };
      const fileBuff = {
        lastModified: "",
        name: "",
        size: "",
        type: "",
        arrayBuffer: "",
        slice: "",
        stream: "",
        text: "",
      };

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

  async uploadDocs(http: Http) {
    const profileId = http.params.profileId;

    const profile = await Profile.findOne({ uuid: profileId });
    if (!profile) {
      return http.res.send({ error: "Profile  not Found" });
    }

    const images = await http.files("images", {
      files: 10,
      size: 10,
      // mimetype: "image",
    });

    // check errors
    if (images.hasFilesWithErrors()) {
      const filesWithErrors = images.filesWithError();

      // Do something with filesWithErrors

      return http.send({
        message: "Upload encountered some errors",
      });
    }

    // Save all files to one folder
    // await images.saveFiles($.path.storage("/uploads"));

    // Or save files to specific folder using conditions by passing a function
    const today = moment().format("DD-MM-YYYY");

    await images.saveFiles((file) => {
      console.log(file.dotExtension());
      return `${uploadsFolder}/${today}/${file.extension()}`;

      /*  if (file.dotExtension() === ".jpg") {
        return `${uploadsFolder}/${file.extension()}`;
      }
      if (file.dotExtension() === ".pdf") {
        return $.path.storage("pdf");
      }
      // console.log(file.name, file.path);
      return $.path.storage("/uploads") + file.dotExtension();*/
    });

    // console.log(images.filesWithoutError());
    console.log(profileId, "a profile Id");

    images.filesWithoutError().forEach((file) => {
      profile.update({ name: "first image" });
    });

    for (const file of images.filesWithoutError()) {
      // Save file.
      await profile.update({
        images: `${uploadsFolder}/${today}/${file.extension()}`,
      });

      // await file.saveTo(`uploads/${file.extension()}`)
    }

    // return response
    return http.send({
      message: `${images.files.length} files has been uploaded successfully!.`,
    });
  }
}

export = ProfileController;
