import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read metro.json
const metroDataPath = path.join(__dirname, '../data/metro.json');
const rawData = JSON.parse(fs.readFileSync(metroDataPath, 'utf8'));

// Normalize station name
function normalizeName(name) {
  // Remove suffix like [Conn: Blue] or (First Station)
  let cleaned = name.split('[')[0].split('(')[0].trim();
  // There are some inconsistent naming, lowercasing would be better for comparison
  // But let's keep original casing for the map and lowercase for lookup
  return cleaned;
}

const graph = {};

function addEdge(u, v, weight) {
  if (!graph[u]) graph[u] = {};
  if (!graph[v]) graph[v] = {};
  graph[u][v] = weight;
  graph[v][u] = weight;
}

const lines = {};
rawData.forEach(station => {
  const line = station['Metro Line'];
  if (!lines[line]) lines[line] = [];
  lines[line].push(station);
});

const stationNodesMap = {}; // normalizedName -> [nodeId1, nodeId2, ...]
const normalizedLookup = {}; // lowercaseName -> normalizedName

Object.keys(lines).forEach(lineName => {
  const stations = lines[lineName];
  stations.sort((a, b) => Number(a['Dist. From First Station(km)']) - Number(b['Dist. From First Station(km)']));

  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    const normName = normalizeName(s['Station Names']);
    const lowerName = normName.toLowerCase();
    normalizedLookup[lowerName] = normName;
    
    const nodeId = `${normName} (${lineName})`;
    
    if (!stationNodesMap[normName]) stationNodesMap[normName] = [];
    if (!stationNodesMap[normName].includes(nodeId)) {
        stationNodesMap[normName].push(nodeId);
    }

    if (i > 0) {
      const prevS = stations[i - 1];
      const prevNormName = normalizeName(prevS['Station Names']);
      const prevNodeId = `${prevNormName} (${lineName})`;
      
      const dist = Math.abs(Number(s['Dist. From First Station(km)']) - Number(prevS['Dist. From First Station(km)']));
      const weight = dist > 0 ? dist : 1.0; 
      addEdge(nodeId, prevNodeId, weight);
    }
  }
});

// Add interchange edges
const TRANSFER_PENALTY = 0.5; // km penalty for changing lines

Object.keys(stationNodesMap).forEach(normName => {
  const nodes = stationNodesMap[normName];
  if (nodes.length > 1) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        addEdge(nodes[i], nodes[j], TRANSFER_PENALTY);
      }
    }
  }
});

function findShortestPath(startName, endName) {
  const lowerStart = startName.trim().toLowerCase();
  const lowerEnd = endName.trim().toLowerCase();

  const normStart = normalizedLookup[lowerStart];
  const normEnd = normalizedLookup[lowerEnd];

  if (!normStart) throw new Error(`Station not found: ${startName}`);
  if (!normEnd) throw new Error(`Station not found: ${endName}`);
  
  const startNodes = stationNodesMap[normStart];
  const endNodes = stationNodesMap[normEnd];
  
  const graphCopy = JSON.parse(JSON.stringify(graph));
  
  graphCopy['START'] = {};
  startNodes.forEach(node => {
    graphCopy['START'][node] = 0;
  });
  
  endNodes.forEach(node => {
    if (!graphCopy[node]) graphCopy[node] = {};
    graphCopy[node]['END'] = 0;
  });
  graphCopy['END'] = {};

  const distances = {};
  const previous = {};
  const nodes = new Set();
  
  Object.keys(graphCopy).forEach(node => {
    distances[node] = Infinity;
    nodes.add(node);
  });
  
  distances['START'] = 0;
  
  // A simple Dijkstra using Set for priority queue (O(V^2))
  while (nodes.size > 0) {
    let closestNode = null;
    let minDistance = Infinity;
    
    for (const node of nodes) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        closestNode = node;
      }
    }
    
    if (!closestNode) break; 
    if (closestNode === 'END') break; 
    
    nodes.delete(closestNode);
    
    for (const neighbor in graphCopy[closestNode]) {
      const weight = graphCopy[closestNode][neighbor];
      const alt = distances[closestNode] + weight;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = closestNode;
      }
    }
  }
  
  if (distances['END'] === Infinity) {
    throw new Error("No path found");
  }
  
  const path = [];
  let curr = 'END';
  while (curr) {
    path.unshift(curr);
    curr = previous[curr];
  }
  
  path.shift(); 
  path.pop(); 
  
  // Format the path nicely
  const formattedPath = path.map(nodeId => {
    const match = nodeId.match(/(.+?) \((.+?)\)$/);
    if (match) {
        return { station: match[1], line: match[2] };
    }
    return { station: nodeId, line: 'Unknown' };
  });

  // Calculate actual travel distance excluding START and END edges
  let totalDistance = distances['END'];
  
  return {
    path: formattedPath,
    distance: totalDistance.toFixed(2)
  };
}

export { findShortestPath, stationNodesMap, normalizedLookup };
