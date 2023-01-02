import express, { Request, Response, Router } from "express";
import { BetVictor } from "../../service/types";

export function createV1Router(service: BetVictor.BetVictorService): Router {
  const version = "v1";
  const router = express.Router();
  const language = "/en-gb";

  router.get(`/${version}/sports`, async (req: Request, res: Response) => {
    // try {
    //   const response = await axios.get(`${host}${language}${path}`);
    //   const sports = response.data.result.sports;
    //   res.json(sports);
    // } catch (error) {
    //
    //   console.error(error);
    //   res.status(500).json({ message: "Error fetching sports data" });
    // }

    const response = await service.getData();
    res.json(response);
  });

  return router;
}
