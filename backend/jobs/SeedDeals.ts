import JobHelper from "xpresser/src/Console/JobHelper";
import Deal from "../models/Deal";
const chance = require("chance").Chance();

import moment from "moment";

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
      "School",
      "Romance",
      "Vacation",
      "Seminars",
      "Religious",
    ];

    const country = [
      "Nigeria",
      "United Kingdom",
      "Australia",
      "United states of America",
      "Jerusalem",
      "mecca",
      "Dubai",
      "Ireland",
      "Turkey",
      "Ukraine",
      "South Africa",
      "Maldives",
    ];

    // const  time =

    // End current job process.

    let count = process.argv[4] || 5;

    count = Number(count);

    let counter = 0;

    do {
      const deals = {
        title: `${activity[chance.integer({ min: 0, max: 5 })]} in/at/ ${
          country[chance.integer({ min: 0, max: 12 })]
        } , `,
        description: chance.sentence(),
        country: chance.country({ full: true }),
        expiresIn: "2021-08-15T20:43:34.489+00:00",
        price: chance.integer({ min: 150000, max: 650000 }),
        enabled: [true, false][chance.integer({ min: 0, max: 1 })],
      };

      await Deal.new(deals);

      counter++;
    } while (counter < count);

    return job.end();
  },
};
