import "dotenv/config";
import express from "express";
import { getConfig } from "./config";
import { createV1Router } from './controller/v1';
import { createBetVictorService } from './service';

(async function () {
  const { host, path, port } = getConfig();
  const app = express();

  app.listen(port, () =>
    console.info(`BetVictor Proxy server listening on port ${port}!`)
  );

  const service = await createBetVictorService(host, path);

  app.use('/proxy', createV1Router(service));

})().catch((e) => {
  console.error(e);
  process.exit(1);
});
