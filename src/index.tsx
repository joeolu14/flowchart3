import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createDriver, Neo4jProvider } from "use-neo4j";

const driver = createDriver(
  "neo4j",
  process.env.REACT_APP_URL!,
  7687,
  process.env.REACT_APP_USERNAME,
  process.env.REACT_APP_PASSWORD
);

ReactDOM.render(
  <Neo4jProvider driver={driver} database="stock">
    <App />
  </Neo4jProvider>,
  document.getElementById("root")
);
