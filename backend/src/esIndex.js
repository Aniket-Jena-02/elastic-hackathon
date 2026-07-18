import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js";
import { MONUMENTS } from "./data/monuments.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SYNONYMS = [
  "cp, connaught place, rajiv chowk => rajiv chowk",
  "isbt, kashmere gate, kashmiri gate => kashmere gate",
  "qutub minar, qutab minar => qutub minar",
  "iit, iit delhi => iit metro station",
];

export const INDEX_MAPPING = {
  settings: {
    analysis: {
      filter: {
        monument_synonyms: {
          type: "synonym",
          synonyms: SYNONYMS,
        },
      },
      analyzer: {
        monument_analyzer: {
          tokenizer: "standard",
          filter: ["lowercase", "monument_synonyms"],
        },
      },
    },
  },
  mappings: {
    properties: {
      id: { type: "keyword" },
      monument_name: { type: "text", analyzer: "monument_analyzer" },
      aliases: { type: "text", analyzer: "monument_analyzer" },
      description: { type: "text" },
      category: { type: "keyword" },
      location: { type: "geo_point" },
      nearest_stations: {
        type: "nested",
        properties: {
          station_name: { type: "keyword" },
          line_color: { type: "keyword" },
          distance_km: { type: "float" },
          best_exit_gate: { type: "keyword" },
          walking_time_mins: { type: "integer" },
        },
      },
    },
  },
};

// Haversine distance in km
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Creates the index (with mapping + synonym filter) if it doesn't exist yet,
 * then bulk-seeds it from MONUMENTS and dynamically imported metro stations.
 */
export async function ensureIndexSeeded(client) {
  const exists = await client.indices.exists({ index: config.esIndex });
  if (exists) return { created: false, seeded: 0 };

  await client.indices.create({ index: config.esIndex, ...INDEX_MAPPING });

  // Load csvjson.json
  const stationsPath = path.resolve(__dirname, "../../csvjson.json");
  const stationsData = JSON.parse(fs.readFileSync(stationsPath, "utf8"));

  // 1. Convert stations to monuments
  const stationMonuments = stationsData.map((s) => {
    const name = s["Station Names"].split("[")[0].trim();
    return {
      id: `station-${s["ID (Station ID)"]}`,
      monument_name: name,
      aliases: [],
      description: `Metro Station on the ${s["Metro Line"]}. Opened in ${s["Opened(Year)"]}. Layout: ${s["Layout"]}.`,
      category: "Metro Station",
      location: { lat: s.Latitude, lon: s.Longitude },
      nearest_stations: [
        {
          station_name: name,
          line_color: s["Metro Line"],
          distance_km: 0,
          best_exit_gate: "N/A",
          walking_time_mins: 0,
        },
      ],
    };
  });

  // 2. Augment original monuments with dynamically calculated closest stations
  const augmentedMonuments = MONUMENTS.map((m) => {
    const lat = m.location.lat;
    const lon = m.location.lon;

    const stationDistances = stationsData.map((s) => {
      const dist = getDistance(lat, lon, s.Latitude, s.Longitude);
      return { station: s, dist };
    });

    stationDistances.sort((a, b) => a.dist - b.dist);

    const nearest = [];
    const seenNames = new Set();
    for (const item of stationDistances) {
      const name = item.station["Station Names"].split("[")[0].trim();
      if (!seenNames.has(name)) {
        seenNames.add(name);
        nearest.push({
          station_name: name,
          line_color: item.station["Metro Line"],
          distance_km: Number(item.dist.toFixed(2)),
          best_exit_gate: "Any", 
          walking_time_mins: Math.max(1, Math.round(item.dist * 12)), 
        });
      }
      if (nearest.length >= 2) break;
    }

    return {
      ...m,
      nearest_stations: nearest,
    };
  });

  const allDocs = [...augmentedMonuments, ...stationMonuments];

  const operations = allDocs.flatMap((doc) => [
    { index: { _index: config.esIndex, _id: doc.id } },
    doc,
  ]);
  
  const bulkResponse = await client.bulk({ refresh: true, operations });

  if (bulkResponse.errors) {
    const failed = bulkResponse.items.filter((item) => item.index?.error);
    throw new Error(
      `Failed to seed ${failed.length} monument(s): ${JSON.stringify(failed[0]?.index?.error)}`
    );
  }

  return { created: true, seeded: allDocs.length };
}
