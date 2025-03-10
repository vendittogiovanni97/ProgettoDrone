import mongoose from "mongoose";
import { Status } from "./droneSchemaHistory";

const { Schema, model } = mongoose;

// Schema per i dati in tempo reale del drone
const RealTimeDroneDataSchema = new Schema(
  {
    deviceId: { type: String, unique: true, required: true },
    uniqueId: { type: Number,unique: true},
    status: { type: String, enum: Status },
    lat: { type: Number, required: true }, // Latitudine
    lon: { type: Number, required: true }, // Longitudine
    temperature: { type: Number, required: true }, // Temperatura del drone
    lastUpdated: { type: Date, default: Date.now },
  },
  { collection: "real_time_drone_data" }
);

const RealTimeDroneData = model("RealTimeDroneData", RealTimeDroneDataSchema);
console.log("Schema creato", RealTimeDroneData);


export default RealTimeDroneData;