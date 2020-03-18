import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-check-in-out-page',
  templateUrl: './check-in-out-page.component.html',
  styleUrls: ['./check-in-out-page.component.scss']
})
export class CheckInOutPageComponent implements OnInit {
  time: any = new Observable(observer =>
    window.setInterval(() => observer.next(new Date().toString()), 1000).toString
  );
  constructor() { }

  ngOnInit(): void {
  }

}
