import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/service/admin.service';
import { NgbCalendar, NgbDateStruct, NgbDate, NgbDatepicker, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Holiday } from 'src/app/model/Holiday.model';

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
      this.disableDates(this.existingHolidays);
  }

  public myClass(date:NgbDateStruct){
    this.isSelected = this.existingHolidays
      .find( d=>d.year==date.year && d.month==date.month && d.day==date.day)
      return this.isSelected ? 'classSelected' : 'classNormal';
  }

  public disableDates(dates){
    this.isHoliday = (date:NgbDateStruct,current: {month:number,year:number}) =>{
      return dates.find(x => NgbDate.from(x).equals(date)) ? true : false;
    }
  }

  public transformDayMonth(day,month){
    let dayString = ("0" + day).slice(-2);
    let monthString = ("0" + month).slice(-2);
    return `${dayString}-${monthString}`;
  }

  public onDateSelect(date: NgbDate){
    this.holiday = {
      holidayName :'',
      holidayType : '',
      holidayDate : ''
    };
    this.editable = false;
    let year = date.year.toString();
    let day_month = this.transformDayMonth(date.day,date.month);

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
