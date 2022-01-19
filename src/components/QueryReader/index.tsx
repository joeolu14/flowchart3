import React, { useCallback, useEffect, useState } from "react";
import * as d3 from "d3";
import Q1 from "../../cipher/Query1";
import { useReadCypher } from "use-neo4j";
import { sortNodes } from "../../utilities/sortNodes";
import { translate } from "../../utilities/translate";

const QueryReader = () => {
  const HEIGHT = 800;
  const [p1Data, setP1Data] = useState<any[]>([]);
  const [p2Data, setP2Data] = useState<any[]>([]);
  const [p3Data, setP3Data] = useState<any[]>([]);
  const [result, setResult] = useState<any>({});
  const [finalResult, setFinalResult] = useState<any[] | undefined>();
  const [identity, setIdentity] = useState<any>({});
  const [identityArr, setIdentityArr] = useState<string[]>([]);

  const { loading, error, records } = useReadCypher(Q1);

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (!loading) {
      const data1 = records?.map((res) => res?.get("p1"));
      const data2 = records?.map((res) => res?.get("p2"));
      const data3 = records?.map((res) => res?.get("p3"));

      let dd1: any = [];
      let dd2: any = [];
      let dd3: any = [];

      if (data1 !== null) {
        data1?.forEach((res, i) => {
          if (res) {
            let seg = res?.segments;
            dd1.push(...seg);
          }
        });
      }
      if (data2 !== null) {
        data2?.forEach((res, i) => {
          if (res) {
            let seg = res?.segments;
            dd2.push(...seg);
          }
        });
      }
      if (data3 !== null) {
        data3?.forEach((res, i) => {
          if (res) {
            let seg = res?.segments;
            dd3.push(...seg);
          }
        });
      }
      sortNodes(dd1, 1, setP1Data, p1Data);
      sortNodes(dd2, 2, setP2Data, p2Data);
      sortNodes(dd3, 3, setP3Data, p3Data);
    }
    // }
  }, [loading, records]);

  const finalLinker = useCallback(
    (identity: any, data: any) => {
      const obj_name = Object.keys(identity);
      setIdentityArr(obj_name);
      obj_name.forEach((resx) => {
        identity[resx].forEach((res: any) => {
          if (res !== undefined) {
            let obj_relation1 = p2Data.find(
              (resp) =>
                resp.start.identity.low === res || resp.end.identity.log === res
            );
            let obj_relation2 = p3Data.find(
              (resp) =>
                resp.start.identity.low === res || resp.end.identity.log === res
            );
            if (obj_relation1) data[resx] = [...data[resx], ...[obj_relation1]];
            if (obj_relation2) data[resx] = [...data[resx], ...[obj_relation2]];
          }
        });
      });
      Interpreter(obj_name, data);
    },
    [p2Data, p3Data]
  );

  const RearrageResults = useCallback(() => {
    const dates: Date[] | undefined = [];
    let data = {};
    const identity = {};

    if (p1Data.length > 0) {
      p1Data.forEach((res) => {
        if (!dates.includes(res.dateHappened.toString())) {
          dates.push(res.dateHappened.toString());
        }
      });
    }

    if (p1Data.length > 0) {
      p1Data.forEach((res) => {
        const mini_date: string = res.dateHappened.toString();
        //@ts-ignore
        // data[mini_date] = [...data[mini_date], res];

        data[mini_date] = [...(data[mini_date] || []), res];
        //@ts-ignore
        identity[mini_date] = [
          //@ts-ignore
          ...(identity[mini_date] || []),

          ...[
            //@ts-ignore
            identity[mini_date]?.includes(res.start.identity.low)
              ? undefined
              : res.start.identity.low,
            //@ts-ignore
            identity[mini_date]?.includes(res.end.identity.low)
              ? undefined
              : res.end.identity.low,
          ],
        ];
      });
    }

    setIdentity(identity);
    setResult(data);
    finalLinker(identity, data);
  }, [p1Data, finalLinker]);

  useEffect(() => {
    RearrageResults();
  }, [p1Data, p2Data, p3Data, RearrageResults]);

  const Interpreter = (obj_name: string[], data: any) => {
    const new_arr: any[] = [];
    obj_name?.forEach((res) => {
      new_arr.push(translate(data[res]));
    });
    setFinalResult(new_arr);
  };

  /// Draw

  const svg = d3
    .select("svg")
    .attr("width", finalResult?.length! * 370)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("height", HEIGHT)
    .style("font", "10px sans-serif");

  const g = svg.append("g").attr("transform", "translate(20,20)");

  useEffect(() => {
    if (finalResult) {
      const rects = g
        .selectAll(".rects")
        .data(finalResult)
        .join("rect")
        .attr("x", (d, i) => i * 350)
        .attr("y", 40)
        .attr("width", 300)
        .attr("height", 200)
        .attr("stroke", "black")
        .attr("fill", "transparent");

      const fo = g
        .selectAll("foreignObject")
        .data(finalResult)
        .join("foreignObject")
        .attr("width", 250)
        .attr("height", 180)
        .attr("x", (d, i) => i * 350)
        .attr("y", 50)
        .attr("transform", "translate(15,0)")
        .append("xhtml:div")
        .style("font", "16px 'Helvetica Neue")
        .style("color", "black")
        .text((d) => d);
    }
    let types: any[] = [];

    identityArr.forEach((res, i) => {
      types.push({ type: `arrow${i}` });
    });

    svg
      .append("defs")
      .selectAll("marker")
      .data(types)
      .join("marker")
      .attr("id", (d) => `arrow-${d.type}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "black")
      .attr("d", "M0,-5L10,0L0,5");

    //   Draw our connecting lines;

    const lines = svg.append("g");
    lines
      .selectAll("line")
      .data(types)
      .join("line")
      .attr("x1", (d, i) => i * 350 + 350 - 20)
      .attr("x2", (d, i) => i * 350 + 350 + 10)
      .attr("y1", 150)
      .attr("y2", 150)
      .attr("stroke", (d, i) => {
        if (i === types.length - 1) {
          return "white";
        }
        return "black";
      })
      .attr("marker-end", (d, i) => {
        if (i === types.length - 1) {
          return "";
        }

        return `url(#arrow-${d.type})`;
      });

    return () => {
      g.remove();
    };
  }, [finalResult, g, identityArr, svg]);

  return (
    <div
      style={{
        overflow: "auto",
        width: "1000px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <svg> </svg>
    </div>
  );
};

export default QueryReader;
