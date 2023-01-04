import { expect } from "chai";
import nock from "nock";
import NodeCache from "node-cache";
import supertest from "supertest";
import { BetVictorENGBExampleResponse } from "../../../src/services/betvictor/examples/response.en-gb.example";
import { config, eventsCacheResponse, initTestApp } from "../../helpers";

describe("router/v1/events", function () {
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

  it("should return events using BetVictor API", async () => {
    const app = await initTestApp(cache);

    const { body } = await supertest(app).get("/api/v1/events").expect(200);

    expect(body).to.haveOwnProperty("events").which.has.length(5);
    expect(body.events[0]).to.haveOwnProperty("sportId").which.deep.eq(100);
    expect(body.events[0])
      .to.haveOwnProperty("sportEvents")
      .which.has.length(10);
  });

  it("should return events using cache", async () => {
    nock.cleanAll();
    const app = await initTestApp(cache);

    cache.set("events:en-gb:all", eventsCacheResponse);

    const { body } = await supertest(app).get("/api/v1/events").expect(200);

    expect(body).to.haveOwnProperty("events").which.has.length(5);
    expect(body.events[0]).to.haveOwnProperty("sportId").which.deep.eq(100);
    expect(body.events[0])
      .to.haveOwnProperty("sportEvents")
      .which.has.length(10);
  });

  it("should return events for one sportId", async () => {
    const app = await initTestApp(cache);

    const { body } = await supertest(app)
      .get("/api/v1/events?sportId=600")
      .expect(200);

    expect(body).to.haveOwnProperty("events").which.has.length(1);
    expect(body.events[0]).to.haveOwnProperty("sportId").which.deep.eq(600);
    expect(body.events[0])
      .to.haveOwnProperty("sportEvents")
      .which.has.length(6);
  });

  it("should throw 502 Bad Gateway if BetVictor service is unnavigable", async () => {
    nock.cleanAll();
    nock(config.host).get("/en-gb/in-play/1/events").reply(500, {});

    const app = await initTestApp(cache);

    await supertest(app).get("/api/v1/events").expect(502);
  });

  it("should throw 404 for missing sportId", async () => {
    const app = await initTestApp(cache);

    await supertest(app).get("/api/v1/events?sportId=601").expect(404);
  });
});
