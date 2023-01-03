import NodeCache from "node-cache";
import { BetVictor } from "../../../services/betvictor/types";
import { APIError } from "../../../utils/errors";
import { V1Router } from "../types";
import Event = V1Router.Endpoints.Events.Response.Event;
import SportEvents = V1Router.Endpoints.Events.Response.SportEvents;

/**
 * Function obtaining events from either the endpoint's cache or from BetVictor service
 * @param languageCode
 * @param cache
 * @param service
 * @param sportId
 * @return Promise<Array<{sportId: number, sportEvents: Array<Event>}>>
 */
export async function getEventsResults(
  languageCode: string,
  cache: NodeCache,
  service: BetVictor.BetVictorService,
  sportId: number | undefined
): Promise<Array<SportEvents>> {
  const result: Array<{ sportId: number; sportEvents: Array<Event> }> = [];
  const cacheKey = `events:${languageCode}${sportId ? `:${sportId}` : ":all"}`;
  const cachedResponse =
    cache.get<Array<{ sportId: number; sportEvents: Array<Event> }>>(cacheKey);

  if (cachedResponse) {
    result.push(...cachedResponse);
  } else {
    const response = await service.getData(languageCode);
    const events = getSportsEventsData(response, languageCode, sportId);

    result.push(...events);
    cache.set(cacheKey, events);
  }

  return result;
}

/**
 * Function returning all Events from one Sport when sportId property is provided or from all when the property is absent
 * @param response
 * @param languageCode
 * @param sportId
 * @return Array<{sportId: number, sportEvents: Array<Event>}>
 */
function getSportsEventsData(
  response: BetVictor.Response.Body,
  languageCode: string,
  sportId?: number
): Array<SportEvents> {
  if (!sportId) {
    return response.result.sports.flatMap((sport) => {
      const sportEvents = sport.comp.flatMap((comp) => {
        return comp.events.map((event) => {
          const desc: Record<string, string> = {};
          desc[languageCode] = event.desc;

          return {
            id: event.id,
            type: event.event_type,
            desc,
          };
        });
      });

      return [
        {
          sportId: sport.id,
          sportEvents,
        },
      ];
    });
  }

  const sport = response.result.sports.find((sport) => sport.id === sportId);

  if (!sport) {
    throw new APIError(404, `SportId: ${sportId} not found`);
  }

  const sportEvents = sport.comp.flatMap((comp) => {
    return comp.events.map((event) => {
      const desc: Record<string, string> = {};
      desc[languageCode] = event.desc;

      return {
        id: event.id,
        type: event.event_type,
        desc,
      };
    });
  });

  return [
    {
      sportId,
      sportEvents,
    },
  ];
}

/**
 * Function formatting the input Events Map to an array of SportEvents
 * @param result
 * @return Array<SportEvents>
 */
export function formatResponse(
  result: Map<number, Event & { sportId: number }>
): Array<SportEvents> {
  const sportsEvents: Array<Event & { sportId: number }> = Array.from(
    result.values()
  );

  const combinedEvents = sportsEvents.reduce((combined, event) => {
    if (!combined[event.sportId]) {
      combined[event.sportId] = [];
    }
    combined[event.sportId].push({
      id: event.id,
      type: event.type,
      desc: event.desc,
    });

    return combined;
  }, {} as Record<string, Array<Event>>);

  return Object.entries(combinedEvents).map(([sportId, sportEvents]) => {
    return {
      sportId: parseInt(sportId),
      sportEvents,
    };
  });
}
