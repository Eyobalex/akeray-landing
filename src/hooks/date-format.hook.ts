"use client";
interface Option {
  [key: string]: any;
}
export function dateFormat(
  data: any,
  options?: {
    weekday?: boolean;
    year?: boolean;
    month?: boolean;
    day?: boolean;
    hour?: boolean;
    minute?: boolean;
    hour12?: boolean;
  }
) {
  let date;

  const optionsData: Option = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  if (options) {
    if (!options.weekday) {
      delete optionsData.weekday;
    }
    if (!options.day) {
      delete optionsData.day;
    }

    if (!options.hour) {
      delete optionsData.hour;
    }
    if (!options.minute) {
      delete optionsData.minute;
    }
    if (!options?.hour12) {
      delete optionsData.hour12;
    }
  }
  if (typeof data === "string") {
    date = new Date(data);
  } else {
    date = data;
  }
  return date?.toLocaleString("en-us", optionsData);
}
