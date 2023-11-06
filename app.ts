import cookieParser from "cookie-parser";
import { $ } from "./backend/instance";

$.on.expressInit((next) => {
  const express = require("express");
  const folder = $.path.storage();

  $.app!.use("", express.static(folder));
  $.app!.use(cookieParser());
  next();
});

$.boot();

// END File
