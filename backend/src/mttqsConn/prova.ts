///Gestione classe con connessione ad mttqs, con interface mqttConfid
import mqtt, { IClientOptions, MqttClient } from "mqtt";

export default class MQTTServiceProva {
  private static instance: MQTTServiceProva;
  private client: MqttClient;

  private constructor() {
    const options: IClientOptions = {
      host: "broker.emqx.io",
      port: 8883,
      protocol: "mqtts",
      clientId: "clientId_univoco",
      keepalive: 60,
      rejectUnauthorized: false,
    };

    this.client = mqtt.connect(options);

    this.client.on("connect", () => {
      console.log("✅ Connesso al broker MQTTs!");
    });

    ///// iscrizione al topic
    this.client.subscribe("testtopic/#", (err) => {
      console.log("subscribe in attesa");
      if (!err) {
        console.log(`Sottoscritto al topic:`);
      } else {
        console.error("❌ Errore durante la sottoscrizione:", err);
      }
    });

    ///// pubblicazione del messaggio
    this.client.publish(
      "testtopic/#",
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
  public static getInstance(): MQTTServiceProva {
    if (!MQTTServiceProva.instance) {
      MQTTServiceProva.instance = new MQTTServiceProva();
    }
    return MQTTServiceProva.instance;
  }
}
