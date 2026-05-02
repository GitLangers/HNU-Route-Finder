const rooms = [
  { id: "gate1", name: "Entrance Gate 1", x: 80, y: 150, zone: "Northwest Entrance" },
  { id: "hospital", name: "HNU Hospital", x: 320, y: 155, zone: "Medical Services" },
  { id: "newoval", name: "New Oval", x: 585, y: 70, zone: "Track and Field" },
  { id: "gate5", name: "Entrance Gate 5", x: 760, y: 125, zone: "Northeast Entrance" },
  { id: "barder", name: "Fr. Patrick Barder SVD Gymnasium", x: 715, y: 195, zone: "Basketball / Taekwondo" },
  { id: "residence", name: "SVD Residence", x: 545, y: 248, zone: "Residence" },
  { id: "activity", name: "Activity Center", x: 615, y: 320, zone: "Billiards / Badminton" },
  { id: "foodcourt", name: "Food Court", x: 566, y: 366, zone: "Dining Area" },
  { id: "shs", name: "Senior High School Building", x: 650, y: 418, zone: "Senior High" },
  { id: "oldoval", name: "Old Oval", x: 220, y: 285, zone: "Central Oval" },
  { id: "hsgym", name: "High School Gym", x: 300, y: 255, zone: "Futsal / 3x3 / Dance" },
  { id: "court-tennis", name: "Covered Courts Tennis", x: 70, y: 330, zone: "Lawn Tennis" },
  { id: "court-volley", name: "Covered Courts Volleyball", x: 85, y: 405, zone: "Volleyball" },
  { id: "gate4", name: "Entrance Gate 4", x: 95, y: 448, zone: "Southwest Entrance" },
  { id: "basiced", name: "Basic Education Building", x: 252, y: 400, zone: "Basic Education" },
  { id: "emc", name: "Elementary EMC", x: 365, y: 468, zone: "Chess Area" }
];

const roadSegments = [
  { from: "gate1", to: "hospital", distance: 130, roadClass: "major", d: "M 80 150 C 120 150, 188 151, 250 154 S 301 156, 320 155" },
  { from: "hospital", to: "newoval", distance: 220, roadClass: "major", d: "M 320 155 C 370 154, 434 140, 482 115 S 555 80, 585 70" },
  { from: "newoval", to: "gate5", distance: 155, roadClass: "major", d: "M 585 70 C 640 82, 705 95, 760 125" },
  { from: "gate5", to: "barder", distance: 88, roadClass: "minor", d: "M 760 125 C 752 145, 735 167, 715 195" },
  { from: "hospital", to: "residence", distance: 190, roadClass: "major", d: "M 320 155 C 372 182, 444 214, 500 232 S 535 243, 545 248" },
  { from: "residence", to: "barder", distance: 175, roadClass: "major", d: "M 545 248 C 590 245, 640 232, 715 195" },
  { from: "residence", to: "activity", distance: 118, roadClass: "minor", d: "M 545 248 C 555 275, 580 298, 615 320" },
  { from: "activity", to: "foodcourt", distance: 78, roadClass: "minor", d: "M 615 320 C 605 335, 590 350, 566 366" },
  { from: "foodcourt", to: "shs", distance: 122, roadClass: "major", d: "M 566 366 C 595 382, 620 398, 650 418" },
  { from: "hospital", to: "oldoval", distance: 175, roadClass: "major", d: "M 320 155 C 298 184, 270 222, 243 252 S 224 277, 220 285" },
  { from: "oldoval", to: "hsgym", distance: 82, roadClass: "minor", d: "M 220 285 C 245 279, 272 269, 300 255" },
  { from: "oldoval", to: "basiced", distance: 135, roadClass: "major", d: "M 220 285 C 224 320, 234 360, 252 400" },
  { from: "basiced", to: "emc", distance: 112, roadClass: "major", d: "M 252 400 C 286 425, 328 448, 365 468" },
  { from: "basiced", to: "gate4", distance: 158, roadClass: "major", d: "M 252 400 C 204 413, 150 428, 95 448" },
  { from: "gate4", to: "court-volley", distance: 66, roadClass: "minor", d: "M 95 448 C 84 434, 82 420, 85 405" },
  { from: "court-volley", to: "court-tennis", distance: 86, roadClass: "minor", d: "M 85 405 C 74 386, 68 356, 70 330" },
  { from: "court-tennis", to: "oldoval", distance: 138, roadClass: "major", d: "M 70 330 C 102 318, 140 304, 220 285" },
  { from: "hsgym", to: "residence", distance: 198, roadClass: "major", d: "M 300 255 C 365 250, 430 248, 545 248" },
  { from: "oldoval", to: "foodcourt", distance: 278, roadClass: "major", d: "M 220 285 C 320 286, 430 306, 566 366" }
];

