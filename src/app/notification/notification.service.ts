import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private socket:Socket) {
  }

  getNotifications(){
    this.socket.emit('getNotifications');
    return new Observable((observer)=> {
      this.socket.on('notifications',(notifs)=>{
        observer.next(notifs);
      });
    });
  }

  sendNotification(notifObj){
    this.socket.emit('newNotification',notifObj);
  }

  markAsSeen(notifId){
    this.socket.emit('seenNotification',notifId);
  }
}
