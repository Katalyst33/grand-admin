/**
 * This feature files any data returned to it.
 * It holds and returns the data until the expiry date is reached.
 */

import moment from "moment";
import { $ } from "../instance";

const folder = $.path.storage("cached-response");
$.file.makeDirIfNotExist(folder);

type DataFile = { date: Date; data: any };
export async function FileApiRequest<T extends (...args: any) => Promise<any>>(
  $file: `${string}.json`,
  cache_duration: number, // in seconds
  func: T,
): Promise<ReturnType<T> | undefined> {
  // find file
  const file = `${folder}/${$file}`;

  let cachedData: any;
  const now = moment();

  if ($.file.exists(file)) {
    const data = $.file.readJson(file) as DataFile;
    // convert date string to date

    const date = moment(data.date);

    // check if data is expired using cache_duration in seconds
    if (!now.isAfter(date)) {
      return data.data;
    }

    cachedData = data.data;
  }

  // run function
  try {
    const data = await func();

    // save data to file
    $.file.saveToJson(
      file,
      {
        date: now.add(cache_duration, "seconds").toDate(),
        data,
      },
      { checkIfFileExists: false },
    );

    return data;
  } catch (e) {
    if (cachedData) return cachedData;

    return undefined;
  }
}
