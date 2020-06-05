import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

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

  getAllNotifs(){
    let observable = new Observable(observer => {
      this.socket.on('notifications',(data) => {
        observer.next(data);
      });
      return () =>{
        this.socket.disconnect();
      };
    });
    return observable;
  }
  

  sendNotification(notifObj){
    this.socket.emit('newNotification',notifObj);
  }

  markAsSeen(notifId){
    this.socket.emit('seenNotification',notifId);
  }
}
