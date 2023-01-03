import axios from "axios";
import NodeCache from "node-cache";
import { supportedLanguages } from "../../router/v1/types";
import { BetVictor } from "./types";

export async function createBetVictorService(
  host: string,
  path: string,
  cache: NodeCache
): Promise<BetVictor.BetVictorService> {
  const getData = async (
    language?: string
  ): Promise<BetVictor.Response.Body> => {
    const lang =
      language && supportedLanguages.includes(language) ? language : "en-gb";
    const cacheKey = `base:${lang}`;
    const cachedResponse = cache.get<BetVictor.Response.Body>(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const response = await axios.get<BetVictor.Response.Body>(
        `${host}/${lang}${path}`
      );
      cache.set(cacheKey, response.data);

      return response.data;
    } catch (error) {
      throw new Error("Error fetching data");
    }
  };

  await getData().then(() => {
    console.info("BetVictorService running...");
  });

  return {
    getData,
  };
}
