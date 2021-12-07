import { Controller, Http } from "xpresser/types/http";
import Profile from "../../models/Profile";
import slugify from "slugify";
import moment from "moment";
import { CompressPdf } from "../utilities";
import { $, randomStr } from "../../exports";
import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs/ILovePDFApi";
import { type } from "os";
import UploadedFile from "@xpresser/file-uploader/js/src/UploadedFile";
import User from "../../models/User";
import Deal from "../../models/Deal";

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
export = <
  Controller.Object<{
    profile: Profile;
  }>
>{
  // Controller Name
  name: "ProfileController",

  // Controller Default Error Handler.
  e: (http: Http, error: string) => http.status(401).json({ error }),

  async boot(http: Http) {
    const data: Record<string, any> = {};
    if (http.hasParam("referenceId")) {
      const referenceId = http.params.referenceId;
      data.profile = await Profile.findOne(
        { reference: referenceId },
        {
          projection: Profile.projectPublicFields(),
        }
      );
      //
      if (!data.profile) {
        return http.status(404).send({ error: "Profile not found" });
      }
    }
    return data;
  },
  /**
   * Example Action.
   * @param http - Current Http Instance
   */

  async makeProfile(http) {
    const ownerId = http.params.userId;

    const profile = Profile.make({
      ownerId: ownerId,

      reference: randomStr(),
    });
    console.log(profile, "profile");
    await profile.save();
    // console.log(randomStr, "random ?");

    http.send({ profile });
  },

  async allProfiles(http) {
    const ownerId = http.params.userId;

    const userProfiles = await Profile.find({ ownerId: ownerId });
    http.send(userProfiles);
  },

  async profile(http, { profile }) {
    return http.send(profile);
  },

  async update(http, { profile }) {
    const body = http.$body.all();
    console.log(body, "body");

    await profile.$refreshDataUsing("reference");
    console.log(profile, "body");
    // const newProfile = profile.toCollection().omit(["_id", " createdAt"]);
    await profile.update(body);

    // console.log("new profile", newProfile);
    return http.send({ body, message: "Profile was Update " });
  },

  async uploadDoc(http: Http) {
    const userReference = http.params.referenceId;
    const label = http.$body.all();

    console.log(label, "here labels");

    const profile = await Profile.findOne({ reference: userReference });
    if (!profile) {
      return http.res.send({ error: "Profile  not Found" });
    }
    // Get File
    const document = await http.file("image", {
      size: 10, // size in megabyte
      // extensions: ["png", "jpg", "gif", "svg", "pdf"],
      includeBody: true,
      // mimetype: 'image',
    });

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
      }
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
      }
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
            `${input} format not supported, upload image with (.png, .jpg, .jpeg)`
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

  async delete(http, { profile }) {
    await profile.$refreshDataUsing("reference");
    await profile.delete();
    return http.send({ message: "Profile has been deleted" });
  },

  async docUpload(http) {},
};
