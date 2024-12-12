const express = require('express');
const app = express();
const port = 80;

function generateSensorData() {
    return {
        data: {
            v_Rms: (Math.random() * 0.5).toFixed(4),  // Random value between 0 and 0.5 for v_Rms
            a_Peak: (Math.random() * 10).toFixed(1),  // Random value between 0 and 10 for a_Peak
            a_Rms: (Math.random() * 5).toFixed(1),    // Random value between 0 and 5 for a_Rms
            Temperature: (Math.random() * 50 + 10).toFixed(1),  // Random value between 10°C and 60°C
            Crest: (Math.random() * 5).toFixed(1),     // Random value between 0 and 5 for Crest
            status: "OK"
        },
        ts: new Date().toISOString()  // Current timestamp
    };
}

// Endpoint to serve the simulated data
app.post('/', (req, res) => {
    const sensorData = generateSensorData();
    res.setHeader('Content-Type', 'application/json');
    res.json([sensorData]);
    console.log("Generated data:", sensorData);
});


// Start the server
app.listen(port, () => {
    console.log(`Data generator server listening at http://localhost:${port}`);
});
