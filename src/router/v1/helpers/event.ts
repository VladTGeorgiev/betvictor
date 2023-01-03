import NodeCache from "node-cache";
import { BetVictor } from "../../../services/betvictor/types";
import { APIError } from "../../../utils/errors";
import Event = BetVictor.Response.Event;

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
  const cachedResponse = cache.get<any>(cacheKey);

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
 */
export function formatMarkets(
  event: BetVictor.Response.Event,
  normalizedLanguageCode: string
) {
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
 */
export function mergeMarketsLanguages(
  existingMarkets: any,
  currentMarkets: any
) {
  const map = new Map();

  existingMarkets.forEach((item: any) => map.set(item.id, item));
  currentMarkets.forEach((item: any) => {
    const existing = map.get(item.id);
    map.set(item.id, {
      ...existing,
      ...item,
      des: { ...existing.des, ...item.des },
      prdDsc: { ...existing.prdDsc, ...item.prdDsc },
      pltDes: { ...existing.pltDes, ...item.pltDes },
      p: { ...existing.p, ...item.p },
    });
  });

  return Array.from(map.values());
}
