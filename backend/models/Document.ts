import { is, XMongoSchema, XMongoModel, joi } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";

/**
 * Interface for Model's `this.data`.
 * Optional if accessing data using model helper functions
 */
export interface DocumentDataType {
  updatedAt?: Date;
  createdAt: Date;
  publicId: string;
  type: "document";
  for: "user";
  name: string;
  path: string;
  size: number;
  ext: string;

  referenceId: string;
  ownerId?: string;
  category: string;
  optimizedPath?: string;
}

/**
 * Document Model
 * Collection: `documents`
 */
class Document extends XMongoModel {
  // Set Model Schema
  static schema: XMongoSchema = {
    updatedAt: is.Date(),
    createdAt: is.Date().required(),

    publicId: is.Uuid(4).required(),
    type: is.String(["document"]).required(),
    for: is.String(["user"]).required(),
    name: is.String().required(),
    path: is.String().required(),
    size: is.Number().required(),
    ext: is.String().required(),
    category: is.String().required(),

    ownerId: is.String(),
    referenceId: is.String().required(),
    optimizedPath: is.String(),
  };

  public data!: DocumentDataType;
}

/**
 * Map Model to Collection: `documents`
 * .native() will be made available for use.
 */
UseCollection(Document, "documents");

export default Document;
