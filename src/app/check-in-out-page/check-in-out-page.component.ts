import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-check-in-out-page',
  templateUrl: './check-in-out-page.component.html',
  styleUrls: ['./check-in-out-page.component.scss']
})
export class CheckInOutPageComponent implements OnInit {
  registerForm = new FormGroup ({
    fname: new FormControl(''),
    lname: new FormControl(''),
    email: new FormControl(''),
    dob: new FormControl('')
  });
  constructor() { }

  ngOnInit(): void {
  }

}
