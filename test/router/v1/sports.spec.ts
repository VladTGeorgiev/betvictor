import { expect } from "chai";
import express from "express";
import nock from "nock";
import NodeCache from "node-cache";
import supertest from "supertest";
import { BetVictorENGBExampleResponse } from "../../../src/services/betvictor/examples/response.en-gb.example";
import { config, initTestApp } from "../../helpers";

describe("router/v1/sports", function () {
  const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

  beforeEach(async () => {
    cache.flushAll();
    nock.cleanAll();

    nock(config.host)
      .get("/en-gb/in-play/1/events")
      .reply(200, BetVictorENGBExampleResponse);
  });

  after(async () => {
    cache.flushAll();
    nock.cleanAll();
  });

  it("should return sports using BetVictor API", async () => {
    const app = await initTestApp(cache);

    const { body } = await supertest(app).get("/api/v1/sports").expect(200);

    expect(body).to.haveOwnProperty("sports").which.has.length(5);
  });

  it("should return sports using cache", async () => {
    nock.cleanAll();

    cache.set("sports:en-gb", [
      { id: 100, desc: { "en-gb": "Football" }, pos: 1 },
      { id: 600, desc: { "en-gb": "Tennis" }, pos: 2 },
      { id: 17500, desc: { "en-gb": "Cricket" }, pos: 3 },
      { id: 601600, desc: { "en-gb": "Basketball" }, pos: 4 },
      { id: 650, desc: { "en-gb": "Table Tennis" }, pos: 18 },
    ]);

    const app = await initTestApp(cache);

    const { body } = await supertest(app).get("/api/v1/sports").expect(200);

    expect(body).to.haveOwnProperty("sports").which.has.length(5);
  });

  it("should throw 502 Bad Gateway if BetVictor service is unnavigable", async () => {
    nock.cleanAll();
    nock(config.host).get("/en-gb/in-play/1/events").reply(500, {});

    const app = await initTestApp(cache);

    await supertest(app).get("/api/v1/sports").expect(502);
  });
});
