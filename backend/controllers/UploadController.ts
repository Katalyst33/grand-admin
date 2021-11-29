import { Controller, Http } from "xpresser/types/http";
import { getInstance } from "xpresser";
import File, { FileDataType } from "../models/File";

const $ = getInstance();
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
  async destinationImage(http) {
    console.log("upload destination");

    const images = await http.files("images");
    await images.saveFiles($.path.storage("uploads/destination"));
    for (const image of images.filesWithoutError()) {
      const file = File.make(<FileDataType>{
        for: "destination",
        name: image.name,
        type: "image",
        path: image.path,
        size: image.size,
        ext: image.extension(),
      });
      file.data.path = file.data.path.replace($.path.storage(), "");
      await file.save();
      console.log(file);
    }
    return http.send(images);
  },
};
