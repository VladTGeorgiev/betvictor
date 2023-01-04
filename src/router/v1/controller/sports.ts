import { Request } from "express";
import NodeCache from "node-cache";
import { BetVictor } from "../../../services/betvictor/types";
import { getSportsResults } from "../helpers/sports";
import { normalizeLanguages } from "../lib";
import { V1Router } from "../types";
import Sport = V1Router.Endpoints.Sports.Response.Sport;

/**
 * Endpoint handler returning an array of sports, with optional languages property supporting English, German and Chinese
 * @param service
 * @param cache
 * @param req
 * @return Promise<V1Router.Endpoints.Sports.Response.Body>
 */
export const getSports = async (
  service: BetVictor.BetVictorService,
  cache: NodeCache,
  req: Request
): Promise<V1Router.Endpoints.Sports.Response.Body> => {
  const query = req.query as Record<string, string>;
  const languageCodes = normalizeLanguages(query?.languages);
  const result: Map<number, Sport> = new Map();

  for (const language of languageCodes) {
    const sports: Array<Sport> = await getSportsResults(
      language,
      cache,
      service
    );

    for (const sport of sports) {
      const present = result.get(sport.id);

      if (!present) {
        result.set(sport.id, {
          id: sport.id,
          desc: sport.desc,
          pos: sport.pos,
        });

        continue;
      }

      const pos = Math.min(sport.pos, present.pos);
      result.set(present.id, {
        id: sport.id,
        desc: { ...present.desc, ...sport.desc },
        pos,
      });
    }
  }

  const sports: Array<Sport> = Array.from(result.values()).sort(
    (sportPrev, sportNext) => sportPrev.pos - sportNext.pos
  );

  return {
    sports,
  };
};
