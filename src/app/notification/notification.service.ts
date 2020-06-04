import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = this.socket.fromEvent<[]>('notifications');

  constructor(private socket:Socket) {
  }

  getNotifs(domainId:string){
    this.socket.emit('getNotifications',domainId);
  }
  

  sendNotification(notifObj){
    this.socket.emit('newNotification',notifObj);
  }

}
