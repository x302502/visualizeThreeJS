import { Injectable, EventEmitter } from '@angular/core';
import * as io from 'socket.io-client';
import { ConfigService } from './config-service/config.service';

@Injectable()
export class SocketService {
  connected: boolean;
  socket: SocketIOClient.Socket;
  emitter: EventEmitter<ISocketData>;
  socketUrl: string;
  socketKey: string;
  constructor(private configService: ConfigService) {
    this.socketUrl = this.configService.clientConfig.socket.url;
    this.socketKey = this.configService.clientConfig.socket.key;
    this.connected = false;
    this.emitter = new EventEmitter();
    this.socket = io.connect(this.socketUrl);
    this.socket.on('connect', () => {
      this.connected = true;
    });
    this.socket.on('disconnect', () => {
      this.connected = false;
    });
    this.socket.on(this.socketKey, data => {
      this.emitter.emit(data);
    });
  }
  send(data: ISocketData) {
    if (this.connected) this.socket.emit(this.socketKey, data);
  }
}

export interface ISocketData {
  code: string;
  data: any;
}
