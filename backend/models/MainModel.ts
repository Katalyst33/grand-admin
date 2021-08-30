import { is, XMongoSchema, XMongoModel, omitIdAndPick } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";

/**
 * Interface for Model's `this.data`.
 * Optional if accessing data using model helper functions
 */
export interface MainModelDataType {
  updatedAt?: Date;
  createdAt: Date;
}

/**
 * MainModel Model
 * Collection: `main_models`
 */
class MainModel extends XMongoModel {
  static publicFields: string[] = [];

  static projectPublicFields() {
    return omitIdAndPick(this.publicFields);
  }

  publicFields() {
    const publicFields = this.$static<typeof MainModel>().publicFields;
    return this.toCollection().pick(publicFields);
  }

  public data!: MainModelDataType;
}

export default MainModel;
