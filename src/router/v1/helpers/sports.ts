import NodeCache from "node-cache";
import { BetVictor } from "../../../services/betvictor/types";
import { V1Router } from "../types";
import Sport = V1Router.Endpoints.Sports.Response.Sport;

/**
 * Function obtaining sports from either the endpoint's cache or from BetVictor service
 * @param languageCode
 * @param cache
 * @param service
 * @return Promise<Array<V1Router.Endpoints.Sports.Response.Sport>>
 */
export async function getSportsResults(
  languageCode: string,
  cache: NodeCache,
  service: BetVictor.BetVictorService
): Promise<Array<Sport>> {
  const result: Array<Sport> = [];
  const cacheKey = `sports:${languageCode}`;
  const cachedResponse = cache.get<Array<Sport>>(cacheKey);

  if (cachedResponse) {
    result.push(...cachedResponse);
  } else {
    const response = await service.getData(languageCode);
    const sports = response.result.sports.map((sport) => {
      const desc: Record<string, string> = {};
      desc[languageCode] = sport.desc;

      return {
        id: sport.id,
        desc,
        pos: sport.pos,
      };
    });

    result.push(...sports);
    cache.set(cacheKey, sports);
  }

  return result;
}
