import json
import struct
import time

"""
v-Rms (Speed Effective/average Value):
Represents the root mean square (RMS) speed of vibration. 

a-Peak (Acceleration Peak Value):
Represents Maximum acceleration, of vibration.

a-Rms (Acceleration Effective Value):
Represents the RMS acceleration of vibration.

Crest factor: This is the acceleration crest factor, (multiplied by 0.1). 
It's a useful metric for evaluating the peak-to-RMS ratio of vibration.
peak-to-RMS ratio = a-Peak / a-Rms
A high crest factor may indicate that the equipment is experiencing shock or impulsive events, while a low crest factor may indicate steady operation.

Temperature:
The current temperature at the sensor.

Device Status:
Provides information on the device's operational status (OK, maintenance required, failure, etc.).

"""

#****************************************** Get the data in Hex format **************************************************
def read_vibration_data():
    # Data structure based on the sensor's output data:
    # v-Rms (16-bit), a-Peak (16-bit), a-Rms (16-bit), Temperature (16-bit), Crest (16-bit), Device Status (4-bit)
    
    # Example: v-Rms = 2345 (0x0920), a-Peak = 1964 (0x078F), a-Rms = 1025 (0x0400), temperature = 25.0°C (0xFF00),
    # Crest = 15 (0x0F), Device status = 0 (OK)
    raw_data = struct.pack('>HHHHHB', 2345, 1964, 1025, 250, 15, 0)  # Big-endian format for Modbus
    
    return raw_data

# Function to process the raw sensor data
def process_sensor_data(raw_data):
    # Unpack the raw byte data (based on the assumed format: 16-bit unsigned integers for vibration and temperature, 8-bit for device status)
    v_rms, a_peak, a_rms, temperature, crest, device_status = struct.unpack('>HHHHHB', raw_data)
    
    # Convert the raw data to actual values
    processed_data = {
        'v_Rms': v_rms * 0.0001,  # Convert to meters per second (m/s)
        'a_Peak': a_peak * 0.1,    # Convert to meters per second squared (m/s²)
        'a_Rms': a_rms * 0.1,      # Convert to meters per second squared (m/s²)
        'temperature': temperature * 0.1,  # Convert to Celsius (°C)
        'crest': crest * 0.1,      # Convert to crest factor
        'device_status': device_status
    }
    
    return processed_data

# Function to save the data to a JSON file
def save_data_to_json(data, filename='vibration_data.json'):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

# Main function
def main():
    while True:
        # Step 1: Read raw data from the sensor (replace this with actual data retrieval code)
        raw_data = read_vibration_data()
        
        # Step 2: Process the raw data to get the actual values
        processed_data = process_sensor_data(raw_data)
        
        # Step 3: Save the processed data to a JSON file
        save_data_to_json(processed_data)
        
        # Print out the processed data for verification
        print(json.dumps(processed_data, indent=4))
        
        # Wait before reading the data again (adjust as needed)
        time.sleep(5)

if __name__ == '__main__':
    main()
