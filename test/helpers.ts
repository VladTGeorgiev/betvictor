import express from "express";
import NodeCache from "node-cache";
import { createV1Router } from "../src/router/v1";
import { createBetVictorService } from "../src/services/betvictor";

export const config = {
  host: "https://partners.betvictor.localhost",
  path: "/in-play/1/events",
  port: 3000,
};

export async function initTestApp(cache: NodeCache) {
  const betVictorService = await createBetVictorService(
    config.host,
    config.path,
    cache
  );

  const app = express();
  app.use("/api/v1", createV1Router(betVictorService, cache));

  return app;
}

export async function initBetVictorTestService(cache: NodeCache) {
  return createBetVictorService(config.host, config.path, cache);
}

export const eventsCacheResponse = [
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
          "en-gb": "Borussia Dortmund (Inquisitor) v Atletico Madrid (Kray)",
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
          "en-gb": "Atlanta Hawks (Pakapaka) v Chicago Bulls (Djapacmeister)",
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
];

export const eventCacheResponse = {
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
      overviewComment: "/scoreboard/board/1855385200/overview/comments/en_GB",
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
};
