export const sortNodes = (
  nodeObject: any[],
  i: number,
  setState: React.Dispatch<React.SetStateAction<any[]>>,
  nodes: any[]
) => {
  if (nodeObject !== null) {
    let arr_links: any[] = [...nodes];
    let final_links: any[] = [];
    nodeObject?.forEach((res: any) => {
      const time = res.end.properties.happened
        ? new Date(res.end.properties.happened)
        : new Date(res.start.properties.happened);
      time.setTime(time.getTime() + time.getTimezoneOffset() * 60 * 1000);
      let objLink: any = {};

      objLink["start"] = res?.start;
      objLink["end"] = res?.end;
      objLink["relationshipType"] = res?.relationship?.type;
      objLink["dateHappened"] = time;
      objLink["happenedFrom"] = res.end.properties.happened ? "end" : "start";

      if (
        !arr_links.find(
          (res) => JSON.stringify(res) === JSON.stringify(objLink)
        )
      )
        arr_links.push(objLink);
    });

    setState(arr_links);
  }
};