const backgroundLayer = document.getElementById("background-layer");
const roadSegmentMap = new Map();

const roomMap = new Map(rooms.map((room) => [room.id, room]));
const nameToId = new Map(rooms.map((room) => [room.name.toLowerCase(), room.id]));
roadSegments.forEach((segment) => {
  roadSegmentMap.set(makeEdgeKey(segment.from, segment.to), segment);
  roadSegmentMap.set(makeEdgeKey(segment.to, segment.from), segment);
});
const connections = roadSegments.map(({ from, to, distance }) => [from, to, distance]);
const adjacency = buildAdjacencyList(connections);

const roomOptions = document.getElementById("room-options");
const form = document.getElementById("route-form");
const startInput = document.getElementById("start-room");
const endInput = document.getElementById("end-room");
const swapButton = document.getElementById("swap-button");
const statusCard = document.getElementById("status-card");
const distanceOutput = document.getElementById("distance-output");
const timeOutput = document.getElementById("time-output");
const pathOutput = document.getElementById("path-output");
const directionsList = document.getElementById("directions-list");
const edgesLayer = document.getElementById("edges-layer");
const pathLayer = document.getElementById("path-layer");
const nodesLayer = document.getElementById("nodes-layer");

populateRoomOptions();
drawBaseMap();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculateRoute();
});

swapButton.addEventListener("click", () => {
  const currentStart = startInput.value;
  startInput.value = endInput.value;
  endInput.value = currentStart;
  if (startInput.value && endInput.value) {
    calculateRoute();
  }
});

function populateRoomOptions() {
  roomOptions.innerHTML = rooms
    .map((room) => `<option value="${room.name}"></option>`)
    .join("");
}

function buildAdjacencyList(edgeList) {
  const graph = new Map();

  rooms.forEach((room) => {
    graph.set(room.id, []);
  });

  edgeList.forEach(([from, to, distance]) => {
    graph.get(from).push({ to, distance });
    graph.get(to).push({ to: from, distance });
  });

  return graph;
}

function drawBaseMap() {
  drawCampusBackground();
  edgesLayer.innerHTML = "";
  nodesLayer.innerHTML = "";

  roadSegments.forEach((segment) => {
    const path = createSvgElement("path", {
      d: segment.d,
      class: `edge ${segment.roadClass === "minor" ? "minor" : ""}`
    });
    edgesLayer.appendChild(path);
  });

  rooms.forEach((room) => {
    const group = createSvgElement("g", {
      "data-room-id": room.id
    });

    const halo = createSvgElement("circle", {
      cx: room.x,
      cy: room.y,
      r: 10,
      class: "node-halo"
    });
    const marker = createSvgElement("circle", {
      cx: room.x,
      cy: room.y,
      r: 6,
      class: "node-marker"
    });
    const textBackground = createSvgElement("rect", {
      x: room.x - 72,
      y: room.y - 44,
      width: 144,
      height: 30,
      rx: 15,
      class: "node-room"
    });

    const roomName = createSvgElement("text", {
      x: room.x,
      y: room.y - 28,
      class: "node-label"
    });
    roomName.textContent = room.name;

    const zone = createSvgElement("text", {
      x: room.x,
      y: room.y + 18,
      class: "node-subtext"
    });
    zone.textContent = room.zone;

    group.append(halo, marker, textBackground, roomName, zone);
    nodesLayer.appendChild(group);
  });
}

