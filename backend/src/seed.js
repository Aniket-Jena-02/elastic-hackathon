import { getEsClient } from "./esClient.js";
import { ensureIndexSeeded } from "./esIndex.js";

async function main() {
  const client = getEsClient();
  const result = await ensureIndexSeeded(client);
  if (result.created) {
    console.log(`Created index and seeded ${result.seeded} monuments.`);
  } else {
    console.log("Index already exists — nothing to seed.");
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
