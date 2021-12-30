import { Controller, Http } from "xpresser/types/http";
import Profile from "../../models/Profile";
import slugify from "slugify";
import moment from "moment";
import { CompressPdf } from "../utilities";
import { $, randomStr } from "../../exports";
import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs/ILovePDFApi";

import Document, { DocumentDataType } from "../../models/Document";

// declarations
const today = moment().format("DD-MM-YYYY");
const env = require("../../configs/env");
const uploadsFolder = $.path.storage("uploads/profile");
const instance = new ILovePDFApi(env.pdfPublicKey, env.pdfSecretKey);

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

  async everyProfile(http) {
    const everyProfile = await Profile.native().find({}).count();

    if (everyProfile) {
      http.send({ everyProfile });
    } else {
      http.send({ error: "No profile found" });
    }
  },

  async allProfiles(http) {
    const ownerId = http.params.userId;

    const userProfiles = await Profile.find({ ownerId: ownerId });

    if (userProfiles) {
      http.send(userProfiles);
    } else {
      http.send({ error: "No profiles found" });
    }
  },

  async profile(http, { profile }) {
    const allDocuments = await Document.find({
      referenceId: profile.data.reference,
    });

    return http.send({ profile, allDocuments });
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

  async uploadDoc(http, { profile }) {
    const userReference = http.params.referenceId;

    console.log(profile.data.ownerId, "the profile");

    // console.log(body, "here labels");

    /*   const profile = await Profile.findOne({ reference: userReference });
    if (!profile) {
      return http.res.send({ error: "Profile  not Found ?????" });
    }*/
    // Get File
    const document = await http.file("document", {
      size: 10, // size in megabyte
      extensions: ["png", "jpg", "jpeg", "pdf", "docx", "doc"],
      includeBody: true,
    });

    console.log(document, "document");
    // Check for error
    if (document.error()) {
      return http.res.send(document.error());
    }

    // Save File
    await document.saveTo(`${uploadsFolder}/${userReference}`, {
      // name: `new-doc`,
      name: slugify(`${document.name}`, {
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

    let savePath = document.path?.replace($.path.storage(), "");
    console.log(savePath, "savePath");

    const fileData = Document.make(<DocumentDataType>{
      for: "user",
      name: document.name,
      path: savePath,
      size: document.size,
      type: document.field,
      referenceId: userReference,
      ext: document.dotExtension(),
      category: document.body.documentCategory,
      ownerId: profile.data.ownerId,

      // ownerId: http.params.userId,
    });

    await fileData.save();
    console.log(fileData.data.path.replace($.path.storage(), ""), "DBBBB");
    return http.res.send({
      file: document,
      message: "File uploaded successfully!.",
    });
  },

  async deleteDoc(http, { profile }) {
    const documentId = http.params.referenceId;

    const document = await Document.findOne({ referenceId: documentId });

    if (!document) {
      return http.res.send({ error: "Document not found" });
    }
    await document.delete();

    return http.res.send({
      documentId,
      message: "File deleted successfully!",
    });
  },

  async delete(http, { profile }) {
    await profile.$refreshDataUsing("reference");
    await profile.delete();
    return http.send({ message: "Profile has been deleted" });
  },
};
