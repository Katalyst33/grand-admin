// Import Xpresser
import xpresser = require("xpresser");

import instance = require("./backend/instance");

const $ = instance();
const cookieParser = require("cookie-parser");

$.initializeTypescript(__filename);

$.on.expressInit((next) => {
  const express = require("express");
  const folder = $.path.storage();
  console.log(folder);

  $.app!.use("", express.static(folder));
  $.app!.use(cookieParser());
  next();
});
$.boot();

// END File
