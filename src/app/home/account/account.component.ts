import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  currName = 'John Doe';
  currDomainId = 'tjohndoe';
  currAddress = '67, PJS 7/9, 77777, Bandar Sunway';
  currIdNo = '11223344';
  workingDays = 'Mon - Fri';
  startTime = '9 AM';
  endTime = '6 PM';
  dptName ='IT CoE';
  dptLocation = '23A';
  supervisor = 'Jane Doe';
  constructor() { }

  ngOnInit(): void {
  }

}
