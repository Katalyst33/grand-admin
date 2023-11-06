import instance from "./backend/instance";
import cookieParser from "cookie-parser";

const $ = instance();

$.initializeTypescript(__filename);

$.on.expressInit((next) => {
  const express = require("express");
  const folder = $.path.storage();

  $.app!.use("", express.static(folder));
  $.app!.use(cookieParser());
  next();
});
$.boot();

// END File
