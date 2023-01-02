import "dotenv/config";
import bodyParser from 'body-parser';
import express from "express";
import NodeCache from "node-cache";
import { getConfig } from "./config";
import { createV1Router } from "./controller/v1";
import { createBetVictorService } from "./service";

(async function () {
  const { host, path, port } = getConfig();
  const app = express();

  app.use(bodyParser.json());

  app.listen(port, () =>
    console.info(`BetVictor Proxy server listening on port ${port}!`)
  );

  const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
  console.info("Cache service running...");

  const service = await createBetVictorService(host, path, cache);

  app.use("/v1", createV1Router(service));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
