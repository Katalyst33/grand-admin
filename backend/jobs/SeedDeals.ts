import JobHelper from "xpresser/src/Console/JobHelper";
const chance = require("chance").Chance();

/**
 *  Job: SeedDeals
 */
export = {
  // Job Handler
  async handler(args: string[], job: JobHelper): Promise<any> {
    // Your Job Here
    const deals = {
      title: "School visa",
      description: "Travel to dubai this easter",
      country: "United Arab Emirates",
      expiresIn: "2021-08-15T20:43:34.489+00:00",
      price: 240000,
    };
    // End current job process.
    return job.end();
  },
};
