interface MQTTConfig {
  broker: string;
  clientId: string;
  username: string;
  password: string;
  topicPrefix: string;
}

const mqttConfig: MQTTConfig = {
  broker: "nexustlc.ddns.net",
  clientId: `drone_mttqs_${Math.random().toString(16).substring(2, 10)}`,
  username: "ProgettoDroneClient",
  password: "42286f739da8106ff3049807d1ac3fa5",
  topicPrefix: "Synapsy/drone/+/+",
};

export default mqttConfig;
