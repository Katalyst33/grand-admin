// Import Xpresser
import { init } from "xpresser";
import { Options } from "xpresser/types";
/**
 * Boot Xpresser with your config.
 *
 * Get config from config.ts
 * See https://xpresserjs.com/configuration/
 */
import config = require("./configs/config");

// Initialize Xpresser
const $ = init(config);

$.initializeTypescript(__filename);

export { $ };
