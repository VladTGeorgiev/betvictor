import express, { Router } from "express";
import { BetVictor } from "../../service/types";
import { getSports } from './sports';

export function createV1Router(service: BetVictor.BetVictorService): Router {
  const router = express.Router();

  router.get(`/sports`, (req, res) => getSports(service, req, res));

  return router;
}
