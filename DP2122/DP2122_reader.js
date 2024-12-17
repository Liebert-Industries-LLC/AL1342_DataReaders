// Function to process raw hex data
function processSensorData(rawData) {
  const SCALING_FACTOR = 0.1;

  // Extract speed (first 4 bytes)
  const speedRaw = parseInt(rawData.slice(0, 8), 16);
  const speed = speedRaw * SCALING_FACTOR;

  // Extract device status (next byte)
  const deviceStatus = parseInt(rawData.slice(8, 10), 16);

  // Extract OUT1 and OUT2 statuses (last byte)
  const digitalStatus = parseInt(rawData.slice(10, 12), 16);
  const out1Status = Boolean(digitalStatus & 0x01);
  const out2Status = Boolean((digitalStatus >> 1) & 0x01);

  return {
    speed: `${speed} Hz`,
    deviceStatus,
    out1Status,
    out2Status,
  };
}

// Function to handle HTTP request
async function handleSensorRequest(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405; // Method Not Allowed
    res.end(JSON.stringify({ error: "Method not allowed. Use POST." }));
    return;
  }

  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const { rawData } = JSON.parse(body); // Assume JSON payload { "rawData": "..." }

      if (!rawData || typeof rawData !== "string" || rawData.length < 12) {
        throw new Error("Invalid rawData format.");
      }

      const processedData = processSensorData(rawData);

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          rawData,
          ...processedData,
        })
      );
    });
  } catch (error) {
    res.statusCode = 400; // Bad Request
    res.end(JSON.stringify({ error: error.message }));
  }
}

// HTTP Server setup
const http = require("http");

const server = http.createServer((req, res) => {
  handleSensorRequest(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
