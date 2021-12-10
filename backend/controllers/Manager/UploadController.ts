import { Controller, Http } from "xpresser/types/http";
import File, { FileDataType } from "../../models/File";
import sharp from "sharp";
import { $, folderPath } from "../../exports";
import Deal from "../../models/Deal";

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

    const images = await http.files("images", {
      size: 20, //mb
    });
    await images.saveFiles(folderPath.default, (file) => {
      const filename = file.name.replace(file.dotExtension(), "");
      return {
        name: `${filename}_${$.helpers.randomStr(5)}`,
        prependExtension: true,
      };
    });
    for (const image of images.filesWithoutError()) {
      const file = File.make(<FileDataType>{
        for: "destination",
        name: image.name,
        type: "image",
        path: image.path,
        size: image.size,
        ext: image.extension(),
      });
      //
      let optimizedPath = image.path!;
      console.log(image.size, "size??");
      if (image.size > 1000000) {
        optimizedPath = `${folderPath.default}/opt_${image.name}`;

        await sharp(image.path).jpeg({ quality: 20 }).toFile(optimizedPath);
        $.file.delete(image.path!);
      }

      //
      file.data.path = optimizedPath.replace($.path.storage(), "");
      //crop file here
      for (let folder of Object.keys(folderPath) as any) {
        if (folder !== "default") {
          folder = parseInt(folder);
          //crop file here
          const fullPath = `${folderPath[folder]}/${image.name}`;
          await sharp(optimizedPath)
            .resize(folder, folder)
            .jpeg({ quality: 80 })

            .toFile(fullPath);
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
    console.log(images.filesWithoutError().length, "erros ??");
    return http.send(images);
  },
  //get all galley images
  async gallery(http: Http) {
    const images = await File.find(
      { for: "destination" },
      { sort: { createdAt: -1 } }
    );
    return http.send(images);
  },

  //delete gallery images
  async deleteImages(http: Http) {
    //get image ids
    let imageIds = http.body<string[]>("images");
    // find images
    const images = await File.find({ publicId: { $in: imageIds } });

    //loop and delete images
    for (let image of File.fromArray(images)) {
      const imagePath = $.path.storage(image.data.path);
      const crop100 = $.path.storage(image.data.crop["100"]);
      const crop500 = $.path.storage(image.data.crop["500"]);
      $.file.delete(imagePath);
      $.file.delete(crop100);
      $.file.delete(crop500);
      await image.delete();
    }
    //delete images from Deal/destination collection too
    await Deal.native().updateOne({}, { $pull: { images: { $in: imageIds } } });
    return http.send({ message: "Image(s) successfully deleted" });
  },
};
