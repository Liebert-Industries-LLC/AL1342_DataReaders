import paho.mqtt.client as mqtt
import struct

# MQTT Configuration
BROKER = "127.0.0.1"
PORT = 1883
TOPIC = "factory/sensor/speed"

# Scaling factor (from datasheet)
SCALING_FACTOR = 0.1

# Callback when a message is received
def on_message(client, userdata, message):
    # Decode payload (assuming it's hex)
    raw_data = message.payload.decode("utf-8")
    print(f"Raw data received: {raw_data}")
    
    # Extract speed (first 4 bytes)
    speed_raw = int(raw_data[0:8], 16)  # Convert hex to int
    speed = speed_raw * SCALING_FACTOR  # Apply scaling
    
    # Extract device status (next byte)
    device_status = int(raw_data[8:10], 16)
    
    # Extract OUT1 and OUT2 statuses (last byte)
    digital_status = int(raw_data[10:12], 16)
    out1_status = bool(digital_status & 0x01)
    out2_status = bool((digital_status >> 1) & 0x01)
    
    # Print processed data
    print(f"Speed: {speed} Hz, Device Status: {device_status}, OUT1: {out1_status}, OUT2: {out2_status}")

# Setup MQTT client
client = mqtt.Client()
client.on_message = on_message
client.connect(BROKER, PORT)
client.subscribe(TOPIC)

print("Listening for MQTT messages...")
client.loop_forever()
