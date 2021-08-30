import JobHelper from "xpresser/src/Console/JobHelper";

/**
 *  Job: DealsCheck
 */
export = {
  // Job Handler
  async handler(args: string[], job: JobHelper): Promise<any> {
    // Your Job Here

    console.log("Deals manager !!");

    // End current job process.
    return job.end();
  },
};
