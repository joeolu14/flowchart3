import { transpiled } from "./transpiled";
const minimizeDate = (x: string) => {
  let date = new Date(x);
  let dd = ("0" + date.getDate()).slice(-2);
  let mm = ("0" + (date.getMonth() + 1)).slice(-2);
  let yy = date.getFullYear();

  return `${yy}-${mm}-${dd}`;
};

export const translate = (resultSent: any[]) => {
  let text = "";
  resultSent.forEach((res, i) => {
    if (i === 0) text += `On ${minimizeDate(res?.dateHappened)}, `;
    if (res?.relationshipType === "OUTPUTS") {
      if (res?.end?.labels[0] === "Vendor") {
        text += `${transpiled(
          res?.start?.labels[0],
          "start",
          res
        )} was sent from ${transpiled(res?.end?.labels[0], "end", res)}. `;
      } else {
        text += `${transpiled(
          res?.end?.labels[0],
          "end",
          res
        )} was received from ${transpiled(
          res?.start?.labels[0],
          "start",
          res
        )}. `;
      }
    } else if (res?.relationshipType === "INPUT_TO") {
      text += `${transpiled(
        res?.start?.labels[0],
        "start",
        res
      )} was sent to ${transpiled(res?.end?.labels[0], "end", res)}. `;
    } else if (res?.relationshipType === "TRACKS") {
      if (res?.start?.labels[0] === "Purchase") {
        text += ` Purchase order is ${transpiled(
          res?.start?.labels[0],
          "start",
          res
        )}. `;
      }
      if (res?.end?.labels[0] === "Purchase") {
        text += ` Purchase order is ${transpiled(
          res?.end?.labels[0],
          "end",
          res
        )}. `;
      }
    }
  });

  return text;
};
