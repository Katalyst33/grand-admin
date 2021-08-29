const moment = require("moment/moment");

console.log(moment().format("MMM Do YY"));
console.log();

const threeMonthsAgo = moment().subtract(3, "months").format();
const twoWeeks = moment(threeMonthsAgo).add(2, "weeks").format("MMM Do YY");

// const randomMonth = moment.ad

const startDate = moment().add(3, "days").format("MMM Do YY");

const duration = {
  start: startDate,
  end: "",
};

console.log(moment().subtract(3, "months").format("MMM Do YY"), "3 months ago");
console.log(twoWeeks, "plus 2 weeks");
