import NodeCache from "node-cache";
import { BetVictor } from "../../../services/betvictor/types";
import { APIError } from "../../../utils/errors";
import { V1Router } from "../types";
import Event = BetVictor.Response.Event;
import Market = V1Router.Endpoints.Event.Response.Market;

/**
 * Function obtaining event from either the endpoint's cache or from BetVictor service
 * @param languageCode
 * @param cache
 * @param service
 * @param eventId
 * @return Promise<Array<{sportId: number, sportEvents: Array<Event>}>>
 */
export async function getEventData(
  languageCode: string,
  cache: NodeCache,
  service: BetVictor.BetVictorService,
  eventId: number
): Promise<Event> {
  const cacheKey = `event:${languageCode}:${eventId}`;
  const cachedResponse = cache.get<Event>(cacheKey);

  if (cachedResponse) {
    return cachedResponse;
  } else {
    const response = await service.getData(languageCode);
    let result: Event | undefined;

    response.result.sports.some((sport) => {
      sport.comp.some((comp) => {
        comp.events.some((event) => event.id === eventId && (result = event));
      });
    });

    if (!result) {
      throw new APIError(404, `EventId: ${eventId} not found`);
    }

    cache.set(cacheKey, result);
    return result;
  }
}

/**
 * Function formatting Market object with languageCode in the properties of the object where different languages are used
 * @param event
 * @param normalizedLanguageCode
 * @return Array<V1Router.Endpoints.Event.Response.Market>
 */
export function formatMarkets(
  event: BetVictor.Response.Event,
  normalizedLanguageCode: string
): Array<Market> {
  return event.markets.map((market) => {
    const des: Record<string, string> = {};
    const prdDsc: Record<string, string> = {};
    const pltDes: Record<string, string> = {};
    const p: Record<string, string> = {};

    des[normalizedLanguageCode] = market.des;
    prdDsc[normalizedLanguageCode] = market.prdDsc;
    pltDes[normalizedLanguageCode] = market.pltDes;
    p[normalizedLanguageCode] = market.p;

    return {
      ...market,
      des,
      prdDsc,
      pltDes,
      p,
    };
  });
}

/**
 * Function merging Markets objects with properties in different languages
 * @param existingMarkets
 * @param currentMarkets
 * @return Array<V1Router.Endpoints.Event.Response.Market>
 */
export function mergeMarketsLanguages(
  existingMarkets: Array<Market>,
  currentMarkets: Array<Market>
): Array<Market> {
  const map: Map<number, Market> = new Map();

  existingMarkets.forEach((item: Market) => map.set(item.id, item));

  for (const market of currentMarkets) {
    const existing = map.get(market.id);
    if (!existing) {
      map.set(market.id, {
        ...market,
        des: { ...market.des },
        prdDsc: { ...market.prdDsc },
        pltDes: { ...market.pltDes },
        p: { ...market.p },
      });

      continue;
    }

    map.set(market.id, {
      ...existing,
      ...market,
      des: { ...existing.des, ...market.des },
      prdDsc: { ...existing.prdDsc, ...market.prdDsc },
      pltDes: { ...existing.pltDes, ...market.pltDes },
      p: { ...existing.p, ...market.p },
    });
  }

  return Array.from(map.values());
}
