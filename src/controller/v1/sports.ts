import { Request, Response } from "express";
import { BetVictor } from "../../service/types";

export const getSports = async (
  service: BetVictor.BetVictorService,
  req: Request,
  res: Response
) => {
  const { language } = req.query as Record<string, string>;
  const response = await service.getData(language);
  res.json(response);
};
