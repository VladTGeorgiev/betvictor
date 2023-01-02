import "dotenv/config";
import axios from "axios";
import express, { Request, Response } from "express";
import { getConfig } from "./config";

(async function () {
  const { host, path, port } = getConfig();
  const language = "/en-gb";
  const app = express();

  app.get("/sports", async (req: Request, res: Response) => {
    try {
      const response = await axios.get(`${host}${language}${path}`);
      const sports = response.data.result.sports;
      res.json(sports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching sports data" });
    }
  });

  app.listen(port, () =>
    console.info(`BetVictor Proxy server listening on port ${port}!`)
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
