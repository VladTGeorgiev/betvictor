import { Request } from "express";
import NodeCache from "node-cache";
import { BetVictor } from "../../services/betvictor/types";
import { APIError } from "../../utils/errors";
import {
  formatMarkets,
  getEventData,
  mergeMarketsLanguages,
} from "./helpers/event";
import { normalizeLanguages } from "./lib";
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
): Promise<V1Router.Endpoints.Event.Response.Body> => {
  const query = req.query as Record<string, string>;
  const params = req.params as Record<string, string>;
  const eventId = params?.eventId ? parseInt(params?.eventId) : null;

  const languageCodes = normalizeLanguages(query?.languages);

  if (!eventId) {
    throw new APIError(400, `EventId not provided or not in correct format`);
  }

  const result: Map<number, V1Router.Endpoints.Event.Response.Event> =
    new Map();

  for (const language of languageCodes) {
    const event: Event = await getEventData(language, cache, service, eventId);

    const desc: Record<string, string> = {};
    const oppADesc: Record<string, string> = {};
    const oppBDesc: Record<string, string> = {};

    desc[language] = event.desc;
    oppADesc[language] = event.oppADesc;
    oppBDesc[language] = event.oppBDesc;
    const markets = formatMarkets(event, language);

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

  const event = result.get(eventId);

  if (!event) {
    throw new APIError(404, `EventId: ${query.eventId} not found`);
  }

  return {
    event,
  };
};
