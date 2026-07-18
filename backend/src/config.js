import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 8000),
  elasticUrl: process.env.ELASTIC_URL || "",
  elasticApiKey: process.env.ELASTIC_API_KEY || "",
  esIndex: process.env.ES_INDEX || "delhi_monuments",
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};

export function assertElasticConfigured() {
  if (!config.elasticUrl || !config.elasticApiKey) {
    throw new Error(
      "ELASTIC_URL and ELASTIC_API_KEY must be set in backend/.env — see .env.example"
    );
  }
}
