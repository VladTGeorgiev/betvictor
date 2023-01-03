import { Request } from "express";
import NodeCache from "node-cache";
import { BetVictor } from "../../services/betvictor/types";
import { APIError } from "../../utils/errors";
import {
  formatMarkets,
  getEventData,
  mergeMarketsLanguages,
} from "./helpers/event";
import { V1Router } from "./types";
import Event = BetVictor.Response.Event;

/**
 * Endpoint handler returning an array of events, with optional languages supporting English, German and Chinese. and sportId properties
 * @param service
 * @param cache
 * @param req
 * @return Promise<V1Router.Endpoints.Events.Response.Body>
 */
export const getEvent = async (
  service: BetVictor.BetVictorService,
  cache: NodeCache,
  req: Request
): Promise<any> => {
  const { eventId } = req.params as Record<string, string>;
  const eId = eventId ? parseInt(eventId) : null;

  const { languages } = req.query as Record<string, string>;
  const languageCodes = languages ? languages.split(",") : ["en-gb"];

  if (!eId) {
    throw new APIError(400, `EventId not provided or not in correct format`);
  }

  const result: Map<number, any> = new Map();

  for (const language of languageCodes) {
    const normalizedLanguageCode = language.trim().toLowerCase();

    const event: Event = await getEventData(
      normalizedLanguageCode,
      cache,
      service,
      eId
    );

    const desc: Record<string, string> = {};
    const oppADesc: Record<string, string> = {};
    const oppBDesc: Record<string, string> = {};

    desc[normalizedLanguageCode] = event.desc;
    oppADesc[normalizedLanguageCode] = event.oppADesc;
    oppBDesc[normalizedLanguageCode] = event.oppBDesc;
    const markets = formatMarkets(event, normalizedLanguageCode);

    const existing = result.get(event.id);
    if (!existing) {
      result.set(event.id, {
        ...event,
        desc,
        oppADesc,
        oppBDesc,
        markets,
      });

      continue;
    }

    result.set(existing.id, {
      ...event,
      desc: { ...existing.desc, ...desc },
      oppADesc: { ...existing.oppADesc, ...oppADesc },
      oppBDesc: { ...existing.oppBDesc, ...oppBDesc },
      markets: mergeMarketsLanguages(existing.markets, markets),
    });
  }

  return {
    event: result.get(eId),
  };
};
