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
  minDate:any;
  isDuplicate:boolean;

  constructor(
    private calendar: NgbCalendar,
    private formBuilder:FormBuilder,
    private formatter: NgbDateParserFormatter,
    private adminService: AdminService,
    private _snackBar: MatSnackBar
    ) { 
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 0);
    this.setMinDate();
    this.startDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    this.endDate = `${this.toDate.day}/${this.toDate.month}/${this.toDate.year}`;
  }

  ngOnInit(): void {
    this.viewAllHolidays();
    this.createForm();
  }

  createForm(){
    this.createHolidayForm = this.formBuilder.group({
      holidayName: ['',Validators.required],
      holidayType: ['',Validators.required]
    });
  }

  public setMinDate(){
    this.minDate = {
      year: this.fromDate.year,
      month: this.fromDate.month + 1,
      day: 1
    };
    this.fromDate = this.minDate;
    this.toDate = this.minDate;
  }

  public disableDates(dates){
    this.isDisabled = (date:NgbDateStruct,current: {month:number,year:number}) =>{
      return dates.find(x=>NgbDate.from(x).equals(date))?true:false;
    }
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
    this.validateHoliday(this.fromDate,this.toDate);
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
        this.disableDates(this.exisitingHolidays);
      });
  }

  public validateHoliday(startDay,endDay){
    this.isDuplicate = false;
    let startDate = moment(this.formatter.format(startDay));
    let endDate = moment(this.formatter.format(endDay));
    let duration = [];
    if (endDate.format("DD-MM-YYYY") === 'Invalid date')
      endDate = startDate;

    for(let i=moment(startDate); i.isSameOrBefore(endDate);i.add(1,'days')){
      let date = i.format("DD-MM");
      let year = i.format("YYYY");
      let holiday = {
        date: date,
        year: year
      }
      duration.push(holiday);
    }
    this.adminService.viewHolidays().subscribe ( data => {
      let existingDates:any = data;
      for (let i=0;i<existingDates.length;i++){
        for (let j=0;j<duration.length;j++){
          if (existingDates[i].date === duration[j].date && existingDates[i].year === duration[j].year){
            this.isDuplicate = true;
            break;
          }
        }
      }
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
