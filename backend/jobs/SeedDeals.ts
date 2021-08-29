import JobHelper from "xpresser/src/Console/JobHelper";
import Deal from "../models/Deal";
const chance = require("chance").Chance();

import moment from "moment";
import { randomInt } from "crypto";

/**
 *  Job: SeedDeals
 */
export = {
  // Job Handler
  async handler(args: string[], job: JobHelper): Promise<any> {
    // Your Job Here
    await Deal.native().deleteMany({});

    const activities = [
      "Travel to",
      "School at",
      "Romance in",
      "Vacation in",
      "Seminars in",
      "Religious at",
    ];

    const countryArray = [
      {
        full: "Nigeria",
        code: "NG",
      },
      {
        full: "United Kingdom",

        code: "GB",
      },
      {
        full: "Australia",

        code: "AU",
      },
      {
        full: "United states of America",

        code: "US",
      },
      {
        full: "Dubai",
        code: "AE",
      },
      {
        full: "Ireland",
        code: "IE",
      },
      {
        full: "Turkey",
        code: "TR",
      },
      {
        full: "Ukraine",
        code: "UA",
      },
      {
        full: "South Africa",
        code: "ZA",
      },
      {
        full: "Maldives",
        code: "MV",
      },
      {
        full: "Singapore",
        code: "SG",
      },
    ];

    let countryCodeString: string | never[] = [];
    let countryFullString = null;

    let count = process.argv[4] || 5;

    count = Number(count);

    let counter = 0;

    do {
      const backDate = moment().subtract(3, "months").format();
      const startDate = moment(backDate)
        .add(counter++, "months")
        .format();

      const twoWeeks = moment(startDate).add(1, "weeks").format();
      const country = countryArray[randomInt(0, countryArray.length - 1)];
      const activity = activities[randomInt(0, activities.length - 1)];
      const month = chance.month();
      const deals = {
        title: `${activity}  ${country.full} , this ${month}`,
        description: `${activity}  ${
          country.full
        } , this ${month}, ${chance.sentence()}`,
        country: {
          name: country.full,
          code: country.code,
        },
        activity,
        expiresIn: new Date("2021-08-15T20:43:34.489+00:00"),
        duration: {
          start: startDate,
          end: twoWeeks,
        },
        price: randomInt(150000, 650000),
        included: `  "Economy Class Ticket",<br>
          "5 nights in Beach resort",<br>
          "Daily breakFast",<br>
          "Return Airport transfer",<br>
          "Travel Insurance",`,
        enabled: [true, false][chance.integer({ min: 0, max: 1 })],
      };

      await Deal.new(deals);

      counter++;
    } while (counter < count);

    console.log(`Seeded ${counter} Deals`);

    return job.end();
  },
};
