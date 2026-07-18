import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { getEsClient } from "./esClient.js";
import { ensureIndexSeeded } from "./esIndex.js";
import monumentsRouter from "./routes/monuments.js";
import interchangeRouter from "./routes/interchange.js";
import routeRouter from "./routes/route.js";

const app = express();

app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());

app.get("/api/v1/health", async (req, res) => {
  let elasticsearch = "not configured";
  if (config.elasticUrl && config.elasticApiKey) {
    try {
      const client = getEsClient();
      await client.ping();
      elasticsearch = "connected";
    } catch (err) {
      elasticsearch = `error: ${err.message}`;
    }
  }
  res.json({ status: "ok", elasticsearch });
});

app.use("/api/v1", monumentsRouter);
app.use("/api/v1", interchangeRouter);
app.use("/api/v1", routeRouter);

app.use((req, res) => {
  res.status(404).json({ detail: "Not found" });
});

async function start() {
  if (config.elasticUrl && config.elasticApiKey) {
    try {
      const client = getEsClient();
      const result = await ensureIndexSeeded(client);
      if (result.created) {
        console.log(`Elasticsearch index '${config.esIndex}' created and seeded with ${result.seeded} monuments.`);
      } else {
        console.log(`Elasticsearch index '${config.esIndex}' already exists.`);
      }
    } catch (err) {
      console.error(`Warning: could not verify/seed Elasticsearch index: ${err.message}`);
      console.error("The server will still start, but /search, /nearby, and /monuments/:id will fail until this is resolved.");
    }
  } else {
    console.warn("ELASTIC_URL / ELASTIC_API_KEY not set — search endpoints will return errors until backend/.env is filled in.");
  }

  app.listen(config.port, () => {
    console.log(`Dilli Safar API listening on http://localhost:${config.port}`);
  });
}

start();