function drawCampusBackground() {
  backgroundLayer.innerHTML = "";

  const paper = createSvgElement("rect", {
    x: 0,
    y: 0,
    width: 860,
    height: 520,
    class: "campus-paper"
  });
  backgroundLayer.appendChild(paper);

  roadSegments.forEach((segment) => {
    backgroundLayer.appendChild(createSvgElement("path", {
      d: segment.d,
      class: `campus-road-casing ${segment.roadClass === "minor" ? "minor" : ""}`
    }));
    backgroundLayer.appendChild(createSvgElement("path", {
      d: segment.d,
      class: `campus-road ${segment.roadClass === "minor" ? "minor" : ""}`
    }));
  });

  const buildings = [
    { tag: "rect", attrs: { x: 270, y: 126, width: 98, height: 62, rx: 10, class: "campus-building hospital" } },
    { tag: "rect", attrs: { x: 252, y: 116, width: 16, height: 80, rx: 8, class: "campus-building alt" } },
    { tag: "rect", attrs: { x: 368, y: 28, width: 226, height: 78, rx: 36, transform: "rotate(-31 481 67)", class: "campus-park oval" } },
    { tag: "rect", attrs: { x: 664, y: 160, width: 120, height: 54, rx: 10, class: "campus-building" } },
    { tag: "rect", attrs: { x: 523, y: 228, width: 68, height: 58, rx: 10, class: "campus-building alt" } },
    { tag: "rect", attrs: { x: 576, y: 288, width: 94, height: 68, rx: 12, class: "campus-building" } },
    { tag: "rect", attrs: { x: 505, y: 345, width: 118, height: 52, rx: 10, class: "campus-building alt" } },
    { tag: "rect", attrs: { x: 595, y: 388, width: 138, height: 64, rx: 12, class: "campus-building" } },
    { tag: "ellipse", attrs: { cx: 221, cy: 285, rx: 74, ry: 98, class: "campus-park oval" } },
    { tag: "rect", attrs: { x: 267, y: 226, width: 88, height: 68, rx: 10, transform: "rotate(-24 311 260)", class: "campus-building alt" } },
    { tag: "rect", attrs: { x: 208, y: 367, width: 118, height: 64, rx: 8, class: "campus-building" } },
    { tag: "rect", attrs: { x: 328, y: 448, width: 82, height: 44, rx: 8, class: "campus-building alt" } }
  ];

  buildings.forEach(({ tag, attrs }) => {
    backgroundLayer.appendChild(createSvgElement(tag, attrs));
  });

  const tennis1 = createSvgElement("ellipse", {
    cx: 66,
    cy: 331,
    rx: 13,
    ry: 19,
    class: "campus-court"
  });
  const tennis2 = createSvgElement("ellipse", {
    cx: 93,
    cy: 348,
    rx: 13,
    ry: 19,
    class: "campus-court"
  });
  const volley = createSvgElement("rect", {
    x: 48,
    y: 392,
    width: 44,
    height: 26,
    rx: 4,
    class: "campus-court"
  });
  backgroundLayer.append(tennis1, tennis2, volley);

  const labels = [
    { text: "HNU HOSPITAL", x: 319, y: 113, class: "campus-label" },
    { text: "NEW OVAL", x: 516, y: 77, class: "campus-label" },
    { text: "FR. PATRICK BARDER", x: 722, y: 145, class: "campus-label small" },
    { text: "SVD GYMNASIUM", x: 722, y: 159, class: "campus-label small" },
    { text: "OLD OVAL", x: 221, y: 285, class: "campus-label" },
    { text: "HIGH SCHOOL GYM", x: 312, y: 220, class: "campus-label small" },
    { text: "ACTIVITY CENTER", x: 622, y: 287, class: "campus-label small" },
    { text: "FOOD COURT", x: 563, y: 339, class: "campus-label small" },
    { text: "SENIOR HIGH", x: 663, y: 384, class: "campus-label small" },
    { text: "SCHOOL BLDG", x: 663, y: 397, class: "campus-label small" },
    { text: "BASIC EDUCATION", x: 269, y: 439, class: "campus-label small" },
    { text: "ELEMENTARY EMC", x: 368, y: 445, class: "campus-label small" },
    { text: "GATE 1", x: 73, y: 126, class: "campus-label small" },
    { text: "GATE 4", x: 89, y: 473, class: "campus-label small" },
    { text: "GATE 5", x: 780, y: 103, class: "campus-label small" }
  ];

  labels.forEach(({ text, x, y, class: className }) => {
    const label = createSvgElement("text", { x, y, class: className });
    label.textContent = text;
    backgroundLayer.appendChild(label);
  });

  const northArrow = [
    createSvgElement("circle", { cx: 112, cy: 57, r: 24, class: "campus-compass" }),
    createSvgElement("line", { x1: 112, y1: 34, x2: 112, y2: 80, class: "campus-outline" }),
    createSvgElement("line", { x1: 88, y1: 57, x2: 136, y2: 57, class: "campus-outline" }),
    createSvgElement("path", { d: "M 112 18 L 104 36 L 120 36 Z", class: "campus-marker" })
  ];
  northArrow.forEach((element) => backgroundLayer.appendChild(element));
  const north = createSvgElement("text", { x: 112, y: 14, class: "campus-label small" });
  north.textContent = "N";
  backgroundLayer.appendChild(north);
}

