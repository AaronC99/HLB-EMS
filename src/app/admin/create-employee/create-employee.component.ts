import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  events:string[]=[];
  startDate = new Date(1990, 0, 1);
  createEmployeeFormGroup = new FormGroup({
    name: new FormControl(''),
    domainId: new FormControl(''),
    ic_passportNo: new FormControl(''),
    dob: new FormControl(''),
    dptName: new FormControl(''),
    dptLocation: new FormControl(''),
    supervisor: new FormControl(''),
    workingDays: new FormControl(''),
    workingHours: new FormControl('')
  });

  constructor() {
  }

  ngOnInit(): void {
  }
  
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //this.model.dob = event.value;
    this.events.push(`${type}: ${event.value}`);
  }

}
