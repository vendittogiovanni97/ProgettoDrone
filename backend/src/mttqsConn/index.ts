///Gestione classe con connessione ad mttqs, con interface mqttConfid
import mttqConfig from "../configuration/mttqsConfig";
import mqtt, { IClientOptions, MqttClient } from "mqtt";

export default class MQTTService {
  private static instance: MQTTService;
  private client: MqttClient;

  private constructor() {
    const options: IClientOptions = {
      host: mttqConfig.broker,
      port: 8883, // Assicurati che sia la porta giusta per il tuo broker
      protocol: "mqtts",
      username: mttqConfig.username,
      password: mttqConfig.password,
      clientId: mttqConfig.clientId,
      rejectUnauthorized: false, // Cambia a true per connessioni sicure
    };

    this.client = mqtt.connect(options);

    this.client.on("connect", () => {
      console.log("✅ Connesso al broker MQTTs!");
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

