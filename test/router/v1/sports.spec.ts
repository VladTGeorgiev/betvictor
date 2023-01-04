import { expect } from "chai";
import express from "express";
import nock from "nock";
import NodeCache from "node-cache";
import supertest from "supertest";
import { createV1Router } from "../../../src/router/v1";
import { createBetVictorService } from "../../../src/services/betvictor";
import { BetVictorENGBExampleResponse } from "../../../src/services/betvictor/examples/response.en-gb.example";

describe("router/v1/sports", function () {
  const config = {
    host: "https://partners.betvictor.localhost",
    hostpath: "/in-play/1/events",
    port: 3000,
  };

  const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

  beforeEach(async () => {
    cache.flushAll();
    nock.cleanAll();
  });

  after(async () => {
    cache.flushAll();
    nock.cleanAll();
  });

  it("should return sports using BetVictor API", async () => {
    nock(config.host)
      .get("/en-gb/in-play/1/events")
      .reply(200, BetVictorENGBExampleResponse);

    const betVictorService = await createBetVictorService(
      config.host,
      config.hostpath,
      cache
    );

    const app = express();
    app.use("/api/v1", createV1Router(betVictorService, cache));

    const { body } = await supertest(app).get("/api/v1/sports").expect(200);

    expect(body).to.haveOwnProperty("sports").which.has.length(5);
  });

  it("should return sports using cache", async () => {
    const betVictorService = await createBetVictorService(
      config.host,
      config.hostpath,
      cache
    );

    cache.set("sports:en-gb", [
      { id: 100, desc: { "en-gb": "Football" }, pos: 1 },
      { id: 600, desc: { "en-gb": "Tennis" }, pos: 2 },
      { id: 17500, desc: { "en-gb": "Cricket" }, pos: 3 },
      { id: 601600, desc: { "en-gb": "Basketball" }, pos: 4 },
      { id: 650, desc: { "en-gb": "Table Tennis" }, pos: 18 },
    ]);

    const app = express();
    app.use("/api/v1", createV1Router(betVictorService, cache));

    const { body } = await supertest(app).get("/api/v1/sports").expect(200);

    expect(body).to.haveOwnProperty("sports").which.has.length(5);
  });

  it("should throw 502 Bad Gateway if BetVictor service is unnavigable", async () => {
    nock(config.host).get("/en-gb/in-play/1/events").reply(500, {});

    const betVictorService = await createBetVictorService(
      config.host,
      config.hostpath,
      cache
    );

    const app = express();
    app.use("/api/v1", createV1Router(betVictorService, cache));

    await supertest(app).get("/api/v1/sports").expect(502);
  });
});
