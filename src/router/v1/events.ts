import { Request, Response } from "express";
import NodeCache from "node-cache";
import { BetVictor } from "../../services/betvictor/types";
import { V1Router } from "./types";

export const getEvents = async (
  service: BetVictor.BetVictorService,
  cache: NodeCache,
  req: Request,
  res: Response
) => {
  const { languages, sport } = req.query as Record<string, string>;
  const languageCodes = languages ? languages.split(",") : ["en-gb"];
  const sportId = sport ? parseInt(sport) : null;

  res.json({});
};
