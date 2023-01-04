import { expect } from "chai";
import nock from "nock";
import NodeCache from "node-cache";
import supertest from "supertest";
import {
  BetVictorDExampleResponse,
  BetVictorENGBExampleResponse,
} from "../../../src/services/betvictor/examples/response.en-gb.example";
import { config, initTestApp } from "../../helpers";

describe("router/v1/event", function () {
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

  it("should return event using BetVictor API", async () => {
    const app = await initTestApp(cache);

    const { body } = await supertest(app)
      .get("/api/v1/events/1855385200")
      .expect(200);

    expect(body)
      .to.haveOwnProperty("event")
      .which.has.ownProperty("id")
      .which.deep.eq(1855385200);
  });

  it("should return event using cache", async () => {
    const app = await initTestApp(cache);

    const { body } = await supertest(app)
      .get("/api/v1/events/1855385200")
      .expect(200);

    expect(body)
      .to.haveOwnProperty("event")
      .which.has.ownProperty("id")
      .which.deep.eq(1855385200);
  });

  it("should return event in multiple languages", async () => {
    nock(config.host)
      .get("/de/in-play/1/events")
      .reply(200, BetVictorDExampleResponse);

    const app = await initTestApp(cache);

    const { body } = await supertest(app)
      .get("/api/v1/events/1855385200?languages=en-gb,de")
      .expect(200);

    expect(body)
      .to.haveOwnProperty("event")
      .which.has.ownProperty("desc")
      .which.deep.eq({
        "en-gb": "Ferroviaria SP U20 v Nacional FC U20",
        de: "Ferroviaria SP U20 v Nacional FC U20",
      });
  });

  it("should throw 502 Bad Gateway if BetVictor service is unnavigable", async () => {
    nock.cleanAll();
    nock(config.host).get("/en-gb/in-play/1/events").reply(500, {});

    const app = await initTestApp(cache);

    await supertest(app).get("/api/v1/events/1855385200").expect(502);
  });

  it("should throw 404 for missing eventId", async () => {
    const app = await initTestApp(cache);

    await supertest(app).get("/api/v1/events/1855385201").expect(404);
  });

  it("should throw 404 for incorrect eventId", async () => {
    const app = await initTestApp(cache);

    await supertest(app).get("/api/v1/events/asasas1855385201").expect(400);
  });
});
