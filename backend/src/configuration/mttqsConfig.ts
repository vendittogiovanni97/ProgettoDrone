export const mttqConfig = {
  broker: 'mqtts://nexustlc.ddns.net:8883',
  wssBroker: 'wss://nexustlc.ddns.net:443/mqtt',
  clientId: `drone_mttqs_${Math.random().toString(16).substring(2, 10)}`,
  username: 'ProgettoDroneClient',
  password: '42286f739da8106ff3049807d1ac3fa5',
  topicPrefix: 'Synapsy/drone'
}