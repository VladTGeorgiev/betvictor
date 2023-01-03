import { Router } from "express";
import NodeCache from "node-cache";
import { BetVictor } from "../../services/betvictor/types";
import { getEvent } from "./event";
import { getEvents } from "./events";
import { getSports } from "./sports";

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
      const data = await getSports(service, cache, req);

      res.send(data);
    } catch (e) {
      next(e);
    }
  });

  router.get(`/events`, async (req, res, next) => {
    try {
      const data = await getEvents(service, cache, req);

      res.send(data);
    } catch (e) {
      next(e);
    }
  });

  router.get(`/events/:eventId`, async (req, res, next) => {
    try {
      const data = await getEvent(service, cache, req);

      res.send(data);
    } catch (e) {
      next(e);
    }
  });

  return router;
}
