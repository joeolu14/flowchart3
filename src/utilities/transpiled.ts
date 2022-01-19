const numberWithCommas = (x: string) => {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return x;
};

export const transpiled = (label: string, pointer: string, res: any) => {
  if (label === "Vendor" && pointer === "start") {
    return "vendor " + res?.start?.properties?.name;
  }
  if (label === "Vendor" && pointer === "end") {
    return "vendor " + res?.end?.properties?.name;
  }
  if (label === "Portion" && pointer === "end") {
    return `${numberWithCommas(res?.end?.properties?.quantity)} ${
      res?.end?.properties?.unit
    } of batch ${res?.end?.properties?.from_batch}`;
  }
  if (label === "Portion" && pointer === "start") {
    return `${numberWithCommas(res?.start?.properties?.quantity)} ${
      res?.start?.properties?.unit
    } of batch ${res?.start?.properties?.from_batch}`;
  }
  if (label === "Inventory" && pointer === "start") {
    return `site ${res?.start?.properties?.site} (batch: ${res?.start?.properties?.batch})`;
  }
  if (label === "Inventory" && pointer === "end") {
    return `site ${res?.end?.properties?.site} (batch: ${res?.end?.properties?.batch})`;
  }
  if (label === "Batch" && pointer === "start") {
    return `Batch is ${res?.start?.properties?.batch}`;
  }
  if (label === "Batch" && pointer === "end") {
    return `Batch is ${res?.end?.properties?.batch}`;
  }
  if (label === "WIP" && pointer === "start") {
    return `site WIP-${res?.start?.properties?.site}`;
  }
  if (label === "WIP" && pointer === "end") {
    return `site WIP-${res?.end?.properties?.site}`;
  }
  if (label === "Customer" && pointer === "start") {
    return "customer " + res?.start?.properties?.name;
  }
  if (label === "Customer" && pointer === "end") {
    return "customer " + res?.end?.properties?.name;
  }
  if (label === "Purchase" && pointer === "start") {
    return res?.start?.properties?.id;
  }
  if (label === "Purchase" && pointer === "end") {
    return res?.end?.properties?.id;
  }
};
