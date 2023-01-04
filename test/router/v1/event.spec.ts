import { expect } from "chai";
import express from "express";
import nock from "nock";
import NodeCache from "node-cache";
import supertest from "supertest";
import { createV1Router } from "../../../src/router/v1";
import { createBetVictorService } from "../../../src/services/betvictor";
import {
  BetVictorDExampleResponse,
  BetVictorENGBExampleResponse,
} from "../../../src/services/betvictor/examples/response.en-gb.example";

describe("router/v1/event", function () {
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

  it("should return event using BetVictor API", async () => {
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

    const { body } = await supertest(app)
      .get("/api/v1/events/1855385200")
      .expect(200);

    expect(body)
      .to.haveOwnProperty("event")
      .which.has.ownProperty("id")
      .which.deep.eq(1855385200);
  });

  it("should return event using cache", async () => {
    const betVictorService = await createBetVictorService(
      config.host,
      config.hostpath,
      cache
    );

    cache.set("event:en-gb:1855385200", {
      id: 1855385200,
      event_type: "GAME_EVENT",
      event_path_id: 616047610,
      sport_id: 100,
      desc: "Ferroviaria SP U20 v Nacional FC U20",
      oppADesc: "Ferroviaria SP U20",
      oppAId: 267623100,
      oppBDesc: "Nacional FC U20",
      oppBId: 276400500,
      american: null,
      inPlay: true,
      time: 1672785000000,
      pos: 9999,
      markets: [
        {
          id: 11451621230,
          st: 1,
          pltNP: 1,
          ca: true,
          next: false,
          ew: false,
          o: [Array],
          status: 1,
          current: true,
          des: "Match Betting",
          mbl: 42135333,
          mtId: 1,
          mtid: 1,
          eId: 1855385200,
          pId: 100,
          pid: 100,
          prdDsc: "90 Mins",
          pltD: 1,
          pltDes: "Win only",
          mtDimension: "match-betting",
          p: "90 Mins",
        },
      ],
      eventPathTree: { table: {} },
      metadata: { badges: ["BET_BOOST", "CORNERS"] },
      has_stream: false,
      scoreboard: {
        addresses: {
          comment: "/scoreboard/board/1855385200/comments/en_GB",
          essentialScoreboard: "/essentialscoreboard/100/1855385200",
          essentialScoreboardCallback:
            "/c/essentialscoreboard/100/1855385200/en_GB",
          stats: "/scoreboard/board/1855385200/stats",
          timeline: "/scoreboard/board/1855385200/timeline",
          overviewComment:
            "/scoreboard/board/1855385200/overview/comments/en_GB",
        },
        clockInSeconds: 1,
        validAt: 1672784965068,
        reversedClock: false,
        periodKey: "H1",
        clockStatus: "STARTED",
        marketSuspensionReason: "",
        inPlay: true,
        redCardA: 0,
        redCardB: 0,
        stoppageTime: "",
        matchLength: 90,
        eId: 1855385200,
        sId: 100,
        clk: "40:49",
        run: true,
        dsc: "1H",
        code: 234,
        sTs: 1672785000000,
        cal: true,
        act: 267623100,
        oaId: 267623100,
        obId: 276400500,
        scr: "0-1",
        scrA: 0,
        scrB: 1,
        pId: 10,
      },
    });

    const app = express();
    app.use("/api/v1", createV1Router(betVictorService, cache));

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
      .get("/en-gb/in-play/1/events")
      .reply(200, BetVictorENGBExampleResponse);

    nock(config.host)
      .get("/de/in-play/1/events")
      .reply(200, BetVictorDExampleResponse);

    const betVictorService = await createBetVictorService(
      config.host,
      config.hostpath,
      cache
    );

    const app = express();
    app.use("/api/v1", createV1Router(betVictorService, cache));

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
    nock(config.host).get("/en-gb/in-play/1/events").reply(500, {});

    const betVictorService = await createBetVictorService(
      config.host,
      config.hostpath,
      cache
    );

    const app = express();
    app.use("/api/v1", createV1Router(betVictorService, cache));

    await supertest(app).get("/api/v1/events/1855385200").expect(502);
  });

  it("should throw 404 for missing eventId", async () => {
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

    await supertest(app).get("/api/v1/events/1855385201").expect(404);
  });

  it("should throw 404 for incorrect eventId", async () => {
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

    await supertest(app).get("/api/v1/events/asasas1855385201").expect(400);
  });
});
