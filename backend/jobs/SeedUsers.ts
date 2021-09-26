import JobHelper from "xpresser/src/Console/JobHelper";

/**
 *  Job: SeedUsers
 */
export = {
  // Job Handler
  async handler(args: string[], job: JobHelper): Promise<any> {
    // Your Job Here

    console.log(args[0], args[1]);

    console.log("Users have been Seeded");
    // End current job process.
    return job.end();
  },
};
