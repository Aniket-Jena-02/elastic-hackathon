import { Router } from "express";
import { getEsClient } from "../esClient.js";
import { config } from "../config.js";

const router = Router();

router.get("/search", async (req, res) => {
  const q = (req.query.q || "").toString().trim();
  if (!q) {
    return res.status(400).json({ detail: "Query param 'q' is required." });
  }

  try {
    const client = getEsClient();
    const result = await client.search({
      index: config.esIndex,
      query: {
        multi_match: {
          query: q,
          fields: ["monument_name^3", "aliases^2", "description"],
          fuzziness: "AUTO",
        },
      },
    });
    res.json(result.hits.hits.map((hit) => hit._source));
  } catch (err) {
    res.status(502).json({ detail: `Elasticsearch error: ${err.message}` });
  }
});

router.get("/nearby", async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  const radius = Number(req.query.radius || 3);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return res.status(400).json({ detail: "Query params 'lat' and 'lon' are required and must be numeric." });
  }

  try {
    const client = getEsClient();
    const result = await client.search({
      index: config.esIndex,
      query: {
        geo_distance: {
          distance: `${radius}km`,
          location: { lat, lon },
        },
      },
      sort: [
        {
          _geo_distance: {
            location: { lat, lon },
            order: "asc",
            unit: "km",
          },
        },
      ],
    });
    res.json(result.hits.hits.map((hit) => hit._source));
  } catch (err) {
    res.status(502).json({ detail: `Elasticsearch error: ${err.message}` });
  }
});

router.get("/monuments/:id", async (req, res) => {
  try {
    const client = getEsClient();
    const result = await client.get({ index: config.esIndex, id: req.params.id });
    res.json(result._source);
  } catch (err) {
    if (err.meta?.statusCode === 404) {
      return res.status(404).json({ detail: "Monument not found" });
    }
    res.status(502).json({ detail: `Elasticsearch error: ${err.message}` });
  }
});

export default router;
