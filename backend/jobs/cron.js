const cronTime = require("cron-time-generator");

module.exports = [
  {
    job: "DealsCheck",
    schedule: cronTime.everyMinute(),
  },
];