function calculateRoute() {
  const startId = normalizeRoomName(startInput.value);
  const endId = normalizeRoomName(endInput.value);

  if (!startId || !endId) {
    setStatus("Please choose rooms from the available campus locations.", "warning");
    resetOutputs();
    clearPath();
    return;
  }

  if (startId === endId) {
    const roomName = roomMap.get(startId).name;
    setStatus(`You are already at ${roomName}. Choose another destination to calculate a route.`, "warning");
    updateOutputs({
      distance: "0 m",
      time: "0 min",
      pathText: roomName,
      directions: [`You are already in ${roomName}.`]
    });
    highlightActiveRooms([startId]);
    clearPath();
    return;
  }

  const result = shortestPath(startId, endId);

  if (!result.path.length) {
    setStatus("No connected route was found between those rooms.", "warning");
    resetOutputs();
    clearPath();
    return;
  }

  const roomNames = result.path.map((roomId) => roomMap.get(roomId).name);
  const minutes = Math.max(1, Math.round(result.distance / 80));
  const directions = buildDirections(roomNames);

  setStatus(`Best route found from ${roomNames[0]} to ${roomNames[roomNames.length - 1]}.`, "success");
  updateOutputs({
    distance: `${result.distance} m`,
    time: `${minutes} min`,
    pathText: roomNames.join(" -> "),
    directions
  });
  drawPath(result.path);
  highlightActiveRooms(result.path);
}

function normalizeRoomName(value) {
  return nameToId.get(value.trim().toLowerCase()) || null;
}

function shortestPath(startId, endId) {
  const distances = new Map();
  const previous = new Map();
  const unvisited = new Set(rooms.map((room) => room.id));

  rooms.forEach((room) => distances.set(room.id, Infinity));
  distances.set(startId, 0);

  while (unvisited.size > 0) {
    let current = null;
    let currentDistance = Infinity;

    unvisited.forEach((roomId) => {
      const distance = distances.get(roomId);
      if (distance < currentDistance) {
        current = roomId;
        currentDistance = distance;
      }
    });

    if (!current || currentDistance === Infinity) {
      break;
    }

    unvisited.delete(current);

    if (current === endId) {
      break;
    }

    adjacency.get(current).forEach(({ to, distance }) => {
      if (!unvisited.has(to)) {
        return;
      }

      const tentative = currentDistance + distance;
      if (tentative < distances.get(to)) {
        distances.set(to, tentative);
        previous.set(to, current);
      }
    });
  }

  const path = [];
  let cursor = endId;

  while (cursor) {
    path.unshift(cursor);
    cursor = previous.get(cursor);
  }

  if (path[0] !== startId) {
    return { path: [], distance: Infinity };
  }

  return {
    path,
    distance: distances.get(endId)
  };
}

function buildDirections(roomNames) {
  if (roomNames.length === 2) {
    return [
      `Start at ${roomNames[0]}.`,
      `Walk directly to ${roomNames[1]}.`
    ];
  }

  const steps = [`Start at ${roomNames[0]}.`];

  for (let index = 1; index < roomNames.length - 1; index += 1) {
    steps.push(`Continue to ${roomNames[index]}.`);
  }

  steps.push(`Arrive at ${roomNames[roomNames.length - 1]}.`);
  return steps;
}

function updateOutputs({ distance, time, pathText, directions }) {
  distanceOutput.textContent = distance;
  timeOutput.textContent = time;
  pathOutput.textContent = pathText;
  directionsList.innerHTML = directions.map((step) => `<li>${step}</li>`).join("");
}

function resetOutputs() {
  distanceOutput.textContent = "--";
  timeOutput.textContent = "--";
  pathOutput.textContent = "No route yet";
  directionsList.innerHTML = "<li>Select rooms to see turn-by-turn guidance.</li>";
  highlightActiveRooms([]);
}

function setStatus(message, variant) {
  statusCard.textContent = message;
  statusCard.className = `status-card ${variant}`;
}

function clearPath() {
  pathLayer.innerHTML = "";
}

function drawPath(pathIds) {
  clearPath();

  for (let index = 0; index < pathIds.length - 1; index += 1) {
    const segment = roadSegmentMap.get(makeEdgeKey(pathIds[index], pathIds[index + 1]));
    if (!segment) {
      continue;
    }

    const pathSegment = createSvgElement("path", {
      d: segment.d,
      class: "path-edge"
    });
    pathLayer.appendChild(pathSegment);
  }
}

function highlightActiveRooms(activeIds) {
  const activeSet = new Set(activeIds);
  document.querySelectorAll("[data-room-id]").forEach((group) => {
    const label = group.querySelector(".node-room");
    const marker = group.querySelector(".node-marker");
    const halo = group.querySelector(".node-halo");
    const active = activeSet.has(group.dataset.roomId);
    label.classList.toggle("active", active);
    marker.classList.toggle("active", active);
    halo.classList.toggle("active", active);
  });
}

function makeEdgeKey(from, to) {
  return `${from}::${to}`;
}

function createSvgElement(tag, attributes) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}
