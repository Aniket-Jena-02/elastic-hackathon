// Interchange walkthrough scripts, served directly (no ES needed — this
// is fixed wayfinding content, not searchable/geo data).

export const INTERCHANGES = {
  "kashmere-gate": {
    station_name: "Kashmere Gate",
    lines: ["Red", "Yellow", "Violet"],
    steps: [
      { step: 1, instruction: "Exit the Red Line platform and follow signs for 'Yellow/Violet Line Interchange'." },
      { step: 2, instruction: "Take the central escalator down to the concourse level." },
      { step: 3, instruction: "Follow the yellow footsteps on the floor toward the Yellow Line platform, or violet footsteps for the Violet Line." },
      { step: 4, instruction: "Allow 6-8 minutes to cross during peak hours; the corridor is long and can get crowded." },
    ],
  },
  "rajiv-chowk": {
    station_name: "Rajiv Chowk",
    lines: ["Yellow", "Blue"],
    steps: [
      { step: 1, instruction: "From the Yellow Line platform, follow overhead signs marked 'Blue Line Interchange'." },
      { step: 2, instruction: "Go up one level via escalator to the shared concourse." },
      { step: 3, instruction: "Head toward Gate 6 side for Blue Line trains toward Noida, or Gate 2 side for Dwarka." },
      { step: 4, instruction: "Interchange typically takes 4-5 minutes; avoid rush hour if you're short on time." },
    ],
  },
  "hauz-khas": {
    station_name: "Hauz Khas",
    lines: ["Yellow", "Magenta"],
    steps: [
      { step: 1, instruction: "Exit the Yellow Line platform and look for 'Magenta Line' signage." },
      { step: 2, instruction: "Descend via escalator to the lower concourse." },
      { step: 3, instruction: "Follow magenta footsteps to the Magenta Line platform toward Botanical Garden or Janakpuri West." },
      { step: 4, instruction: "This is a shorter interchange, usually under 3 minutes." },
    ],
  },
};
