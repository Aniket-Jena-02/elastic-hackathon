// Static seed list of Delhi monuments/attractions, cross-referenced against
// real DMRC station names, coordinates, and line colors from the provided
// station dataset.

export const MONUMENTS = [
  {
    id: "akshardham",
    monument_name: "Akshardham Temple",
    aliases: ["swaminarayan akshardham", "akshardham mandir"],
    description:
      "A sprawling temple complex on the banks of the Yamuna known for its intricate stone carvings, exhibitions, and musical fountain.",
    category: "Historical",
    location: { lat: 28.61806, lon: 77.27869 },
    nearest_stations: [
      {
        station_name: "Akshardham",
        line_color: "Blue",
        distance_km: 0.1,
        best_exit_gate: "Gate 1",
        walking_time_mins: 3,
      },
    ],
  },
  {
    id: "connaught-place",
    monument_name: "Connaught Place",
    aliases: ["cp", "rajiv chowk", "cp inner circle"],
    description:
      "Delhi's colonnaded Georgian-era shopping and business district, built around a large central park.",
    category: "Shopping",
    location: { lat: 28.63282, lon: 77.21826 },
    nearest_stations: [
      {
        station_name: "Rajiv Chowk",
        line_color: "Yellow",
        distance_km: 0.0,
        best_exit_gate: "Gate 2 (Inner Circle)",
        walking_time_mins: 2,
      },
      {
        station_name: "Rajiv Chowk",
        line_color: "Blue",
        distance_km: 0.0,
        best_exit_gate: "Gate 6 (Outer Circle)",
        walking_time_mins: 4,
      },
    ],
  },
  {
    id: "india-gate",
    monument_name: "India Gate",
    aliases: ["all india war memorial"],
    description:
      "A 42-metre war memorial arch at the heart of Rajpath, flanked by wide lawns popular for evening walks.",
    category: "Historical",
    location: { lat: 28.6129, lon: 77.2295 },
    nearest_stations: [
      {
        station_name: "Central Secretariat",
        line_color: "Yellow",
        distance_km: 1.8,
        best_exit_gate: "Gate 1",
        walking_time_mins: 22,
      },
      {
        station_name: "Khan Market",
        line_color: "Violet",
        distance_km: 2.0,
        best_exit_gate: "Gate 1",
        walking_time_mins: 24,
      },
    ],
  },
  {
    id: "chandni-chowk",
    monument_name: "Chandni Chowk",
    aliases: ["chandni chowk market", "old delhi bazaar"],
    description:
      "A chaotic, centuries-old market lane in Old Delhi famous for street food, wedding-card shops, and the Red Fort at its end.",
    category: "Food",
    location: { lat: 28.65785, lon: 77.23014 },
    nearest_stations: [
      {
        station_name: "Chandni Chowk",
        line_color: "Yellow",
        distance_km: 0.1,
        best_exit_gate: "Gate 3",
        walking_time_mins: 3,
      },
      {
        station_name: "Chawri Bazar",
        line_color: "Yellow",
        distance_km: 0.9,
        best_exit_gate: "Gate 2",
        walking_time_mins: 12,
      },
    ],
  },
  {
    id: "lotus-temple",
    monument_name: "Lotus Temple",
    aliases: ["bahai house of worship"],
    description:
      "A lotus-shaped Bahá'í House of Worship set in landscaped gardens, known for its silence and striking architecture.",
    category: "Historical",
    location: { lat: 28.5535, lon: 77.2588 },
    nearest_stations: [
      {
        station_name: "Kalkaji Mandir",
        line_color: "Magenta",
        distance_km: 1.2,
        best_exit_gate: "Gate 3",
        walking_time_mins: 15,
      },
      {
        station_name: "Nehru Place",
        line_color: "Violet",
        distance_km: 1.4,
        best_exit_gate: "Gate 2",
        walking_time_mins: 17,
      },
    ],
  },
  {
    id: "qutub-minar",
    monument_name: "Qutub Minar",
    aliases: ["qutab minar"],
    description:
      "A 73-metre 12th-century minaret and UNESCO World Heritage Site surrounded by the ruins of the Qutb complex.",
    category: "Historical",
    location: { lat: 28.51302, lon: 77.18648 },
    nearest_stations: [
      {
        station_name: "Qutab Minar",
        line_color: "Yellow",
        distance_km: 0.4,
        best_exit_gate: "Gate 1",
        walking_time_mins: 6,
      },
    ],
  },
  {
    id: "red-fort",
    monument_name: "Red Fort",
    aliases: ["lal quila"],
    description:
      "The red sandstone Mughal fortress that was the seat of imperial power for nearly 200 years, now a museum and evening light show venue.",
    category: "Historical",
    location: { lat: 28.6562, lon: 77.241 },
    nearest_stations: [
      {
        station_name: "Lal Quila",
        line_color: "Violet",
        distance_km: 0.3,
        best_exit_gate: "Gate 1",
        walking_time_mins: 5,
      },
    ],
  },
  {
    id: "humayuns-tomb",
    monument_name: "Humayun's Tomb",
    aliases: ["humayun tomb", "mughal garden tomb"],
    description:
      "A Mughal garden-tomb that inspired the Taj Mahal, set inside a walled Persian charbagh garden.",
    category: "Historical",
    location: { lat: 28.5933, lon: 77.2507 },
    nearest_stations: [
      {
        station_name: "Jor Bagh",
        line_color: "Yellow",
        distance_km: 2.0,
        best_exit_gate: "Gate 2",
        walking_time_mins: 24,
      },
      {
        station_name: "Jawaharlal Nehru Stadium",
        line_color: "Violet",
        distance_km: 2.2,
        best_exit_gate: "Gate 1",
        walking_time_mins: 26,
      },
    ],
  },
];
