import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/service/admin.service';
import { NgbCalendar, NgbDateStruct, NgbDate, NgbDatepicker, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Holiday } from 'src/app/model/Holiday.model';
import * as moment from 'moment';

@Component({
  selector: 'app-all-holidays',
  templateUrl: './all-holidays.component.html',
  styleUrls: ['./all-holidays.component.scss']
})
export class AllHolidaysComponent implements OnInit {
  displayMonths = 6;
  navigation = 'none';
  showWeekNumbers = false;
  outsideDays = 'visible';
  isHoliday:any;
  existingHolidays = [];
  isSelected:any;
  holidayDetails:any = [];
  minDate:any;
  holiday = {
    holidayName :'',
    holidayType : '',
    holidayDate : ''
  };
  
  editable:boolean;
  
  constructor(
    private adminService: AdminService,
    private calendar: NgbCalendar
  ) {
    this.getAllHolidays();
    this.minDate = {
      day: 1,
      month: this.calendar.getToday().month + 1,
      year: this.calendar.getToday().year
    }
   }  

  ngOnInit(): void {
    
  }

  public getAllHolidays(){
    this.adminService.viewHolidays().subscribe(data =>{
      this.convertDates(data);
      this.holidayDetails = data;
    });
  }

  public convertDates(dates){
    let holidays:any = dates;
      let getDate = string => (([day,month]) => ({day,month}))(string.split('-'));
      holidays.forEach(element => {
        let day = getDate(element.date).day;
        let month = getDate(element.date).month;
        let year = element.year;
        let date = {
          day: parseInt(day),
          month: parseInt(month),
          year: parseInt(year)
        };
        this.existingHolidays.push(date);
      });
  }

  public myClass(date:NgbDateStruct){
    this.isSelected = this.existingHolidays
      .find( d=>d.year==date.year && d.month==date.month && d.day==date.day)
      return this.isSelected ? 'classSelected' : 'classNormal';
  }

  public transformDayMonth(value){
    let formattedValue = ("0" + value).slice(-2);
    return formattedValue;
  }

  public onDateSelect(date: NgbDate){
    let year = date.year.toString();
    let day = this.transformDayMonth(date.day);
    let month = this.transformDayMonth(date.month);
    let day_month = `${day}-${month}`;
    let selectedDate = `${year}-${month}-${day}`;
    let startingDate = `${this.minDate.year}-${this.transformDayMonth(this.minDate.month)}-${this.transformDayMonth(this.minDate.day)}`;

    // Disable edit button if selected holiday is before minimum date
    if(moment(selectedDate).isAfter(startingDate))
      this.editable = true;
    else
      this.editable = false;

    // Display Holiday Info 
    this.holidayDetails.forEach(element =>{
      if(element.date === day_month && element.year === year){
        this.holiday.holidayName =  element.holiday_name;
        this.holiday.holidayType = element.holiday_type;
        this.holiday.holidayDate = `${element.date}-${element.year}`;
        this.editable = true;
      }
    });
  }

  public editHoliday(){
    console.log(this.holiday);
  }

}
