// Function to parse 16-bit integers from hex
function parseInt16(hex) {
    const data = hex.match(/../g);
    const buf = new ArrayBuffer(2);
    const view = new DataView(buf);
    data.forEach((b, i) => {
        view.setUint8(i, parseInt(b, 16));
    });
    return view.getInt16(0, false);
}

// Function to interpret status codes
function interpretStatus(hex) {
    switch (hex.toUpperCase()) {
        case '7FF8': return 'Normal Operation';
        case '7FF0': return 'No Data';
        case '7FFC': return 'Underload';
        case '8008': return 'Overload';
        default: {
            if (hex === '00') return 'OUT1: Inactive';
            if (hex === '01') return 'OUT1: Active';
            return 'Unknown Status';
        }
    }
}

// Process response
if (msg.payload && msg.payload.data && msg.payload.data.value) {
    const original = msg.payload.data.value;

    // Check if it's a special status code
    const isSpecialStatus = ['7FF8', '7FF0', '7FFC', '8008'].includes(original.toUpperCase());

    if (isSpecialStatus) {
        msg.payload = [{
            measurement: "DP2200",
            status: interpretStatus(original),
            status_code: original,
            current: null,
            tags: {
                sensor: "DP2200",
                type: "special_status"
            }
        }];
    } else {
        // Normal reading with current and OUT1 status
        const currentHex = original.substring(0, 4);
        const statusHex = original.substring(4, 6);
        const currentValue = Number((parseInt(currentHex, 16) * 0.001).toFixed(3));

        msg.payload = [{
            measurement: "DP2200",
            tags: {
                sensor: "DP2200",
                type: "normal_reading"
            },
            value: currentValue,
            status: interpretStatus(statusHex),
            status_code: statusHex,
        }];
    }

    // Error case
} else {
    msg.payload = [{
        measurement: "DP2200",
        tags: {
            sensor: "DP2200",
            type: "error"
        },
        fields: {
            error: "Invalid response format"
        },
    }];
}

return msg;