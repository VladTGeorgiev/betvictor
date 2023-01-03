import { Request } from "express";
import NodeCache from "node-cache";
import { BetVictor } from "../../services/betvictor/types";
import { formatResponse, getEventsResults } from "./helpers/events";
import { V1Router } from "./types";
import SportEvents = V1Router.Endpoints.Events.Response.SportEvents;
import Event = V1Router.Endpoints.Events.Response.Event;

/**
 * Endpoint handler returning an array of events, with optional languages supporting English, German and Chinese. and sportId properties
 * @param service
 * @param cache
 * @param req
 * @return Promise<V1Router.Endpoints.Events.Response.Body>
 */
export const getEvents = async (
  service: BetVictor.BetVictorService,
  cache: NodeCache,
  req: Request
): Promise<V1Router.Endpoints.Events.Response.Body> => {
  const { languages, sportId } = req.query as Record<string, string>;
  const languageCodes = languages ? languages.split(",") : ["en-gb"];
  const sport = sportId ? parseInt(sportId) : undefined;

  const result: Map<number, Event & { sportId: number }> = new Map();

  for (const language of languageCodes) {
    const normalizedLanguageCode = language.trim().toLowerCase();

    const sportsEvents: Array<SportEvents> = await getEventsResults(
      normalizedLanguageCode,
      cache,
      service,
      sport
    );

    for (const sport of sportsEvents) {
      for (const event of sport.sportEvents) {
        const existing = result.get(event.id);
        if (!existing) {
          result.set(event.id, {
            id: event.id,
            type: event.type,
            desc: event.desc,
            sportId: sport.sportId,
          });

          continue;
        }

        result.set(existing.id, {
          id: event.id,
          type: event.type,
          desc: { ...existing.desc, ...event.desc },
          sportId: sport.sportId,
        });
      }
    }
  }

  const events = formatResponse(result);

  return {
    events,
  };
};
