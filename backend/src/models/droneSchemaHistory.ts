import { timeStamp } from "console";
import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Schema per la cronologia dei droni
const DroneHistorySchema = new Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },
    uniqueId: {
      type: Number,
      required: true,
    },
    status: { type: String,default: "OFFLINE"},
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
    temperature: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { collection: "drone_history" }
);

const DroneHistory = model("DroneHistory", DroneHistorySchema);
console.log("Schema creato", DroneHistory);
export default DroneHistory;
