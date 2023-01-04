import { expect } from "chai";
import express from "express";
import nock from "nock";
import NodeCache from "node-cache";
import supertest from "supertest";
import { createV1Router } from "../../../src/router/v1";
import { createBetVictorService } from "../../../src/services/betvictor";
import { BetVictorENGBExampleResponse } from "../../../src/services/betvictor/examples/response.en-gb.example";

describe("router/v1/events", function () {
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

  it("should return events using BetVictor API", async () => {
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

    const { body } = await supertest(app).get("/api/v1/events").expect(200);

    expect(body).to.haveOwnProperty("events").which.has.length(5);
    expect(body.events[0]).to.haveOwnProperty("sportId").which.deep.eq(100);
    expect(body.events[0])
      .to.haveOwnProperty("sportEvents")
      .which.has.length(10);
  });

  it("should return events using cache", async () => {
    const betVictorService = await createBetVictorService(
      config.host,
      config.hostpath,
      cache
    );

    const app = express();
    app.use("/api/v1", createV1Router(betVictorService, cache));

    cache.set("events:en-gb:all", [
      {
        sportId: 100,
        sportEvents: [
          {
            id: 1855385200,
            type: "GAME_EVENT",
            desc: { "en-gb": "Ferroviaria SP U20 v Nacional FC U20" },
          },
          {
            id: 1855400600,
            type: "GAME_EVENT",
            desc: { "en-gb": "Palmeiras U20 v Juazeirense BA (U20)" },
          },
          {
            id: 1855942300,
            type: "GAME_EVENT",
            desc: {
              "en-gb":
                "Borussia Dortmund (Inquisitor) v Atletico Madrid (Kray)",
            },
          },
          {
            id: 1855942400,
            type: "GAME_EVENT",
            desc: {
              "en-gb": "Chelsea FC (Laikingdast) v Inter Milan (Labotryas)",
            },
          },
          {
            id: 1855930000,
            type: "GAME_EVENT",
            desc: { "en-gb": "Aston Villa (Sef) v Wolverhampton (Gabiigol)" },
          },
          {
            id: 1855930100,
            type: "GAME_EVENT",
            desc: { "en-gb": "Everton (Boki) v West Ham (Peja)" },
          },
          {
            id: 1855930200,
            type: "GAME_EVENT",
            desc: { "en-gb": "Arsenal FC (Piki) v Aston Villa (Sef)" },
          },
          {
            id: 1855930400,
            type: "GAME_EVENT",
            desc: { "en-gb": "Wolverhampton (Gabiigol) v Everton (Boki)" },
          },
          {
            id: 1855899400,
            type: "GAME_EVENT",
            desc: { "en-gb": "Italy (Petruchio) v Germany (Nederfox)" },
          },
          {
            id: 1855836400,
            type: "GAME_EVENT",
            desc: { "en-gb": "Belgium (Honey) v Netherlands (Calvin)" },
          },
        ],
      },
      {
        sportId: 600,
        sportEvents: [
          {
            id: 1855767300,
            type: "GAME_EVENT",
            desc: { "en-gb": "Jan-Lennard Struff v Alexandre Muller" },
          },
          {
            id: 1855767600,
            type: "GAME_EVENT",
            desc: { "en-gb": "Liam Broady v Luca Nardi" },
          },
          {
            id: 1855409800,
            type: "GAME_EVENT",
            desc: { "en-gb": "Leandro Riedi v Hugo Gaston" },
          },
          {
            id: 1855765400,
            type: "GAME_EVENT",
            desc: { "en-gb": "Mai Hontama v Diane Parry" },
          },
          {
            id: 1855840200,
            type: "GAME_EVENT",
            desc: { "en-gb": "Eva Lys v Elina Avanesyan" },
          },
          {
            id: 1855783700,
            type: "GAME_EVENT",
            desc: { "en-gb": "Heather Watson v Yuriko Lily Miyazaki" },
          },
        ],
      },
      {
        sportId: 17500,
        sportEvents: [
          {
            id: 1853856200,
            type: "GAME_EVENT",
            desc: { "en-gb": "Wellington Blaze (W) v Northern Districts (W)" },
          },
          {
            id: 1853662800,
            type: "GAME_EVENT",
            desc: { "en-gb": "Andhra v Hyderabad" },
          },
        ],
      },
      {
        sportId: 601600,
        sportEvents: [
          {
            id: 1855836800,
            type: "GAME_EVENT",
            desc: { "en-gb": "Temple (W) @ South Florida (W)" },
          },
          {
            id: 1855837000,
            type: "GAME_EVENT",
            desc: { "en-gb": "Chicago State (W) @ Norfolk State (W)" },
          },
          {
            id: 1855229900,
            type: "GAME_EVENT",
            desc: { "en-gb": "Universo / Caixa / Brasilia v Pato" },
          },
          {
            id: 1854811300,
            type: "GAME_EVENT",
            desc: { "en-gb": "Cerrado Iesplan v Corinthians Paulista" },
          },
          {
            id: 1855932600,
            type: "GAME_EVENT",
            desc: {
              "en-gb": "Brooklyn Nets (MambaOUT) v Phoenix Suns (Savage)",
            },
          },
          {
            id: 1855932500,
            type: "GAME_EVENT",
            desc: {
              "en-gb":
                "Atlanta Hawks (Pakapaka) v Chicago Bulls (Djapacmeister)",
            },
          },
        ],
      },
      {
        sportId: 650,
        sportEvents: [
          {
            id: 1855948600,
            type: "GAME_EVENT",
            desc: { "en-gb": "Dmitriy Regotun v Ruslan Solomko" },
          },
          {
            id: 1855950000,
            type: "GAME_EVENT",
            desc: { "en-gb": "Sergey Sokolov v Dmitriy Derevinskiy" },
          },
          {
            id: 1855948800,
            type: "GAME_EVENT",
            desc: { "en-gb": "Ivan Danilov v Veniamin Dubrovin" },
          },
          {
            id: 1855793900,
            type: "GAME_EVENT",
            desc: { "en-gb": "Ales Hlawatschke v Miroslav Adamec" },
          },
          {
            id: 1855794100,
            type: "GAME_EVENT",
            desc: { "en-gb": "Richard Krejci v Frantisek Briza" },
          },
        ],
      },
    ]);

    const { body } = await supertest(app).get("/api/v1/events").expect(200);

    expect(body).to.haveOwnProperty("events").which.has.length(5);
    expect(body.events[0]).to.haveOwnProperty("sportId").which.deep.eq(100);
    expect(body.events[0])
      .to.haveOwnProperty("sportEvents")
      .which.has.length(10);
  });

  it("should return events for one sportId", async () => {
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
      .get("/api/v1/events?sportId=600")
      .expect(200);

    expect(body).to.haveOwnProperty("events").which.has.length(1);
    expect(body.events[0]).to.haveOwnProperty("sportId").which.deep.eq(600);
    expect(body.events[0])
      .to.haveOwnProperty("sportEvents")
      .which.has.length(6);
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

    await supertest(app).get("/api/v1/events").expect(502);
  });

  it("should throw 404 for missing sportId", async () => {
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

    await supertest(app).get("/api/v1/events?sportId=601").expect(404);
  });
});
