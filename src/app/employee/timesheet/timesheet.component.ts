import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../service/employee.service';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit{
  currEmployee:any;
  dateList:any;
  timesheetForm = new FormGroup ({
    selectedDate: new FormControl('')
  });
  displayedColumns: string[] = ['date','timeIn','timeOut','dateOut','ot','ut','lateness','remarks'];
  TIMESHEET_DATA:any;
  dataSource: any = [];
  needRequest:boolean;
  currUserDomainId:any;
  currUserSupervisor:any;
  canDownload:boolean;
  date:any = new Date();
  localTime = new DatePipe('en-US');
  currDate = this.localTime.transform(this.date,'d-MM-y');
  currMonth  = this.localTime.transform(this.date,'MMMM y');

  @HostListener('contextmenu',['$event'])
  onRightClick(event){
    event.preventDefault();
  }

  constructor(
    private formBuilder:FormBuilder,
    private employeeService: EmployeeService,
    private authService: AuthenticationService,
    private _snackBar: MatSnackBar
    ) { 
    this.createForm();
    this.authService.userAuthDetails.subscribe( user=> {
      this.currUserDomainId = user.username;
    });
    this.employeeService.getAvailableTimesheet(this.currUserDomainId)
    .subscribe(data => {
      this.dateList = data;
      this.dateList.forEach(element => {
        element.period_number++;
      });
    });
  }

  ngOnInit():void{
    this.employeeService.getProfile(this.currUserDomainId)
    .subscribe( currUser => {
      this.currEmployee = currUser;
    });
  }

  get userInput(){
    return this.timesheetForm.controls;
  }

  createForm(){
    this.timesheetForm = this.formBuilder.group({
      selectedDate: ['',Validators.required]
    });
  }

  displayTimesheet(currentMonth){
    let month = this.userInput.selectedDate.value.period_number;
    let year = this.userInput.selectedDate.value.year;
    this.employeeService.getTimesheet(this.currUserDomainId,month,year)
    .subscribe( data => {
      this.TIMESHEET_DATA = data;
      this.dataSource = this.TIMESHEET_DATA;
    });
    if(currentMonth.is_approved)
      this.canDownload = true;
    else 
      this.needRequest = true;
  }

  requestApproval(){
    let period =  this.userInput.selectedDate.value.period_number - 1;
    let year = this.userInput.selectedDate.value.year;
    let statusType = 'Approval';
    this.employeeService.requestApproval(this.currUserDomainId,period.toString(),year,statusType)
      .subscribe(status => {
        if(status !== null)
          this.displayMessage('Request successfully sent to Department Head');  
      },
      err =>{
        console.log(err);
        if (err !== null)
          this.displayMessage('Error sending request. Please try again');
      });
  }

  displayMessage(message:string){
    this._snackBar.open(message,'Close',{
      duration: 3000
    });
  }

  downloadTimesheet(){ 
    const timesheetPdf = this.getDocumentDefinition();
    pdfMake.createPdf(timesheetPdf).open();
  }

  getDocumentDefinition(){
    return{
      content:[
        {
          text: 'Hong Leong Bank Berhad\n Employee Timesheet',
          bold: true,
          fontSize: 14,
          alignment: 'center',
          margin:[0,0,0,0]
        },
        {
          columns:[ // Current Employee Details
            [
              {
                text: `Name : ${this.currEmployee.name}`,
                style:'header'
              },
              {
                text: `NRIC : ${this.currEmployee.ic}`,
                style: 'header'
              },
              {
                text: `Email : ${this.currEmployee.email}`,
                style: 'header'
              }
            ],
          ]
        },
        this.getTimesheet(),
        this.getEmployeeSignature()
      ],
      info:{
        title: `${this.currMonth} Timesheet`,
        author: 'Name',
        subject: 'Timesheet'
      },
      styles:{
        header: {
          fontSize: 10,
          margin: [0, 0, 0, 5],
        },
        tableHeader: {
          fontSize:10,
          bold: true,
        },
        tableContent: {
          fontSize:9
        },
        table:{
          margin:[10,5,10,7],
        },
        footer: {
          fontSize: 10,
          margin: [0, 5, 0, 0],
        },
        footer2: {
          fontSize: 10,
          margin: [0, 5, 0, 0]
        }
      }
    };
  }

  getTimesheet(){
    return{
      layout:'lightHorizontalLines',
      table:{
        widths:['*','*','*','*'],
        body:[
          [//header
            {
            text: 'Date',
            style:'tableHeader'
            },
            {
              text: 'Time In',
              style:'tableHeader'
            },
            {
              text: 'Time Out',
              style:'tableHeader'
            },
            {
              text: 'Remarks',
              style:'tableHeader'
            },
          ],
            ...this.TIMESHEET_DATA.map(t => {
              return [
                {
                  text: t.date_in +'-'+ t.year,
                  style:'tableContent'
                },
                {
                  text: t.time_in,
                  style:'tableContent'
                },
                {
                  text: t.time_out,
                  style: 'tableContent'
                },
                {
                  text: t.remarks,
                  style:'tableContent'
                }
              ];
            })
        ]
      },style:'table'
    }
  }

  getEmployeeSignature(){
    return {
      layout:'lightHorizontalLines',
      table:{
        widths:[50,'*',50,'*'],
        body:[
          [//header
            {
            text: 'Prepared By',
            style:'tableHeader'
            },
            {
              text: '',
              style:'tableHeader'
              },
            {
              text: 'Approved By',
              style:'tableHeader'
            },
            {
              text: '',
              style:'tableHeader'
              },
          ],
          [//row 1
            {
              text:'Employee Signature: ',
              style:'tableContent'
            },
            {
              text:'',
              style:'tableContent'
            },
            {
              text:'Supervisor Signature: ',
              style:'tableContent'
            },
            {
              text:'',
              style:'tableContent'
            }
          ],
          [//row 2
            {
              text:'Employee Name:',
              style:'tableContent'
            },
            {
              text:`${this.currEmployee.name}`,
              style:'tableContent'
            },
            {
              text:'Supervisor Name: ',
              style:'tableContent'
            },
            {
              text:`${this.currEmployee.department.department_head.name} (${this.currEmployee.department.department_name})`,
              style:'tableContent'
            },
          ],
          [//row 3
            {
              text:'Date: ',
              style:'tableContent'
            },
            {
              text:this.currDate,
              style:'tableContent'
            },
            {
              text:'Date: ',
              style:'tableContent'
            },
            {
              text:this.currDate,
              style:'tableContent'
            },
          ]
        ]
      },style:'table'
    }
  }

}