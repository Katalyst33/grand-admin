import JobHelper from "xpresser/src/Console/JobHelper";
import Deal from "../models/Deal";
const chance = require("chance").Chance();

/**
 *  Job: SeedDeals
 */
export = {
  // Job Handler
  async handler(args: string[], job: JobHelper): Promise<any> {
    // Your Job Here
    await Deal.native().deleteMany({});

    const activity = [
      "Travel",
      // "School",
      "Romance",
      "Vacation",
      "Seminars",
      "Religious",
    ];

    const FormattedActivity = `${
      activity[chance.integer({ min: 0, max: 5 })]
    } `;

    // const  time =
    const deals = {
      title: "School visa",
      description: `${FormattedActivity} `,
      country: chance.country({ full: true }),
      expiresIn: "2021-08-15T20:43:34.489+00:00",
      price: chance.integer({ min: -20, max: 20 }),
    };

    await Deal.new(deals);

    // End current job process.
    return job.end();
  },
};
