import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

export interface PeriodicElement {
  date: string;
  clockIn: string;
  clockOut: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {date: '20/3/20', clockIn: '8:45', clockOut: '17:45'},
  {date: '21/3/20', clockIn: '8:45', clockOut: '17:45'},
  {date: '22/3/20', clockIn: '8:45', clockOut: '17:45'},
  {date: '23/3/20', clockIn: '8:45', clockOut: '17:45'},
];
@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  months:any[] = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  years:any[] = [2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020];
  genTimesheetForm = new FormGroup ({
    selectedMonth: new FormControl(''),
    selectedYear: new FormControl('')
  });
  displayedColumns: string[] = ['date','clockIn','clockOut'];
  dataSource = ELEMENT_DATA;
  visible = false;
  constructor(private formBuilder:FormBuilder) { 
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(){
    this.genTimesheetForm = this.formBuilder.group({
      selectedMonth: ['',Validators.required],
      selectedYear: ['',Validators.required]
    });
  }
  onSubmit(){
    //get Timesheet from database
    console.table(this.genTimesheetForm.value);
    this.visible = true;
  }
  dwnldTimesheet(){
    console.log('Download Timesheet');

  }
  generateExcelFile(){
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'test.xlsx');
  }


}
