import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Holiday } from 'src/app/model/Holiday.model';
import { AdminService } from '../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-holiday-declaration',
  templateUrl: './holiday-declaration.component.html',
  styleUrls: ['./holiday-declaration.component.scss']
})
export class HolidayDeclarationComponent implements OnInit {
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  holidayTypes = ['Working','Non-Working'];
  createHolidayForm:FormGroup;
  startDate:any;
  endDate:any;
  holidayDuration = [];
  holiday: Holiday;
  exisitingHolidays = [];
  isDisabled:any;

  constructor(
    private calendar: NgbCalendar,
    private formBuilder:FormBuilder,
    private formatter: NgbDateParserFormatter,
    private adminService: AdminService,
    private _snackBar: MatSnackBar
    ) { 
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 4);
    this.startDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    this.endDate = `${this.toDate.day}/${this.toDate.month}/${this.toDate.year}`;
    //this.admin = localStorage.getItem('currentUser');
    this.viewAllHolidays();
    this.isDisabled = (date:NgbDateStruct,current: {month:number,year:number}) =>{
      return this.exisitingHolidays.find(x=>NgbDate.from(x).equals(date))?true:false;
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.createHolidayForm = this.formBuilder.group({
      holidayName: ['',Validators.required],
      holidayType: ['',Validators.required],
      duration: [`${this.startDate}-${this.endDate}`]
    });
  }

  get userInput(){
    return this.createHolidayForm.controls;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.endDate = `${this.toDate.day}/${this.toDate.month}/${this.toDate.year}`;
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.endDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    }
    this.startDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    this.createHolidayForm.get('duration').setValue(`${this.startDate} - ${this.endDate}`);
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  public viewAllHolidays(){
    this.adminService.viewHolidays()
      .subscribe(data => {
        let holidays:any = data;
        let getDate = string => (([day,month]) => ({day,month}))(string.split('-'));
        holidays.forEach(element => {
          let day = getDate(element.date).day;
          let month = getDate(element.date).month;
          let year = element.year;
          let holidays ={
            day: parseInt(day),
            month: parseInt(month),
            year: parseInt(year)
          };
          this.exisitingHolidays.push(holidays);
        });
        console.log(this.exisitingHolidays)
      });
  }

  onSubmit(){
    this.holidayDuration.splice(0,this.holidayDuration.length);
    this.startDate = moment(this.formatter.format(this.fromDate));
    this.endDate = moment(this.formatter.format(this.toDate));
    if (this.endDate.format("DD-MM-YYYY") === 'Invalid date')
      this.endDate = this.startDate;

    for(let i=moment(this.startDate); i.isSameOrBefore(this.endDate);i.add(1,'days')){
      let date = i.format("DD-MM");
      let year = i.format("YYYY");
      this.holiday = {
        holiday_name: this.userInput.holidayName.value,
        holiday_type: this.userInput.holidayType.value,
        date: date,
        year: year
      }
      this.holidayDuration.push(this.holiday);
    }
    this.createHolidayForm.reset();
    this.adminService.createHoliday(this.holidayDuration).subscribe(
      data =>{
        let holidayArray:any = data;
        holidayArray.forEach(element => {
          if (element === null)
            this.displayMessage('This date already is a holiday');
          else 
            this.displayMessage('Holiday Created Successfully');
        });
      }
    );
  }

  public displayMessage(message:string){
    this._snackBar.open(message,'Close',{
      duration: 3000
    });
  }

}
