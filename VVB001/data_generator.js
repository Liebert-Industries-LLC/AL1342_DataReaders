const express = require('express');
const app = express();
const port = 80;


// Endpoint to serve the simulated data
app.post('/', (req, res) => {
    const sensorData = generateRawHexRecord();
    res.setHeader('Content-Type', 'application/json');
    res.json({
        cid:0,
        data: {value: sensorData[0]},
        code: 200,
    });
    console.log("Generated data:", sensorData);
});


// Start the server
app.listen(port, () => {
    console.log(`Data generator server listening at http://localhost:${port}`);
});

function generateRawHexRecord() {
  const record = [];

  // Word 0 (16 bits): v-Rms
  record.push(
    Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, "0")
  );

  // Word 1 (8 bits scale + 8 bits n/a): Scale v-Rms and n/a
  const scale_vRms = Math.floor(Math.random() * 0xff)
    .toString(16)
    .padStart(2, "0");
  const n_a_1 = "00"; // n/a is set to 0
  record.push(scale_vRms + n_a_1);

  // Word 2 (16 bits): a-Peak
  record.push(
    Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, "0")
  );

  // Word 3 (8 bits scale + 8 bits n/a): Scale a-Peak and n/a
  const scale_aPeak = Math.floor(Math.random() * 0xff)
    .toString(16)
    .padStart(2, "0");
  const n_a_2 = "00"; // n/a is set to 0
  record.push(scale_aPeak + n_a_2);

  // Word 4 (16 bits): a-Rms
  record.push(
    Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, "0")
  );

  // Word 5 (8 bits scale + 8 bits n/a): Scale a-Rms and n/a
  const scale_aRms = Math.floor(Math.random() * 0xff)
    .toString(16)
    .padStart(2, "0");
  const n_a_3 = "00"; // n/a is set to 0
  record.push(scale_aRms + n_a_3);

  // Word 6 (16 bits): Temperature
  record.push(
    Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, "0")
  );

  // Word 7 (8 bits scale + 8 bits n/a): Scale Temperature and n/a
  const scale_temperature = Math.floor(Math.random() * 0xff)
    .toString(16)
    .padStart(2, "0");
  const n_a_4 = "00"; // n/a is set to 0
  record.push(scale_temperature + n_a_4);

  // Word 8 (16 bits): Crest
  record.push(
    Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, "0")
  );

  // Word 9 (8 bits scale + 8 bits device status): Scale Crest and Device Status
  const scale_crest = Math.floor(Math.random() * 0xff)
    .toString(16)
    .padStart(2, "0");
  const device_status = Math.floor(Math.random() * 0xff)
    .toString(16)
    .padStart(2, "0");
  record.push(scale_crest + device_status);

  // Join all words together to form the raw hex record (160 bits).
  return record.join("");
}

function generateMultipleRecords(count) {
  const records = [];

  for (let i = 0; i < count; i++) {
    records.push(generateRawHexRecord());
  }

  return records;
}

// Example: Generate 10 raw hex records.
// const rawHexRecords = generateMultipleRecords(10);
// console.log("Generated raw hex records:", rawHexRecords);
