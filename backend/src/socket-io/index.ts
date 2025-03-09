/// Gestione classe di websocket per inizializzazione della connessione nella server ts con classe(server)

import { Request } from "express";
import { Server } from "https";
import { EventEmitter, WebSocket, WebSocketServer } from "ws";
import { oggi } from "../configuration/time.config";

export class WebSocketManager extends EventEmitter {
  private wss: WebSocketServer;
  clients: Map<number, any>;
  clientCounter: number;

  constructor(server: Server) {
    console.log("Istanza server Websocket");
    super();
    this.wss = new WebSocket.Server({ server, path: "/" });
    this.clients = new Map(); //Qua mappiamo i client con un id per tenerli traccia
    this.clientCounter = 0;
    this.init();
  }

  init(): void {
    console.log("Inizializzazione del WebSocket server");
    this.wss.on("connection", this.handleConnection.bind(this));
  }

  private handleConnection(ws: WebSocket, request: Request): void {
    const clientId = ++this.clientCounter;
    this.clients.set(clientId, {
      ws,
      ip: request.socket.remoteAddress,
      connectTime: oggi,
      lastActivity: oggi,
    });

    console.log(
      `Websocket : Nuovo Client ${clientId} connesso da ${request.socket.remoteAddress} `
    );
    //this.emit("connection", { clientId, ws, request });
  }
}
