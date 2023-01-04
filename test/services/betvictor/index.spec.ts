import { expect } from "chai";
import { beforeEach } from "mocha";
import nock from "nock";
import NodeCache from "node-cache";
import { createBetVictorService } from "../../../src/services/betvictor";
import { BetVictorENGBExampleResponse } from "../../../src/services/betvictor/examples/response.en-gb.example";

describe("services/betvictor/index", function () {
  const config = {
    host: "https://partners.betvictor.localhost",
    hostpath: "/in-play/1/events",
    port: 3000,
  };

  const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

  beforeEach(async () => {
    nock.cleanAll();
    cache.flushAll();
  });

  after(async () => {
    nock.cleanAll();
    cache.flushAll();
  });

  it("should get data from BetVictor", async () => {
    nock(config.host)
      .get("/en-gb/in-play/1/events")
      .reply(200, BetVictorENGBExampleResponse);
    const response = await createBetVictorService(
      config.host,
      config.hostpath,
      cache
    );
    const data = await response.getData();

    expect(data.status).to.deep.eq({
      success: true,
      errorCode: 0,
      extraInfo: {},
    });

    expect(data.result).to.haveOwnProperty("sports").which.has.length(5);
  });

  it("should get data from cache if available", async () => {
    cache.set("base:en-gb", BetVictorENGBExampleResponse);
    const response = await createBetVictorService(
      config.host,
      config.hostpath,
      cache
    );
    const data = await response.getData();

    expect(data.status).to.deep.eq({
      success: true,
      errorCode: 0,
      extraInfo: {},
    });

    expect(data.result).to.haveOwnProperty("sports").which.has.length(5);
  });
});
