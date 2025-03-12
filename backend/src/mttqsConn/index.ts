// Classe per gestire la connessione MQTT al broker
import mqtt, { IClientOptions, MqttClient } from "mqtt";
import mqttConfig from "../configuration/mqttsConfig";
import DroneHistory from "../models/droneSchemaHistory";
import RealTimeDroneData from "../models/droneSchemaRealTime";

export default class MQTTService {
  // Implementazione del pattern Singleton per garantire una sola istanza
  private static instance: MQTTService;
  private client: MqttClient;

  private constructor() {
    // Configurazione delle opzioni di connessione al broker MQTT
    const options: IClientOptions = {
      host: mqttConfig.broker, // Host del broker MQTT
      port: 8883,
      protocol: "mqtts", // Protocollo sicuro
      username: mqttConfig.username, // Credenziali di autenticazione
      password: mqttConfig.password,
      clientId: mqttConfig.clientId, // ID univoco per questo client
      rejectUnauthorized: false, // Ignora problemi con certificati SSL (in produzione mettere a true)
    };

    // Inizializzazione della connessione MQTT
    this.client = mqtt.connect(options);

    // Gestione evento di connessione riuscita
    this.client.on("connect", () => {
      console.log("✅ Connesso al broker MQTTs!");
    });

    // Sottoscrizione al topic dei droni
    // Il topic è formattato come: Synapsy/drone/+/+ dove + è wildcard per qualsiasi deviceId e uniqueId
    this.client.subscribe(mqttConfig.topicPrefix, (err) => {
      console.log("subscribe in attesa");
      if (!err) {
        console.log(`Sottoscritto al topic: ${mqttConfig.topicPrefix}`);
      } else {
        console.error("❌ Errore durante la sottoscrizione:", err);
      }
    });

    // Mappa per tenere traccia dello stato dei droni e relativi timeout
    const droneStatus = new Map();

    // Gestione dei messaggi in arrivo dai droni
    this.client.on("message", async (topic, message) => {
      // Estrazione deviceId e uniqueId dal topic (formato: Synapsy/drone/deviceId/uniqueId)
      const topicParts = topic.split("/");
      const deviceId = topicParts[2];
      const uniqueId = topicParts[3];

      // Parsing del messaggio JSON ricevuto
      const data = JSON.parse(message.toString());

      // Preparazione oggetto per aggiornamento stato drone
      const update = {
        status: "ONLINE", // Imposta drone come online
        timestamp: new Date(), // Aggiorna il timestamp
        lat: data.lat, // Aggiorna posizione
        lon: data.lon,
        temperature: data.temperature, // Aggiorna temperatura
      };

      // Opzioni per upsert (inserisci se non esiste, aggiorna se esiste)
      const options = { upsert: true, new: true };

      // Salva i dati nella collezione storica
      const drone = new DroneHistory({
        deviceId,
        uniqueId,
        lat: data.lat,
        lon: data.lon,
        temperature: data.temperature,
        timestamp: new Date(),
      });

      await drone.save();

      // Aggiorna o crea record in tempo reale
      await RealTimeDroneData.updateOne({ deviceId }, update, options);
      console.log(`Dati salvati per il drone ${deviceId}`);

      // Gestione timeout per impostare drone offline se non riceve dati per 5 minuti
      // Cancella eventuale timeout precedente per lo stesso drone
      if (droneStatus.has(deviceId)) {
        clearTimeout(droneStatus.get(deviceId));
      }

      // Imposta nuovo timeout
      const timeout = setTimeout(async () => {
        await RealTimeDroneData.updateOne(
          { deviceId },
          { status: "OFFLINE" },
          { new: true }
        );
        console.log(`Drone ${deviceId} impostato su OFFLINE per inattività.`);
      }, 5 * 60 * 1000); // 5 minuti in millisecondi

      droneStatus.set(deviceId, timeout); // Salva il timeout nella mappa
    });

    // Gestione degli errori di connessione MQTT
    this.client.on("error", (err) => {
      console.error("❌ Errore MQTT:", err);
    });

    // Gestione chiusura connessione
    this.client.on("close", () => {
      console.log("🔌 Connessione chiusa.");
    });
  }

  // Metodo per ottenere l'istanza singleton (garantisce una sola connessione)
  public static getInstance(): MQTTService {
    if (!MQTTService.instance) {
      MQTTService.instance = new MQTTService();
    }
    return MQTTService.instance;
  }

  /*Ho optato per il singleton perchè facciamo in modo qual'ora nel codice venga chiamato più volte,
  MQTTService.getInstance(),esisterà solamente una connessione, perchè se non esiste la crea, ma se esiste restituisce l'istanza già esistente,
  in questo modo risparmiamo in primis le risorse come la memoria, ma eviteremo i loop dei message, e garantiamo
  che ci iscriviamo al topic una sola volta evitando i messaggi duplicati dei dati che riceviamo. */
}
