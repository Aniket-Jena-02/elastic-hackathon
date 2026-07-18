import { Router } from "express";
import { findShortestPath } from "../utils/graph.js";

const router = Router();

router.get("/route", (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: "Missing 'from' or 'to' query parameters" });
  }

  try {
    const result = findShortestPath(from, to);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
