import { is, XMongoSchema, XMongoModel, joi } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";

/**
 * Interface for Model's `this.data`.
 * Optional if accessing data using model helper functions
 */
export interface FileDataType {
  updatedAt?: Date;
  createdAt: Date;
  publicId: string;
  type: "image" | "document";
  for: "user" | "destination";
  name: string;
  path: string;
  size: number;
  ext: string;
  used: boolean;
  status?: string;
  crop: {
    100: string;
    200: string;
  };
}

/**
 * File Model
 * Collection: `files`
 */
class File extends XMongoModel {
  // Set Model Schema
  static schema: XMongoSchema = {
    updatedAt: is.Date(),
    createdAt: is.Date().required(),
    publicId: is.Uuid(4).required(),
    type: is.String(["image", "document"]).required(),
    for: is.String(["user", "destination"]).required(),
    name: is.String().required(),
    path: is.String().required(),
    size: is.Number().required(),
    ext: is.String().required(),
    used: is.Boolean().required(),
    status: is.String(),
    crop: joi
      .object()
      .keys({
        100: joi.string().required(),
        500: joi.string().required(),
      })
      .default({}),
  };

  public data!: FileDataType;
}

/**
 * Map Model to Collection: `files`
 * .native() will be made available for use.
 */
UseCollection(File, "files");

export default File;
