export const formatDate = (date: string, isUtc?: boolean) => {
  return new Date(date)
    .toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: isUtc === undefined ? "UTC" : undefined,
    })
    .toString();
};

export const formatDateWithoutClock = (date: string) => {
  return new Date(date)
    .toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: false,
      timeZone: "UTC",
    })
    .toString();
};

export const getDatesBetween = (start: Date, end: Date) => {
  let arr = [];
  for (
    let dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(
      new Date(dt).toLocaleDateString("fr-CA", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
    );
  }
  return arr;
};

export const formatDateYearFirst = (date: string) => {
  //year first, date only, with dash
  return new Date(date)
    .toLocaleString("fr-CA", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour12: false,
    })
    .toString();
};
