import { Request, Response } from "express";
import NodeCache from "node-cache";
import { BetVictor } from "../../services/betvictor/types";
import { getSportsResults } from "./lib";
import { V1Router } from './types';
import Sport = V1Router.Endpoints.Sports.Response.Sport;

/**
 * Endpoint handler returning an array of sports, with optional languages property supporting English, German and Chinese
 * @param service
 * @param cache
 * @param req
 * @param res
 * @return
 */
export const getSports = async (
  service: BetVictor.BetVictorService,
  cache: NodeCache,
  req: Request,
  res: Response
) => {
  const { languages } = req.query as Record<string, string>;
  const languageCodes = languages ? languages.split(",") : ["en-gb"];
  const map = new Map();

  for (const language of languageCodes) {
    const normalizedLanguageCode = language.trim().toLowerCase();
    const sports: Array<Sport> =
      await getSportsResults(normalizedLanguageCode, cache, service);

    for (const sport of sports) {
      const present = map.get(sport.id);
      if (!present) {
        map.set(sport.id, {
          id: sport.id,
          desc: sport.desc,
          pos: sport.pos,
        });

        continue;
      }

      const pos = Math.min(sport.pos, present.pos);
      map.set(present.id, {
        id: sport.id,
        desc: { ...present.desc, ...sport.desc },
        pos,
      });
    }
  }

  const response: Array<Sport> = Array.from(map.values()).sort(
    (sportPrev, sportNext) => sportPrev.pos - sportNext.pos
  );

  res.json({
    sports: response,
  });
};