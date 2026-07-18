import { Client } from "@elastic/elasticsearch";
import { config } from "./config.js";

let client = null;

/**
 * Lazily creates and returns the shared Elasticsearch client, authenticated
 * with the API key supplied via ELASTIC_URL / ELASTIC_API_KEY. Throws if
 * those env vars aren't set — the app is Elasticsearch-backed, not optional.
 */
export function getEsClient() {
  if (client) return client;

  if (!config.elasticUrl || !config.elasticApiKey) {
    throw new Error(
      "ELASTIC_URL and ELASTIC_API_KEY must be set in backend/.env — see .env.example"
    );
  }

  client = new Client({
    node: config.elasticUrl,
    auth: { apiKey: config.elasticApiKey },
  });

  return client;
}
