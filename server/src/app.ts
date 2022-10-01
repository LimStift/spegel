import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import morgan from "morgan";
import { parseStringPromise } from "xml2js";

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

interface SensorValue {
  entity_id: string;
  state: number;
  last_changed: Date;
}

app.get("/api/internalpower", async (req, res) => {
  const periodCutoff = new Date(Date.now() - 600000); // Last 10 mins
  const response = await fetch(
    `http://192.168.1.100:8123/api/history/period/${periodCutoff.toISOString()}?filter_entity_id=sensor.power_consumed`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HOMEASSISTANT_TOKEN}`,
      },
    }
  );

  const responseJson = (await response.json()) as SensorValue[][];
  const result = responseJson[0].map((s) => {
    return { date: s.last_changed, value: s.state };
  });

  res.send(result);
});

interface Point {
  "price.amount": string[];
}

app.get("/api/powermarket", async (req, res) => {
  const today = new Date();
  const response = await fetch(
    "https://web-api.tp.entsoe.eu/api?" +
      `securityToken=${process.env.ENTSOE_TOKEN ?? ""}&` +
      `documentType=A44&` +
      `in_Domain=10Y1001A1001A47J&` +
      `out_Domain=10Y1001A1001A47J&` +
      `periodStart=${today.getFullYear()}${today.toLocaleString("sv", {
        month: "2-digit",
      })}${today.toLocaleString("sv", {
        day: "2-digit",
      })}1100&` +
      `periodEnd=${today.getFullYear()}${today.toLocaleString("sv", {
        month: "2-digit",
      })}${today.toLocaleString("sv", {
        day: "2-digit",
      })}1200`
  );

  const data = await parseStringPromise(await response.text());

  res.send(
    data.Publication_MarketDocument.TimeSeries[0].Period[0].Point.map((e: Point) =>
      parseFloat(e["price.amount"][0])
    )
  );
});

app.get("/api/time", async (req, res) => {
  const response = await fetch("http://worldtimeapi.org/api/timezone/Europe/Stockholm");

  res.send(await response.json());
});

app.get("/api/travelbus", async (req, res) => {
  const response = await fetch(
    `https://api.resrobot.se/v2.1/departureBoard?id=740017393&duration=240&format=json&accessId=${process.env.RESROBOT_ACCESS_ID}`
  );

  res.send(await response.json());
});

app.get("/api/traveltrain", async (req, res) => {
  const response = await fetch(
    `https://api.resrobot.se/v2.1/departureBoard?id=740001547&duration=240&format=json&accessId=${process.env.RESROBOT_ACCESS_ID}`
  );

  res.send(await response.json());
});

app.get("/api/weather", async (req, res) => {
  const response = await fetch(
    "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/12.9081/lat/55.8557/data.json"
  );

  res.send(await response.json());
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
