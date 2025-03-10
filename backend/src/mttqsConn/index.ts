///Gestione classe con connessione ad mttqs, con interface mqttConfid
import mqtt, { IClientOptions, MqttClient } from "mqtt";
import mqttConfig from "../configuration/mqttsConfig";
import DroneHistory from "../models/droneSchemaHistory";
import RealTimeDroneData from "../models/droneSchemaRealTime";

export default class MQTTService {
  private static instance: MQTTService;
  private client: MqttClient;

  private constructor() {
    const options: IClientOptions = {
      host: mqttConfig.broker,
      port: 8883, // Assicurati che sia la porta giusta per il tuo broker
      protocol: "mqtts",
      username: mqttConfig.username,
      password: mqttConfig.password,
      clientId: mqttConfig.clientId,
      rejectUnauthorized: false, // Cambia a true per connessioni sicure
    };

    this.client = mqtt.connect(options);

    this.client.on("connect", () => {
      console.log("✅ Connesso al broker MQTTs!");
    });

    ///// iscrizione al topic
    this.client.subscribe(mqttConfig.topicPrefix, (err) => {
      console.log("subscribe in attesa");
      if (!err) {
        console.log(`Sottoscritto al topic: ${mqttConfig.topicPrefix}`);
      } else {
        console.error("❌ Errore durante la sottoscrizione:", err);
      }
    });

    ///// pubblicazione del messaggio
    this.client.publish(
      mqttConfig.topicPrefix,
      "Ciao, questo è un messaggio di prova",
      (err) => {
        if (!err) {
          console.log("Messaggio pubblicato con successo");
        } else {
          console.error("❌ Errore durante la pubblicazione:", err);
        }
      }
    );
    const droneStatus = new Map();
    // Gestione dei messaggi in arrivo
    this.client.on("message", async (topic, message) => {
      const topicParts = topic.split("/");
      const deviceId = topicParts[2];
      const uniqueId = topicParts[3];
      const data = JSON.parse(message.toString());
      const update = {
        uniqueId,
        status: "ONLINE",
        timestamp: new Date(), // Aggiorna il timestamp
        lat: data.lat,
        lon: data.lon,
        temperature: data.temperature,
      };
      const options = { upsert: true, new: true }; // Opzioni per upsert

      const drone = new DroneHistory({
        deviceId,
        uniqueId,
        status: "ONLINE",
        lat: data.lat,
        lon: data.lon,
        temperature: data.temperature,
      });
      await drone.save();
      await RealTimeDroneData.findOneAndUpdate({deviceId}, update, options);
      console.log(`Dati salvati per il drone ${deviceId}`);

      const timeout = setTimeout(async () => {
        await RealTimeDroneData.findOneAndUpdate(
          { deviceId },
          { status: "OFFLINE" },
          { new: true }
        );
        console.log(`Drone ${deviceId} impostato su OFFLINE per inattività.`);
      }, 5 * 60 * 1000); // 5 minuti
  
      droneStatus.set(deviceId, timeout); // Salva il timeout nella mappa
    });

    this.client.on("error", (err) => {
      console.error("❌ Errore MQTT:", err);
    });

    this.client.on("close", () => {
      console.log("🔌 Connessione chiusa.");
    });
  }

  // Metodo per ottenere l'istanza singleton
  public static getInstance(): MQTTService {
    if (!MQTTService.instance) {
      MQTTService.instance = new MQTTService();
    }
    return MQTTService.instance;
  }
}
