import { Controller, Http } from "xpresser/types/http";
import { $ } from "../../exports";

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
};
