import "dotenv/config";
import bodyParser from "body-parser";
import express from "express";
import NodeCache from "node-cache";
import { getConfig } from "./config";
import { createV1Router } from "./router/v1";
import { createBetVictorService } from "./services/betvictor";

/**
 * Project entrypoint bootstrapping all necessary services and creating a server
 */
(async function () {
  const { host, path, port } = getConfig();
  const app = express();

  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());

  const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
  console.info("CacheService running...");

  const service = await createBetVictorService(host, path, cache);

  try {
    await service.getData();
  } catch (e) {
    console.error("BetVictor API is unavailable");
  }

  app.use("/api/v1", createV1Router(service, cache));

  app.listen(port, () =>
    console.info(`BetVictor Proxy server listening on port ${port}!`)
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
