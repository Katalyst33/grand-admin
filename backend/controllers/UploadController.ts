import { Controller, Http } from "xpresser/types/http";
import { getInstance } from "xpresser";
import File, { FileDataType } from "../models/File";
import sharp from "sharp";

const $ = getInstance();
const folderPath: Record<any, string> = {
  default: $.path.storage("uploads/destination"),
  100: $.path.storage("uploads/destination/100"),
  500: $.path.storage("uploads/destination/500"),
};

for (const folder of Object.values(folderPath)) {
  $.file.makeDirIfNotExist(folder);
}
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
    const images = await http.files("images", {
      size: 0.5, //mb
    });
    await images.saveFiles(folderPath.default);
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
      //crop file here

      for (let folder of Object.keys(folderPath) as any) {
        if (folder !== "default") {
          folder = parseInt(folder);
          //crop file here
          const fullPath = `${folderPath[folder]}/${image.name}`;
          await sharp(image.path).resize(folder, folder).toFile(fullPath);
          // set full path
          (file.data.crop as any)[folder] = fullPath.replace(
            $.path.storage(),
            ""
          );
        }
      }

      await file.save();
      console.log(file);
    }
    return http.send(images);
  },
};
