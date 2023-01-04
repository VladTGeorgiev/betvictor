import { Router } from "express";
import NodeCache from "node-cache";
import { BetVictor } from "../../services/betvictor/types";
import { getEvent } from "./controller/event";
import { getEvents } from "./controller/events";
import { getSports } from "./controller/sports";

/**
 * V1 Router
 * @param service
 * @param cache
 */
export function createV1Router(
  service: BetVictor.BetVictorService,
  cache: NodeCache
): Router {
  const router = Router();

  router.get(`/sports`, async (req, res, next) => {
    try {
      res.send(await getSports(service, cache, req));
    } catch (e) {
      next(e);
    }
  });

  router.get(`/events`, async (req, res, next) => {
    try {
      res.send(await getEvents(service, cache, req));
    } catch (e) {
      next(e);
    }
  });

  router.get(`/events/:eventId`, async (req, res, next) => {
    try {
      res.send(await getEvent(service, cache, req));
    } catch (e) {
      next(e);
    }
  });

  return router;
}
