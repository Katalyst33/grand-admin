// Import Xpresser
import xpresser = require("xpresser");

/**
 * Boot Xpresser with your config.
 *
 * Get config from config.ts
 * See https://xpresserjs.com/configuration/
 */
import config = require("./configs/config");
import env = require("./configs/env");
import { Options } from "xpresser/types";

export = (options: Options = { exposeDollarSign: false }) => {
  // Initialize Xpresser
  const $ = xpresser.init(config, options);

  return $;
};
