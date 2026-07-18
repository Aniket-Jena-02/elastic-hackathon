import { Router } from "express";
import { INTERCHANGES } from "../data/interchanges.js";

const router = Router();

router.get("/interchange", (req, res) => {
  res.json(Object.values(INTERCHANGES));
});

router.get("/interchange/:slug", (req, res) => {
  const hub = INTERCHANGES[req.params.slug];
  if (!hub) {
    return res.status(404).json({ detail: "No interchange guide for this station" });
  }
  res.json(hub);
});

export default router;
