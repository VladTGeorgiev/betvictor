import express, { Router } from "express";
import NodeCache from 'node-cache';
import { BetVictor } from "../../services/betvictor/types";
import { getEvents } from './events';
import { getSports } from './sports';

/**
 * V1 Router
 * @param service
 * @param cache
 */
export function createV1Router( service: BetVictor.BetVictorService, cache: NodeCache): Router {
  const router = express.Router();

  router.get(`/sports`, (req, res) => getSports(service, cache, req, res));
  router.get(`/events`, (req, res) => getEvents(service, cache, req, res));

  return router;
}
