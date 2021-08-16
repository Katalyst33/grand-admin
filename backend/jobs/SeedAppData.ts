import JobHelper from "xpresser/src/Console/JobHelper";
import AppConfig from "../models/AppConfig";

// Load and instantiate Chance
const chance = require("chance").Chance();

// Use Chance here.

/**
 *  Job: SeedAppData
 */
export = {
  // Job Handler
  async handler(args: string[], job: JobHelper): Promise<any> {
    // Your Job Here
    await AppConfig.native().deleteMany({});

    const companyData = {
      companyName: "Grand Eagle",
      contact: {
        phone: chance.phone({ country: "uk", mobile: true }),
        email: chance.email({ domain: "travel.com" }),
        address: chance.address(),
      },
    };

    await AppConfig.native().insertOne(companyData);
    console.log("Company Data Seeded");

    // End current job process.
    return job.end();
  },
};
