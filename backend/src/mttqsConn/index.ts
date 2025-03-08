///Gestione classe con connessione ad mttqs, con interface mqttConfid
import mqtt, { IClientOptions, MqttClient } from "mqtt";
import mqttConfig from "../configuration/mqttsConfig";

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

    // Gestione dei messaggi in arrivo
    this.client.on("message", (topic, message) => {
      console.log(
        `Messaggio ricevuto sul topic ${topic}: ${message.toString()}`
      );
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
