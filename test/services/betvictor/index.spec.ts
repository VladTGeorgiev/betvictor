import { expect } from "chai";
import { beforeEach } from "mocha";
import nock from "nock";
import NodeCache from "node-cache";
import { BetVictorENGBExampleResponse } from "../../../src/services/betvictor/examples/response.en-gb.example";
import { config, initBetVictorTestService } from "../../helpers";

describe("services/betvictor/index", function () {
  const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

  beforeEach(async () => {
    nock.cleanAll();
    cache.flushAll();

    nock(config.host)
      .get("/en-gb/in-play/1/events")
      .reply(200, BetVictorENGBExampleResponse);
  });

  after(async () => {
    nock.cleanAll();
    cache.flushAll();
  });

  it("should get data from BetVictor", async () => {
    const betVictorService = await initBetVictorTestService(cache);
    const result = await betVictorService.getData();

    expect(result.status).to.deep.eq({
      success: true,
      errorCode: 0,
      extraInfo: {},
    });

    expect(result.result).to.haveOwnProperty("sports").which.has.length(5);
  });

  it("should get data from cache if available", async () => {
    nock.cleanAll();
    cache.set("base:en-gb", BetVictorENGBExampleResponse);

    const betVictorService = await initBetVictorTestService(cache);
    const result = await betVictorService.getData();

    expect(result.status).to.deep.eq({
      success: true,
      errorCode: 0,
      extraInfo: {},
    });

    expect(result.result).to.haveOwnProperty("sports").which.has.length(5);
  });
});
