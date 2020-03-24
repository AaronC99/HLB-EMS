import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
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
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
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
