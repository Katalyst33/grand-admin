import JobHelper from "xpresser/src/Console/JobHelper";
const env = require("../../backend/configs/env");

/**
 *  Job: Trash
 */
export = {
  // Job Handler
  async handler(args: string[], job: JobHelper): Promise<any> {
    // Your Job Here
    // console.log($.config);
    console.log(env);
    // End current job process.
    return job.end();
  },
};
